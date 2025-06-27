import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  resume: {
    type: String,
  },
  pan: {
    type: String,
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
  },
  age: {
    type: String,
  },
  location: {
    type: String,
  },
  experience: {
    type: String,
  },
  currentCTC: {
    type: String,
  },
  expectedCTC: {
    type: String,
  },
  education: {
    type: [
      {
        institute: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    default: [],
  },
  noticePeriod: {
    type: String,
  },

  currentCompany: {
    type: String,
  },
  recency: {
    type: Date,
  },
  preferredFormStatus: {
    type: Boolean,
    default: false,
  },
  allAppliedJobs: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
    default: [],
  },
  allShortlistedJobs: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Candidates", candidateSchema);
