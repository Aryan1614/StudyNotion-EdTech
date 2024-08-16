const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const mongoose = require('mongoose');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');
const PaymentHistory = require('../models/PaymentHistory');
const Payments = require('../models/Payments');
const { deleteCourse } = require('./Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const Category = require('../models/Category');
const RatingAndReviews = require('../models/RatingAndReviews');

exports.updateProfile = async(req,res) => {
    try{

        const {
            firstName="",
            lastName="",
            gender="",
            dateOfBirth="",
            about="",
            contactNumber="",
        } = req.body;

    
        const userDetails = await User.findById(req.user.id);
        const profileId = userDetails.additionalDetails;

        await Profile.findByIdAndUpdate(
            {_id: profileId._id},
            {
                gender: gender,
                about: about,
                dateOfBirth: dateOfBirth,
                contactNumber: contactNumber,
            },
            {new:true}
        );

        const newUpdateduser = await User.findById(userDetails._id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Profile Successfully Updated",
            newUpdateduser,
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Profile Updation Failure!",
        });
    }
}

// delete Account 
exports.deleteAccount = async (req, res) => {
    try {
      const id = req.user.id;
      console.log(id);
      
      const user = await User.findById({ _id: id });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Delete Assosiated Profile with the User
      await Profile.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(user.additionalDetails),
      });

      if(user.accountType === "Student"){
        for (const courseId of user.courses) {
          await Course.findByIdAndUpdate(
            {_id: courseId},
            { $pull: { studentsEnrolled: id } },
            { new: true }
          );
        }

        await PaymentHistory.findOneAndDelete({userId: user._id});
        await Payments.deleteMany({userId: user._id});
      }
      if(user.accountType === "Instructor"){
        const courses = user.courses;
        for(const courseId of courses){
          const course = await Course.findById(courseId);
          if(!course) {
            return res.status(404).json({
              success: false,
              message: "Course Not Found!",
            });
          }
          // unroll Students From The Course TODO !!!
          const studentsEnrolled = course.studentsEnrolled
          for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
              $pull: { courses: courseId },
            })
          }

          // delete Course From Category
          await Category.findByIdAndUpdate(
            {_id: course.category},
            {
              $pull:{
                courses: course._id,
              }
            }
          );

          // delete Sections And SubSections
          const sections = course.courseContent;

          for(const sectionId of sections){
            const section = await Section.findById(sectionId);

            if(section){
              const subSections = section.subSection;
              for(const subSecionId of subSections){
                await SubSection.findByIdAndDelete(subSecionId);
              }
            }
            
            await Section.findByIdAndDelete(sectionId);
          }

          await Course.findByIdAndDelete(courseId);

          await User.findByIdAndUpdate(
            {_id: user._id},
            {
              $pull:{
                courses: courseId
              }
            }
          );

          await CourseProgress.deleteMany({courseID: course._id});
        }
      }

      await RatingAndReviews.deleteMany({user: user._id});

      // Now Delete User
      await User.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });

      await CourseProgress.deleteMany({ userId: id });
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "User Cannot be deleted successfully" })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{

        const id = req.user.id;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Id Not Found!!",
            });
        }

        const user = await User.findById({id}).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "All Details Fetched Successfully!",
            user,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Fetching Details Failure!"
        });
    }
}

exports.updateProfilePicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    // console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.removeProfilePicture = async (req, res) => {
  try {
    
    const id = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      {id},
      {
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${Newuser.firstName} ${Newuser.lastName}`,
      },
      {new:true},
    );
    // console.log(updatedUser);

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    userDetails = userDetails.toObject();

    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0

      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.duration), 0)

        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })

      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboardData = async(req,res) => {
  try{

    const id = req.user.id;

    if(!id){
      return res.status(404).json({
        success: false,
        message: "Instructor id Not Found!",
      });
    }

    const userDetails = await User.findById(id).populate({
      path: "courses",
      populate:{
        path: "courseContent",
        populate:{
          path: "subSection"
        }
      }
    }).exec();

    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "Instructor Not Found!"
      });
    }

    let noOfCourses = userDetails.courses.length;
    let noOfStudentsEnrolled = 0;
    let totalIncome = 0;
    let courses = userDetails.courses;

    for(let course of courses){
      totalIncome += (course.studentsEnrolled.length*course.price);
      noOfStudentsEnrolled += course.studentsEnrolled.length;
    }

    return res.status(200).json({
      success: true,
      message: "Details Fetched Successfully!",
      noOfCourses,
      totalIncome,
      noOfStudentsEnrolled,
      courses,
    })
  } catch(e){
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong While Fetching Dashboard Data"
    })
  }
}