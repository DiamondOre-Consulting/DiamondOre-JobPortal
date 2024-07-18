import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employees from "../Models/Employees.js";
import EmployeeAuthenticateToken from "../Middlewares/EmployeeAuthenticateToken.js";
import ERP from "../Models/ERP.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Admin from "../Models/Admin.js";
import LeaveReport from "../Models/LeaveReport.js";
import PerformanceReport from "../Models/PerformanceReport.js";
import AccountHandling from "../Models/AccountHandling.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_EMPLOYEE;

const router = express.Router();

// EMPLOYEE SIGNUP
router.post("/add-emp", AdminAuthenticateToken, async (req, res) => {
  try {
    const { empType, name, email, password, dob, doj } = req.body;
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
      doj
    });

    await newEmp.save();



    res
      .status(201)
      .json({ message: "New Employee registered successfully!!! ", newEmp });
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// EMPLOYEE LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
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
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// EMPLOYEE USER_DATA
router.get("/user-data", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Employees.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, name, profilePic } = user;

    res.status(200).json({
      id,
      name,
      email,
      profilePic
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET ALL ERP DATA
router.get("/all-erp-data", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    // Find the user in the database
    const user = await Employees.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allData = await ERP.findOne().sort({_id: -1});

    console.log(allData.EmpOfMonth);

    res.status(200).json(allData);
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET LEAVE REPORT
router.get("/leave-report", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { userId, email } = req.user;

    // Find the user in the database
    const user = await Employees.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestData = await LeaveReport.find({employeeId: userId});

    if (!latestData) {
      return res.status(404).json({ message: "No Leave Report data found" });
    }

    res.status(200).json(latestData);
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET PERFORMANCE REPORT
router.get("/performance-report", EmployeeAuthenticateToken, async (req, res) => {
    try {
        const { userId, email } = req.user;

        // Find the user in the database
        const user = await Employees.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const latestData = await PerformanceReport.find({employeeId: userId});
    
        if (!latestData) {
          return res.status(404).json({ message: "No Performance Report data found" });
        }
    
        res.status(200).json(latestData);
    } catch(error) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// SET ACCOUNT HANDLING
router.put("/set-account-handling", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const {userId} = req.user;
    const { hrName, clientName, phone, channel, zone } = req.body;

    // Find the employee by userId
    const employee = await Employees.findById(userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the account details for the specified userId
    let accountHandling = await AccountHandling.findOne({ owner: userId });
    if (!accountHandling) {
      accountHandling = new AccountHandling({ owner: userId, accountHandlingStatus: true, accountDetails: [] });
    }

    // Push new details to accountHandling array
    accountHandling.accountDetails.push({
      detail: {
        hrName: hrName,
        clientName: clientName,
        phone: phone,
        channel: channel,
        zone: zone
      },
    });

    // Save the updated goal sheet
    await accountHandling.save();

    res.status(200).json({ message: "Account details updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// FETCH MY ACCOUNT HANDLING DETAIL
router.get("/accounts/:id", async (req, res) => {
  try {

  } catch(error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
})

export default router;