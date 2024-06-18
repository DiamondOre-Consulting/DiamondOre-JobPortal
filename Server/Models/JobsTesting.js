import mongoose from "mongoose";

const testJobsSchema = new mongoose.Schema({
  positionName: String,
  company: String,
  ctcOffered: Number,
  location: String,
  channel: String
});

export default mongoose.model('TestJob', testJobsSchema);