import mongoose from "mongoose";

const leaveReportSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming you have an Employee model
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    absentDays: {
        type: Number,
        default: 0
    },
    lateDays: {
        type: Number,
        default: 0
    },
    halfDays: {
        type: Number,
        default: 0
    },
    adjustedLeaves: {
        type: Number,
        default: 0
    },
    totalLeaves: {
        type: Number,
        default: 16
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

export default mongoose.model("LeaveReport", leaveReportSchema);