import mongoose from "mongoose";

const clientFormSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  designation: {
    type: String,
  },
  company: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ClientForm", clientFormSchema);
