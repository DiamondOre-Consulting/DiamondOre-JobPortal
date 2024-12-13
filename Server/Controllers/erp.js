import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import axios from "axios";
import ERP from "../Models/ERP.js";
import Admin from "../Models/Admin.js";
import Employees from "../Models/Employees.js";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

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

// ADD A NEW ERP DATA
router.post("/add-erp-data", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const {
      EmpOfMonth,
      recognitionType,
      EmpOfMonthDesc,
      Top5HRs,
      Top5Clients,
      RnRInterns,
      RnRRecruiters,
      BreakingNews,
      JoningsForWeek,
      profilePicUrl
    } = req.body;

    console.log("object")
    console.log(profilePicUrl)
    // console.log("Received data:", req.body);

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newERPData = new ERP({
      EmpOfMonth,
      EmpOfMonthDesc,
      recognitionType,
      Top5HRs,
      Top5Clients,
      RnRInterns,
      RnRRecruiters,
      BreakingNews,
      JoningsForWeek,
      profilePic: profilePicUrl
    });

    await newERPData.save();

    res.status(201).json({ message: "New ERP data is added successfully!!! ", newERPData });

  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

router.put("/edit-erp-data/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;
    const {
      EmpOfMonth,
      recognitionType,
      EmpOfMonthDesc,
      Top5HRs,
      Top5Clients,
      RnRInterns,
      RnRRecruiters,
      BreakingNews,
      JoningsForWeek,
      profilePicUrl
    } = req.body;

    console.log("object")
    console.log(profilePicUrl)
    // console.log("Received data:", req.body);

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const singleERP = await ERP.findById({ _id: id });

    singleERP.EmpOfMonth = EmpOfMonth;
    singleERP.EmpOfMonthDesc = EmpOfMonthDesc;
    singleERP.recognitionType = recognitionType;
    singleERP.Top5HRs = Top5HRs;
    singleERP.Top5Clients = Top5Clients;
    singleERP.RnRInterns = RnRInterns;
    singleERP.RnRRecruiters = RnRRecruiters;
    singleERP.BreakingNews = BreakingNews;
    singleERP.JoningsForWeek = JoningsForWeek;
    singleERP.profilePic = profilePicUrl;
    await singleERP.save();

    res.status(201).json({ message: "New ERP data is added successfully!!! ", singleERP });

  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET ALL ERP DATA
router.get("/all-erp-data", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("object")

    const allData = await ERP.findOne().sort({ _id: -1 });

    const findEmp = await Employees.findById({ _id: allData.EmpOfMonth });

    console.log("alash", findEmp)
    // console.log(findEmp)
    res.status(200).json({ allData, findEmp });
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET AN ERP DATA
router.get("/erp-data/:id", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const { id } = req.params;
    console.log("object")
    console.log(id)
    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const singleERP = await ERP.findById({ _id: id });

    console.log(singleERP);

    res.status(200).json(singleERP);

  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
})

export default router;