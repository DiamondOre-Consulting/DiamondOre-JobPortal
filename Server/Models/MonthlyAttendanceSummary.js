import mongoose from "mongoose";

const monthlyAttendanceSummarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    presentDays: {
      type: Number,
      default: 0,
    },
    absentDays: {
      type: Number,
      default: 0,
    },
    halfDays: {
      type: Number,
      default: 0,
    },
    leaveUnits: {
      type: Number,
      default: 0,
    },
    totalMarkedDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

monthlyAttendanceSummarySchema.index(
  { employeeId: 1, year: 1, month: 1 },
  { unique: true }
);

export default mongoose.model(
  "MonthlyAttendanceSummary",
  monthlyAttendanceSummarySchema
);
