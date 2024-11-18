import mongoose from "mongoose";

const candidateContactSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    // unique: true,
  },
  Email: {
    type: String,
    required: true,
    // unique : true,
  },
  Message: {
    type: String,
    default: "N/A",
    required: true,
    // unique: true,
  },
  Status: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CandidateContact", candidateContactSchema);