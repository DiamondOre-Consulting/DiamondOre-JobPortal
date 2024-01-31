import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();

// Use express-fileupload middleware for handling file uploads
app.use(fileUpload());

app.use(express.json());
app.use(cors());
app.use(express.static("ProfileImgUploads"));
// app.use(bodyParser.urlencoded(extended))

const PORT = 5000;

// Database connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

import candidatesController from "./Controllers/candidates.js";
import newJobPost from "./Controllers/jobs.js";
import adminController from "./Controllers/admin.js";
import adminERPController from "./Controllers/erp.js";
// import employerController from "./Controllers/employers.js";
// import contactUsController from "./Controllers/contactus.js";

app.use('/api/candidates', candidatesController);
app.use('/api/jobs', newJobPost);
app.use('/api/admin-confi', adminController);
app.use('/api/admin-confi/erp', adminERPController);
// app.use('/api/employers', employerController);
// app.use('/api/contactus', contactUsController);

const storeOTP = {};
const forgotOtp = {};

app.get("/", (req, res) => {
  res.send("Hello Diamondore");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default {storeOTP, forgotOtp};