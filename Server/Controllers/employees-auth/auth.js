import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Employees from "../../Models/Employees.js";
import Admin from "../../Models/Admin.js";
import AdminAuthenticateToken from "../../Middlewares/AdminAuthenticateToken.js";
import { sendEmail, employeeWelcomeTemplate } from "../../utils/email.js";
import dotenv from "dotenv";

dotenv.config();

const employeeAuthRouter = express.Router();
const secretKey = process.env.JWT_SECRET_EMPLOYEE;

// EMPLOYEE SIGNUP
employeeAuthRouter.post("/add-emp", AdminAuthenticateToken, async (req, res) => {
  try {
    const { empType, name, email, password, dob, doj, accountHandler } = req.body;
    const { userId } = req.user;

    const user = await Admin.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userExists = await Employees.exists({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmp = new Employees({
      empType,
      name,
      email,
      password: hashedPassword,
      dob,
      doj,
      accountHandler
    });

    await newEmp.save();

    // Send welcome email
    const { subject, html } = employeeWelcomeTemplate({ name, empType });
    await sendEmail({ to: email, subject, html });

    res
      .status(201)
      .json({ message: "New Employee registered successfully!!! ", newEmp });
  } catch (error) {
    res.status(500).json("Something went wrong!!!", error);
  }
});

const EmployeeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// EMPLOYEE LOGIN
employeeAuthRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log("enter")
    const parsedData = EmployeeLoginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
 
    // Find the user in the database
    const user = await Employees.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: "Employee",
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default employeeAuthRouter;