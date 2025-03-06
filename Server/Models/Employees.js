import mongoose, { mongo } from "mongoose";

// / goalDetail.target = cost * 4;
const employeeSchema = new mongoose.Schema({
  empType: {
    type: String,
    default: "Recruiter",
  },
  name: {
    type: String,
    required: true,
  },
  accountHandler: {
    type: Boolean,
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
    required: true,
  },
  doj: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
  },
  myGoalSheet: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoalSheet",
      },
    ],
    default: [],
  },
  myIncentive: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incentive",
      },
    ],
    default: [],
  },
  myKPI: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KPI",
      },
    ],
    default: [],
  },
  myAccountHandling: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountHandling",
  },
  // joining exelshel shet to uplaod
  joiningExcel: {
    type: String,
  },

  shortlistedCandidates:{
    type : String
  },

 
  isTeamLead: {
    type: Boolean,
    default: false,
  },

  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
    },
  ],

  activeStatus: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const teamSchema = new mongoose.Schema({
//   teamLead: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employees",
//     required: true,
//   },
//   employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employees" }],
// } ,{timestamps : true});

export default mongoose.model("Employees", employeeSchema);
// export const Team = mongoose.model("Team" , teamSchema);
