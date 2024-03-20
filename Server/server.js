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
import empController from "./Controllers/employees.js";
// import contactUsController from "./Controllers/contactus.js";

app.use('/api/candidates', candidatesController);
app.use('/api/jobs', newJobPost);
app.use('/api/admin-confi', adminController);
app.use('/api/admin-confi/erp', adminERPController);
app.use('/api/employee', empController);
// app.use('/api/employers', employerController);
// app.use('/api/contactus', contactUsController);


const otpStore = {};
const forgotOtp = {};

app.get("/", (req, res) => {
  res.send("Hello Diamondore");
});

// For any other request, serve the React app's HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default otpStore;