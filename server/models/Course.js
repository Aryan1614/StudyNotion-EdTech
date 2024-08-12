const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim : true,
        },
        courseDescription : {
            type: String,
            required: true,
            trim : true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        whatYouWillLearn: {
            type: String,
            required: true,
            trim : true,
        },
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section"
            }
        ],
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview",
            }
        ],
        tag:{
          type:[String],
          required: true,  
        },
        price: {
            type: Number,
        },
        thumbNail: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            }
        ],
        instructions:{
            type: [String],
            required: true,
        },
        status:{
            type: String,
            enum: ["Draft","Published"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

module.exports = mongoose.model("Course",CourseSchema);