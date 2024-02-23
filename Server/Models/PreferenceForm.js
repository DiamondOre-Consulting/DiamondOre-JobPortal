import mongoose from "mongoose";

const preferenceFormSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  preferredCity: {
    type: String,
    required: true,
  },
  preferredChannel: {
    type: String,
    required: true,
    // unique: true,
  },
  minExpectedCTC: {
    type: String,
    required: true,
  },
  maxExpectedCTC: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PreferenceForm", preferenceFormSchema);
