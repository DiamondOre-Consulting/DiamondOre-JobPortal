import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { multerErrorHandler } from "./Middlewares/error.multer.middleware.js";

import candidatesController from "./Controllers/candidates.js";
import newJobPost from "./Controllers/jobs.js";
import adminController from "./Controllers/admin.js";
import adminERPController from "./Controllers/erp.js";
import empController from "./Controllers/employees.js";

import employeeAuthRouter from './Controllers/employees-auth/auth.js'

import adminAuthRouter from './Controllers/admin-auth/auth.js'

import candidateAuthRouter from './Controllers/candidates-auth/auth.js'

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static("ProfileImgUploads"));

const PORT = process.env.PORT || 5000;

// Database connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use('/api/candidates', candidatesController);
app.use('/api/candidates',candidateAuthRouter)
app.use('/api/jobs', newJobPost);
app.use('/api/admin-confi', adminController);
app.use('/api/admin-confi',adminAuthRouter)
app.use('/api/admin-confi/erp', adminERPController);
app.use('/api/employee', empController);
app.use('/api/employee',employeeAuthRouter)

app.use(multerErrorHandler);

app.get("/", (req, res) => {
  res.send("Hello Diamondore");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});