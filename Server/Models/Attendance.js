import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      default: "Present",
    },
    leaveRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest",
      default: null,
    },
    leaveType: {
      type: String,
      enum: ["CL", "EL", "LOP", ""],
      default: "",
    },
    manualDeduction: {
      cl: { type: Number, default: 0 },
      el: { type: Number, default: 0 },
      lop: { type: Number, default: 0 },
      clCarry: { type: Number, default: 0 },
      elCarry: { type: Number, default: 0 },
      units: { type: Number, default: 0 },
      priorYearUsage: [
        {
          year: { type: Number },
          cl: { type: Number, default: 0 },
          el: { type: Number, default: 0 },
        },
      ],
      leaveType: {
        type: String,
        enum: ["CL", "EL", "LOP", ""],
        default: "",
      },
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
