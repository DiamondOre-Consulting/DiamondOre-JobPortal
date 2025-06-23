import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Admin from "../../Models/Admin.js";
import AdminAuthenticateToken from "../../Middlewares/AdminAuthenticateToken.js";
import { uploadImage } from "../../Middlewares/multer.middleware.js";
import {
  generateOtp,
  storeOtp,
  validateOtp,
  clearOtp,
} from "../../utils/otp.js";
import { sendEmail, otpEmailTemplate } from "../../utils/email.js";

const adminAuthRouter = express.Router();
const secretKey = process.env.JWT_SECRET_ADMIN;

/**
 * @route POST /send-otp
 * @desc Send OTP to admin email
 */
adminAuthRouter.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await Admin.exists({ email });
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

/**
 * @route POST /signup-admin
 * @desc Register a new admin
 */
adminAuthRouter.post("/signup-admin",AdminAuthenticateToken,uploadImage.single("myFileImage"),
  async (req, res) => {
    const { name, email, password, otp, adminType } = req.body;
    try {
      if (!validateOtp(email, otp)) {
        return res.status(400).json({ message: "OTP expired or not found" });
      }
      const userExists = await Admin.exists({ email });
      if (userExists) {
        return res.status(409).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Admin({
        name,
        email,
        otp: null,
        password: hashedPassword,
        profilePic: req.file ? req.file.path : undefined,
        adminType,
      });
      await newUser.save();
      clearOtp(email);
      return res.status(201).json({ message: "Admin User created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * @route POST /login-admin
 * @desc Login as admin
 */
adminAuthRouter.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;
  const { success } = adminLoginSchema.safeParse({ email, password });
  if (!success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const user = await Admin.findOne({ email });
    if (user.adminType == "kpiAdmin") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: "admin" },
      secretKey,
      { expiresIn: "10h" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route POST /login-kpi-admin
 * @desc Login as KPI admin
 */
adminAuthRouter.post("/login-kpi-admin", async (req, res) => {
  const { email, password } = req.body;
  const { success } = adminLoginSchema.safeParse({ email, password });
  if (!success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!(admin.adminType == "kpiAdmin" || admin.adminType == "superAdmin")) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const token = jwt.sign(
      { userId: admin._id, name: admin.name, email: admin.email, role: admin.adminType },
      secretKey,
      { expiresIn: "24h" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route PUT /update-password
 * @desc Update admin password
 */
adminAuthRouter.put("/update-password", async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    if (!validateOtp(email, otp)) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "admin not found" });
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

/**
 * @route GET /validate-token-for-kpi-admin
 * @desc Validate token for KPI admin
 */
adminAuthRouter.get('/validate-token-for-kpi-admin', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    if (!(decoded.role == 'kpiAdmin'||decoded.role=="superAdmin")) {
      return res.status(403).json({ message: 'Access denied: Not a KPI admin' });
    }
    res.status(200).json({ message: 'Token valid for KPI admin', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default adminAuthRouter; 