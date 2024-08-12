const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

// resetPasswordToken

exports.resetPasswordToken = async(req,res) => {
    try{

        const { email } = req.body;

        if(!email){
            return res.status(401).json({
                success: false,
                message: "Email Not Found",
            });
        }

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User Not Found!",
            });
        }

        // generate token
        const token = crypto.randomUUID();

        const updateUser = await User.findByIdAndUpdate({_id: user._id},{
            token : token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },{new:true});
        // third parameter return an updated user deatils

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(
            email,
            "Reset password Link",
            `Reset Password Link : ${url}`,
        );

        return res.status(200).json({
            success: true,
            message: "Email Send Successfully, Please Check Mail And Change the password!",
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing Went Wrong While Sending Reset password mail!",
        });
    }
}

// resetPassword
exports.resetPassword = async(req,res) => {
    try{

        const { password, confirmPassword, token } = req.body;

        if(!password || !confirmPassword || !token){
            return res.status(401).json({
                success: false,
                message: "All Details Required!",
            });
        }

        if(password != confirmPassword){
            return res.status(401).json({
                success: false,
                message: "password Not Matched!",
            });
        }

        const userDetails = await User.findOne({token : token});

        if(!userDetails){
            return res.status(403).json({
                success: false,
                message: "Invalid Token"
            });
        }

        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token Expired, Please Try Again!",
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.findOneAndUpdate({token: token},{
            password: hashedPassword
        },{new:true});

        return res.status(200).json({
            success: true,
            message: "Password Change Successfully!"
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Reseting Password",
        })
    }
}