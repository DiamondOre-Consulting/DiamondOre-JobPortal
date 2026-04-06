import mongoose from "mongoose";

const monthlyLeaveSummarySchema = new mongoose.Schema(
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
    presentDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    halfDays: { type: Number, default: 0 },
    leaveUnits: { type: Number, default: 0 },
    totalMarkedDays: { type: Number, default: 0 },
    clCredited: { type: Number, default: 0 },
    elCredited: { type: Number, default: 0 },
    compOffCL: { type: Number, default: 0 },
    compOffEL: { type: Number, default: 0 },
    carryForwardCL: { type: Number, default: 0 },
    carryForwardEL: { type: Number, default: 0 },
    clUsed: { type: Number, default: 0 },
    elUsed: { type: Number, default: 0 },
    lopUsed: { type: Number, default: 0 },
    manualAdjustmentCL: { type: Number, default: 0 },
    manualAdjustmentEL: { type: Number, default: 0 },
    manualAdjustmentLOP: { type: Number, default: 0 },
    pendingRequests: { type: Number, default: 0 },
    approvedRequests: { type: Number, default: 0 },
    rejectedRequests: { type: Number, default: 0 },
    modifiedRequests: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

monthlyLeaveSummarySchema.index(
  { employeeId: 1, year: 1, month: 1 },
  { unique: true }
);

export default mongoose.model("MonthlyLeaveSummary", monthlyLeaveSummarySchema);
