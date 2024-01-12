import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidates",
  },
  jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
  },
  check: {
    type: Boolean,
    default: true
  },
  status: {
    Applied: {
      type: Boolean,
      default: null,
    },
    CvShortlisted: {
      type: Boolean,
      default: null,
    },
    Screening: {
      type: Boolean,
      default: null,
    },
    InterviewScheduled: {
      type: Boolean,
      default: null,
    },
    Interviewed: {
      type: Boolean,
      default: null,
    },
    Shortlisted: {
      type: Boolean,
      default: null,
    },
    Joined: {
      type: Boolean,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Status", statusSchema);
