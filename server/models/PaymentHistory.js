const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        paymentHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payments",
            }
        ]
    }
);

module.exports = mongoose.model("PaymentHistory",paymentHistorySchema);