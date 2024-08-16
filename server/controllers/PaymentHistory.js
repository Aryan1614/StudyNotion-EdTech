const PaymentHistory = require("../models/PaymentHistory");
const User = require("../models/User");


exports.fetchPaymentHistoryForStudent = async(req,res) => {
    try{

        const id = req.user.id;

        if(!id){
            return res.status(404).json({
                success: false,
                message: "User Id Not Found!",
            });
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const paymentHistory = await PaymentHistory.findOne({userId: id}).populate({
            path: "paymentHistory",
            populate:{
                path: "userId"
            },
            populate:{
                path: "courses"
            }
        }).exec();

        if(!paymentHistory){
            return res.status(404).json({
                success: false,
                message: "Payment History Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment History Data fetched Successfully!",
            data: paymentHistory.paymentHistory,
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Payments Data Fetching Failure!"
        });
    }
}