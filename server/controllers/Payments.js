const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require('../models/CourseProgress');
const Payments = require('../models/Payments');
const PaymentHistory = require('../models/PaymentHistory');

exports.capturePayment = async(req,res) => {
    try{

        const {courses} = req.body;
        const userId = req.user.id;

        if(courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "Please Provide course Id"
            });
        }

        let totalAmount = 0;
        for(const course_id of courses){
            let course;
            try{
                console.log("Backend");
                console.log(courses);
                console.log(course_id)
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(404).json({
                        success: false,
                        message: "Course Details Not Found!",
                    });
                }

                const uid = new mongoose.Types.ObjectId(userId);

                if(course.studentsEnrolled.includes(uid)){
                    return res.status(403).json({
                        success: false,
                        message: "Student has Already Enrolled This Course",
                    });
                }

                totalAmount += course.price;
            } catch(e){
                console.log(e);
                return res.status(404).json({
                    success: false,
                    message: "Course Not Found!"
                })
            }
        }

        const currency = "INR";
        const options = {
            amount: totalAmount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
        }


        try{
            const paymentResponse = await instance.orders.create(options);

            return res.status(200).json({
                success: true,
                data: paymentResponse,
            })
        } catch(e){
            console.log(e);
            return res.status(403).json({
                success: false,
                message: "Could Not Initiate Order",
            });
        }


    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Capturing The Payment!",
        })
    }
}


// verification of payment
exports.verifyPayment = async(req,res) => {
    try{

        const razorpay_order_id = req?.body?.razorpay_order_id;
        const razorpay_payment_id = req?.body?.razorpay_payment_id;
        const razorpay_signature = req?.body?.razorpay_signature;
        const courses = req?.body?.courses;
        const userId = req.user.id;

        if(!razorpay_signature || !razorpay_order_id || !razorpay_payment_id || !courses || !userId){
            return res.status(404).json({
                success: false,
                message: "Payment Failed ->",
            })
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

        if(expectedSignature === razorpay_signature){
            await enrollStudents(courses, userId, res);

            

            return res.status(200).json({
                success: true,
                message: "Payment Verified",
            })
        }
        else{
            return res.status(500).json({
                success: false,
                message: "Payment Failed!",
            });
        }

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Payment Verification Failure",
        })
    }
}


const enrollStudents = async(courses, userId, res) => {
    try{

        if(!courses || !userId){
            return res.status(404).json({
                success: false,
                message: "Courses And UserId Not Found!",
            })
        }

        for(const course_id of courses){
            const enrolledCourseByStduent = await Course.findOneAndUpdate(
                {_id: course_id},
                {
                    $push:{
                        studentsEnrolled: userId,
                    }
                },
                {new:true}
            );

            if(!enrolledCourseByStduent){
                return res.status(500).json({
                    success: false,
                    message: "Course Not Found!",
                })
            }

            // const cid = new mongoose.Types.ObjectId(course_id);
            const courseProgress = await CourseProgress.create({
                courseID: course_id,
                userId: userId,
                completedVideos: [],
            });

            const userCourseEnrolled = await User.findOneAndUpdate(
                {_id: userId},
                {
                    $push:{
                        courses: course_id,
                        courseProgress: courseProgress._id
                    }
                },
                {new:true}
            );

            if(!userCourseEnrolled){
                return res.status(500).json({
                    success: false,
                    message: "User Not Found!",
                })
            }

            const mailResponse = await mailSender(
                userCourseEnrolled.email,
                `Successfully Enrolled into ${enrolledCourseByStduent.courseName}`,
                courseEnrollmentEmail(enrolledCourseByStduent.courseName,`${userCourseEnrolled.firstName} ${userCourseEnrolled.lastName}`)
            )

            console.log("Email Sent Successfully", mailResponse);
        }

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Courses Enrollement Failure!",
        })
    }
}


exports.sendVerificationEmail = async(req,res) => {
    try{

        const {order_id,payment_id,amount,courses} = req.body;
        const userId = req.user.id;

        // console.log("Backend Send Verification Mail->",userId,order_id,payment_id,amount);

        if(!order_id || !payment_id || !amount){
            return res.status(404).json({
                success: false,
                message: "Payment Id , OrderId And Amount Not Found!"
            });
        }

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Student Not Found!",
            })
        }

        const newPayment = await Payments.create({
            userId: user._id,
            courses: courses,
            amount: amount,
            paymentId: payment_id,
            orderId: order_id,
        });


        const paymentHistory = await PaymentHistory.findOneAndUpdate(
            {userId: user._id},
            {
                $push:{
                    paymentHistory: newPayment._id
                }
            },
            {new: true}
        );

        // console.log(paymentHistory);

        await mailSender(
            user.email,
            "Payment Received",
            paymentSuccessEmail(`${user.firstName}`,amount/100,order_id,payment_id)
        );

        return res.status(200).json({
            success: true,
            message: "Mail Sent Successfully!"
        })
    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Verfication email Not Send, Something Went Wrong!"
        })
    }
}


// exports.capturePayment = async(req,res) => {
//     try{

//         const {courseId} = req.body;
//         const userId = req.user.id;

//         if(!courseId){
//             return res.status(400).json({
//                 success: false,
//                 message: "Please Provide Valid CourseId",
//             })
//         }

//         const course = await Course.findById(courseId);

//         if(!course){
//             return res.status(400).json({
//                 success: false,
//                 message: "Could Not Found Course",
//             });
//         }

//         const uid = new mongoose.Types.ObjectId(userId);

//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success: false,
//                 message: "Student Already Registered",
//             });
//         }

//         const amount = course.price;
//         const currency = "INR";

//         const options = {
//             amount: amount*100,
//             currency,
//             receipt: Math.Random(Date.now()).toString(),
//             notes:{
//                 courseId: course._id,
//                 userId,
//             }
//         }


//         try{
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);

//             return res.status(200).json({
//                 success: true,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbNail: course.thumbNail,
//                 orderId: paymentResponse.id,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount,
//             });

//         } catch(e){
//             console.log(e);
//             return res.status(500).json({
//                 success: false,
//                 message: "Could Not Initiate Order",
//             });
//         }   


//     } catch(e){
//         console.log(e);
//         return res.status(500).json({
//             success: false,
//             message: "Something Went Wrong While Capturing Payment"
//         })
//     }
// }


// exports.verfiySignature = async(req,res) => {
//     const webhooksecret = "12345678";
//     const signature = req.headers["x-razerpay-signature"];

//     const shasum = crypto.createHmac("SHA256",webhooksecret);
//     shasum.update(JSON.stringify(req.body));

//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment Is Authorized");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{

//             const enrolledCourse = await Course.findByIdAndUpdate(
//                 {_id:courseId},
//                 {
//                     $push:{
//                         studentsEnrolled: userId,
//                     }
//                 },
//                 {new: true}
//             );

//             if(!enrolledCourse){
//                 return res.status(400).json({
//                     success: false,
//                     message: "Something Went Wrong While Adding Student to Course List"
//                 });
//             }

//             const enrolledUser = await User.findByIdAndUpdate(
//                 {_id: userId},
//                 {
//                     $push:{
//                         courses: courseId,
//                     }
//                 },
//                 {new: true}
//             );

//             if(!updatedUser){
//                 return res.status(400).json({
//                     success: false,
//                     message: "Course Not Added In User",
//                 });
//             }

//             // mail send
//             const mailResponse = await mailSender(
//                 enrolledUser.email,
//                 "Congratulations from CodeHelp",
//                 "Congratulations, you Are OnBoarded Into New CodeHelp Course"
//             );

//             console.log(mailResponse);

//             return res.status(200).json({
//                 success: true,
//                 message: "Signature Verified And Course Added",
//             });

//         } catch(e){
//             console.log(e);
//             return res.status(400).json({
//                 success: false,
//                 message: "Something Went Wrong!",
//             });
//         }
//     }
// }