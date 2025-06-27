import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Candidates from "../Models/Candidates.js";
import CandidateAuthenticateToken from "../Middlewares/CandidateAuthenticateToken.js";
import Jobs from "../Models/Jobs.js";
import Status from "../Models/Status.js";
import CandidateContact from "../Models/CandidateContact.js";
import PreferenceForm from "../Models/PreferenceForm.js";
import RemovedCandidates from "../Models/RemovedCandidates.js";
import fs from "fs";
import { fileURLToPath } from "url";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import ResumeTemp from "../Models/ResumeTemp.js";
import ClientReviews from "../Models/ClientReviews.js";
import { z } from "zod";
import { uploadImage } from "../Middlewares/multer.middleware.js";
import { skipMiddlewareFunction } from "mongoose";
import { uploadFile } from "../utils/fileUpload.utils.js";
import { deleteFile } from "../utils/fileUpload.utils.js";
import {
  sendEmail,
  otpEmailTemplate,
  forgotPasswordOtpTemplate,
  welcomeEmailTemplate,
} from "../utils/email.js";
import { generateOtp, storeOtp, validateOtp, clearOtp } from "../utils/otp.js";
dotenv.config();

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = {
  accessKeyId: "wRc04Y5sYocX6Aec",
  secretAccessKey: "93L4ucUETrFEyo9laZtPsvNCjttYAcCsIRxvmHcc",
};

const credentialsResumes = {
  accessKeyId: "rjRpgCugr4BV9iTw",
  secretAccessKey: "KBhGM26n6kLYZnigoZk6QJnB3GTqHYvMEQ1ihuZs",
};

// Create an S3 service client object
const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentials,
  region: "global",
});

const s3ClientResumes = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentialsResumes,
  region: "global",
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
      allShortlistedJobs,
      preferredFormStatus,
    } = user;

    res.status(200).json({
      id,
      name,
      email,
      phone,
      profilePic,
      resume,
      allAppliedJobs,
      allShortlistedJobs,
      preferredFormStatus,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const jobSchema = z.object({
  Channel: z.string().optional(),
  City: z.string().optional(),
  minCTC: z.coerce.number().optional(),
  maxCTC: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

// FETCHING ALL JOBS
router.get("/all-jobs", async (req, res) => {
  try {
    const { success, data, error } = jobSchema.safeParse(req.query);

    if (!success) {
      return res.status(422).json({ message: "invalid Credentials" });
    }

    const { Channel, City, minCTC, maxCTC } = data;

    const page = data.page || 0;
    const limit = data.limit || 20;

    const skip = page * limit;

    let queryData;
    let totalCount;
    if (Channel || City) {
      const query = {
        $and: [{ JobStatus: "Active" }, City ? { City } : null],
        $or: [
          ...(minCTC && maxCTC
            ? [{ MaxSalary: { $gte: minCTC, $lte: maxCTC } }]
            : []),
          Channel ? { Channel } : null,
        ].filter(Boolean),
      };
      console.log("queryyy", query);
      totalCount = await Jobs.countDocuments(query);
      queryData = await Jobs.find(query).skip(skip).limit(limit);
      // console.log("query data", queryData);
    } else {
      totalCount = await Jobs.countDocuments();
      queryData = await Jobs.find({}).skip(skip).limit(limit);
    }

    const uniqueCities = await Jobs.distinct("City");
    const uniqueChannels = await Jobs.distinct("Channel");

    return res.status(200).json({
      allJobs: queryData.reverse(),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      uniqueCities,
      uniqueChannels,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// JOB RECOMMENDATIONS
router.get(
  "/recommended-jobs",
  CandidateAuthenticateToken,
  async (req, res) => {
    try {
      const { userId, email } = req.user;

      const user = await Candidates.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const prefFormData = await PreferenceForm.findOne({
        candidateId: userId,
      });

      if (user.preferredFormStatus === true) {
        const mini = parseFloat(prefFormData.minExpectedCTC);
        const maxi = parseFloat(prefFormData.maxExpectedCTC);
        const recommendedJobs = await Jobs.find({
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$MaxSalary" }, mini] },
              { $lte: [{ $toDouble: "$MaxSalary" }, maxi] },
            ],
          },
          Channel: prefFormData.preferredChannel,
          City: prefFormData.preferredCity,
        });

        return res.status(200).json(recommendedJobs);
      } else {
        const allJobs = await Jobs.find({});

        return res.status(200).json(allJobs);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// FETCHING ALL APPLIED JOBS
router.get(
  "/all-applied-jobs",
  CandidateAuthenticateToken,
  async (req, res) => {
    try {
      // Get the user's email from the decoded token
      const { email } = req.user;

      // Find the user in the database
      const user = await Candidates.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const allAppliedJobs = user.allAppliedJobs;

      const appliedJobs = await Jobs.find({ _id: { $in: allAppliedJobs } });

      return res.status(200).json(appliedJobs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// FETCHING ALL SHORTLISTED JOBS
router.get(
  "/all-shortlisted-jobs",
  CandidateAuthenticateToken,
  async (req, res) => {
    try {
      // Get the user's email from the decoded token
      const { email } = req.user;

      // Find the user in the database
      const user = await Candidates.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const allShortlistedJobs = user.allShortlistedJobs;

      const shortlistedJobs = await Jobs.find({
        _id: { $in: allShortlistedJobs },
      });

      return res.status(200).json({ shortlistedJobs });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// FETCHING ALL DIRECT CHANNEL JOBS
router.get("/all-direct-jobs", CandidateAuthenticateToken, async (req, res) => {
  try {
    const allJobs = await Jobs.find({ Channel: "Direct" });
    if (!allJobs) {
      return res.status(402).json({ message: "No Direct Jobs" });
    }

    console.log(allJobs);

    return res.status(200).json(allJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL BANCA CHANNEL JOBS
router.get("/all-banca-jobs", CandidateAuthenticateToken, async (req, res) => {
  try {
    const allJobs = await Jobs.find({ Channel: "Banca" });
    if (!allJobs) {
      return res.status(402).json({ message: "No Banca Jobs" });
    }

    console.log(allJobs);

    return res.status(200).json(allJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL AGENCY CHANNEL JOBS
router.get("/all-agency-jobs", CandidateAuthenticateToken, async (req, res) => {
  try {
    const allJobs = await Jobs.find({ Channel: "Agency" });
    if (!allJobs) {
      return res.status(402).json({ message: "No agency Jobs" });
    }

    console.log(allJobs);

    return res.status(200).json(allJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// FETCHING ALL OTHER JOBS
router.get("/all-other-jobs", CandidateAuthenticateToken, async (req, res) => {
  try {
    const excludedChannels = ["Banca", "Agency", "Direct"];

    const filteredJobs = await Jobs.find({
      Channel: { $nin: excludedChannels },
    });
    const allJobs = await Jobs.find({ Channel: "Agency" });
    if (!filteredJobs || filteredJobs.length === 0) {
      return res.status(402).json({ message: "No jobs matching the criteria" });
    }

    console.log(filteredJobs);

    return res.status(200).json(filteredJobs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// GET FILTERED JOBS
router.get("/filtered-jobs", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await Candidates.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract filter parameters from the query
    const { cities, channels, ctcRanges } = req.query;

    // Construct a filter object based on the provided parameters
    const filter = {};
    if (cities) {
      filter.City = { $in: cities.split(",") };
    }
    if (channels) {
      filter.Channel = { $in: channels.split(",") };
    }
    if (ctcRanges) {
      const ctcRangesArray = ctcRanges.split(",");
      const ctcFilters = ctcRangesArray.map((range) => {
        const [min, max] = range.split("-");
        return { MaxSalary: { $gte: parseInt(min), $lte: parseInt(max) } };
      });
      filter.$or = ctcFilters;
    }

    // Query the database with the constructed filter
    const filteredJobs = await Jobs.find(filter);

    res.status(200).json(filteredJobs);
  } catch (error) {
    console.error("Error fetching filtered jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// FETCHING A PARTICULAR JOB
router.get("/all-jobs/:id", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oneJob = await Jobs.findById({ _id: id });
    // console.log(oneJob);

    return res.status(201).json(oneJob);
  } catch (error) {
    console.log("error in single", error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// Job application confirmation email template
function jobAppliedTemplate(job) {
  return {
    subject: "Job Applied Successfully!",
    html: `
      <p style="color:green; text-align:center;">Congratulations! You have successfully applied to the following job:</p>
      <ul>
        <li><strong>Job Title:</strong> ${job.JobTitle}</li>
        <li><strong>Channel:</strong> ${job.Channel}</li>
        <li><strong>City:</strong> ${job.City}</li>
        <li><strong>State:</strong> ${job.State}</li>
        <li><strong>Min Experience:</strong> ${job.MinExperience}</li>
        <li><strong>Max Salary:</strong> ${job.MaxSalary}</li>
      </ul>
      <p style="color:green;">Thank you for applying!</p>
      <p style="text-align: left; ">Regards,</p>
    `,
  };
}

// Job application admin notification template
function jobAppliedAdminTemplate(job, candidate) {
  return {
    subject: `A new applicant applied for ${job.JobTitle}`,
    html: `
      <ul>
        <li><strong>Name:</strong> ${candidate.name}</li>
        <li><strong>Email:</strong> ${candidate.email}</li>
        <li><strong>Phone Number:</strong> ${candidate.phone}</li>
        <li><strong>Resume/CV:</strong> ${candidate.resume}</li>
      </ul>
      <p style="text-align: left;">Regards,</p>
    `,
  };
}

// Account deletion notification template
function accountDeletionTemplate(user) {
  return {
    subject: `Account Deletion Notification: ${user.name}`,
    html: `
      <p>Dear ${user.name},</p>
      <p>We regret to inform you that your account has been deleted from Diamond Ore pvt.Ltd</p>
      <p>We appreciate the time you spent exploring opportunities with us and your interest in the positions available on our platform. If you have any feedback about your experience or the reason behind your decision to delete your account, we would appreciate hearing from you. Your input helps us improve our services for all users.</p>
      <p>If you ever decide to return or have any questions, please feel free to reach out to us.</p>
      <p>Thank you for considering opportunities with us, and we wish you the best in your future endeavors</p>
      <p>Best regards</p>
      <p style="color:green;">Diamond Ore pvt.Ltd</p>
    `,
  };
}

// Contact us notification template
function requestContactTemplate(Name, Email, Message, queryFor) {
  return {
    subject: `Contact Details FROM DOC: New Message Received from ${Name}`,
    html: `<h4 style="font-size:1rem; display:flex; justify-content: center;">A new message has been submitted by ${Name}</h4><br/><h4 style="font-size:1rem; display:flex; justify-content: center;">Email: ${Email}</h4><br/><h4 style="font-size:1rem; display:flex; justify-content: center;">Query For:${queryFor}</h4> </br><h4 style="font-size:1rem; display:flex; justify-content: center;">Message:${Message}</h4>`,
  };
}

// Request call notification template
function requestCallTemplate(name, phone, queryFor) {
  return {
    subject: `CALL REQUEST FROM DOC: New Message Received from ${name}`,
    html: `<h4 style="font-size:1rem; display:flex; justify-content: center;">A new message has been submitted by ${name}</h4><br/><h4 style="font-size:1rem; display:flex; justify-content: center;">Phone No: ${phone}</h4><br/><h4 style="font-size:1rem; display:flex; justify-content: center;">Query For:${queryFor}</h4>`,
  };
}

// Refactor job application route
router.post("/apply-job/:id", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { id } = req.params;
    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkApplied = await Status.findOne({
      candidateId: userId,
      jobId: id,
    });
    if (checkApplied?.check) {
      return res.status(401).json({ message: "Applied to this job already" });
    } else {
      const job = await Jobs.findByIdAndUpdate(
        { _id: id },
        { $push: { appliedApplicants: userId } }
      );
      await Candidates.findByIdAndUpdate(
        { _id: userId },
        { $push: { allAppliedJobs: id } }
      );
      const newStatus = new Status({
        candidateId: userId,
        jobId: id,
        status: { Applied: true },
      });
      await newStatus.save();
      // Send confirmation email to candidate
      const { subject, html } = jobAppliedTemplate(job);
      await sendEmail({ to: email, subject, html });
      // Send notification email to admin
      const CandidateUser = await Candidates.findById({ _id: userId });
      const { subject: adminSubject, html: adminHtml } =
        jobAppliedAdminTemplate(job, CandidateUser);
      await sendEmail({
        to: "hr@diamondore.in",
        cc: [
          "rahul@rasonline.in",
          "rahul@diamondore.in",
          "zoya.rasonline@gmail.com",
        ],
        subject: adminSubject,
        html: adminHtml,
      });
      return res.status(200).json({ message: "Job applied successfully!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// STATUS OF A JOB
router.get("/status/:id2", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { id2 } = req.params;
    // console.log("data", id1, "email ", id2);

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allStatus = await Status.findOne({ candidateId: userId, jobId: id2 });
    console.log("hgdy", allStatus);

    res.status(201).json(allStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// HELP CONTACT
router.post("/help-contact", async (req, res) => {
  try {
    const { Name, Email, Message, queryFor } = req.body;

    const newMsg = new CandidateContact({
      Name,
      Email,
      Message,
      queryFor,
    });

    await newMsg.save();
    console.log(newMsg);

    const { subject, html } = requestContactTemplate(
      Name,
      Email,
      Message,
      queryFor
    );
    await sendEmail({
      to: "helpdesk2.rasonline@gmail.com",
      cc: [
        "rahul@rasonline.in",
        "zoya.rasonline@gmail.com",
        "hr@diamondore.in",
      ],
      subject,
      html,
    });

    res.status(201).json({ message: "Message sent successfully!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// EDIT PROFILE (Let Aayush know how this is gonna work)
router.put(
  "/edit-profile",
  CandidateAuthenticateToken,
  uploadImage.fields([
    { name: "myFileImage", maxCount: 1 },
    { name: "myFileResume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, phone, password } = req.body;
      const { email } = req.user;

      const profilePic = req.files?.myFileImage?.[0] || null;
      const resume = req.files?.myFileResume?.[0] || null;

      const user = await Candidates.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let uploadProfilePic = null;

      if (profilePic) {
        if (user.profilePic) {
          const deleteProfilePic = await deleteFile(
            user.profilePic,
            "profilepics"
          );
        }

        uploadProfilePic = await uploadFile(profilePic, "profilepics");

        user.profilePic = uploadProfilePic;
      }

      let uploadResume = null;
      if (resume) {
        if (user.resume) {
          const deleteProfilePic = await deleteFile(user.resume, "profilepics");
        }
        uploadResume = await uploadFile(resume, "profilepics");

        user.resume = uploadResume;
      }

      if (name) {
        user.name = name;
      }

      if (phone) {
        user.phone = phone;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      await user.save();

      res.status(201).json({ message: "Edit profile successful!!!", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!!!" });
    }
  }
);

// PREFERENCE FORM
router.post("/add-preference", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.user;
    const { preferredCity, preferredChannel, expectedCTC } = req.body;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [minECTC, maxECTC] = expectedCTC.split("-");

    const newPrefForm = new PreferenceForm({
      candidateId: userId,
      preferredCity,
      preferredChannel,
      minExpectedCTC: minECTC,
      maxExpectedCTC: maxECTC,
    });

    await newPrefForm.save();

    if (newPrefForm) {
      user.preferredFormStatus = true;
      await user.save();
    }

    res.status(200).json({
      message: "Preference form submitted successfully!!! ",
      newPrefForm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// EDIT PREFERENCE FORM
router.put("/edit-preference", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { preferredCity, preferredChannel, expectedCTC } = req.body;
    const { email, userId } = req.user;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prefFormData = await PreferenceForm.findOne({ candidateId: userId });

    if (preferredCity) {
      prefFormData.preferredCity = preferredCity;
      await prefFormData.save();
    }

    if (preferredChannel) {
      prefFormData.preferredChannel = preferredChannel;
      await prefFormData.save();
    }

    if (expectedCTC) {
      const [minECTC, maxECTC] = expectedCTC.split("-");
      prefFormData.minExpectedCTC = minECTC;
      prefFormData.maxExpectedCTC = maxECTC;
      await prefFormData.save();
    }

    res
      .status(201)
      .json({ message: "Edit preference form successfully!!!", prefFormData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// GET PREF DATA
router.get("/get-pref-data", CandidateAuthenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.user;

    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prefFormData = await PreferenceForm.findOne({ candidateId: userId });

    res.status(200).json(prefFormData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
});

// Refactor account deletion route
router.delete(
  "/remove-account",
  CandidateAuthenticateToken,
  async (req, res) => {
    try {
      const { email, userId } = req.user;
      const user = await Candidates.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const deletedUser = new RemovedCandidates({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        profilePic: user.profilePic,
        resume: user.resume,
        preferredFormStatus: user.preferredFormStatus,
        allAppliedJobs: user.allAppliedJobs,
        allShortlistedJobs: user.allShortlistedJobs,
      });
      await deletedUser.save();
      if (deletedUser) {
        await Candidates.findByIdAndDelete({ _id: userId });
      }
      // Send account deletion email
      const { subject, html } = accountDeletionTemplate(deletedUser);
      await sendEmail({ to: deletedUser.email, subject, html });
      res.status(200).json({
        message:
          "Candidate has been removed from Candidates DB and Transferred to DeletedCandidates Schema!!!",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Refactor forgot password OTP route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await Candidates.exists({ email });
    if (!userExists) {
      return res.status(409).json({ message: "User does not exists" });
    }
    const otp = generateOtp();
    storeOtp(email, otp);
    const { subject, html, text } = forgotPasswordOtpTemplate(otp);
    await sendEmail({ to: email, subject, html, text });
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Refactor request call route
router.post("/request-call", async (req, res) => {
  try {
    const { name, phone, queryFor } = req.body;
    console.log(name, phone, queryFor);
    if (!name || !phone || !queryFor) {
      return res.status(401).json({ message: "Both fields are required!!!" });
    }
    const { subject, html } = requestCallTemplate(name, phone, queryFor);
    await sendEmail({
      to: "helpdesk2.rasonline@gmail.com",
      cc: ["rahul@rasonline.in"],
      subject,
      html,
    });
    res.status(200).json("Email sent successfully!!!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

// GIVE A REVIEW
router.post("/post-review", async (req, res) => {
  try {
    const { name, email, reviewFor, diamonds, review } = req.body;

    if (!reviewFor || !diamonds) {
      return res
        .status(401)
        .json({ message: "Review for and diamonds are required fields!!!" });
    }

    const newReview = new ClientReviews({
      name,
      email,
      reviewFor,
      diamonds,
      review,
    });

    await newReview.save();

    res.status(200).json({ message: "Review posted sucessfully!!!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

// FETCH ALL REVIEWS
router.get("/all-reviews", async (req, res) => {
  try {
    const allReviews = await ClientReviews.find();

    res.status(201).json(allReviews);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "" });
  }
});

// FREE RESUME WITH TEBI
// TEBI CREDS
const credentialsFreeResumes = {
  accessKeyId: "KPvWPJ8OJZwpVGZm",
  secretAccessKey: "3jVWD2tpmuoHlrn6UHLIwbFozdoxXneSKL8bYJ0d",
};

const s3ClientFreeResumes = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentialsFreeResumes,
  region: "global",
});

router.post("/free-resume", async (req, res) => {
  try {
    const {
      full_name,
      address,
      phone,
      email,
      linkedinUrl,
      summary,
      tech_skills,
      soft_skills,
      experience,
      graduation,
      twelfth,
      tenth,
    } = req.body;

    // Your existing code to generate output.docx
    const templatePath = path.resolve(__dirname, "Template_Resume.docx");
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.render({
      full_name: full_name,
      address: address,
      phone: phone,
      email: email,
      linkedinUrl: linkedinUrl,
      summary: summary,
      tech_skills: [tech_skills],
      soft_skills: [soft_skills],
      designation: experience.designation,
      start_month: experience.start_month,
      start_year: experience.start_year,
      end_month: experience.end_month,
      end_year: experience.end_year,
      company: experience.company,
      company_city: experience.company_city,
      work_description: experience.work_description,
      degree_name: graduation.degree_name,
      degree_field: graduation.degree_field,
      graduation_year: graduation.graduation_year,
      university_name: graduation.university_name,
      university_city: graduation.university_city,
      twelfth_field: twelfth.twelfth_field,
      twelfth_year: twelfth.twelfth_year,
      twelfth_school_name: twelfth.twelfth_school_name,
      twelfth_school_city: twelfth.twelfth_school_city,
      twelfth_board_name: twelfth.twelfth_board_name,
      tenth_field: tenth.tenth_field,
      tenth_year: tenth.tenth_year,
      tenth_school_name: tenth.tenth_school_name,
      tenth_school_city: tenth.tenth_school_city,
      tenth_board_name: tenth.tenth_board_name,
    });

    // Save Word document
    const buffer = doc
      .getZip()
      .generate({ type: "nodebuffer", compression: "DEFLATE" });
    const outputPath = path.resolve(__dirname, `${full_name}_free_resume.docx`);
    fs.writeFileSync(outputPath, buffer);

    // Upload the generated file to Tebi
    const upload_data = await s3ClientFreeResumes.send(
      new PutObjectCommand({
        Bucket: "freeresumesbuild",
        Key: `${full_name}_free_resume.docx`,
        Body: fs.readFileSync(outputPath),
      })
    );

    const getObjectCommand = new GetObjectCommand({
      Bucket: "freeresumesbuild",
      Key: `${full_name}_free_resume.docx`,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand); // Generate URL valid for 1 hour

    // Parse the signed URL to extract the base URL
    const parsedUrl = new URL(signedUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;
    if (!baseUrl) {
      return res.status(404).json({ message: "file not saved" });
    }
    if (baseUrl) {
      const newFreeResume = new ResumeTemp({
        full_name: full_name,
        address: address,
        phone: phone,
        email: email,
        linkedinUrl: linkedinUrl,
        summary: summary,
        tech_skills: tech_skills,
        soft_skills: soft_skills,
        experience: {
          designation: experience.designation,
          start_month: experience.start_month,
          start_year: experience.start_year,
          end_month: experience.end_month,
          end_year: experience.end_year,
          company: experience.company,
          company_city: experience.company_city,
          work_description: experience.work_description,
        },
        graduation: {
          degree_name: graduation.degree_name,
          degree_field: graduation.degree_field,
          graduation_year: graduation.graduation_year,
          university_name: graduation.university_name,
          university_city: graduation.university_city,
        },
        twelfth: {
          twelfth_field: twelfth.twelfth_field,
          twelfth_year: twelfth.twelfth_year,
          twelfth_school_name: twelfth.twelfth_school_name,
          twelfth_school_city: twelfth.twelfth_school_city,
          twelfth_board_name: twelfth.twelfth_board_name,
        },
        tenth: {
          tenth_field: tenth.tenth_field,
          tenth_year: tenth.tenth_year,
          tenth_school_name: tenth.tenth_school_name,
          tenth_school_city: tenth.tenth_school_city,
          tenth_board_name: tenth.tenth_board_name,
        },
        resumeLink: baseUrl,
      });
      await newFreeResume.save();
    }

    res.status(200).send(baseUrl); // Return the URL of the uploaded file
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!!", error });
  }
});

export default router;
