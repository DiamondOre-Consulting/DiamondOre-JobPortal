import mongoose from "mongoose";

const attendanceSnapshotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    hadRecord: {
      type: Boolean,
      default: false,
    },
    previousStatus: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      default: "Present",
    },
    appliedStatus: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      required: true,
    },
  },
  { _id: false }
);

const leaveRequestSchema = new mongoose.Schema(
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
    leaveType: {
      type: String,
      enum: ["CL", "EL"],
      required: true,
    },
    durationType: {
      type: String,
      enum: ["half_day", "full_day", "multiple_days"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "modified"],
      default: "pending",
      index: true,
    },
    impactApplied: {
      type: Boolean,
      default: true,
    },
    appliedDeduction: {
      cl: { type: Number, default: 0 },
      el: { type: Number, default: 0 },
      lop: { type: Number, default: 0 },
    },
    attendanceSnapshot: {
      type: [attendanceSnapshotSchema],
      default: [],
    },
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
      action: {
        type: String,
        enum: ["approve", "reject", "modify", ""],
        default: "",
      },
      remark: {
        type: String,
        trim: true,
        default: "",
      },
      modificationCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);

