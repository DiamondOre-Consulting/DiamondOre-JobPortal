import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  Company: {
    type: String,
    required: true,
  },
  JobTitle: {
    type: String,
    required: true,
    // unique: true,
  },
  Industry: {
    type: String,
    required: true,
    // unique: true,
  },
  Channel: {
    type: String,
    default: "N/A",
    lowercase:true
    // required: true,
    // unique: true,
  },
  Vacancies: {
    type: Number,
    required: true,
  },
  Zone: {
    type: String,
    // required: true,
    lowercase:true
  },
  City: {
    type: String,
    lowercase:true
  },
  State: {
    type: String,
    required: true,
    lowercase:true
  },
  MinExperience: {
    type: String,
    // required: true,
  },
  MaxSalary: {
    type: Number,
    // required: true,
  },
  JobStatus: {
    type: String,
    default: "Active"
  },
  DateAdded: {
    type: String
  },
  appliedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  shortlistedResumeApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  screeningShortlistedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  interviewedScheduledApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  interviewedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  shortlistedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  joinedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidates" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Jobs", jobsSchema);