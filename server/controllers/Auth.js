const User = require('../models/User');
const OTP = require('../models/OTP');
const otpgenerator = require("otp-generator");
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const mailSender = require('../utils/mailSender');
const PaymentHistory = require('../models/PaymentHistory');

// sendotp
exports.sendOtp = async(req,res) => {
    try{

        const { email } = req.body;

        if(!email){
            return res.status(401).json({
                success: false,
                message: "Email Not Found!",
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(403).json({
                success: false,
                message: "User Already Exist!",
            });
        }

        // now we can create otp 
        var otp = otpgenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const result = await OTP.findOne({otp : otp});

        while(result){
            otp = otpgenerator(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({otp : otp});
        }

        const otpPyload = { email,otp };

        const otpBody = await OTP.create(otpPyload);
        // console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "Otp Created Successfully",
            otp,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// signup
exports.signUp = async(req,res) => {
    try{

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
                success: false,
                message: "All Details Required!",
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password Not Matched!",
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User Already Exists!",
            });
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log(recentOtp);

        if(recentOtp.length == 0){
            return res.status(400).json({
                success: false,
                message: "Otp Not Found"
            });
        }

        if(otp != recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid Otp!!",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // create an db entry 

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const newUser = await User.create({
            firstName,
            lastName,
            email,                    
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`, 
        });

        // console.log(newUser);
        if(accountType === "Student"){
            const newPaymentHistory = await PaymentHistory.create({
                userId: newUser._id,
                paymentHistory: []
            });
    
            if(!newPaymentHistory){
                return res.status(404).json({
                    success: false,
                    message: "Payment History Not Cretaed For User",
                })
            }
        }

        return res.status(200).json({
            success: true,
            message: "User Created Successfully!",
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// login
exports.login = async(req,res) => {
    try{

        const {
            email,
            password
        } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All Details Required!",
            });
        }

        const existingUser = await User.findOne({email}).populate("additionalDetails");

        if(!existingUser){              
            return res.status(400).json({
                success: false,
                message: "User Not Registered!",
            });
        }

        // now we need to check the password
        if(!await bcrypt.compare(password,existingUser.password)){
            return res.status(401).json({
                success: false,
                message: "Invalid password!",
            });
        }

        // password matched

        const payload = {
            email: existingUser.email,
            id: existingUser._id,
            accountType: existingUser.accountType,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "5h",
        });

        existingUser.token = token;
        existingUser.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() +3*24*60*60*1000),
            httpOnly: true,
        };

        res.cookie("token",token,options).status(200).json({
            success: true,
            token,
            existingUser,
            message: "User Logged In Successfully",
        });


    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure!",
        });
    }
}

// changepassword
exports.changePassword = async(req,res) => {
    try{

        const {
            oldPassword,
            newPassword,
        } = req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "All Fields Required!!"
            });
        }

        const user = await User.findById(req.user.id);

        const isPaswordMatched = await bcrypt.compare(oldPassword,user.password);

        if(!isPaswordMatched){
            return res.status(401).json({
                success: false,
                user,
                message: "Password Not Matched!"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        const updatedUser = await User.findByIdAndUpdate({_id: user._id},
            {
                password: hashedPassword,
            },
            {new:true}
        );

        // send verification mail
        try{

            const mailResponse = await mailSender(
                updatedUser.email,
                "Password for your Account has been updated",
                passwordUpdated(
                    updatedUser.email,
                    `password updated successfully for ${updatedUser.firstName} ${updatedUser.lastName}`,
                )
            );

            // console.log("Email sent successfully:", mailResponse.response)
        } catch(error){
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password updated Successfully!",
        });
        
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing Went Wrong while Changing password, Please Try Again!!",
        })
    }
}
