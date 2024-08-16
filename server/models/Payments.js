const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("Payments",paymentSchema);