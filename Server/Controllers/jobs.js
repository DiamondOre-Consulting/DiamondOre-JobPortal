import express, { Router } from "express";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import node_xj from "xls-to-json";
import Candidates from "../Models/Candidates.js";
import Admin from "../Models/Admin.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Jobs from "../Models/Jobs.js";
import CandidateAuthenticateToken from "../Middlewares/CandidateAuthenticateToken.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_ADMIN;

const router = express.Router();

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

router.post("/add-job", AdminAuthenticateToken, async (req, res) => {
  try {
    const {
      Company,
      JobTitle,
      Industry,
      Channel,
      Vacancies,
      Zone,
      City,
      State,
      MinExperience,
      MaxSalary,
    } = req.body;

    const { email } = req.user;

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Not authorized or user not found" });
    }

    // Create a new user object
    const newJob = new Jobs({
        Company,
        JobTitle,
        Industry,
        Channel,
        Vacancies,
        Zone,
        City,
        State,
        MinExperience,
        MaxSalary,
    });

    // Save the user to the database
    await newJob.save();

    return res.status(201).json({ message: "A Job added successfully" });
  } catch (error) {
    console.error("Error adding job", error);
    return res.status(500).send("Error adding job");
  }
});


// Define storage options for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where you want to store the uploaded files
      cb(
        null,
        "C:/Users/Harsh Jha/Documents/RAS Portal Pilot/DiamondOreJobPortal/Server/JobsExcel"
      );
    },
    filename: function (req, file, cb) {
      // Set the file name to be the original name of the uploaded file
    //   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.originalname);
    },
  });
  
  // Create the Multer upload instance
  const upload = multer({ storage: storage });

router.post("/upload-job-excel", async (req, res) => {
    // const uploadedfile = req.file;
    // const mainFile = uploadedfile.path;
    // console.log(mainFile);
try {
    node_xj({
        input: "C:/Users/Harsh Jha/Documents/RAS Portal Pilot/DiamondOreJobPortal/Server/Controllers/Book1.xlsx",
        output: null,
        lowerCaseHeaders: true,
        allowEmptyKey: false,
      }, async (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error converting Excel to JSON' });
        }
        console.log(result);
    
        // Assuming the result is an array of job objects
        const jobsAdd = await Jobs.insertMany(result);
        console.log(jobsAdd)
        if(jobsAdd) {
            return res.status(200).json({message: 'Jobs Added successfully!!!'});
        } else {
            return res.status(500).json({message: "Something went wrong!!!"})
        }
    
      });
} catch (err) {
    return res.status(500).json({message: "Something went wrong!!!"})
}
  
})

export default router;
