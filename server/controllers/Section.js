const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');
const mongoose = require('mongoose');

exports.createSection = async(req,res) => {
    try{

        const { sectionName, courseID } = req.body;

        if(!sectionName || !courseID){
            return res.status(400).json({
                success: false,
                message: "Data Incomplete",
            });
        }

        const updatedSection = await Section.create({
            sectionName,
        });

        // update Course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id: courseID},
            {
                $push:{
                    courseContent: updatedSection._id,
                }
            },
            {new:true}
        ).populate("courseContent").exec();

        return res.status(200).json({
            success: true,
            message: "Section Successfully Created!",
            updatedCourseDetails,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong, While Creating Section",
        });
    }
}

exports.updateSection = async(req,res) => {
    try{

        const { sectionID, sectionName, courseID } = req.body;

        if(!sectionID || !sectionName || !courseID){
            return res.status(400).json({
                success: false,
                message: "All Data Required!"
            });
        }

        await Section.findByIdAndUpdate(
            {_id: sectionID},
            {
                sectionName: sectionName,
            },
            {new: true}
        );

        const updatedCourseDetails = await Course.findById({_id: courseID}).populate({
            path:"courseContent",
            populate:{
                path: "subSection",
            }
        });

        // console.log("Updated Course");
        // console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully!",
            updatedCourseDetails
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Section Updating Failure!"
        });
    }
}

exports.deleteSection = async(req,res) => {
    try{

        // assuming that we are sending id in params
        const {sectionID,courseID}  = req.body;

        if(!sectionID || !courseID){
            return res.status(400).json({
                success: false,
                message: "Section Id Not Found!"
            });
        }

        await Course.findByIdAndUpdate(courseID,{
            $pull : {
                courseContent: sectionID,
            }
        })

        const section = await Section.findById(sectionID);

        await SubSection.deleteMany({ _id : { $in: section.subSection }});

        await Section.findByIdAndDelete(sectionID);

        const updatedCourseDetails = await Course.findById(courseID).populate({
            path: "courseContent",
            populate: {
                path :"subSection",
            }
        });

        return res.status(200).json({
            success: true,
            message: "Section successfully Deleted!",
            updatedCourseDetails
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Section Deletion Failure!"
        });
    }
}