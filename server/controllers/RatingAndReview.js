const RatingAndReview = require('../models/RatingAndReviews');
const Course = require('../models/Course');

// createRating
exports.createRating = async(req,res) => {
    try{

        const id = req.user.id;
        const { rating, review,courseId } = req.body;

        if(!id || !rating || !review || !courseId){
            return res.status(400).json({
                success: false,
                message: "All Details Required!",
            });
        }

        const courseDetails = await Course.findOne({_id:courseId,studentsEnrolled: {$eleMatch: {$eq: id}}});

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student Is Not Enrolled in the Course"
            });
        }

        const checkAlreadyReviewed = await RatingAndReview.findOne({_id:id, course:courseId});

        if(checkAlreadyReviewed){
            return res.status(404).json({
                success: false,
                message: "Already Reviewed"
            });
        }

        const newRating = await RatingAndReview.create({
            user: id,
            course: courseId,
            rating,
            review,
        });

        await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $push:{
                    ratingAndReviews: newRating._id,
                }
            }
        );

        if(!newRating){
            return res.status(401).json({
                success: false,
                message: "Review Adding Failure"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review created Successfully!",
            newRating
        });

    } catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating review",
        });
    }
}

// getAveragerating
exports.getAverageRating = async(req,res) => {
    try{

        const courseId = req.user.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ]);

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        return res.status(200).json({
            success: false,
            message: "Average Rating is 0, no ratings given till now",
            averageRating: 0
        });

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching Average Rating",
        });
    }
}

// getAllRating
exports.getAllRatings = async(req,res) => {
    try{

        const allRating = await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path: "user",
            select:"firstName lastName email image"
        }).populate({
            path: "course",
            select: "courseName"
        }).exec();

        return res.status(200).json({
            success: true,
            message: "All Reviews Fetched Successfully",
            allRating,
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failure in fetching all ratings"
        });
    }
}