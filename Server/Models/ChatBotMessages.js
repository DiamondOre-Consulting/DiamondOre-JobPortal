import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  name: {
    type: String, // Assuming you have an Employee model
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  preferredCity: {
    type: String,
  },
  preferredChannel: {
    type: String,
  },
  currentCTC: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ChatBot", chatbotSchema);
