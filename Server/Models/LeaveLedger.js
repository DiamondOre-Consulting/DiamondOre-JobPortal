import mongoose from "mongoose";

const leaveLedgerSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
      index: true,
    },
    leaveYear: {
      type: Number,
      required: true,
      index: true,
    },
    entryType: {
      type: String,
      enum: [
        "accrual_cl",
        "accrual_el",
        "deduction",
        "restore",
        "comp_off",
        "carry_forward",
        "manual_adjust",
      ],
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ["CL", "EL", "LOP", "MIXED"],
      default: "MIXED",
    },
    amount: {
      type: Number,
      default: 0,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest",
      default: null,
    },
    transactionKey: {
      type: String,
      default: null,
      index: true,
      unique: true,
      sparse: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LeaveLedger", leaveLedgerSchema);
