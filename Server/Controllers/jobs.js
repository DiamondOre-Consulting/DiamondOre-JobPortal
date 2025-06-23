import express, { Router } from "express";
import dotenv from "dotenv";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { fileURLToPath } from 'url';
import Admin from "../Models/Admin.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Jobs from "../Models/Jobs.js";
import {excelUpload} from "../Middlewares/multer.middleware.js";
import xlsx from "xlsx";
dotenv.config();

const secretKey = process.env.JWT_SECRET_ADMIN;

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const credentialsResumes = {
  accessKeyId: "rjRpgCugr4BV9iTw",
  secretAccessKey: "KBhGM26n6kLYZnigoZk6QJnB3GTqHYvMEQ1ihuZs"
};

const s3ClientResumes = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentialsResumes,
  region: "global"
});

router.post("/upload-job-excel", AdminAuthenticateToken, excelUpload.single('myFile') , async (req, res) => {
  console.log(req.user)
  if(req.user.email!="info@rasonline.in"&&req.user.email!="info.codifiers@gmail.com"){
    return res.status(400).send({success:false,message:"Unauthorized access"});
  }
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = req.file.path;
 

  try {
     
     const fileBuffer = fs.readFileSync(filePath)
     const workbook = xlsx.read(fileBuffer, { type: "buffer" });   
     const sheetName = workbook.SheetNames[0];  
     const result = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
     
     if(!result.length){
      return res.status(400).json({ error: "Empty file or invalid format" });
     }
 
     let errorArray = [];

    try{
      const bulkOps = [
          {deleteMany : {filter : {}}},
          ...result.map((doc)=> ( { insertOne : {document:doc}}))
      ]
       await Jobs.bulkWrite(bulkOps)
   
    }
    catch(err){
      errorArray.push({ error: err.message });
      console.error("Database insertion error:", err.message);
      return res.status(400).json({message : err.message});
    }

    return res.status(200).json({
      message: "OPS uploaded successfully",
    });
  } catch(err){
    return res.status(400).json({message : "Internal server error"});
  } finally {
      fs.unlinkSync(filePath);
  }
});

// ADD A JOB
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

    console.log(2, newJob)

    // Save the user to the database
    await newJob.save();
    return res.status(201).json({ message: "A Job added successfully" });
  } catch (error) {
    console.error("Error adding job", error);
    return res.status(500).send("Error adding job");
  }
});

// PERMANENT DELETE JOBS
router.delete('/permanent-delete-jobs', async (req, res) => {
  try {
    // Extract 'from' and 'to' from the query parameters
    const { fromDay, fromMonth, fromYear, toDay, toMonth, toYear } = req.body;

    // Convert the from and to dates to actual Date objects
    const fromDate = new Date(`${fromYear}-${fromMonth}-${fromDay}`);
    const toDate = new Date(`${toYear}-${toMonth}-${toDay}`);

    // Validate date range
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date range provided' });
    }

    // Delete jobs created between the fromDate and toDate
    const result = await Jobs.deleteMany({
      createdAt: {
        $gte: fromDate, // Greater than or equal to the 'fromDate'
        $lte: toDate,   // Less than or equal to the 'toDate'
      },
    });

    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} jobs`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while deleting jobs',
      error: error.message,
    });
  }
})

export default router;
