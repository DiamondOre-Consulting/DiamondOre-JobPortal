import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  empType: {
    type: String,
    default: "Recruiter"
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true
  },
  doj:{
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  },
  myGoalSheet: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoalSheet",
      }
    ],
    default: []
  },
  myIncentive: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incentive",
      }
    ],
    default: []
  },
  myKPI: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KPI",
      }
    ],
    default: []
  },
  myAccountHandling: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountHandling"
  },
  activeStatus: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Employees", employeeSchema);
