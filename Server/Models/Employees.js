import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Employees", employeeSchema);
