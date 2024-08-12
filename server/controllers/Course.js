const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');

// fetch all courses
exports.getAllCourses = async(req,res) => {
    try{

        const allCourses = await Course.find({ status: "Published" },{
            courseName:true,
            courseDescription: true,
            price: true,
            category: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();
        
        if(!allCourses){
            return res.status(403).json({
                success: false,
                message: "Courses Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All Course Fetched Successfully!",
            data: allCourses,
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing Went Wrong While Fetching All Courses."
        });
    }
}

// fetch all course Details 
exports.getAllCourseDetails = async(req,res) => {
    try{

        const { courseId } = req.body;

        const allCourseDetails = await Course.findById({_id:courseId}).populate(
            {
                path: "instructor",
                populate:{
                    path: "additionalDetails",
                }
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate(
            {
                path: "courseContent",
                populate:{
                    path: "subSection",
                }
            }
        ).exec();

        if(!allCourseDetails){
            return res.status(403).json({
                success: false,
                message: "Could Not Found Course!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully!",
            data: allCourseDetails,
        });

    } catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Course Details Fetching Failure",
        })
    }
}

// create Course 
exports.createCourse = async (req, res) => {
    try {
      // Get user ID from request object
      const userId = req.user.id
  
      // Get all required fields from request body
      let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
      } = req.body
      // Get thumbnail image from request files
      const thumbnail = req.files.thumbnailImage
  
      // Convert the tag and instructions from stringified Array to Array
      const tag = JSON.parse(_tag)
      const instructions = JSON.parse(_instructions)
  
      // console.log("tag", tag)
      // console.log("instructions", instructions)
  
      // Check if any of the required fields are missing
      if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !thumbnail ||
        !category ||
        !instructions.length
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        })
      }
  
      if (!status || status === undefined) {
        status = "Draft"
      }
      // Check if the user is an instructor
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
      })
  
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        })
      }
  
      // Check if the tag given is valid
      const categoryDetails = await Category.findById(category)
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        })
      }
      // Upload the Thumbnail to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      // Create a new course with the given details
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbNail: thumbnailImage.secure_url,
        status: status,
        instructions,
      });
  
      // Add the new course to the User Schema of the Instructor
      await User.findByIdAndUpdate(
        {
          _id: instructorDetails._id,
        },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      // Add the new course to the Categories
      const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      // console.log("HEREEEEEEEE", categoryDetails2)
      // Return the new course and a success message
      res.status(200).json({
        success: true,
        data: newCourse,
        message: "Course Created Successfully",
      })
    } catch (error) {
      // Handle any errors that occur during the creation of the course
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      })
    }
}

exports.editCourse = async(req,res) => {
    try{

        const { 
          courseId,
          courseName,
          courseDescription,
          price,
          whatYouWillLearn,
          tag: _tag,
          category,
          instructions: _instructions,
          status
        } = req.body;

        if(!courseId){
          return res.status(404).json({
            success: false,
            message: "Course ID Not Found!!"
          })
        }

        const course = await Course.findById(courseId);

        if(!course){
          return res.status(404).json({
            success: false,
            message: "Course Not Found!",
          });
        }

        if(courseName !== undefined){
          course.courseName = courseName;
        }

        if(courseDescription !== undefined){
          course.courseDescription = courseDescription;
        }

        if(price !== undefined){
          course.price = price;
        }

        if(_instructions && JSON.parse(_instructions).length !== course.instructions.length){
          course.instructions = JSON.parse(_instructions);
        }

        if(whatYouWillLearn !== undefined){
          course.whatYouWillLearn = whatYouWillLearn;
        }

        if(category !== undefined){
          course.category = category;
        }

        if(_tag && JSON.parse(_tag) && JSON.parse(_tag).length !== course.tag.length){
          course.tag = JSON.parse(_tag);
        }

        if((status !== undefined) && (course.status !== status)){
          course.status = status;
        }

        if(req.files && req.files.thumbNail !== undefined){
          course.thumbNail = thumbNail;
        }

        await course.save();

        const updatedCourse = await Course.findById(courseId).populate({
          path:"courseContent",
          populate:{
            path: "subSection"
          }
        })
        
        return res.status(200).json({
          success: true,
          message: "Course Updated Successfully!",
          data: updatedCourse
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Editing The Course!"
        });
    }
}

// fectch all courses for instructor
exports.fetchInstructorCourses = async(req,res) => {
  try{
    
    const id = req.user.id;
    if(!id){
      return res.status(403).json({
        success: false,
        message: "Instructor id Not Found!"
      });
    }
    
    const courses = await Course.find({
      instructor: id
    }).sort({createdAt: -1});

    res.status(200).json({
      success: true,
      message: "Courses Fetched Successfully!",
      courses
    });

  } catch(e){
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong While Fetching The courses!"
    })
  }
}

// delete Course 
exports.deleteCourse = async(req,res) => {
  try{

    const { courseId } = req.body;
    const userId = req.user.id;

    if(!courseId || !userId){
      return res.status(403).json({
        success: false,
        message: "Course Id Not Found!",
      });
    }

    // find Course
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(401).json({
        success: false,
        message: "Course Not Found!"
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
      {_id: userId},
      {
        $pull:{
          courses: courseId
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Course Successfully Deleted!", 
    });

  } catch(e){
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Course Deletion Failure!",
    })
  }
}

exports.getFullDetailsOfCourse = async(req,res) => {
  try{

    const { courseId } = req.body;
    console.log("Course ID BAckend-> ",courseId);

    if(!courseId) {
      return res.status(404).json({
        success: false,
        message: "Course Id Not Found!"
      });
    }

    const course = await Course.findById(courseId).populate({
      path:"courseContent",
      populate:{
        path:"subSection"
      }
    });

    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course Not Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course Details Feteched Successfully!",
      data: course
    });

  } catch(e){
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong While Fetching Details Of Course!"
    })
  }
}