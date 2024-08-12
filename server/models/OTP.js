const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            trim : true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt : {
            type: Date,
            default: Date.now(),
            expires: 5*60,
        }
    }
);

// write a function to send an email
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email From StudyNotion", emailTemplate(otp));
        console.log("MailResponse: ", mailResponse);

    } catch(error){
        console.log("Something Went Wrong while Sending An Email");
        console.log(error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email,this.otp);
    next();
});

module.exports = mongoose.model("OTP",OTPSchema);