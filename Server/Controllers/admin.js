import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { otpStore, storeOtp } from "../server.js";
// import forgotOtp from "../server.js";
import { InventoryConfigurationFilterSensitiveLog, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
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
// import { Team } from "../Models/Employees.js";
import multer from "multer";
import path from "path";
import fs, { stat } from "fs";
import fsPromises from "fs/promises";

import axios from "axios";
import node_xj from "xls-to-json";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import readXlsxFile from "read-excel-file/node";
import Exceljs from "exceljs";
import DSR from "../Models/DSR.js";
import JobsTesting from "../Models/JobsTesting.js";
import RecruitersAndKAMs from "../Models/RecruitersAndKAMs.js";
import ClientReviews from "../Models/ClientReviews.js";
import GoalSheet from "../Models/GoalSheet.js";
import AccountHandling from "../Models/AccountHandling.js";
import KPI from "../Models/KPI.js";
import {z} from 'zod'
import {excelUpload} from "../Middlewares/multer.middleware.js";
import { uploadImage } from '../Middlewares/multer.middleware.js'
import { uploadFile } from "../utils/fileUpload.utils.js";
import {deleteFile} from '../utils/fileUpload.utils.js';
import Policies from '../Models/Policies.js'
import {pdfUpload} from '../Middlewares/multer.middleware.js'

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
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
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
   

    const userExists = await Admin.exists({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate and store OTP
    const otp = generateOTP();
   
    storeOtp(email, otp); // Store OTP for the email
    console.log(email,otp)
 
    // Send OTP via email
    await sendOTPByEmail(email, otp);

    

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



// SIGNUP AS ADMIN
router.post("/signup-admin",AdminAuthenticateToken ,uploadImage.single('myFileImage'), async (req, res) => {
  const { name, email, password, otp, adminType } = 
  req.body;

  
 


  try {
    // Verify OTP

    if (!otpStore[email] || otpStore[email].expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    

    if (otpStore[email].otp == otp) {
      const userExists = await Admin.exists({ email });
      if (userExists) {
        return res.status(409).json({ message: "User already exists" });
      }

     
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newProfilePic = await uploadFile(req.file, "profilepics");

      console.log(newProfilePic)

      // Create a new user object
      const newUser = new Admin({
        name,
        email,
        otp: null,
        password: hashedPassword,
        profilePic:newProfilePic,
        adminType,
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

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// LOGIN AS ADMIN
router.post("/login-admin", async (req, res) => {
  console.log("login-route enter")
  const { email, password } = req.body;
   
  const {success,error} = adminLoginSchema.safeParse({email,password})
    if (!success) {
        return res.status(400).json({message: "Invalid credentials"});
    }

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

    console.log("login",secretKey)

    // Generate JWT token

    function signJwt(payload,secretKey,expiresIn = '10h'){
      try{
             return jwt.sign(payload,secretKey,{expiresIn})
      }
      catch(err){
        console.log("enter")
        console.log(err) 
      }
            
    }
    const token = signJwt(
      { userId: user._id, name: user.name, email: user.email, role: "admin" },
      secretKey
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
    const { id, name, profilePic, adminType, passcode } = user;

    res.status(200).json({
      id,
      name,
      email,
      profilePic,
      adminType,
      passcode,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const allJobsSchema = z.object({
    page:z.coerce.number(),
    limit:z.coerce.number()
})

// FETCHING ALL JOBS
router.get("/all-jobs", async (req, res) => {
  try {
    
    const {success,error,data} = allJobsSchema.safeParse(req.query)
    if (!success) {
        return res.status(400).json({message: "Invalid credentials"});
    }

    const page  = data.page || 0;
    const limit = data.limit || 20;


    const skip = (page) * limit;

    const allJobsCount = await Jobs.countDocuments({JobStatus:true});

    const allJobs = await Jobs.find({JobStatus:true}).limit(limit).skip(skip);
    

    return res.status(200).json({
        totalPages: Math.ceil(allJobsCount/limit),
        allJobs:allJobs,
        currentPage: page
      });

  }catch(error){
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

    res.status(200).json({ message: "Job has been removed from list!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCH POSITIONS WITH HIGH NUMMBER OF APPLICANTS
router.get("/jobs-high", async (req, res) => {
  try {
    // Find the 6 jobs with the highest number of applicants
    const topJobs = await Jobs.aggregate([
      {
        $addFields: {
          applicantsCount: { $size: "$appliedApplicants" } 
        }
      },
      {
        $sort: { applicantsCount: -1 } 
      },
      {
        $limit: 6 
      }
    ]);
    
    return res.status(200).json(topJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});
const allCandidatesSchema = z.object({
  page:z.coerce.number(),
  limit:z.coerce.number()
})

// FETCHING ALL CANDIDATES
router.get("/all-candidates", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
  
    const {success,error,data} = allCandidatesSchema.safeParse(req.query)
    if (!success) {
        return res.status(400).json({message: "erronous data"});
    }


    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const page= data.page || 0;
    const limit = data.limit || 20;

    const skip = page * limit;
    const totalPages = await Candidates.countDocuments();
    const allCandidates = await Candidates.find().skip(skip).limit(limit).select({password:0});

  

    return res.status(200).json({
      allCandidates:allCandidates.reverse(),
      totalPages: Math.ceil(totalPages/limit),
      currentPage: page
    }
    );
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
    

    return res.status(201).json(oneCandidate);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

const singleCandidateSchema= z.object({
  searchTerm:z.string(),
  page:z.coerce.number().optional(),
  limit:z.coerce.number().optional()
})

router.get("/search-candidate", AdminAuthenticateToken , async(req,res)=>{
  
  try{
    const {data,success} = singleCandidateSchema.safeParse(req.query)
    

    if(!success){
      return res.status(422).json({message: "erroneous data"})
    }

  const { email } = req.user;

  const page= data.page || 0;
  const limit = data.limit || 6;
  const skip = page * limit;
  
  const user = await Admin.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

 
  const candidates = await Candidates.aggregate([
    {
      $search:{
        index: "candidates_search_index",
        text:{
          query: data.searchTerm, 
          path: "name",    
          fuzzy: { maxEdits: 2 } 
        }
      }},
      {
        $addFields: { score: { $meta: "textScore" }} 
      },
      {
        $sort: { score: -1, _id: 1 }
      },
      { $skip: skip },
      { $limit: limit },   
      {
        $project: {
          password: 0 
        }
      }
  ])

  const totalCandidates = await Candidates.aggregate([
    {
      $search: {
        index: "candidates_search_index",
        text: {
          query: data.searchTerm,
          path: "name",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    { $count: "total" },
     
  ]);

  // const candidates = await Candidates.find({
  //    name :{ $regex:data.searchTerm, $options:"i"}
  // })

  const totalResults = totalCandidates.length > 0 ? totalCandidates[0].total : 0;
  
  

  res.status(200).json({
    success:true,
    searchedCandidate:candidates,
    totalPages :Math.ceil(totalResults/limit),
    currentPage:page
  })

  }
  catch(err){
    console.log(err)
    res.status(500).json({
      success:false,
      error:err
    })

  }

 
})


router.get("/newly-added-candidates", AdminAuthenticateToken , async(req,res)=>{ 
      try{
          const limit = 10;
          const newlyAddedCandidates = await Candidates.find().sort({createdAt: -1}).limit(limit).select({password:0})        
          res.status(200).json({
            newlyAddedCandidates:newlyAddedCandidates
          })      
      }
      catch(err){
         console.log(err)
         res.status(500).json({
          success:false,
          error:err
         })
      }

})

// FETCHING ALL APPLIED JOBS BY A CANDIDATE
router.get("/all-applied-jobs/:id",AdminAuthenticateToken,async (req, res) => {
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
router.get("/applied-candidates/:id",AdminAuthenticateToken,async (req, res) => {
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
router.get("/get-status/:id1/:id2",AdminAuthenticateToken, async (req, res) => {
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
router.put("/update-cv-shortlisted/:id1/:id2", AdminAuthenticateToken, async (req, res) => {
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
              user: "tech@diamondore.in",
              pass: "zlnbcvnhzdddzrqn",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <tech@diamondore.in>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your CV has been shorlisted",
            html: `
            <p style="color:black; text-align:left; font-size: 20px; font-style: bold;">Congratulations🎊🎉✨!</p>
            <p>Your CV has been successfully shortlisted for ${cvShortlistedJob.JobTitle}.</p>
            <p>We will contact you soon with further details.</p>
            <p style="color:black; text-align:left;">Thank you!</p>
            <p style="text-align: left;  ">Regards,</p>
            <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
            attachments: [
              {
                filename: "logo.png",
                path: "C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/logo.png",
                cid: "logo",
              },
            ],
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
router.put("/update-screening/:id1/:id2",AdminAuthenticateToken,async (req, res) => {
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
              user: "tech@diamondore.in",
              pass: "zlnbcvnhzdddzrqn",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <tech@diamondore.in>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your CV passed the screening process",
            html: `
          <p style="color:black; text-align:left; font-size: 20px; font-style: bold;">Congratulations🎊🎉✨!</p>
            <p>Your CV has successfully passed the screening process.</p>
            <p>We are pleased to inform you that you have passed the screening process for ${screeningJob.JobTitle}.</p>
            <p>We will contact you soon with further details.</p>
            <p style="color:black; text-align:left;">Thank you!</p>
              <p style="text-align: left;  ">Regards,</p>
            <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
            attachments: [
              {
                filename: "logo.png",
                path: "C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/logo.png",
                cid: "logo",
              },
            ],
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
router.put("/update-interviewscheduled/:id1/:id2",AdminAuthenticateToken,async (req, res) => {
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
              user: "tech@diamondore.in",
              pass: "zlnbcvnhzdddzrqn",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <tech@diamondore.in>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! Your Interview has been Scheduled",
            html: `
             <p style="color:black; text-align:left; font-size: 20px; font-style: bold;">Congratulations🎊🎉✨!</p>
            <p>We are pleased to inform you that your Interview has been  Scheduled for  ${interviewScheduledJob.JobTitle}.</p>
            <p>We will contact you soon with further details.</p>
            <p style="color:black; text-align:left;">Thank you!</p>
            <p style="text-align: left;  ">Regards,</p>
            <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
            attachments: [
              {
                filename: "logo.png",
                path: "C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/logo.png",
                cid: "logo",
              },
            ],
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
router.put("/update-interviewed/:id1/:id2",AdminAuthenticateToken,async (req, res) => {
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
router.put("/update-shortlisted/:id1/:id2",AdminAuthenticateToken,async (req, res) => {
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
              user: "tech@diamondore.in",
              pass: "zlnbcvnhzdddzrqn",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <tech@diamondore.in>",
            to: `Recipient <${CandidateUser.email}>`,
            subject: "Congratulation! You are Shortlisted!",
            html: `
            <p style="color:black; text-align:left; font-size: 20px; font-style: bold;">Congratulations🎊🎉✨!</p>
            <p>You have been shortlisted for the position of ${shortlistedJob.JobTitle}.</p>
            <p>This is a significant achievement, and we are excited to consider you for this role.</p>
            <p>We will be in touch shortly with the next steps in the hiring process.</p>
            <p style="color:black; text-align:left;">Thank you!</p>
            <p style="text-align: left;  ">Regards,</p>
            <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
            attachments: [
              {
                filename: "logo.png",
                path: "C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/logo.png",
                cid: "logo",
              },
            ],
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
router.put("/update-joined/:id1/:id2",AdminAuthenticateToken,async (req, res) => {
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
              user: "tech@diamondore.in",
              pass: "zlnbcvnhzdddzrqn",
            },
          });

          const mailOptions = {
            from: "Diamondore.in <tech@diamondore.in>",
            to: `Recipient <${CandidateUser.email}>`,
            subject:
              "Congratulations on Successfully Joining Your New Company!",
            html: `
           <p style="color:black; text-align:left; font-size: 20px; font-style: bold;">Congratulations🎊🎉✨!</p>
             <p>Dear ${CandidateUser?.name},</p>
            <p>We are thrilled to inform you that you have successfully joined  ${JoinedJob?.Company} through Diamond Ore pvt.Ltd!</p>
            <p>This marks the beginning of an exciting journey in your career, and we couldn't be happier to have played a part in your success.</p>
            <p>We wish you all the best as you embark on this new chapter. May it bring you growth, fulfillment, and endless opportunities.</p>
            <p>If you have any questions or need assistance during your transition, please don't hesitate to reach out to us. We're here to support you every step of the way.</p>
            <p>Once again, congratulations on your new role at ${JoinedJob?.Company}!</p>
            <p style="text-align: left;  ">Regards,</p>
            <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
            attachments: [
              {
                filename: "logo.png",
                path: "C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/logo.png",
                cid: "logo",
              },
            ],
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

router.put("/edit-profile", AdminAuthenticateToken,uploadImage.single('profilePic') ,async (req, res) => {
  try {
    const { name ,password,profilePic, passcode } = req.body;
    const { email } = req.user;
    
    console.log(req.body)
    console.log(req.file)

   

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(req.file){
        const deleteProfilePic = await deleteFile(user.profilePic,"profilepics");
        const uploadProfilePic = await uploadFile(req.file, "profilepics");
        user.profilePic = uploadProfilePic
        console.log("asdf",uploadProfilePic)
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

    if (passcode) {
      user.passcode = passcode;
      await user.save();
    }

    res.status(201).json({ message: "Edit profile successful!!!", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// CHATBOT MESSAGE RECIEVE
router.post("/send-chatbot", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
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
      from: "DOC_Labz <tech@diamondore.in>",
      to: "rahul@rasonline.in",
      cc: "tech@diamondore.in",
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
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
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
      from: "DOC_Labz <tech@diamondore.in>",
      to: "hr@diamondore.in",
      cc: ["zoyas3423@gmail.com", "zoya.rasonline@gmail.com"],
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
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
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



router.post("/upload-dsr-excel", excelUpload.single('myFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log(req.file)
  
  const filePath = req.file.path;  
  try{                   
    const fileBuffer = fs.readFileSync(filePath);    
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });   
    const sheetName = workbook.SheetNames[0];  
    const result = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
   

    if(!result.length){
     return res.status(400).json({ error: "Empty file or invalid format" });
    }

    let errorArray = [];
    
    const excelSerialToJSDate = (serial) => {
      const excelEpoch = new Date(1899, 11, 30); 
      return new Date(excelEpoch.getTime() + serial * 86400000);
    };

    const formattedData = result.map((entry) => {
       
      if (entry.currentDate && !isNaN(entry.currentDate)) {        
        entry.currentDate = excelSerialToJSDate(entry.currentDate);    
      }        
      return entry;
    });
   
    try {

      const bulkOps = [
               {deleteMany : { filter : {} }},
               ...formattedData.map((doc)=> ({insertOne : {document:doc}}))               
      ]
      const res=await DSR.bulkWrite(bulkOps);
      console.log(res)
    } catch (insertError) {
      errorArray.push({ error: insertError.message });
      console.error("Database insertion error:", insertError.message);
      return res.status(400).json({message : "Database insertion error"});

    }

    if (errorArray.length > 0) {
      await sendErrorEmailToAdmin(errorArray);
    }

    return res.status(200).json({
      message: "DSR upload process completed!",
    });
  }
   catch (err) {
    console.log({message: err.message})
    return res.status(400).json({message : "Internal server error"});
  } 
  finally{
    fs.unlinkSync(filePath);
  }
});

// Function to send error email to admin
async function sendErrorEmailToAdmin(errorArray) {
  // Configure your email service, replace with your email settings
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any other email service you're using
    auth: {
      user: "tech@diamondore.in",
      pass: "zlnbcvnhzdddzrqn",
    },
  });

  const errorDetails = errorArray
    .map(
      (error, index) =>
        `Entry #${error.index + 1}: ${JSON.stringify(error.entry)}\nError: ${
          error.error
        }\n\n`
    )
    .join("\n");

  const mailOptions = {
    from: "tech@diamondore.in",
    to: "tech@diamondore.in",
    subject: "DSR Upload Errors",
    text: `The following entries had errors during the DSR upload process:\n\n${errorDetails}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Error email sent to admin.");
  } catch (emailError) {
    console.error("Error sending email:", emailError.message);
  }
}

router.get("/findJobs/:phone", async (req, res) =>{
  try {
    const candidate = await DSR.findOne({ phone: req.params.phone });
    if(!candidate) {
      return res.status(404).send({success:false,message:"No candidates found"});
    }
    
    const suitableJobs = await Jobs.find({
      $or:[
        { City  : candidate.currentLocation },
        { State : candidate.currentLocation }
      ],
      JobStatus: "Active",
      MaxSalary:{
        $gte: (candidate.currentCTC),
        $lte: (candidate.currentCTC * 1.5),
      },
    });
    res.status(200).json({ success:true,suitableJobs, candidateName: candidate.candidateName });
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
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const jobRows = suitableJobs
      .map(
        (job) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Company}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.JobTitle}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Industry}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Channel}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Zone}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.City}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.State}</td>
      </tr>
    `
      )
      .join("");

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
      from: "Diamondore.in <tech@diamondore.in>",
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
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const jobRows = suitableJobs
      .map(
        (job) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Company}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.JobTitle}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Industry}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Channel}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.MaxSalary}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.Zone}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.City}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${job.State}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <h1 style="color: blue; text-align: center; font-size: 2rem">DiamondOre Consulting Pvt. Ltd.</h1>
      <h3 style="color: black; font-size: 1.3rem; text-align: center;">Jobs for candidate: ${candidate.candidateName}</h3>
      <h3 style="color: black; font-size: 1.1rem; text-align: center;">Phone: ${candidate.phone}</h3> 
      <h3 style="color: black; font-size: 1.1rem; text-align: center;">Email: ${candidate.email}</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Company</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Job Title</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Industry</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Channel</th>
            <th style="border: 1px solid #ddd; padding: 8px;">MaxSalary</th>
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
      from: "Diamondore.in <tech@diamondore.in>",
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
    const { recipientEmail, fromDate, toDate, location, ctcStart, ctcEnd } =
      req.query; 
   
    if (!fromDate || !toDate) {
      return res.status(400).send("Please provide fromDate and toDate");
    }

   

  
 
    const candidates = await DSR.aggregate(
      [
        {
          $match:{
             currentLocation: { $in: location },
             currentCTC: { 
                           $gte: parseFloat(ctcStart), 
                           $lte : parseFloat(ctcEnd)
                         },
             currentDate : {
               $gte : new Date(fromDate),
               $lte : new Date(toDate),
             }            
          }
        }
      ]
    );



    

    if (!candidates.length) {
      return res.status(404).send("No candidates found");
    }
    

    // console.log(candidates)
    

    const citiesOfCandidates    = []
    const channelsOfCandidates  = []
    

    candidates.forEach((candidate) => {      
      citiesOfCandidates.push(candidate.currentLocation)
    })

    const allJobs = await Jobs.find({
      $or: [
        { City: { $in: citiesOfCandidates } }, 
        { State: { $in: citiesOfCandidates } }
      ],
    });

    console.log(allJobs)
 
    const recommendations = [];


    for (const candidate of candidates){

      const suitableJobs = allJobs.filter((job)=>{
        return (
             job.JobStatus == "Active" &&
             (job.City===candidate.currentLocation || job.State===candidate.currentLocation) &&
             (job.MaxSalary >= candidate.currentCTC &&
             job.MaxSalary <= candidate.currentCTC * 1.5)
        )
      });

      
      
      recommendations.push({
        candidate: candidate,
        jobs: suitableJobs,
      });      
    }
    
    console.log(recommendations.length)
    if(recommendations.length==0){
       res.status(200).json({
        success:false,
        message:'No jobs found for candidates of this region'
       })
    }


    async function generateExcelFile(jobs){
      const workbook = new Exceljs.Workbook()
      const worksheet = workbook.addWorksheet('Jobs');

      
      worksheet.columns = [
        { header: 'Candidate Name', key: 'candidateName', width: 30 },
        { header: 'Candidate Phone no.', key: 'candidatePhoneNumber', width: 30 },
        { header: 'Candidate Location', key: 'candidateLocation', width: 30 },
        { header: 'Candidate Current CTC(LPA)', key: 'candidateCTC' , width:10},
        { header: 'Company', key:'company', width: 25 },
        { header: 'Job Title', key: 'title', width: 45 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'Channel', key: 'channel', width: 20 },
        { header: 'Job CTC(LPA)', key: 'jobCTC', width: 15 },
        { header: 'Industry', key: 'industry', width:20},
        { header: 'Zone' , key: 'zone' , width:15},
        { header: 'State', key: 'state', width:15 }

      ];

      


      jobs?.forEach((data)=>{

           data?.jobs.forEach((job)=>{
                worksheet.addRow({
                  candidateName: data.candidate.candidateName,
                  candidatePhoneNumber:data.candidate.phone,
                  candidateLocation:data.candidate.currentLocation,
                  candidateCTC: data.candidate.currentCTC,
                  company: job.Company,
                  title: job.JobTitle,
                  city: job.City,
                  channel: job.Channel,
                  jobCTC: job.MaxSalary,
                  industry : job.Industry,
                  zone: job.Zone,
                  state: job.State
                });
           })

      })


      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        });
      });


      const filePath = path.join(__dirname, 'suitableJobs.xlsx');
      console.log(filePath)
      await workbook.xlsx.writeFile(filePath);
      return filePath; 
    }


    async function sendEmailWithAttachment(recipient, filePath) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user : "tech@diamondore.in",
          pass : "zlnbcvnhzdddzrqn", 
        },
      });
    
      const mailOptions = {
        from: 'tech@diamondore.in',
        to: recipient,
        subject: 'Suitable Jobs for Candidates',
        text: 'Find attached the suitable jobs for candidates.',
        attachments: [
          {
            filename: 'suitableJobs.xlsx',
            path: filePath,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      };


      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      } finally {
        fs.unlinkSync(filePath);
      }
     
   }

     
    const recruiterMail = [];
    

                             
    const filePath = await generateExcelFile(recommendations);
    await sendEmailWithAttachment(recipientEmail, filePath);
    

    res.status(200).json({
      success:true,
      message:'E-Mail Sent successFully'
    });


  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
});

// getting DSR data

router.get("/get-dsr-data", async (req, res) => {
  try {

    const uniqueData = await DSR.aggregate([
      {
        $group: {
          _id: null,
          uniqueRecruiters: { $addToSet: "$recruiterName" },
          uniqueCities: { $addToSet: "$currentLocation" }
        }
      }
    ]);

    if (uniqueData.length > 0) {
      res.status(200).json({
        recruiters: uniqueData[0].uniqueRecruiters,
        cities: uniqueData[0].uniqueCities
      });
    } else {
      res.status(200).json({ recruiters: [], cities: [] });
    }


  } catch (error) {
    console.error("Error fetching DSR data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register-recruiter-kam", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(402)
        .json({ message: "Both name and email are required!!!" });
    }

    const findEmp = await RecruitersAndKAMs.exists({ email });
    if (findEmp) {
      return res.status(401).json({
        message: "This Recruiter or KAM already has been registered!!!",
      });
    }

    const newEmp = new RecruitersAndKAMs({
      name,
      email,
    });

    await newEmp.save();

    if (newEmp) {
      return res
        .status(201)
        .json({ message: "New Recruiter or KAM got resgitered!!!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// DELETE A REVIEW
router.delete("/delete-review/:id", AdminAuthenticateToken, async (req, res) => {
    try {
      const { id } = req.params;

      const deleteReview = await ClientReviews.findByIdAndDelete({ _id: id });
      if (!deleteReview) {
        return res.status(403).json({ message: "No review found!!!" });
      }

      res.status(200).json({ message: "Review deleted successfully!!!" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong!!!", error });
    }
  }
);


// EMPLOYEE SECTION

// SIGNUP IS IN employees.js

// FETCHING ALL employees
router.get("/all-employees", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allEmployees = await Employees.find({}, { password: 0 });

    const activeEmployees = await allEmployees.filter(
      (emp) => emp.activeStatus == true
    );

    const inactiveEmployees = await allEmployees.filter(
      (emp) => emp.activeStatus == false
    );

    console.log(allEmployees);

    return res.status(200).json({
      allEmployees,
      activeEmployees,
      inactiveEmployees,
    });
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

router.delete("/delete/employee/:id",AdminAuthenticateToken,async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);

      await Employees.deleteOne({ _id: id });

      return res
        .status(201)
        .json({ message: "Employee deleted successfully!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", err: e.message });
    }
  }
);

router.put("/update-status/employee/:id",AdminAuthenticateToken,async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(id);

      const employee = await Employees.findById({ _id: id });

      console.log(employee);

      employee.activeStatus = status;

      await employee.save();

      return res
        .status(201)
        .json({ message: "Employee status updated successfully!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Something went wrong!!!", err: e.message });
    }
  }
);

// will send mail to the employee the your emailid is changed

const SendMailWhenEditEmployee = async (email, updatedFields) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn", // Use environment variables for security
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
      to: email,
      subject: "Updated Details Notification",
      html: `
        <h3>Your details have been updated:</h3>
        <ul>
          ${Object.entries(updatedFields)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join("")}
        </ul>
        <p>If you have any questions, please contact HR.</p>
        <h1 style="color: blue; text-align: center; font-size: 1rem">Diamond Consulting Pvt.Ltd.</h1>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

router.put("/all-employees-edit/:id",AdminAuthenticateToken,async (req, res) => {
    // console.log("request-accepted")
    try {
      const { id } = req.params;

      

      const updatedFields = {};

      if (req.body.name) {
        updatedFields.name = req.body.name;
      }
      if (req.body.email) {
        updatedFields.email = req.body.email;
      }
      if (req.body.empType) {
        updatedFields.empType = req.body.empType;
      }
      if (req.body.dob) {
        updatedFields.dob = req.body.dob;
      }
      if (req.body.doj) {
        updatedFields.doj = req.body.doj;
      }
      if(req.body.kpiDesignation){
        updatedFields.kpiDesignation = req.body.kpiDesignation
      }

  
     

      updatedFields.accountHandler = req.body.accountHandler;

      console.log("test");
      console.log(updatedFields.accountHandler);

      const updateEmployee = await Employees.findByIdAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );

      if (!updateEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      console.log(updateEmployee);
      await SendMailWhenEditEmployee(updateEmployee.email, updatedFields);
      return res.status(200).json(updateEmployee);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

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
router.get("/performance-report/:id",AdminAuthenticateToken,async (req, res) => {
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

// CREATE A GOAL SHEET OF AN EMPLOYEE
router.post("/create-goalsheet/:id",AdminAuthenticateToken,async (req, res) => {
    try {
      const { id } = req.params;
      const { year } = req.body;

      const goalSheetExist = await GoalSheet.findOne({ owner: id, year: year });
      if (goalSheetExist) {
        return res
          .status(402)
          .json({ message: "Employee already has a goal sheet!!!" });
      }

      const newGoalSheet = new GoalSheet({
        owner: id,
        year,
      });

      await newGoalSheet.save();

      res
        .status(201)
        .json({ message: `New Goal sheet has been added for ${year}` });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// SET GOAL SHEET OF AN EMPLOYEE
// router.put("/set-goalsheet", async (req, res) => {
//   try {
//     const { empId, year, month, noOfJoinings, revenue, cost } = req.body;

//     // Convert year and month to numbers
//     // const yearMain = parseInt(year);
//     const yearMain = year;
//     const monthMain = parseInt(month);
//     console.log(yearMain, monthMain);

//     // Find the employee by empId
//     const employee = await Employees.findById(empId);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Find the goal sheet for the specified empId and year
//     let goalSheet = await GoalSheet.findOne({ owner: empId, year: yearMain });
//     if (!goalSheet) {
//       goalSheet = new GoalSheet({
//         owner: empId,
//         year: yearMain,
//         goalSheetDetails: [],
//       });
//     }

//     // Calculate target
//     const target = cost * 4;

//     // Calculate cumulativeCost
//     let cumulativeCost = cost;
//     const [joinDay, joinMonth, joinYear] = employee.doj.split("/").map(Number);
//     // const [joinYear, joinMonth, joinDay] = employee.doj.split("/").map(Number);
//     console.log(joinYear, joinMonth, joinDay);
//     if (joinMonth !== monthMain || joinYear !== yearMain) {
//       if (monthMain === 1) {
//         console.log(joinYear, yearMain);

//         // January
//         const lastYearGoalSheet = await GoalSheet.findOne({
//           owner: empId,
//           year: yearMain - 1,
//         });
//         if (lastYearGoalSheet) {
//           const lastYearDecemberDetails =
//             lastYearGoalSheet.goalSheetDetails.find(
//               (detail) => detail.goalSheet.monthMain === 12
//             );
//           if (lastYearDecemberDetails) {
//             cumulativeCost += lastYearDecemberDetails.goalSheet.cumulativeCost;
//           }
//         }
//       } else {
//         const previousMonthDetails = goalSheet.goalSheetDetails.find(
//           (detail) => detail.goalSheet.month === monthMain - 1
//         );
//         if (previousMonthDetails) {
//           cumulativeCost += previousMonthDetails.goalSheet.cumulativeCost;
//         }
//       }
//     }

//     // Calculate cumulativeRevenue
//     let cumulativeRevenue = revenue;
//     if (joinMonth !== monthMain || joinYear !== yearMain) {
//       if (monthMain === 1) {
//         // January
//         const lastYearGoalSheet = await GoalSheet.findOne({
//           owner: empId,
//           year: yearMain - 1,
//         });
//         if (lastYearGoalSheet) {
//           const lastYearDecemberDetails =
//             lastYearGoalSheet.goalSheetDetails.find(
//               (detail) => detail.goalSheet.month === 12
//             );
//           if (lastYearDecemberDetails) {
//             cumulativeRevenue +=
//               lastYearDecemberDetails.goalSheet.cumulativeRevenue;
//           }
//         }
//       } else {
//         const previousMonthDetails = goalSheet.goalSheetDetails.find(
//           (detail) => detail.goalSheet.month === monthMain - 1
//         );
//         if (previousMonthDetails) {
//           cumulativeRevenue += previousMonthDetails.goalSheet.cumulativeRevenue;
//         }
//       }
//     }

//     // Calculate achYTD and achMTD
//     const achYTD = cumulativeRevenue / cumulativeCost;
//     const achMTD = revenue / cost;

//     // Incentive plans
//     let noOfJoiningIncentive = 0;
//     let mtdIncentive = 0;
//     if (noOfJoinings === 3) {
//       noOfJoiningIncentive = 1000;
//     } else if (noOfJoinings === 4) {
//       noOfJoiningIncentive = 1500;
//     } else if (noOfJoinings >= 5) {
//       noOfJoiningIncentive = 2000;
//     }

//     if (achMTD === 4) {
//       mtdIncentive = 1000;
//     } else if (achMTD >= 5) {
//       mtdIncentive = 2000;
//     }

//     const totalIncentive = noOfJoiningIncentive + mtdIncentive;

//     // Calculate variableIncentive based on achYTD and achMTD
//     let variableIncentive = 0;
//     if (achYTD >= 3) {
//       goalSheet.goalSheetDetails.forEach((detail) => {
//         const { achMTD: detailAchMTD, revenue: detailRevenue } =
//           detail.goalSheet;
//         if (detailAchMTD >= 3 && detailAchMTD <= 3.4) {
//           variableIncentive += detailRevenue * 0.02;
//         } else if (detailAchMTD >= 3.5 && detailAchMTD <= 3.9) {
//           variableIncentive += detailRevenue * 0.04;
//         } else if (detailAchMTD >= 4) {
//           variableIncentive += detailRevenue * 0.06;
//         }
//       });
//     }

//     // Push new details to goalSheetDetails array
//     goalSheet.goalSheetDetails.push({
//       goalSheet: {
//         month: monthMain,
//         noOfJoining: noOfJoinings,
//         cost: cost,
//         revenue: revenue,
//         target: target,
//         cumulativeCost: cumulativeCost,
//         cumulativeRevenue: cumulativeRevenue,
//         achYTD: achYTD,
//         achMTD: achMTD,
//         incentive: totalIncentive,
//         variableIncentive: variableIncentive,
//       },
//     });

//     // Save the updated goal sheet
//     await goalSheet.save();

//     res.status(200).json({ message: "Goal sheet updated successfully" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });
router.post("/set-goalSheet", async (req, res) => {
  const {
    empId,
    year,
    month,
    noOfJoinings,
    cost,
    revenue,
    incentive,
    leakage,
  } = req.body;

  try {
    // Find the employee by empId
    const employee = await Employees.findOne({ _id: empId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let goalSheet = await GoalSheet.findOne({ owner: employee._id });

    if (!goalSheet) {
      // If the GoalSheet does not exist, create one
      goalSheet = new GoalSheet({
        owner: employee._id,
        goalSheetDetails: [],
      });
    }

    // Check if the month and year combination already exists
    const existingDetail = goalSheet.goalSheetDetails.find(
      (detail) => detail.year === year && detail.month === month
    );

    if (existingDetail) {
      return res
        .status(400)
        .json({ error: "GoalSheet for this month and year already exists" });
    }

    goalSheet.goalSheetDetails.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });

    const lastDetail =
      goalSheet.goalSheetDetails
        .filter(
          (detail) =>
            detail.year < year ||
            (detail.year == parseInt(year) && detail.month < parseInt(month))
        )
        .slice(-1)[0] || {};

    const previousCumulativeCost = lastDetail.cumulativeCost || 0;
    const previousCumulativeRevenue = lastDetail.cumulativeRevenue || 0;
    const cumulativeCost = previousCumulativeCost + cost;
    const cumulativeRevenue = previousCumulativeRevenue + revenue;
    const achYTD = (cumulativeRevenue / cumulativeCost).toFixed(2);
    const achMTD = (revenue / cost).toFixed(2);
    const numberIndex = employee.empType.length - 2;

    console.log(
      goalSheet.goalSheetDetails.findIndex(
        (detail) =>
          detail.year < year ||
          (detail.year == parseInt(year) && detail.month < parseInt(month))
      )
    );

    console.log(lastDetail);

    // Calculate necessary fields

    let target;

    console.log(employee.empType);

    if (employee.empType === "Recruiter") {
      target = cost * 4;
    } else if (employee.empType === "SeniorRecruiter") {
      target = cost * 4;
    } else if (employee.empType === "TeamLeader") {
      target = cost * 4;
    } else {
      // console.log()
      target = cost * parseInt(employee.empType[numberIndex]);
    }
    console.log("target", target);

    // Push the new goalSheetDetails
    goalSheet.goalSheetDetails.push({
      year,
      month,
      noOfJoinings,
      cost,
      revenue,
      target,
      cumulativeCost,
      cumulativeRevenue,
      achYTD,
      achMTD,
      incentive, // Leave incentive blank for now
      leakage, // Leave variable incentive blank for now   , now varible incentive is leakage
    });

    goalSheet.goalSheetDetails.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });

    let index = 1;
    let goalSheetIndex = goalSheet.goalSheetDetails.findIndex(
      (detail) =>
        detail.year == parseInt(lastDetail.year) &&
        detail.month == parseInt(lastDetail.month)
    );

    if (goalSheetIndex == -1) {
      index = 1;
    } else {
      index = goalSheetIndex + 1;
    }

    if (goalSheet.goalSheetDetails.length > 1) {
      for (let i = index; i < goalSheet.goalSheetDetails.length; i++) {
        const detail = goalSheet.goalSheetDetails[i];
        detail.cumulativeCost =
          goalSheet.goalSheetDetails[i - 1].cumulativeCost + detail.cost;
        detail.cumulativeRevenue =
          goalSheet.goalSheetDetails[i - 1].cumulativeRevenue + detail.revenue;
        detail.achYTD = (
          detail.cumulativeRevenue / detail.cumulativeCost
        ).toFixed(2);
        detail.achMTD = (detail.revenue / detail.cost).toFixed(2);
      }
    }

    goalSheet.goalSheetDetails.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });

    // Save the GoalSheet
    await goalSheet.save();

    // Add the GoalSheet reference to the employee if it is newly created
    // if (!employee.myGoalSheet.includes(goalSheet._id)) {
    //     employee.myGoalSheet.push(goalSheet._id);
    //     await employee.save();
    // }

    res
      .status(201)
      .json({ message: "GoalSheet updated successfully", goalSheet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
    console.log(error);
  }
});

// GET AN EMPLOYEE's GOAL SHEETS
router.get("/goalsheet/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const findGoalSheets = await GoalSheet.find({ owner: id });
    if (!findGoalSheets) {
      return res.status(402).json({ message: "No goalsheet found!!!" });
    }

    res.status(200).json(findGoalSheets);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// EDIT A GOALSHEET
router.put("/edit-goalSheet", async (req, res) => {
  // console.log("enter")
  const {
    empId,
    year,
    month,
    prevYear,
    prevMonth,
    sheetId,
    noOfJoinings,
    cost,
    revenue,
    incentive,
    leakage,
    selectedColor,
  } = req.body;

 


  try {
    // Find the employee by empId
    const employee = await Employees.findOne({ _id: empId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Find the GoalSheet for the employee
    let goalSheetBeforeSort = await GoalSheet.findOne({ owner: employee._id });
    if (!goalSheetBeforeSort) {
      return res.status(404).json({ error: "GoalSheet not found" });
    }

    const goalSheet = await goalSheetBeforeSort.goalSheetDetails.sort(
      (a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      }
    );

    

    const goalDetailIndex = goalSheet.findIndex(
      (data) => data?._id.toString() === sheetId.toString()
    );

    if (goalDetailIndex === -1) {
      console.log(typeof goalDetailIndex);
      return res
        .status(404)
        .json({ error: "GoalSheet for this month and year not found" });
    }

    // Get the current goalSheetDetail for updates
    let goalDetail = goalSheet[goalDetailIndex];

    // Get the last entry for cumulative calculations
    const lastDetail = goalSheet[goalDetailIndex - 1] || {};
    const previousCumulativeCost = lastDetail.cumulativeCost || 0;
    const previousCumulativeRevenue = lastDetail.cumulativeRevenue || 0;

    // Update the fields conditionally
    if (noOfJoinings !== undefined) {
      goalDetail.noOfJoinings = noOfJoinings;
    }

    if (cost !== goalDetail?.cost) {
      // Calculate cumulativeCost based on the new cost value
      const updatedCumulativeCost = previousCumulativeCost + parseInt(cost);

      goalDetail.cost = parseInt(cost);
      goalDetail.cumulativeCost = updatedCumulativeCost;

      // Update target if cost is provided
      const numberIndex = employee.empType.length - 2;

      // let target;

      

      if (employee.empType === "Recruiter") {
        goalDetail.target = parseInt(cost) * 4;
      } else if (employee.empType === "SeniorRecruiter") {
        goalDetail.target = parseInt(cost) * 4;
      } else if (employee.empType === "TeamLeader") {
        goalDetail.target = parseInt(cost) * 4;
      } else {
        // console.log()
        goalDetail.target =
          parseInt(cost) * parseInt(employee.empType[numberIndex]);
      }
      // goalDetail.target = cost * 4;
    }

    if (revenue !== goalDetail?.revenue) {
    
      // Calculate cumulativeRevenue based on the new revenue value
      const updatedCumulativeRevenue =
        previousCumulativeRevenue + parseInt(revenue);

      goalDetail.revenue = parseInt(revenue);
      goalDetail.cumulativeRevenue = updatedCumulativeRevenue;

      console.log(updatedCumulativeRevenue / goalDetail.cumulativeCost)
     
      // Update achMTD and achYTD if revenue is provided
      goalDetail.achMTD = cost
        ? (revenue / cost).toFixed(2)
        : goalDetail.achMTD;
      goalDetail.achYTD = goalDetail.cumulativeCost
        ? (updatedCumulativeRevenue / goalDetail.cumulativeCost).toFixed(2)
        : goalDetail.achYTD;
    }

    if (month) {
      goalDetail.month = month;
    }

    if (year) {
      goalDetail.year = year;
    }

    if (incentive !== undefined) {
      goalDetail.incentive = incentive;
    }

    if (leakage !== undefined) {
      goalDetail.leakage = leakage;
    }

    if(selectedColor !== null){
         goalDetail.incentiveStatusColor = selectedColor
    }


    if (goalSheet.length > 1) {
      console.log("enter1")
      for (let i = goalDetailIndex ; i < goalSheet.length; i++) {
        const detail = goalSheet[i];
        console.log(detail.cumulativeRevenue)
        console.log(detail.cumulativeCost)
        console.log( (
          detail.cumulativeRevenue / detail.cumulativeCost
        ).toFixed(2))
        detail.cumulativeCost = goalSheet[i - 1].cumulativeCost + detail.cost;
        detail.cumulativeRevenue =
          goalSheet[i - 1].cumulativeRevenue + detail.revenue;
        detail.achYTD = (
          detail.cumulativeRevenue / detail.cumulativeCost
        ).toFixed(2);
        detail.achMTD = (detail.revenue / detail.cost).toFixed(2);
      }
    }

    

    // Save the updated GoalSheet
    await goalSheetBeforeSort.save();

    res
      .status(200)
      .json({ message: "GoalSheet updated successfully", goalSheet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
    console.log(error);
  }
});

// GET ALL THE DUPLICATE PHONE NUMBER REQUESTS
router.get("/duplicate-phone-requests",AdminAuthenticateToken,async (req, res) => {
    try {
      // Find all AccountHandling documents with non-empty requests
      const duplicatePhoneRequests = await AccountHandling.find({
        "requests.0": { $exists: true },
      }).populate("requests.employee", "name email");

      if (duplicatePhoneRequests.length === 0) {
        return res.status(404).json({
          message: "No Accounts available with duplicate requests!!!",
        });
      }

      res.status(200).json(duplicatePhoneRequests);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tech@diamondore.in",
    pass: "zlnbcvnhzdddzrqn",
  },
});


router.put("/account-handling/:id",AdminAuthenticateToken,async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const accountHandling = await AccountHandling.findById(id).populate(
        "owner"
      );
      if (!accountHandling) {
        return res
          .status(404)
          .json({ message: "No account found with this id!!!" });
      }

      const requestToUpdate = accountHandling.requests.find(
        (req) => req.status === "pending"
      );
      if (!requestToUpdate) {
        return res
          .status(400)
          .json({ message: "No pending request found to update!" });
      }

      if (status === "approved") {
        const previousOwnerEmail = accountHandling.owner.email;
        const newOwnerId = requestToUpdate.employee;
        const accountPhone = requestToUpdate.accountPhone;

        // Move the account detail from the previous owner to the new owner
        let accountDetail = null;
        for (const zone of accountHandling.accountDetails) {
          for (const channel of zone.channels) {
            const hrIndex = channel.hrDetails.findIndex(
              (hr) => hr.hrPhone === accountPhone
            );
            if (hrIndex !== -1) {
              accountDetail = channel.hrDetails[hrIndex];
              channel.hrDetails.splice(hrIndex, 1);
              break;
            }
          }
          if (accountDetail) break;
        }

        if (!accountDetail) {
          return res.status(404).json({
            message:
              "Account detail not found in previous owner's accountDetails!",
          });
        }

        let newOwnerAccountHandling = await AccountHandling.findOne({
          owner: newOwnerId,
        });
        if (!newOwnerAccountHandling) {
          newOwnerAccountHandling = new AccountHandling({
            owner: newOwnerId,
            accountHandlingStatus: true,
            accountDetails: [],
          });
        }

        // Check if the zone already exists
        let zone = newOwnerAccountHandling.accountDetails.find(
          (z) => z.zoneName === accountHandling.zoneName
        );
        if (!zone) {
          zone = { zoneName: accountHandling.zoneName, channels: [] };
          newOwnerAccountHandling.accountDetails.push(zone);
        }

        // Check if the channel already exists within the zone
        let channel = zone.channels.find(
          (c) => c.channelName === accountHandling.channelName
        );
        if (!channel) {
          channel = { channelName: accountHandling.channelName, hrDetails: [] };
          zone.channels.push(channel);
        }

        // Add HR details to the channel
        channel.hrDetails.push(accountDetail);

        requestToUpdate.status = "approved";
        await accountHandling.save();
        await newOwnerAccountHandling.save();

        // Send email to the previous owner
        transporter.sendMail(
          {
            from: "tech@diamondore.in",
            to: previousOwnerEmail,
            subject: "Account Handling Ownership Update",
            text: `The AccountHandling with phone: ${accountPhone} has been removed from your list.`,
          },
          (error, info) => {
            if (error) {
              console.error("Error sending email to previous owner:", error);
            } else {
              console.log("Email sent to previous owner:", info.response);
            }
          }
        );

        // Fetch new owner's email
        const newOwner = await Employees.findById(newOwnerId);
        if (!newOwner) {
          return res.status(404).json({ message: "New owner not found!" });
        }

        // Send email to the new owner
        transporter.sendMail(
          {
            from: "tech@diamondore.in",
            to: newOwner.email,
            subject: "New Account Handling Ownership",
            text: `You have been assigned the AccountHandling with phone: ${accountPhone}.`,
          },
          (error, info) => {
            if (error) {
              console.error("Error sending email to new owner:", error);
            } else {
              console.log("Email sent to new owner:", info.response);
            }
          }
        );

        return res.status(200).json({
          message: "AccountHandling updated successfully and emails sent.",
        });
      }

      if (status === "rejected") {
        const previousOwnerEmail = accountHandling.owner.email;
        requestToUpdate.status = "rejected";

        await accountHandling.save();

        transporter.sendMail(
          {
            from: "tech@diamondore.in",
            to: previousOwnerEmail,
            subject: "Account Handling Ownership Update",
            text: `The AccountHandling request for phone: ${accountPhone} has been denied by the Admin.`,
          },
          (error, info) => {
            if (error) {
              console.error("Error sending email to previous owner:", error);
            } else {
              console.log("Email sent to previous owner:", info.response);
            }
          }
        );

        return res
          .status(200)
          .json({ message: "AccountHandling access denied and email sent." });
      }

      res.status(400).json({ message: "Invalid status value provided." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

const kpiScoreSchema = z.object({
  owner:z.string(),
  month:z.string(),
  year:z.coerce.number(),
  costVsRevenue:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  successfulDrives:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  accounts:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  mentorship:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  processAdherence:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  leakage:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  }),
  noOfJoining:z.object({
      target:z.coerce.number(),
      actual:z.coerce.number()
  })
})

// SET KPI SCORE
router.post("/set-kpi-score", async(req, res) => {
  try {
    const {
      owner,
      month,
      year,
      costVsRevenue,
      successfulDrives,
      accounts,
      mentorship,
      processAdherence,
      leakage,
    } = req.body;

    const {success, error} = kpiScoreSchema.safeParse(req.body)

    if(error){
      return res.status(422).json({message:"Validation failed of input fields"})
    }

   

   

    // Find the KPI document for the owner
    let kpi = await KPI.findOne({ owner: owner }).populate("owner");

    console.log(kpi.owner?.kpiDesignation)

    if(!kpi.owner?.kpiDesignation){
      return res.status(404).json({message:"Please first set the KPI designation of the employee"})
    }

    const weights = {
      "Recruiter/KAM/Mentor": {
        costVsRevenue: 25,
        successfulDrives:15,
        accounts:15,
        mentorship:20,
        processAdherence:10,
        leakage:15
      },
      "Recruiter" : {
        costVsRevenue: 60,
        successfulDrives:15,
        processAdherence:10,
        leakage:15
      },
      "Sr. Consultant": {
        costVsRevenue: 25,
        successfulDrives:15,
        accounts:15,
        processAdherence:10,
        leakage:15   
      }
    }

    if(!kpi){
      // If no KPI document exists, create a new one
      kpi = new KPI({ owner: owner, kpis: [] });
    }

    // Helper function to calculate weight and kpiScore
    const calculateScore = (target, actual, weightPercentage) => {
      if (target === 0||actual===0) return { weight: 0, kpiScore: 0 };
      const weight = parseFloat((actual / target).toFixed(2));
      const kpiScore = parseFloat(((weightPercentage / 100) * weight).toFixed(2));
    
      return { weight, kpiScore };
    };

    const costVsRevenueScore = calculateScore(
      costVsRevenue.target,
      costVsRevenue.actual,
      weights[kpi.owner?.kpiDesignation]?.costVsRevenue
    );
    const successfulDrivesScore = calculateScore(
      successfulDrives.target,
      successfulDrives.actual,
      weights[kpi.owner?.kpiDesignation]?.successfulDrives
    );
    let accountsScore= null
    if(accounts&&kpi.owner?.kpiDesignation==="Recruiter/KAM/Mentor"||kpi.owner?.kpiDesignation==="Sr. Consultant"){
   
       accountsScore = calculateScore(
        accounts.target,
        accounts.actual, 
        weights[kpi.owner?.kpiDesignation]?.accounts
     );
    }  
    let mentorshipScore =null
    if(mentorship&&kpi.owner?.kpiDesignation==="Recruiter/KAM/Mentor"){
    
     mentorshipScore = calculateScore(
      mentorship.target,
      mentorship.actual,
      weights[kpi.owner?.kpiDesignation]?.mentorship
    );
    }
    const processAdherenceScore = calculateScore(
      processAdherence.target,
      processAdherence.actual,
      weights[kpi.owner?.kpiDesignation]?.processAdherence
    );
    const leakageScore = calculateScore(
      leakage.target, 
      leakage.actual, 
      weights[kpi.owner?.kpiDesignation]?.leakage
    );
    


    // Calculate total KPI score
    const totalKPIScore = parseFloat(
      (
        Number(costVsRevenueScore?.kpiScore) +
        Number(successfulDrivesScore?.kpiScore) +
        Number(accountsScore?.kpiScore || 0) +
        Number(mentorshipScore?.kpiScore || 0) +
        Number(processAdherenceScore?.kpiScore) +
        Number(leakageScore?.kpiScore)
      ) * 100
    ).toFixed(3);

      console.log(totalKPIScore)

    // Construct the new KPI month information
    const newKpiMonth = {
      kpiMonth: {
        month: month,
        year: (year),
        costVsRevenue: {
          target:   (costVsRevenue.target),
          actual:   (costVsRevenue.actual),
          weight:   (costVsRevenueScore.weight),
          kpiScore: (costVsRevenueScore.kpiScore),
        },
        successfulDrives: {
          target:   (successfulDrives.target),
          actual:   (successfulDrives.actual),
          weight:   (successfulDrivesScore.weight),
          kpiScore: (successfulDrivesScore.kpiScore),
        },
        
        processAdherence:{
          target:   (processAdherence.target),
          actual:   (processAdherence.actual),
          weight:   (processAdherenceScore.weight),
          kpiScore: (processAdherenceScore.kpiScore),
        },
        leakage: {
          target:   (leakage.target),
          actual:   (leakage.actual),
          weight:   (leakageScore.weight),
          kpiScore: (leakageScore.kpiScore),
        },

        totalKPIScore: (totalKPIScore),
      },
    };

    if(accounts&&accountsScore){
      newKpiMonth.kpiMonth.accounts = {
        target:   (accounts.target),
        actual:   (accounts.actual),
        weight:   (accountsScore.weight),
        kpiScore: (accountsScore.kpiScore),
      }
    }

    if(mentorship&&mentorshipScore){
      newKpiMonth.kpiMonth.mentorship = {
        target:   (mentorship.target),
        actual:   (mentorship.actual),
        weight:   (mentorshipScore.weight),
        kpiScore: (mentorshipScore.kpiScore),
      }
    } 

    

    // Push the new KPI month information to the kpis array 
    kpi.kpis.push(newKpiMonth);

    // Save the KPI document
    await kpi.save();

    res.status(200).json({ message: "KPI score set successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// EMPLOYEE'S KPI SCORE
router.get("/employee-kpi-score/:id",AdminAuthenticateToken,async (req, res) => {
    try {
      const { id } = req.params;

      const myKPI = await KPI.findOne({ owner: id }).populate("owner");
      if (!myKPI) {
        return res.status(402).json({ message: "No KPI found!!!" });
      }

      res.status(200).json(myKPI);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

//download excel of all the candidate data
router.post("/download-excel", AdminAuthenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "start date and end date are required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Start date cannot be after end date." });
    }

    const candidateData = await Candidates.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("candidates");

    worksheet.columns = [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Phone no.", key: "phone" },
      { header: "Created At", key: "createdAt" },
    ];
    console.log(candidateData);

    candidateData.forEach((candidate) => {
      worksheet.addRow({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        createdAt: candidate.createdAt.toISOString().slice(0, 10),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=candidates.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});





router.post("/upload-joiningsheet/:id",AdminAuthenticateToken ,excelUpload.single('myFileImage') , async (req, res) => {
  try{

  

    const { id } = req.params;
    
    

    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    
    if(employee?.joiningExcel){
           const upload= await deleteFile(employee.joiningExcel,"profilepics");
           
    }

    let joiningExcel = null;

    try{
      joiningExcel = await uploadFile(req.file, "profilepics");
     
    }
    catch(err){
      console.log(err)
      return
    }
    
    if(joiningExcel){
      employee.joiningExcel = joiningExcel;
    }

    await employee.save();

    res.status(200).json({
      message: "Joinings sheet URL uploaded Successfully",
      employeeId: employee._id,
      joiningExcel: employee.joiningExcel,
    });
  } catch (error) {
    console.log("something went wrong ", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
  finally{
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path); 
    }
  }
});

// Fire Ticker when ytd is lesss then 2.5

router.post("/fire-ticker/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tickerMessage } = req.body;

    if (!tickerMessage) {
      return res.status(400).json({ message: "Ticker message is required." });
    }
    const goalSheet = await GoalSheet.findOne({ owner: id });

    if (!goalSheet) {
      return res
        .status(404)
        .json({ message: "Goal sheet for the employee not found." });
    }

    goalSheet.YTDLessTickerMessage = tickerMessage;

    await goalSheet.save();

    return res.status(200).json({
      message: "Ticker triggered successfully for the employee.",
      tickerMessage: goalSheet.YTDLessTicker,
    });
  } catch (error) {
    console.error("Error in /fire-ticker/:id route:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});



router.post("/upload-policies",AdminAuthenticateToken, pdfUpload.array("policies",3) , async (req, res) => {
  
  try {

    const existingPolicies  = await Policies.findOne()


    const deletePromises = [
      existingPolicies.Policies.leave && deleteFile(existingPolicies.Policies.leave,'profilepics'),
      existingPolicies.Policies.performanceManagement&& deleteFile(existingPolicies.Policies.performanceManagement,'profilepics'),
      existingPolicies.Policies.holidayCalendar && deleteFile(existingPolicies.Policies.holidayCalendar,'profilepics')
    ].filter(Boolean)

     await Promise.allSettled(deletePromises)
  
    
    const uploadPromises = req.files.map(file => uploadFile(file, "profilepics"));

    const results= await Promise.allSettled(uploadPromises)

    const urls = results
    .filter(result => result.status === "fulfilled") 
    .map(result => result.value); 

  

    const policies = await Policies.updateOne({}, { 
      Policies: {
        leave: urls[0] || "", 
        performanceManagement: urls[1] || "", 
        holidayCalendar: urls[2] || "" 
      }
    }, { upsert: true });



    return res.status(200).send("Files uploaded successfully")

  } catch (error) {
    console.error("Error in /upload-policies route:", error);
    res.status(500).send("Internal server error.");
  }
  finally{
  }
});

// update account handling details

router.put("/updateAccounts/:accountId/:accountDetailsId", async (req, res) => {
  const { accountId, accountDetailsId } = req.params;
  const { joinings, amount } = req.body; // Fields to update (optional)

  try {
    // Find the account by its accountId
    const account = await AccountHandling.findById(accountId);

    // Check if the account exists
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Find the specific zone within accountDetails using accountDetailsId
    const zoneToUpdate = account.accountDetails.find(
      (zone) => zone._id.toString() === accountDetailsId
    );

    // If the zone is not found, return an error
    if (!zoneToUpdate) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // Update the joinings and amount if provided
    if (joinings !== undefined) zoneToUpdate.joinings = joinings;
    if (amount !== undefined) zoneToUpdate.amount = amount;

    // Save the updated account
    await account.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Zone updated successfully", account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Goal sheet
const sendMailToEmployee = async (email, emailContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
      to: `Recipient <${email}>`,
      subject: "Your Goal Sheet Analysis",
      text: emailContent,
      html: `
          <h1 style="color: blue; text-align: center; font-size: 1rem">Diamond Consulting Pvt.Ltd.</h1>
          <p style="font-size: 1.2rem;">${emailContent.replace(
            /\n/g,
            "<br/>"
          )}</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
// Route to send email
router.post("/send-mail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, total_costs, total_revenue, expected_revenue,mailSelectedYear } =
      req.body;

    if (!total_costs || !total_revenue || !expected_revenue) {
      return res
        .status(400)
        .send({ error: "Invalid or missing financial data" });
    }

    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).send({ error: "Employee not found" });
    }

    const goalSheet = await GoalSheet.findOne({ owner: id });
    if (!goalSheet) {
      return res
        .status(404)
        .send({ error: "Goal sheet not found for this employee" });
    }

    const formattedGoalSheetDetails = goalSheet.goalSheetDetails
  .filter((detail) => detail.year == mailSelectedYear)
  .map(
    (detail) => `
      <tr>
        <td style="border:1px solid #ccc;">${detail.year || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.month || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.noOfJoinings || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.cost || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.revenue || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.target || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.cumulativeCost || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.cumulativeRevenue || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.achYTD || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.achMTD || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.incentive || "N/A"}</td>
        <td style="border:1px solid #ccc;">${detail.leakage || "N/A"}</td>
      </tr>
    `
  )
  .join("");


    const goalSheetTable = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Year</th>
              <th>Month</th>
              <th>No of Joinings</th>
              <th>Cost</th>
              <th>Revenue</th>
              <th>Target</th>
              <th>Cumulative Cost</th>
              <th>Cumulative Revenue</th>
              <th>Achievement YTD</th>
              <th>Achievement MTD</th>
              <th>Incentive</th>
              <th>Leakage</th>
            </tr>
          </thead>
          <tbody>
            ${formattedGoalSheetDetails}
          </tbody>
        </table>
      `;

    const achievement_ratio = (total_revenue / total_costs).toFixed(2);
   const emailContent = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <p style="font-size: 16px; margin: 0 0 0 0;">
      ${description || "No additional details provided."}
    </p>

    <h2 style="color: #2c3e50; margin-bottom: 1px;">📊 Financial Overview</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
      <tr>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #ccc;">Total Costs:</td>
        <td style="padding: 8px; border: 1px solid #ccc;">₹${total_costs}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #ccc;">Total Revenue:</td>
        <td style="padding: 8px; border: 1px solid #ccc;">₹${total_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #ccc;">Expected Revenue:</td>
        <td style="padding: 8px; border: 1px solid #ccc;">₹${expected_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #ccc;">Achievement Ratio:</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${achievement_ratio}x</td>
      </tr>
    </table>

    <h2 style="color: #2c3e50; margin-bottom: 2px;">📅 Goal Sheet Details for ${mailSelectedYear}</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
      <thead>
        <tr style="background-color: #2ecc71; color: white;">
          <th style="padding: 8px; border: 1px solid #ccc;">Year</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Month</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Joinings</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Cost</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Revenue</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Target</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Cum. Cost</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Cum. Revenue</th>
          <th style="padding: 8px; border: 1px solid #ccc;">YTD</th>
          <th style="padding: 8px; border: 1px solid #ccc;">MTD</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Incentive</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Leakage</th>
        </tr>
      </thead>
      <tbody>
        ${formattedGoalSheetDetails}
      </tbody>
    </table>
  </div>
`;

  

    await sendMailToEmployee(employee.email, emailContent);

    res
      .status(200)
      .send({ message: "Email sent successfully with goal sheet details" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .send({ error: "Failed to send email. Please try again later." });
  }
});

// making Team Lead to an employee
router.post("/make-teamlead/:id", async (req, res) => {
  try {
    const empId = req.params.id;
    const employee = await Employees.findByIdAndUpdate(
      empId,
      { isTeamLead: true },
      { new: true }
    );

    if (!employee) {
      return res.status(400).send({ error: "employee not found" });
    }

    return res
      .status(200)
      .json({ message: "TeamLead status updated successfully", employee });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "An error occurred while updating TeamLead status" });
  }
});

//assigning
router.post("/assign-to-teamlead/:id", async (req, res) => {
  try {
    const teamLeadId = req.params.id;
    const { employeeIds } = req.body;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Employee IDs must be a non-empty array" });
    }

    const teamLead = await Employees.findById(teamLeadId);
    if (!teamLead || !teamLead.isTeamLead) {
      return res
        .status(404)
        .json({ error: "Team Lead not found or is not a Team Lead" });
    }

    teamLead.team = [...new Set([...teamLead.team, ...employeeIds])];
    await teamLead.save();

    await Employees.updateMany(
      { _id: { $in: employeeIds } },
      { $set: { teamLead: teamLeadId } }
    );

    // Fetch the updated team lead with their team for response
    const updatedTeamLead = await Employees.findById(teamLeadId).populate(
      "team"
    );

    return res.status(200).json({
      message: "Employees successfully assigned to the Team Lead",
      teamLead: updatedTeamLead,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while assigning employees to the Team Lead",
    });
  }
});

// Unassign employee from a Team Lead's team list
router.post("/unassign-from-teamlead/:id", async (req, res) => {
  try {
    const teamLeadId = req.params.id; // Team Lead ID
    const { employeeId } = req.body; // Single employee ID to unassign

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(teamLeadId) ||
      !mongoose.Types.ObjectId.isValid(employeeId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid Team Lead ID or Employee ID" });
    }

    // Find the team lead
    const teamLead = await Employees.findById(teamLeadId);
    if (!teamLead || !teamLead.isTeamLead) {
      return res
        .status(404)
        .json({ error: "Team Lead not found or not a valid team lead" });
    }

    // Check if the employee is part of the team lead's team
    if (!teamLead.team.includes(employeeId)) {
      return res
        .status(400)
        .json({ error: "Employee not assigned to this team lead" });
    }

    // Remove the employee from the team lead's `team` array
    teamLead.team = teamLead.team.filter(
      (empId) => empId.toString() !== employeeId
    );
    await teamLead.save();

    // Clear the `teamLeadId` field for the employee
    const employee = await Employees.findById(employeeId);
    if (employee) {
      employee.teamLeadId = null;
      await employee.save();
    }

    return res.status(200).json({
      message: "Employee unassigned from Team Lead successfully",
      teamLead,
    });
  } catch (error) {
    console.error("Error unassigning employee from Team Lead:", error);
    return res.status(500).json({
      error:
        "An error occurred while unassigning the employee from the Team Lead",
    });
  }
});

//get team by team lead id

router.get("/get-team/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  try {
    // Find the employee by ID
    const teamLead = await Employees.findById(id)
      .populate("team", "name email profilePic empType") // Populate team with selected fields
      .select("name email profilePic empType team isTeamLead"); // Fetch specific fields for the team lead

    if (!teamLead || !teamLead.isTeamLead) {
      return res
        .status(404)
        .json({ message: "Team lead not found or not a valid team lead" });
    }

    // Respond with the team lead and their team members
    res.status(200).json({
      teamLead: {
        id: teamLead._id,
        name: teamLead.name,
        email: teamLead.email,
        profilePic: teamLead.profilePic,
        empType: teamLead.empType,
      },
      team: teamLead.team, // Team members
    });
  } catch (error) {
    console.error("Error fetching team data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});









router.get('/accounts',AdminAuthenticateToken,async(req, res)=>{
      try {
          const allAccounts = await AccountHandling.find();
          if (!allAccounts) {
            return res.status(402).json({ message: "No account found!!!" });
          }
      
        
          const empAccounts = [];
          for (let i = 0; i < allAccounts.length; i++) {
            const empName = await Employees.findById(allAccounts[i].owner).select('name activeStatus');
           
            if (empName) {
              
              empAccounts.push({ ...allAccounts[i]._doc, ownerName: empName.name, activeStatus: empName.activeStatus });
            }
      
          }
      
         
      
          res.status(200).json(empAccounts);
        } catch (error) {
          console.error(error.message);
          res.status(500).json({ message: error.message });
        }
})

router.get('/incentive-tree-Data',AdminAuthenticateToken, async(req,res) =>{
  try{
    const { userId } =req.query;
    console.log(req.query)
    
    const goalsheet = await GoalSheet.findOne({ owner: userId });

   const colors = 
{
      Orange: "#FFA500",
      Green: "#008000" }
    

   

    let white =0;
    let orange=0;
    let green=0;

    goalsheet.goalSheetDetails.forEach((goalsheet)=>{
       if(goalsheet.incentiveStatusColor){

         const colorCode = goalsheet.incentiveStatusColor;
          


          if (colorCode == colors.Orange) {
            orange += goalsheet.incentive || 0;
          }
          else if (colorCode == colors.Green) {
            green += goalsheet.incentive || 0;
          }
          else{
            white += goalsheet.incentive || 0
          }
}
    })

  
   
    return res.status(200).json({
      success: true,
      message: "Incentive tree data",
        white,
        orange,
        green
    });

  }
  catch(err){
       console.log(err)
       return res.status(500).json({ message: "Internal server error" });
  }

})



export default router;
