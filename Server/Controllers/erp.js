import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import axios from "axios";
import ERP from "../Models/ERP.js";
import Admin from "../Models/Admin.js";

const router = express.Router();

// ADD A NEW ERP DATA
router.post("/add-erp-data", AdminAuthenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const {
        EmpOfMonth,
        Top5HRs,
        Top5Clients,
        RnRInterns,
        RnRRecruiters,
        BreakingNews,
        JoningsForWeek,
      } = req.body;

    // Find the user in the database
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newERPData = new ERP({
        EmpOfMonth,
        Top5HRs,
        Top5Clients,
        RnRInterns,
        RnRRecruiters,
        BreakingNews,
        JoningsForWeek,
      });

      await newERPData.save();

      res.status(201).json({message: "New ERP data is added successfully!!! ", newERPData});

  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

// GET ALL ERP DATA
router.get("/all-erp-data", async (req, res) => {
  try {
    // const { email } = req.user;

    // // Find the user in the database
    // const user = await Admin.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    const allData = await ERP.find({});

    console.log(allData);

    res.status(200).json(allData);
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

        // Find the user in the database
        const user = await Admin.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const singleERP = await ERP.findById({_id: id});

        console.log(singleERP);

        res.status(200).json(singleERP);

    } catch(error) {
        console.log(error, "Something went wrong!!!");
        res.status(500).json("Something went wrong!!!", error);  
    }
})

export default router;