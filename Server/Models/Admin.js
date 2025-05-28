import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  otp: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true,
  },
  adminType:{
    type:String,
    enum:['superAdmin','subAdmin','kpiAdmin'],
    
  },
  passcode:{
    type:String,
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

export default mongoose.model("Admin", adminSchema);
