import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
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
    clBalance: {
      type: Number,
      default: 0,
    },
    elBalance: {
      type: Number,
      default: 0,
    },
    lopUsed: {
      type: Number,
      default: 0,
    },
    lastMonthlyCreditMonth: {
      type: Number,
      default: 0,
    },
    lastELCreditMonth: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

leaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

export default mongoose.model("LeaveBalance", leaveBalanceSchema);

