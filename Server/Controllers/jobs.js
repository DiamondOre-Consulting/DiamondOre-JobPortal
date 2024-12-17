import express, { Router } from "express";
import dotenv from "dotenv";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import node_xj from "xls-to-json";
import fs from "fs";
import { fileURLToPath } from 'url';
import axios from "axios";
import Admin from "../Models/Admin.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Jobs from "../Models/Jobs.js";
import Candidates from "../Models/Candidates.js";
import nodemailer from "nodemailer";

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
// mail to all candidate added to job


const addedJobsMailToAllTheCandidates = async (candidateEmail, candidateName) => {
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
      to: `Recipient <${candidateEmail}>`,
      subject: "Exciting New Job Opportunity at Diamond Ore .Pvt Ltd",
      text: `Congratulations! We are thrilled to have you as a new member of our community. By joining us, you've taken the first step towards unlocking a world of opportunities.`,
      html: `
      <p>Dear ${candidateName},</p>
      <p>We are thrilled to announce that a new job opportunity has just been added to our platform at Diamond Ore Pvt Ltd! We believe that these jobs could be a perfect fit for with your skills and experience.</p>
      <p>Best regards</p>
      <a href="https://www.diamondore.in/" style="color:blue;">Diamond Ore pvt.Ltd</p>
      // <p style="text-align: left;"><img src="cid:logo" alt="Company Logo" style="width:200px;height:auto;"/></p>
            `,
      // attachments: [{
      //   filename: 'logo.png',
      //   path: 'C:/Users/ACER/Documents/RAS/DiamondOre-JobPortal/Client/src/assets/Logo.png',
      //   cid: 'logo'
      // }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // console.log(info);
  } catch (error) {
    console.error("Error sending Mail:", error);
    throw error;
  }
};


// Handle Resume file upload
router.post('/upload-ops', async (req, res) => {
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
    return res.status(500).send('Error uploading file');
  }
});

const downloadFile = async (url, outputFilePath) => {
  const writer = fs.createWriteStream(outputFilePath);

  const response = await axios({
    url: url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// router.post("/upload-job-excel", AdminAuthenticateToken, async (req, res) => {
//   const { url } = req.body;
//   const outputFilePath = path.join(__dirname, 'tempFile.xlsx');
//   try {
//     console.log(url);
//     await downloadFile(url, outputFilePath);
//     node_xj(
//       {
//         input:
//           outputFilePath,
//         output: null,
//         lowerCaseHeaders: true,
//         allowEmptyKey: false,
//       },
//       async (err, result) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ error: "Error converting Excel to JSON", err });
//         }
//         console.log(result);

//         // Assuming the result is an array of job objects
//         const jobsAdd = await Jobs.insertMany(result);
//         console.log(jobsAdd);
//         if (jobsAdd) {
//           // jobaddmail to all the candidatees are in our db
//           const allCandidates = await Candidates.find({}, { password: 0 });
//           for (const candidate of allCandidates) {
//             await addedJobsMailToAllTheCandidates(candidate.email, candidate.name);
//           }
//           return res
//             .status(200)
//             .json({ message: "Jobs Added successfully!!!" });
//         } else {
//           return res.status(500).json({ message: "Something went wrong!!" });
//         }
//       }
//     );
//   } catch (err) {
//     return res.status(400).json({ message: "Something went wrong!!!" });
//   } finally {
//     // Clean up: Delete the temporary file
//     fs.unlinkSync(outputFilePath);
//   }
// });

router.post("/upload-job-excel", AdminAuthenticateToken, async (req, res) => {
  const { url } = req.body;
  const outputFilePath = path.join(__dirname, "tempFile.xlsx");

  try {
    // Download the Excel file
    await downloadFile(url, outputFilePath);

    // Convert Excel to JSON
    const result = await new Promise((resolve, reject) => {
      node_xj(
        {
          input: outputFilePath,
          output: null,
          lowerCaseHeaders: true,
          allowEmptyKey: false,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    });

    let jobsAdded = [];
    let jobsUpdated = [];

    for (const job of result) {
      const {
        Company,
        JobTitle,
        Industry,
        Channel,
        Zone,
        City,
        State,
        JobStatus,
        DateAdded,
      } = job;

      const [day, month, year] = DateAdded.split("-");
      const formattedDateAdded = new Date(`${year}-${month}-${day}`);

      const existingJob = await Jobs.findOne({
        JobTitle: JobTitle,
        City: City,
        DateAdded: formattedDateAdded,
      });

      if (existingJob) {
        if (existingJob.JobStatus !== (JobStatus === "Active")) {
          existingJob.JobStatus = JobStatus === "Active";
          await existingJob.save();
          jobsUpdated.push(existingJob);
        }
      } else {
        const newJob = new Jobs({
          ...job,
          JobStatus: JobStatus === "Active",
          DateAdded: formattedDateAdded,
        });
        await newJob.save();
        jobsAdded.push(newJob);
      }
    }


    console.log(jobsAdded)
    console.log(jobsUpdated)
    // Respond with success
    return res.status(200).json({
      jobsAdded: jobsAdded.length,
      jobsUpdated: jobsUpdated.length,
      message: "Jobs processed successfully & sent emails",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong!!!", error: err.message });
  } finally {
    // Clean up: Delete the temporary file
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }
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
    console.log(1)
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
