const {contactUsEmail} = require("../mail/templates/contactFormRes");
const { supportIssueMail } = require("../mail/templates/supportMail");
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  console.log(req.body);

  try {
    const supportMail = 'studynotionbyaryan@gmail.com';
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    const supportMailRes = await mailSender(
      supportMail,
      "New Issue!",
      supportIssueMail(email,firstname,lastname,message,phoneNo,countrycode)
    );
    // console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
