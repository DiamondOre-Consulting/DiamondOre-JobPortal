import mongoose from "mongoose";

const dsrSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String,
    required: true
  },
  currentChannel: {
    type: String,
    required: true
  },
  currentCTC: {
    type: Number,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  recruiterName: {
    type: String,
    required: true
  },
  kamName: {
    type: String,
    required: true
  },
  currentDate: {
    type: String,
    required: true
  }
});

export default mongoose.model("DSR", dsrSchema);