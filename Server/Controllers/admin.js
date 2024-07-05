import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import otpStore from "../server.js";
import forgotOtp from "../server.js";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import Candidates from "../Models/Candidates.js";
import Admin from "../Models/Admin.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Status from "../Models/Status.js";
import Jobs from "../Models/Jobs.js";
import CandidateContact from "../Models/CandidateContact.js";
import Employees from "../Models/Employees.js";
import LeaveReport from "../Models/LeaveReport.js";
import PerformanceReport from "../Models/PerformanceReport.js";
import ChatBotMessages from "../Models/ChatBotMessages.js";
import ClientForm from "../Models/ClientForm.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import node_xj from "xls-to-json";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import readXlsxFile from "read-excel-file/node";
import DSR from "../Models/DSR.js";
import JobsTesting from "../Models/JobsTesting.js";
import RecruitersAndKAMs from "../Models/RecruitersAndKAMs.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_ADMIN;

const router = express.Router();

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Send OTP via email using Nodemailer
const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshkr2709@gmail.com",
        pass: "frtohlwnukisvrzh",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <harshkr2709@gmail.com>",
      to: `Recipient <${email}>`,
      subject: "One Time Password",
      text: `Your OTP is: ${otp}`,
      html: `<h1 style="color: blue; text-align: center; font-size: 2rem">Diamond Consulting Pvt. Ltd.</h1> </br> <h3 style="color: black; font-size: 1.3rem; text-align: center;">Your OTP is: ${otp}</h3>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // console.log(info);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Initiate OTP sending
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    const userExists = await Admin.exists({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore[email] = otp; // Store OTP for the email

    console.log(email);
    console.log("otpStore: ", otpStore[email]);

    // Send OTP via email
    await sendOTPByEmail(email, otp);

    console.log("otpStore:", otpStore[email]);

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const credentials = {
  accessKeyId: "wRc04Y5sYocX6Aec",
  secretAccessKey: "93L4ucUETrFEyo9laZtPsvNCjttYAcCsIRxvmHcc",
};

// Create an S3 service client object
const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentials,
  region: "global",
});

// Handle Image file upload
router.post("/upload-profile-pic", async (req, res) => {
  try {
    const file = req.files && req.files.myFileImage; // Change 'myFile' to match the key name in Postman

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // Generate a unique identifier
    const uniqueIdentifier = uuidv4();

    // Get the file extension from the original file name
    const fileExtension = file.name.split(".").pop();

    // Create a unique filename by appending the unique identifier to the original filename
    const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

    // Convert file to base64
    const base64Data = file.data.toString("base64");

    // Create a buffer from the base64 data
    const fileBuffer = Buffer.from(base64Data, "base64");

    const uploadData = await s3Client.send(
      new PutObjectCommand({
        Bucket: "profilepics",
        Key: uniqueFileName, // Use the unique filename for the S3 object key
        Body: fileBuffer, // Provide the file buffer as the Body
      })
    );

    // Generate a public URL for the uploaded file
    const getObjectCommand = new GetObjectCommand({
      Bucket: "profilepics",
      Key: uniqueFileName,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand); // Generate URL valid for 1 hour

    // Parse the signed URL to extract the base URL
    const parsedUrl = new URL(signedUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

    // Send the URL as a response
    res.status(200).send(baseUrl);

    // Log the URL in the console
    console.log("File uploaded. URL:", baseUrl);
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).send("Error uploading file");
  }
});

// SIGNUP AS ADMIN
router.post("/signup-admin", async (req, res) => {
  const { name, email, password, otp, profilePic } = req.body;

  console.log("Signup Email:", email);
  console.log("Entered OTP:", otp);
  console.log("Stored OTP:", otpStore[email]);
  // const isValidOTP = verifyOTP(otpStore, otp); //TESTING OTP
  // if (isValidOTP) {
  // TESTING OTP
  try {
    // Verify OTP
    if (otpStore[email] == otp) {
      const userExists = await Admin.exists({ email });
      if (userExists) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const newUser = new Admin({
        name,
        email,
        otp: null,
        password: hashedPassword,
        profilePic,
      });

      // Save the user to the database
      await newUser.save();

      delete otpStore[email];

      return res
        .status(201)
        .json({ message: "Admin User created successfully" });
    } else {
      return res.status(400).json({ message: "Something went wrong!!!" });
    }
    // Check if user already exists
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  // } else {
  //   res.status(400).json({ error: "Invalid OTP" });
  // }
});

// LOGIN AS ADMIN
router.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: "admin" },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// FETCHING USER DATA
router.get("/user-data", AdminAuthenticateToken, async (req, res) => {
  try {
    // Get the user's email from the decoded token
    const { email } = req.user;

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the required fields from the user object
    const { id, name, profilePic } = user;

    res.status(200).json({
      id,
      name,
      email,
      profilePic,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// FETCHING ALL JOBS
router.get("/all-jobs", async (req, res) => {
  try {
    const allJobs = await Jobs.find({});

    console.log(allJobs);

    return res.status(200).json(allJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING A PARTICULAR JOB
router.get("/all-jobs/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oneJob = await Jobs.findById({ _id: id });
    console.log(oneJob);

    return res.status(201).json(oneJob);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// DELETE BUT NOT EXACTLY DELETE A PARTICULAR JOB
router.put("/remove-job/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const job = await Jobs.findByIdAndUpdate(
      { _id: id },
      {
        $set: { JobStatus: false },
      }
    );

    res.status(201).json({ message: "Job has been removed from list!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCH POSITIONS WITH HIGH NUMMBER OF APPLICANTS
router.get("/jobs-high", async (req, res) => {
  try {
    // Find the 6 jobs with the highest number of applicants
    const topJobs = await Jobs.find({})
      .sort({ appliedApplicants: -1 }) // Sort in descending order based on totalapplicants
      .limit(8); // Limit the result to 6 jobs

    return res.status(200).json(topJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL CANDIDATES
router.get("/all-candidates", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allCandidates = await Candidates.find({}, { password: 0 });

    console.log(allCandidates);

    return res.status(200).json(allCandidates);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING A CANDIDATE
router.get("/all-candidates/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oneCandidate = await Candidates.findById(
      { _id: id },
      { password: 0 }
    );
    console.log(oneCandidate);

    return res.status(201).json(oneCandidate);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL APPLIED JOBS BY A CANDIDATE
router.get(
  "/all-applied-jobs/:id",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      // Get the user's email from the decoded token
      const { email } = req.user;

      const { id } = req.params;

      // Find the user in the database
      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const candidate = await Candidates.findById({ _id: id });

      const allAppliedJobs = candidate.allAppliedJobs;

      const appliedJobs = await Jobs.find({ _id: { $in: allAppliedJobs } });

      return res.status(200).json(appliedJobs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// FETCHING ALL CANDIDATES APPLIED FOR A PARTICULAR JOB
router.get(
  "/applied-candidates/:id",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.user;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const job = await Jobs.findById({ _id: id });

      const allAppliedCandidates = job.appliedApplicants;

      const appliedCandidates = await Candidates.find({
        _id: { $in: allAppliedCandidates },
      });

      return res.status(200).json(appliedCandidates);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// GET STATUS OF A CANDIDATE FOR A PARTICULAR JOB
router.get(
  "/get-status/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { id1, id2 } = req.params;
      const { email } = req.user;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const statusData = await Status.findOne({ candidateId: id1, jobId: id2 });

      // console.log(statusData);
      return res.status(200).json(statusData);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// UPDATE CV SHORTLISTED
router.put(
  "/update-cv-shortlisted/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { id1, id2 } = req.params;
      console.log(id1, id2);
      const { email } = req.user;
      // console.log(email, id1, id2);

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const current = await Status.findOne({ candidateId: id1, jobId: id2 });
      if (!current) {
        return res.status(402).json({ message: "Status not found" });
      }
      // console.log(current);

      const cvShortlistedStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: { status: { Applied: true, CvShortlisted: true } },
        },
        { new: true }
      );

      console.log(cvShortlistedStatus);

      const cvShortlistedJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { shortlistedResumeApplicants: id1 },
        }
      );

      console.log(cvShortlistedJob);
      const CandidateUser = await Candidates.findById({ _id: id1 });
      // cv shorlisted confirmation mail

      const CvShortlistedSucessfully = async (
        CandidateUser,
        cvShortlistedJob,
        user
      ) => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "harshkr2709@gmail.com",
              pass: "frtohlwnukisvrzh",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <harshkr2709@gmail.com>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your CV has been shorlisted",
            html: `
            <p style="color:green; text-align:center;">Congratulations!</p>
            <p>Your CV has been successfully shortlisted for ${cvShortlistedJob.JobTitle}.</p>
            <p>We will contact you soon with further details.</p>
            <p style="color:green; text-align:center;">Thank you!</p>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);

          // console.log(info);
        } catch (error) {
          console.error("Error sending Mail:", error);
          throw error;
        }
      };
      await CvShortlistedSucessfully(CandidateUser, cvShortlistedJob, user);

      return res
        .status(201)
        .json({ message: "CV Shortlisted status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ error, message: "Something went wrong!!!" });
    }
  }
);

// UPDATE Screening
router.put(
  "/update-screening/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { email } = req.user;
      const { id1, id2 } = req.params;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const screeningStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: {
            status: { Applied: true, CvShortlisted: true, Screening: true },
          },
        },
        { new: true }
      );

      const screeningJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { screeningShortlistedApplicants: id1 },
        }
      );

      const CandidateUser = await Candidates.findById({ _id: id1 });

      // CV Screening mail
      const CvScreeningSucessfully = async (
        CandidateUser,
        screeningJob,
        user
      ) => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "harshkr2709@gmail.com",
              pass: "frtohlwnukisvrzh",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <harshkr2709@gmail.com>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your CV passed the screening process",
            html: `
            <p style="color:green; text-align:center;">Congratulations!</p>
            <p>Your CV has successfully passed the screening process.</p>
            <p>We are pleased to inform you that you have passed the screening process for ${screeningJob.JobTitle}.</p>
            <p>We will contact you soon with further details.</p>
            <p style="color:green; text-align:center;">Thank you!</p>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);

          // console.log(info);
        } catch (error) {
          console.error("Error sending Mail:", error);
          throw error;
        }
      };
      await CvScreeningSucessfully(CandidateUser, screeningJob, user);
      return res
        .status(201)
        .json({ message: "Screening status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", error });
    }
  }
);

// UPDATE Interview Scheduled
router.put(
  "/update-interviewscheduled/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { email } = req.user;
      const { id1, id2 } = req.params;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const interviewScheduledStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: {
            status: {
              Applied: true,
              CvShortlisted: true,
              Screening: true,
              InterviewScheduled: true,
            },
          },
        },
        { new: true }
      );

      const interviewScheduledJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { interviewedScheduledApplicants: id1 },
        }
      );

      const CandidateUser = await Candidates.findById({ _id: id1 });

      // Interview Shedule
      const InterviewScheduledSucessfully = async (
        CandidateUser,
        interviewScheduledJob,
        user
      ) => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "harshkr2709@gmail.com",
              pass: "frtohlwnukisvrzh",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <harshkr2709@gmail.com>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your Interview has been Scheduled",
            html: `
            <p style="color:green; text-align:center;">Congratulations!</p>
            <p>We are pleased to inform you that your Interview has been  Scheduled you will get the further information through our HR ${interviewScheduledJob.JobTitle}.</p>
            <p style="color:green; text-align:center;">Thank you!</p>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);

          // console.log(info);
        } catch (error) {
          console.error("Error sending Mail:", error);
          throw error;
        }
      };
      await InterviewScheduledSucessfully(
        CandidateUser,
        interviewScheduledJob,
        user
      );
      return res
        .status(201)
        .json({ message: "Interview scheduled status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", error });
    }
  }
);

// UPDATE Interviewed
router.put(
  "/update-interviewed/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { email } = req.user;
      const { id1, id2 } = req.params;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const interviewedStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: {
            status: {
              Applied: true,
              CvShortlisted: true,
              Screening: true,
              InterviewScheduled: true,
              Interviewed: true,
            },
          },
        },
        { new: true }
      );

      const interviewedJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { interviewedApplicants: id1 },
        }
      );

      return res
        .status(201)
        .json({ message: "Interviewed status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", error });
    }
  }
);

// UPDATE Shortlisted
router.put(
  "/update-shortlisted/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { email } = req.user;
      const { id1, id2 } = req.params;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const shortlistedStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: {
            status: {
              Applied: true,
              CvShortlisted: true,
              Screening: true,
              InterviewScheduled: true,
              Interviewed: true,
              Shortlisted: true,
            },
          },
        },
        { new: true }
      );

      const shortlistedJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { shortlistedApplicants: id1 },
        }
      );

      const CandidateUser = await Candidates.findById({ _id: id1 });
      // Shrtlisted for job mail

      const shortlistedforjob = async (CandidateUser, shortlistedJob, user) => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "harshkr2709@gmail.com",
              pass: "frtohlwnukisvrzh",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <harshkr2709@gmail.com>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! You are Shortlisted!",
            html: `
            <p style="color:green; text-align:center;">Congratulations!</p>
            <p>You have been shortlisted for the position of ${shortlistedJob.JobTitle}.</p>
            <p>This is a significant achievement, and we are excited to consider you for this role.</p>
            <p>We will be in touch shortly with the next steps in the hiring process.</p>
            <p style="color:green; text-align:center;">Thank you!</p>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);

          // console.log(info);
        } catch (error) {
          console.error("Error sending Mail:", error);
          throw error;
        }
      };
      await shortlistedforjob(CandidateUser, shortlistedJob, user);

      return res
        .status(201)
        .json({ message: "Shortlisted status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", error });
    }
  }
);

// UPDATE Joined
router.put(
  "/update-joined/:id1/:id2",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { email } = req.user;
      const { id1, id2 } = req.params;

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const joinedStatus = await Status.findOneAndUpdate(
        { candidateId: id1, jobId: id2 },
        {
          $set: {
            status: {
              Applied: true,
              CvShortlisted: true,
              Screening: true,
              InterviewScheduled: true,
              Interviewed: true,
              Shortlisted: true,
              Joined: true,
            },
          },
        },
        { new: true }
      );

      const JoinedJob = await Jobs.findByIdAndUpdate(
        { _id: id2 },
        {
          $push: { joinedApplicants: id1 },
          $inc: { Vacancies: -1 },
        }
      );

      const CandidateUser = await Candidates.findById({ _id: id1 });
      // Shrtlisted for job mail

      const Joiningstatusmail = async (CandidateUser, JoinedJob, user) => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "harshkr2709@gmail.com",
              pass: "frtohlwnukisvrzh",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <harshkr2709@gmail.com>",
            to: `Recipient <${CandidateUser.email}>`,
            subject:
              "Congratulations on Successfully Joining Your New Company!",
            html: `
             <p style="color:green; text-align:center;">Congratulations!</p>
             <p>Dear ${CandidateUser?.name},</p>
            <p>We are thrilled to inform you that you have successfully joined  ${JoinedJob?.Company} through Diamond Ore pvt.Ltd!</p>
            <p>This marks the beginning of an exciting journey in your career, and we couldn't be happier to have played a part in your success.</p>
            <p>We wish you all the best as you embark on this new chapter. May it bring you growth, fulfillment, and endless opportunities.</p>
            <p>If you have any questions or need assistance during your transition, please don't hesitate to reach out to us. We're here to support you every step of the way.</p>
            <p>Once again, congratulations on your new role at ${JoinedJob?.Company}!</p>
            <p style="color:green; text-align:center;">Best regards,</p>
            <p>Diamond Ore Pvt.Ltd</p>
            `,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);

          // console.log(info);
        } catch (error) {
          console.error("Error sending Mail:", error);
          throw error;
        }
      };
      await Joiningstatusmail(CandidateUser, JoinedJob, user);

      return res
        .status(201)
        .json({ message: "Joined status updated sucessfully!!!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", error });
    }
  }
);

// FETCH ALL MESSAGES OF CANDIDATES
router.get("/all-messages", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allMsg = await CandidateContact.find({});

    console.log(allMsg);

    return res.status(200).json({ allMsg });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCH A MESSAGE OF CANDIDATE
router.get("/all-messages/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allMsg = await CandidateContact.findById({ _id: id });

    console.log(allMsg);

    return res.status(200).json({ allMsg });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

router.put("/edit-profile", AdminAuthenticateToken, async (req, res) => {
  try {
    const { name, password, profilePic } = req.body;
    const { email } = req.user;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
      await user.save();
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      await user.save();
    }
    if (profilePic) {
      user.profilePic = profilePic;
      await user.save();
    }

    res.status(201).json({ message: "Edit profile successful!!!", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL employees
router.get("/all-employees", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allEmployees = await Employees.find({}, { password: 0 });

    console.log(allEmployees);

    return res.status(200).json(allEmployees);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING A Employee
router.get("/all-employees/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not Found" });
    }

    const oneEmployee = await Employees.findById({ _id: id }, { password: 0 });
    console.log(oneEmployee);
    return res.status(201).json(oneEmployee);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// EMPLOYEE LEAVE REPORT
// ADD LEAVE REPORT
router.post("/add-leave-report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, absentDays, lateDays, halfDays, adjustedLeaves } =
      req.body;

    // Find the existing report for the given month and year
    const reportExists = await LeaveReport.findOne({
      employeeId: id,
      month: month,
      year: year,
    });
    if (reportExists) {
      return res
        .status(409)
        .json({ message: "This month's or year's report already exists" });
    }

    const currentReport = await LeaveReport.findOne({ employeeId: id });

    let newReport = {};
    if (currentReport) {
      let currentLeaves = currentReport.totalLeaves;
      if (month == "April" || month == "Apr") {
        newReport = new LeaveReport({
          employeeId: id,
          month,
          year,
          absentDays,
          lateDays,
          halfDays,
          adjustedLeaves,
          totalLeaves: currentLeaves - adjustedLeaves + 16,
        });
      } else {
        newReport = new LeaveReport({
          employeeId: id,
          month,
          year,
          absentDays,
          lateDays,
          halfDays,
          adjustedLeaves,
          totalLeaves: currentLeaves - adjustedLeaves,
        });
      }
      await newReport.save();
    } else {
      newReport = new LeaveReport({
        employeeId: id,
        month,
        year,
        absentDays,
        lateDays,
        halfDays,
        adjustedLeaves,
        totalLeaves: 16 - adjustedLeaves,
      });

      await newReport.save();
    }

    res
      .status(200)
      .json({ message: "Leave report submitted successfully!!!", newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADD PERFORMANCE REPORT
router.post("/add-performance-report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, multipleOf4x, monthlyIncentive, kpiScore } = req.body;

    const reportExists = await PerformanceReport.findOne({
      employeeId: id,
      month: month,
      year: year,
    });
    if (reportExists) {
      return res
        .status(409)
        .json({ message: "This month's or year's report already exists" });
    }

    const currentReport = await PerformanceReport.findOne({ employeeId: id });

    let newReport = {};
    if (currentReport) {
      let currentLeaves = currentReport.totalLeaves;
      if (month == "April" || month == "Apr") {
        newReport = new PerformanceReport({
          employeeId: id,
          month,
          year,
          multipleOf4x,
          monthlyIncentive,
          kpiScore,
        });
      } else {
        newReport = new PerformanceReport({
          employeeId: id,
          month,
          year,
          multipleOf4x,
          monthlyIncentive,
          kpiScore,
        });
      }
      await newReport.save();
    } else {
      newReport = new PerformanceReport({
        employeeId: id,
        month,
        year,
        multipleOf4x,
        monthlyIncentive,
        kpiScore,
      });

      await newReport.save();
    }

    res
      .status(200)
      .json({ message: "Performance report submitted", newReport });
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET LEAVE REPORT OF AN EMPLOYEE
router.get("/leave-report/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestData = await LeaveReport.find({ employeeId: id });

    if (!latestData) {
      return res.status(404).json({ message: "No Leave Report data found" });
    }

    res.status(200).json(latestData);
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET PERFORMANCE REPORT OF AN EMPLOYEE
router.get(
  "/performance-report/:id",
  AdminAuthenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.user;

      // Find the user in the database
      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const latestData = await PerformanceReport.find({ employeeId: id });

      if (!latestData) {
        return res
          .status(404)
          .json({ message: "No Performance Report data found" });
      }

      res.status(200).json(latestData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// CHATBOT MESSAGE RECIEVE
router.post("/send-chatbot", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "helpdesk2.rasonline@gmail.com",
        pass: "fnhwhrbfgjctngwg",
      },
    });
    const userName = req.body.name;
    const userEmailAddress = req.body.email; // Assuming the form has an email input
    const userPhone = req.body.phone;
    const userPreferredCity = req.body.preferredCity;
    const userPreferredChannel = req.body.preferredChannel;
    const userCurrentCTC = req.body.currentCTC;

    const newChatBotMsg = new ChatBotMessages({
      name: userName,
      email: userEmailAddress,
      phone: userPhone,
      preferredCity: userPreferredCity,
      preferredChannel: userPreferredChannel,
      currentCTC: userCurrentCTC,
    });

    await newChatBotMsg.save();

    // Compose the email
    const mailOptions = {
      from: "DOC_Labz <helpdesk2.rasonline@gmail.com>",
      to: "helpdesk2.rasonline@gmail.com",
      subject: `ROBO_RECRUITER: New Message Received from ${userName}`,
      text: `A new message has been submitted by ${userName}.`,
      html: `<h4 style="font-size:1rem; display:flex; justify-content: center;">A new message has been submitted by ${userName}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Email Id: ${userEmailAddress}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Phone No: ${userPhone}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Preferred City: ${userPreferredCity}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Preferred Channel: ${userPreferredChannel}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Current CTC: ${userCurrentCTC}</h4> </br>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    res
      .status(201)
      .json({ message: "ROBO_RECRUITER Sent message successfully!!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// CLIENT MESSAGE RECIEVE
router.post("/client-form", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "helpdesk2.rasonline@gmail.com",
        pass: "fnhwhrbfgjctngwg",
      },
    });
    const userName = req.body.name;
    const userEmail = req.body.email; // Assuming the form has an email input
    const userPhone = req.body.phone;
    const userDesignation = req.body.designation;
    const userCompany = req.body.company;

    const newClientMsg = new ClientForm({
      name: userName,
      email: userEmail,
      phone: userPhone,
      designation: userDesignation,
      company: userCompany,
    });

    await newClientMsg.save();

    // Compose the email
    const mailOptions = {
      from: "DOC_Labz <helpdesk2.rasonline@gmail.com>",
      to: "hr@diamondore.in",
      subject: `DOC_LABZ - New Client: New Message Received from ${userName}`,
      text: `A new message has been submitted by ${userName}.`,
      html: `<h4 style="font-size:1rem; display:flex; justify-content: center;">A new message has been submitted by ${userName}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Email Id: ${userEmail}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Phone No: ${userPhone}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Designation: ${userDesignation}</h4> </br>
                <h4 style="font-size:1rem; display:flex; justify-content: center;">Company: ${userCompany}</h4> </br>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    res.status(201).json({ message: "Client Sent message successfully!!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// FORGOT PASSWORD
// Send OTP via email using Nodemailer For Forgot Password
const sendOTPByEmailForgotPassword = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshkr2709@gmail.com",
        pass: "frtohlwnukisvrzh",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <harshkr2709@gmail.com>",
      to: `Recipient <${email}>`,
      subject: "Forgot Password - OTP",
      text: `Your OTP is: ${otp}`,
      html: `<h1 style="color: blue; text-align: center; font-size: 2rem">Diamond Consulting Pvt. Ltd.</h1> </br> <h3 style="color: black; font-size: 1.3rem; text-align: center;">Your OTP for forget password is: ${otp}</h3>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // console.log(info);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// SEND-OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check affiliate exists
    const userExists = await Admin.exists({ email });
    if (!userExists) {
      return res.status(409).json({ message: "Admin does not exists" });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore[email] = otp; // Store OTP for the email

    // Send OTP via email
    await sendOTPByEmailForgotPassword(email, otp);

    console.log("otpStore:", otpStore[email]);

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// VERIFY AND UPDATE PASSWORD
router.put("/update-password", async (req, res) => {
  const { email, otp, password } = req.body;

  console.log(otpStore[email]);

  try {
    // const { id } = req.params;
    if (otpStore[email] == otp) {
      console.log("stored: ", otpStore[email]);
      console.log("Entered: ", otp);

      // Find the user in the database
      const user = await Admin.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "admin not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      await user.save();

      delete otpStore[email];

      res.status(200).json({ message: "Password Updated Successfully!!" });
    }
  } catch (error) {
    console.error("Error updating Admin Password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const credentialsResumes = {
  accessKeyId: "rjRpgCugr4BV9iTw",
  secretAccessKey: "KBhGM26n6kLYZnigoZk6QJnB3GTqHYvMEQ1ihuZs",
};

const s3ClientResumes = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentialsResumes,
  region: "global",
});

router.post("/upload-dsr", async (req, res) => {
  try {
    const file = req.files && req.files.myFile; // Change 'myFile' to match the key name in Postman

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // Generate a unique identifier
    const uniqueIdentifier = uuidv4();

    // Get the file extension from the original file name
    const fileExtension = file.name.split(".").pop();

    // Create a unique filename by appending the unique identifier to the original filename
    const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

    // Convert file to base64
    const base64Data = file.data.toString("base64");

    // Create a buffer from the base64 data
    const fileBuffer = Buffer.from(base64Data, "base64");

    const uploadData = await s3ClientResumes.send(
      new PutObjectCommand({
        Bucket: "resumes",
        Key: uniqueFileName, // Use the unique filename for the S3 object key
        Body: fileBuffer, // Provide the file buffer as the Body
      })
    );

    // Generate a public URL for the uploaded file
    const getObjectCommand = new GetObjectCommand({
      Bucket: "resumes",
      Key: uniqueFileName,
    });

    const signedUrl = await getSignedUrl(s3ClientResumes, getObjectCommand); // Generate URL valid for 1 hour

    // Parse the signed URL to extract the base URL
    const parsedUrl = new URL(signedUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

    // Send the URL as a response
    res.status(200).send(baseUrl);

    // Log the URL in the console
    console.log("File uploaded. URL:", baseUrl);
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).send("Error uploading file");
  }
});

const downloadFile = async (url, outputFilePath) => {
  const writer = fs.createWriteStream(outputFilePath);

  const response = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

router.post("/upload-dsr-excel", async (req, res) => {
  const { url } = req.body;
  const outputFilePath = path.join(__dirname, "dsrFile.xlsx");
  try {
    console.log(url);
    await downloadFile(url, outputFilePath);
    node_xj(
      {
        input: outputFilePath,
        output: null,
        lowerCaseHeaders: true,
        allowEmptyKey: false,
      },
      async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error converting Excel to JSON", err });
        }
        console.log(result);

        // Assuming the result is an array of job objects
        const dsrAdd = await DSR.insertMany(result);
        console.log(dsrAdd);
        if (dsrAdd) {
          return res.status(200).json({ message: "DSR Added successfully!!!" });
        } else {
          return res.status(500).json({ message: "Something went wrong!!" });
        }
      }
    );
  } catch (err) {
    return res.status(400).json({ message: err.message });
  } finally {
    // Clean up: Delete the temporary file
    fs.unlinkSync(outputFilePath);
  }
});


// SEARCH JOBS 
router.get("/findJobs/:phone", async (req, res) => {
  try {
    const candidate = await DSR.findOne({ phone: req.params.phone });
    if (!candidate) {
      return res.status(404).send("Candidate not found");
    }
    const suitableJobs = await Jobs.find({
      City: candidate.currentLocation,
      Channel: candidate.currentChannel,
      MaxSalary: {
        $gt: candidate.currentCTC,
        $lte: candidate.currentCTC * 1.5, // Not more than 50% of current CTC
      },
    });
    res.status(201).json({ suitableJobs, candidateName: candidate.candidateName });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// BULK
// Send OTP via email using Nodemailer
const sendJobsToRecByEmail = async (eMailIdRec, candidate, suitableJobs) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshkr2709@gmail.com",
        pass: "frtohlwnukisvrzh",
      },
    });

    const jobRows = suitableJobs.map(job => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Company}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.JobTitle}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Industry}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Channel}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Zone}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.City}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.State}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1 style="color: blue; text-align: center; font-size: 2rem">DiamondOre Consulting Pvt. Ltd.</h1>
      <h3 style="color: black; font-size: 1.3rem; text-align: center;">Jobs for candidate: ${candidate.candidateName}</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Company</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Job Title</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Industry</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Channel</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Zone</th>
            <th style="border: 1px solid #ddd; padding: 8px;">City</th>
            <th style="border: 1px solid #ddd; padding: 8px;">State</th>
          </tr>
        </thead>
        <tbody>
          ${jobRows}
        </tbody>
      </table>
    `;

    const mailOptions = {
      from: "Diamondore.in <harshkr2709@gmail.com>",
      to: `Recipient <${eMailIdRec}>`,
      subject: "Recommended Jobs",
      text: `Jobs for candidate: ${candidate.name}`,
      html: htmlContent,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // console.log(info);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const sendJobsToKamByEmail = async (eMailIdKam, candidate, suitableJobs) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshkr2709@gmail.com",
        pass: "frtohlwnukisvrzh",
      },
    });


    const jobRows = suitableJobs.map(job => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Company}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.JobTitle}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Industry}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Channel}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Zone}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.City}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.State}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1 style="color: blue; text-align: center; font-size: 2rem">DiamondOre Consulting Pvt. Ltd.</h1>
      <h3 style="color: black; font-size: 1.3rem; text-align: center;">Jobs for candidate: ${candidate.candidateName}</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Company</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Job Title</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Industry</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Channel</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Zone</th>
            <th style="border: 1px solid #ddd; padding: 8px;">City</th>
            <th style="border: 1px solid #ddd; padding: 8px;">State</th>
          </tr>
        </thead>
        <tbody>
          ${jobRows}
        </tbody>
      </table>
    `;


    const mailOptions = {
      from: "Diamondore.in <harshkr2709@gmail.com>",
      to: `Recipient <${eMailIdKam}>`,
      subject: "Recommended Jobs",
      text: `Jobs for candidate: ${candidate.candidateName}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // console.log(info);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
router.get("/find-bulk-jobs", async (req, res) => {
  try {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year

    const formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate);
    const candidates = await DSR.find({currentDate: formattedDate});
    if (!candidates.length) {
      return res.status(404).send("No candidates found");
    }

    const recommendations = [];

    for (const candidate of candidates) {
      const suitableJobs = await Jobs.find({
        City: candidate.currentLocation,
        Channel: candidate.currentChannel,
        MaxSalary: {
          $gt: candidate.currentCTC,
          $lte: candidate.currentCTC * 1.5, // Not more than 50% of current CTC
        },
      });

      recommendations.push({
        candidate: candidate,
        jobs: suitableJobs,
      });

      if(suitableJobs.length > 0) {
        const findRec = await RecruitersAndKAMs.findOne({
          name: candidate.recruiterName
        });
        const findKam = await RecruitersAndKAMs.findOne({
          name: candidate.kamName
        })
        const eMailIdRec = findRec.email;
        const eMailIdKam = findKam.email;
        console.log(eMailIdKam, eMailIdRec);
        await sendJobsToRecByEmail(eMailIdRec, candidate, suitableJobs)
        await sendJobsToKamByEmail(eMailIdKam, candidate, suitableJobs)
      }
    }

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// REGISTER RECRUITER AND KAM
router.post("/register-recruiter-kam", async (req, res) => {
  try {
    const {name, email} = req.body;

    if (!name || !email) {
      return res.status(402).json({message: "Both name and email are required!!!"})
    }

    const findEmp = await RecruitersAndKAMs.exists({email});
    if(findEmp) {
      return res.status(401).json({message: "This Recruiter or KAM already has been registered!!!"});
    }

    const newEmp = new RecruitersAndKAMs({
      name,
      email
    })

    await newEmp.save();

    if (newEmp) {
      return res.status(201).json({message: "New Recruiter or KAM got resgitered!!!"});
    }
  } catch(error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
})

export default router;
