import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";
import otpStore from "../server.js";
import forgotOtp from "../server.js";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import Candidates from "../Models/Candidates.js";
import CandidateAuthenticateToken from "../Middlewares/CandidateAuthenticateToken.js";
import Jobs from "../Models/Jobs.js";
import Status from "../Models/Status.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

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

    const userExists = await Candidates.exists({ email });
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
    secretAccessKey: "93L4ucUETrFEyo9laZtPsvNCjttYAcCsIRxvmHcc"
};

const credentialsResumes = {
    accessKeyId: "rjRpgCugr4BV9iTw",
    secretAccessKey: "KBhGM26n6kLYZnigoZk6QJnB3GTqHYvMEQ1ihuZs"
};

// Create an S3 service client object
const s3Client = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentials,
    region: "global"
});

const s3ClientResumes = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentialsResumes,
    region: "global"
});

// Handle Image file upload
router.post('/upload-profile-pic', async (req, res) => {
    try {
        const file = req.files && req.files.myFile; // Change 'myFile' to match the key name in Postman
        
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        // Generate a unique identifier
        const uniqueIdentifier = uuidv4();

        // Get the file extension from the original file name
        const fileExtension = file.name.split('.').pop();

        // Create a unique filename by appending the unique identifier to the original filename
        const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

        // Convert file to base64
        const base64Data = file.data.toString('base64');

        // Create a buffer from the base64 data
        const fileBuffer = Buffer.from(base64Data, 'base64');

        const uploadData = await s3Client.send(
            new PutObjectCommand({
                Bucket: "profilepics",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "profilepics",
            Key: uniqueFileName
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
        return res.status(500).send('Error uploading file');
    }
});

// Handle Resume file upload
router.post('/upload-resume', async (req, res) => {
    try {
        const file = req.files && req.files.myFile; // Change 'myFile' to match the key name in Postman
        
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        // Generate a unique identifier
        const uniqueIdentifier = uuidv4();

        // Get the file extension from the original file name
        const fileExtension = file.name.split('.').pop();

        // Create a unique filename by appending the unique identifier to the original filename
        const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

        // Convert file to base64
        const base64Data = file.data.toString('base64');

        // Create a buffer from the base64 data
        const fileBuffer = Buffer.from(base64Data, 'base64');

        const uploadData = await s3ClientResumes.send(
            new PutObjectCommand({
                Bucket: "resumes",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "resumes",
            Key: uniqueFileName
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
        return res.status(500).send('Error uploading file');
    }
});

// SIGNUP AS CANDIDATE
router.post("/signup", async (req, res) => {
    const { name, email, phone, password, otp, profilePic, resume } = req.body;
  
    console.log("Signup Email:", email);
    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", otpStore[email]);
    // const isValidOTP = verifyOTP(otpStore, otp); //TESTING OTP
    // if (isValidOTP) {
    // TESTING OTP
    try {
      // Verify OTP
      if (otpStore[email] == otp) {
        const userExists = await Candidates.exists({ email });
        if (userExists) {
          return res.status(409).json({ message: "User already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user object
        const newUser = new Candidates({
          name,
          email,
          phone,
          otp: null,
          password: hashedPassword,
          profilePic,
          resume
        });
  
        // Save the user to the database
        await newUser.save();
  
        delete otpStore[email];
  
        return res
          .status(201)
          .json({ message: "Candidate User created successfully" });
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

// LOGIN AS CANDIDATE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, role: "candidate" }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// FETCHING USER DATA
router.get("/user-data", CandidateAuthenticateToken, async (req, res) => {
  try {
    // Get the user's email from the decoded token
    const { email } = req.user;

    // Find the user in the database
    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the required fields from the user object
    const {
      id,
      name,
      phone,
      profilePic,
      resume,
      allAppliedJobs,
      allShortlistedJobs
    } = user;

    res.status(200).json({
      id,
      name,
      email,
      phone,
      profilePic,
      resume,
      allAppliedJobs,
      allShortlistedJobs
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

    return res.status(200).json({allJobs});
  } catch (error) {
      console.log(error);
      return res.status(500).json({message: "Something went wrong!!!"})
  }
})

// FETCHING A PARTICULAR JOB
router.get("/all-jobs/:id", CandidateAuthenticateToken, async (req, res) => {
  try{
    const {email} = req.user;
    const {id} = req.params;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oneJob = await Jobs.findById({_id: id});
    console.log(oneJob);

    return res.status(201).json(oneJob);

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Something went wrong!!!"})
  }
})

// APPLY TO A JOB
router.post("/apply-job/:id", CandidateAuthenticateToken, async (req, res) => {
  try {
    const {userId, email} = req.user;
    const {id} = req.params;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkApplied = await Status.findOne({candidateId: userId, jobId: id});
    if(checkApplied.check) {
      console.log("Applied to this job already", checkApplied);
      return res.status(401).json({ message: "Applied to this job already" });
    } else {
      console.log("Have to apply");
      const job = await Jobs.findByIdAndUpdate(
        {_id: id}, 
        {
          $push: { appliedApplicants: userId }
        }
      );
  
      const userUpdate = await Candidates.findByIdAndUpdate(
        {_id: userId}, {
          $push: {allAppliedJobs: id}
        }
      )
  
      const newStatus = new Status({
        candidateId: userId,
        jobId: id,
        check: true,
        status: {
          Applied: true
        }
      })
  
      await newStatus.save();
  
      console.log(newStatus);
      res.status(201).json({newStatus, message: "Applied to job successfully!!!"})
    }

  } catch (error){
    console.log(error);
    res.status(500).json({message: "Something went wrong!!!"});
  }
})

export default router;
