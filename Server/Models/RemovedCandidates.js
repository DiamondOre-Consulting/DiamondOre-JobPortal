import mongoose from "mongoose";

const removedSchema = new mongoose.Schema({
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
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    resume: {
      type: String,
      required: true,
    },
    preferredFormStatus: {
      type: Boolean,
      default: false
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
  
  export default mongoose.model("RemovedCandidates", removedSchema);