const CourseProgress = require("../models/CourseProgress");

exports.markLectureAsComplete = async(req,res) => {
    try{
  
      const id = req.user.id;
      const {courseId,subSectionId} = req.body;
  
      if(!id || !courseId || !subSectionId){
        return res.status(404).json({
          success: false,
          message: "Data Required!!"
        });
      }
  
      const courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: id 
      });
  
      if(!courseProgress){
        return res.status(404).json({
          success: false,
          message: "CourseProgress Not Found!",
        });
      }
      else if(courseProgress.completedVideos.includes(id)){
        return res.status(403).json({
          success: false,
          message: "Lecture Already Marked As Comed!",
        });
      }
      else{
        courseProgress.completedVideos.push(subSectionId);
      } 
      await courseProgress.save();

      return res.status(200).json({
        success: true,
        message: "Lectures Completed!"
      })
    } catch(e){
      console.log(e);
      return res.status(500).json({
        success: false,
        message: "Lecture Completion Failure!"
      });
    }
  }