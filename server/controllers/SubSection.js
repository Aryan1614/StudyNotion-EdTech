const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Course = require("../models/Course");

exports.createSubSection = async(req,res) => {
    try{

        const {sectionId, title, description} = req.body;
        const video = req.files.video;

        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success: false,
                message: "All Data Required!"
            });
        }

        const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({
            title: title,
            duration: `${uploadedVideo.duration}`,
            description: description,
            videoUrl: uploadedVideo.secure_url,
        });

        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push:{
                    subSection: newSubSection._id,
                }   
            },
            {new:true}
        ).populate("subSection").exec();

        return res.status(200).json({
            success: true,
            message: "SubSection Created Successfully!",
            updatedSection,
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "SubSection Creation Failure!"
        });
    }
};


exports.updateSubSection = async(req,res) => {
    try{
        
        const {sectionId,subSectionId, title, duration, description} = req.body;
        
        if(!subSectionId || !sectionId){
            return res.status(404).json({
                success: false,
                message: "Id Not Found",
            });
        }

        const subSection = await SubSection.findById(subSectionId);

        if(title !== undefined){
            subSection.title = title;
        }

        if(duration !== undefined){
            subSection.duration = duration;
        }

        if(description !== undefined){
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined){
            try{
                const video = req.files.video;
                const videoUpload = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
                subSection.video = videoUpload.secureUrl;
            } catch(e){
                return res.status(403).json({
                    success: false,
                    message: "Video Uploading Failure",
                });
            }
        }

        await subSection.save();

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        );

        return res.status(200).json({
            success: true,
            message: "SubSection Updated Successfully!",
            updatedSection,
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "SubSection updation Failure!",
        });
    }
}


exports.deleteSubSection = async(req,res) => {
    try{

        const { sectionId, subSectionId,courseId } = req.body;

        if(!sectionId || !subSectionId){
            return res.status(404).json({
                success: false,
                message: "Section or Subsection Id Not Found!",
            });
        }

        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull:{
                    subsection: subSectionId,
                }
            },
            {new:true}
        );

        const deletedSubSection = await SubSection.findByIdAndDelete(
            {_id: subSectionId},
        );

        if (!deletedSubSection) {
            return res.status(404).json({ 
                success: false, 
                message: "SubSection not found" 
            });
        }
    
        // find updated section and return it
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate :{
                path: "subSection"
            }
        })
    
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: course,
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "SubSection deletion Failure!",
        });
    }
}