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
import {uploadImage} from '../Middlewares/multer.middleware.js'
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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


// ADD A NEW ERP DATA
router.post("/add-erp-data", AdminAuthenticateToken, uploadImage.single('profilePic'), async (req, res) => {
  try {
    const { email } = req.user;

    // Safely parse ERP data with defaults
    const erpData = req.body.erpData ? JSON.parse(req.body.erpData) : {};
    
    // Destructure with default empty values
    const {
      EmpOfMonth = "",
      recognitionType = "",
      EmpOfMonthDesc = "",
      Top5HRs = [],
      Top5Clients = [],
      RnRInterns = [],
      RnRRecruiters = [],
      BreakingNews = [],
      JoningsForWeek = []
    } = erpData;

    // Find user with error handling
    const user = await Admin.findOne({ email }).catch(err => {
      console.error("Database error finding user:", err);
      throw new Error("Database operation failed");
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profile picture upload
    let profilePicUrl = null;
    if (req.file) {
      try {
        const uniqueFileName = `${uuidv4()}.${req.file.originalname.split(".").pop()}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: "profilepics",
          Key: uniqueFileName,
          Body: req.file.buffer,
        }));
        profilePicUrl = `https://s3.tebi.io/profilepics/${uniqueFileName}`;
      } catch (uploadError) {
        console.error("S3 upload failed:", uploadError);
        // Continue without failing the entire operation
      }
    }

    // Create new ERP data with validation
    const newERPData = new ERP({
      EmpOfMonth,
      EmpOfMonthDesc,
      recognitionType,
      Top5HRs: Array.isArray(Top5HRs) ? Top5HRs : [],
      Top5Clients: Array.isArray(Top5Clients) ? Top5Clients : [],
      RnRInterns: Array.isArray(RnRInterns) ? RnRInterns : [],
      RnRRecruiters: Array.isArray(RnRRecruiters) ? RnRRecruiters : [],
      BreakingNews: Array.isArray(BreakingNews) ? BreakingNews : [],
      JoningsForWeek: Array.isArray(JoningsForWeek) ? JoningsForWeek : [],
      profilePic: profilePicUrl
    });

    // Save with error handling
    const savedData = await newERPData.save().catch(err => {
      console.error("Database save error:", err);
      throw new Error("Failed to save ERP data");
    });

    res.status(201).json({ 
      success: true,
      message: "ERP data added successfully",
      data: savedData
    });

  } catch (error) {
    console.error("Error in /add-erp-data:", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.put("/edit-erp-data/:id", AdminAuthenticateToken, uploadImage.single('profilePic'), async (req, res) => {
 
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
    } = JSON.parse(req.body.erpData);;

   
  

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const singleERP = await ERP.findById({ _id: id });
   
    if (singleERP.profilePic) {
      const oldKey = new URL(singleERP.profilePic).pathname.substring(1);
     
      await s3Client.send(new DeleteObjectCommand({
          Bucket : "profilepics",
          Key : oldKey,
      }));
      console.log(`Deleted old image: ${oldKey}`);
  }

    let profilePicUrl= null;

    if(req.file){
      const uniqueFileName = `${uuidv4()}.${req.file.originalname.split(".").pop()}`;
      const status= await s3Client.send(new PutObjectCommand({
        Bucket: "profilepics",
        Key: uniqueFileName,
        Body: req.file.buffer,
      }));
      
      profilePicUrl = `https://s3.tebi.io/profilepics/${uniqueFileName}`;
    }
    

    if(EmpOfMonth){
      singleERP.EmpOfMonth=EmpOfMonth;
    }
    else{
      singleERP.EmpOfMonth=undefined
    }

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
    // 1. Check user exists
    const user = await Admin.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Get latest ERP data
    const allData = await ERP.findOne().sort({ createdAt: -1 });
    
    // 3. Prepare response
    const response = { allData };
    
    // 4. Only add employee if exists
    if (allData && allData.EmpOfMonth) {
      response.findEmp = await Employees.findById(allData.EmpOfMonth);
    }

    // 5. Send response
    res.status(200).json(response);

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
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