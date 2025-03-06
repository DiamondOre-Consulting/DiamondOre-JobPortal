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
      
    } =JSON.parse(req.body.erpData);

    
   
    
    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    let profilePicUrl= null;
    
    if(req.file){
      const uniqueFileName = `${uuidv4()}.${req.file.originalname.split(".").pop()}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: "profilepics",
        Key: uniqueFileName,
        Body: req.file.buffer,
      }));
      profilePicUrl = `https://s3.tebi.io/profilepics/${uniqueFileName}`;
    }
    
    console.log(profilePicUrl)

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

  

    const allData = await ERP.findOne().sort({ createdAt: -1 });

    const findEmp = await Employees.findById({ _id: allData.EmpOfMonth });

   
  
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