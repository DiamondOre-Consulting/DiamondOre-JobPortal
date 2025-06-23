import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import Candidates from "../../Models/Candidates.js";
import CandidateAuthenticateToken from "../../Middlewares/CandidateAuthenticateToken.js";
import { uploadImage } from "../../Middlewares/multer.middleware.js";
import { generateOtp, storeOtp, validateOtp, clearOtp } from "../../utils/otp.js";
import { sendEmail, otpEmailTemplate, welcomeEmailTemplate, forgotPasswordOtpTemplate } from "../../utils/email.js";

dotenv.config();

const candidateAuthRouter = express.Router();
const secretKey = process.env.JWT_SECRET;

// Send OTP
candidateAuthRouter.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await Candidates.exists({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const otp = generateOtp();
    storeOtp(email, otp);
    const { subject, html, text } = otpEmailTemplate(otp);
    await sendEmail({ to: email, subject, html, text });
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

const candidateSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().min(10).max(10),
  password: z.string().min(8),
  otp: z.string(),
  profilePic: z.instanceof(Object).optional(),
  resume: z.instanceof(Object).optional(),
});

// Signup
candidateAuthRouter.post("/signup",uploadImage.fields([
    { name: "myFileImage", maxCount: 1 },
    { name: "myFileResume", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, email, phone, password, otp } = req.body;
    const profilePic = req?.files?.myFileImage?.[0];
    const resume = req?.files?.myFileResume?.[0];
    const { success } = candidateSignupSchema.safeParse({
      name,
      email,
      phone,
      password,
      otp,
      profilePic,
      resume,
    });
    if (!success) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    try {
      if (validateOtp(email, otp)) {
        const userExists = await Candidates.exists({ email });
        if (userExists) {
          return res.status(409).json({ message: "User already exists" });
        }
        let uploadProfilePic = null;
        let uploadResume = null;
        if (profilePic) {
          uploadProfilePic = await uploadFile(profilePic, "profilepics");
        }
        if (resume) {
          uploadResume = await uploadFile(resume, "profilepics");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Candidates({
          name,
          email,
          phone,
          otp: null,
          password: hashedPassword,
          profilePic: uploadProfilePic,
          resume: uploadResume,
        });
        await newUser.save();
        clearOtp(email);
        const { subject, html } = welcomeEmailTemplate(name);
        await sendEmail({ to: email, subject, html });
        return res.status(200).json({
          success: true,
          message: "Candidate User created successfully",
        });
      } else {
        return res.status(400).json({ message: "OTP expired or invalid" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

const candidateLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Login
candidateAuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { success } = candidateLoginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: "candidate",
      },
      secretKey,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update password
candidateAuthRouter.put("/update-password", async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    if (!validateOtp(email, otp)) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    const user = await Candidates.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    clearOtp(email);
    res.status(200).json({ message: "Password Updated Successfully!!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default candidateAuthRouter; 