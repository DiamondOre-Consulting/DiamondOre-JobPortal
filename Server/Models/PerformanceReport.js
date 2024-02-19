import mongoose from "mongoose";

const performanceReportSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you have an Employee model
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  multipleOf4x: {
    type: Number,
    default: 0,
  },
  monthlyIncentive: {
    type: Number,
    default: 0,
  },
  kpiScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PerformanceReport", performanceReportSchema);
