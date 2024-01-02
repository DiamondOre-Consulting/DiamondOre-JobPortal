import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  candidateId: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidates",
    },
  },
  jobId: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },
  },
  check: {
    type: Boolean,
    default: false
  },
  status: {
    Applied: {
      type: Boolean,
      default: false,
    },
    CvShortlisted: {
      type: Boolean,
      default: false,
    },
    Screening: {
      type: Boolean,
      default: false,
    },
    InterviewScheduled: {
      type: Boolean,
      default: false,
    },
    Interviewed: {
      type: Boolean,
      default: false,
    },
    Shortlisted: {
      type: Boolean,
      default: false,
    },
    Joined: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Status", statusSchema);
