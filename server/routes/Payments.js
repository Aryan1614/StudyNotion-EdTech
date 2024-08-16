const express = require('express');
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendVerificationEmail
} = require("../controllers/Payments");

const {
    fetchPaymentHistoryForStudent
} = require("../controllers/PaymentHistory");


const { auth, isStudent } = require("../middlewares/auth");


router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifyPayment);
router.post("/successPaymentEmail", auth, isStudent, sendVerificationEmail);
router.get("/paymentHistory",auth,isStudent,fetchPaymentHistoryForStudent);

module.exports = router;