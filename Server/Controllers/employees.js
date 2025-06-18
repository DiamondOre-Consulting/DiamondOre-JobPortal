import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Employees from "../Models/Employees.js";
import EmployeeAuthenticateToken from "../Middlewares/EmployeeAuthenticateToken.js";
import ERP from "../Models/ERP.js";
import AdminAuthenticateToken from "../Middlewares/AdminAuthenticateToken.js";
import Admin from "../Models/Admin.js";
import LeaveReport from "../Models/LeaveReport.js";
import PerformanceReport from "../Models/PerformanceReport.js";
import AccountHandling from "../Models/AccountHandling.js";
import GoalSheet from "../Models/GoalSheet.js";
import KPI from "../Models/KPI.js";
import {z} from 'zod'
import Policies from "../Models/Policies.js";
import { excelUpload } from "../Middlewares/multer.middleware.js";
import { uploadFile } from "../utils/fileUpload.utils.js";
import {deleteFile} from '../utils/fileUpload.utils.js';
import fs from "fs/promises";
import DSR from "../Models/DSR.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_EMPLOYEE;

const router = express.Router();

// EMPLOYEE SIGNUP
router.post("/add-emp", AdminAuthenticateToken, async (req, res) => {
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


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tech@diamondore.in",
        pass: "zlnbcvnhzdddzrqn",
      },
    });

    const mailOptions = {
      from: "Diamondore.in <tech@diamondore.in>",
      to: `Recipient <${email}>`,
      subject: "Congratulations!!! You are added to DOC-ERP",
      text: `Welcome to the team, ${name}`,
      html: `<h1 style="color: blue; text-align: center; font-size: 2rem">Diamond Consulting Pvt. Ltd.</h1> </br> <h3 style="color: black; font-size: 1.3rem; text-align: center;">Dear ${name}, Welcome to the DOC-ERP system as ${empType}. Stay Connected.</h3>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);


    res
      .status(201)
      .json({ message: "New Employee registered successfully!!! ", newEmp });
  } catch (error) {
    console.log(error, "Something went wrong!!!");
    res.status(500).json("Something went wrong!!!", error);
  }
});

const EmployeeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// EMPLOYEE LOGIN
router.post("/login", async (req, res) => {
  try {
     
    


    const { email, password } = req.body;

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

    const { id, name, profilePic , joiningExcel , Policies , team , isTeamLead , shortlistedCandidates} = user;

    res.status(200).json({
      id,
      name,
      email,
      profilePic,
      joiningExcel,
      Policies,
      team,
      shortlistedCandidates,
      isTeamLead,
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

    const latestData = await LeaveReport.find({ employeeId: userId });

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
router.get(
  "/performance-report",
  EmployeeAuthenticateToken,
  async (req, res) => {
    try {
      const { userId, email } = req.user;

      // Find the user in the database
      const user = await Employees.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const latestData = await PerformanceReport.find({ employeeId: userId });

      if (!latestData) {
        return res
          .status(404)
          .json({ message: "No Performance Report data found" });
      }

      res.status(200).json(latestData);
    } catch (error) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// SET ACCOUNT HANDLING
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tech@diamondore.in",
    pass: "zlnbcvnhzdddzrqn",
  },
});


// FETCH ALL ACCOUNT HANDLING





router.post(
  "/set-account-handling",
  EmployeeAuthenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.user;
      const { hrName, hrPhone, clientName, channelName, zoneName } = req.body;
      console.log(hrName);
      console.log(req.body)

      // Find the employee by userId
      const employee = await Employees.findById(userId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Check if any accountHandling has the same hrPhone but different owner
      const duplicatePhone = await AccountHandling.findOne({
        "accountDetails.channels.hrDetails.hrPhone": hrPhone,
        owner: { $ne: userId },
      });

      if (duplicatePhone) {
        // Update the requests field of the duplicatePhone document
        duplicatePhone.requests.push({
          employee: userId,
          accountPhone: hrPhone,
        });

        await duplicatePhone.save();

        // Send email notification to admin
        const mailOptions = {
          from: "tech@diamondore.in",
          to: "hr@diamondore.in",
          subject: "Duplicate Phone Number Request",
          text: `An employee (${employee.name}) has requested to use a duplicate phone number: ${hrPhone}.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        return res.status(400).json({
          message: "Phone number already in use by another account, the request to use this phone number has been sent to Admin",
        });
      }

      // Find the account details for the specified userId
      let accountHandling = await AccountHandling.findOne({ owner: userId });
      if (!accountHandling) {
        accountHandling = new AccountHandling({
          owner: userId,
          accountHandlingStatus: true,
          accountDetails: [],

        });
      }

      // Add the clientName if not already present

      // let clinetName= accountHandling.accountDetails.find((c)=> c.clientName===clientName)
      // if (!clientName) {
      //   clientName = {clientName};
      //   // accountHandling.accountDetail s.push(zone);
      // }


      await accountHandling.save()

      // Find or create the zone
      // let zone = accountHandling.accountDetails.find((z) => z.zoneName === zoneName);
      let zone = { zoneName, channels: [] };
      // if (!zone) {
      //   zone = { zoneName, channels: []};
      //   // accountHandling.accountDetail s.push(zone);
      // }

      // console.log(zone);

      // Find or create the channel within the zone
      zone.clientName = clientName
      // let channel = zone.channels.find((c) => c.channelName === channelName);
      let channel = { channelName, hrDetails: [] };
      // console.log("channel",channel)
      // if (!channel) {
      // channel = { hrDetails: []};
      // zone.channels.push(channel);
      // accountHandling.accountDetails.push(zone);

      // }
      // console.log("zone", zone);

      // Add HR details to the channel
      //  channel.channelName=channelName;
      channel.hrDetails.push({ hrName, hrPhone });

      // console.log("channel2",channel)

      zone.channels.push(channel);
      accountHandling.accountDetails.push(zone);
      // console.log("hrName", zone.channels[0]);
      await accountHandling.save()

      // Save the updated account handling details
      // await AccountHandling.updateOne(
      //   { 
      //     owner: new mongoose.Types.ObjectId(userId), // Ensure userId is cast to ObjectId
      //     "accountDetails.zoneName": zoneName, 
      //     "accountDetails.channels.channelName": channelName, 
      //   },
      //   { 
      //     $push: {
      //       "accountDetails.$.channels.$[channel].hrDetails": { hrName, hrPhone },
      //     }
      //   },
      //   { 
      //     arrayFilters: [{ "channel.channelName": channelName }]
      //   }
      // );




      // Update the account handling document with the new accountDetails


      // console.log("res",response)

      // console.log(accountHandling);

      res.status(200).json({ message: "Account details updated successfully", "accountHandling": accountHandling });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);







router.get("/accounts",EmployeeAuthenticateToken, async (req, res) => {
  try {
    const allAccounts = await AccountHandling.find();
    if (!allAccounts) {
      return res.status(402).json({ message: "No account found!!!" });
    }

    const empNames = [];
    const empAccounts = [];
    for (let i = 0; i < allAccounts.length; i++) {
      const empName = await Employees.findById(allAccounts[i].owner).select('name activeStatus');
     
      if (empName) {
        empNames.push(empName);
        empAccounts.push({ ...allAccounts[i]._doc, ownerName: empName.name, activeStatus: empName.activeStatus });
      }

    }

    console.log(empNames);
    // console.log(empAccounts);

    res.status(200).json(empAccounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/all-AccountsforIntern/:passcode", async (req, res) => {
  try {
    const {passcode}=req.params

    const admin = await Admin.findOne({passcode})
    if (!admin) {
      return res.status(402).json({ message: "No account found!!!" });
    }

    const allAccounts = await AccountHandling.find();
    if (!allAccounts) {
      return res.status(402).json({ message: "No account found!!!" });
    }

    const empNames = [];
    const empAccounts = [];
    for (let i = 0; i < allAccounts.length; i++) {
      const empName = await Employees.findById(allAccounts[i].owner).select('name activeStatus');
     
      if (empName) {
        empNames.push(empName);
        empAccounts.push({ ...allAccounts[i]._doc, ownerName: empName.name, activeStatus: empName.activeStatus });
      }

    }

    console.log(empNames);
    // console.log(empAccounts);

    res.status(200).json(empAccounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// FETCH ACCOUNT HANDLING DETAIL OF AN EMPLOYEE
router.get("/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const findAccount = await AccountHandling.findOne({ owner: id });
    if (!findAccount) {
      return res.status(402).json({ message: "No account handling details" });
    }

    res.status(200).json({ findAccount });
  } catch (error) {
    // console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete Account Handling Single List
router.delete("/accounts/delete/:id/:deleteId", async (req, res) => {
  try {
    const { id, deleteId } = req.params;

    console.log(req.params)
    const result = await AccountHandling.updateOne(
      { owner: id },
      { $pull: { accountDetails: { _id: deleteId } } }
    );

    console.log(result)

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Account handling details deleted successfully" });
    } else {
      res.status(401).json({ message: "Failed to delete!!!" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
})

router.put("/accounts/change-owner/:currentOwner/:futureOwner/:updateId", async (req, res) => {
  try {
    const { currentOwner, futureOwner, updateId } = req.params;

    let accountHandling = await AccountHandling.findOne({ owner: futureOwner });
    if (!accountHandling) {
      accountHandling = new AccountHandling({
        owner: futureOwner,
        accountHandlingStatus: true,
        accountDetails: [],

      });
    }

    await accountHandling.save();

    const currentAccount = await AccountHandling.findOne({ owner: currentOwner });
    if (!currentAccount) {
      return res.status(402).json({ message: "Current owner not found." });
    }

    const itemToMove = currentAccount.accountDetails.find(
      (data) => String(data?._id) === updateId
    );
    if (!itemToMove) {
      return res.status(402).json({ message: "Item to move not found in current owner's accountDetails." });
    }

    const removeResult = await AccountHandling.updateOne(
      { owner: currentOwner },
      { $pull: { accountDetails: { _id: updateId } } }
    );
    if (removeResult.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to remove the item from current owner." });
    }

    const addResult = await AccountHandling.updateOne(
      { owner: futureOwner },
      { $push: { accountDetails: itemToMove } }
    );

    console.log(addResult)

    if (addResult.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to add the item to future owner's accountDetails." });
    }

    return res.status(200).json({ message: "Item successfully moved to future owner's accountDetails." });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ message: "An error occurred during the operation." });
  }

})

// GET MY GOALSHEET
router.get("/my-goalsheet", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const {year}= req.query
    

 

  
    


    const allGoalSheets = await GoalSheet.find({ owner: userId });

    
    if (allGoalSheets.length === 0){
      return res.status(402).json({ message: "No goal sheet found!!!" });
    }
    const goalSheet = allGoalSheets[0].toObject();
   
    let minYear
    let maxYear
    if( goalSheet.goalSheetDetails[0].year)
    minYear=goalSheet.goalSheetDetails[0].year
     if(goalSheet.goalSheetDetails[goalSheet.goalSheetDetails.length-1].year) 
      maxYear=goalSheet.goalSheetDetails[goalSheet.goalSheetDetails.length-1].year
    if(minYear){
      goalSheet.minYear = minYear
    }
    if(maxYear){
      goalSheet.maxYear = maxYear
    }

    let filteredGoalSheets = null;
    if (year!="null" && year!="undefined") {
      
      filteredGoalSheets = goalSheet.goalSheetDetails.filter((detail) => detail.year === parseInt(year) )
    }

    if(filteredGoalSheets){
      
      goalSheet.goalSheetDetails = filteredGoalSheets
    }

    

    

    res.status(200).json(goalSheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// MY KPI SCORE
router.get("/my-kpi", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const myKPI = await KPI.findOne({ owner: userId }).populate("owner");
    if (!myKPI) {
      return res.status(402).json({ message: "No KPI found!!!" });
    }

    myKPI.kpis.sort((a, b) => b._id.getTimestamp()-a._id.getTimestamp());

    res.status(200).json(myKPI);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
})

const RnrPasscodeSchema = z.object({
  passcode: z.string(),
})

router.get('/rnr-Leaderborad/:passcode', async (req, res) => {

  try {
    const { passcode } = req.params;
    
    const {success,error} = RnrPasscodeSchema.safeParse({passcode})
    if (!success) {
      return res.status(403).json({ "message": "Invalid passcode" })
    }

    const employee = await Admin.findOne({ passcode })

    if (!employee) {
      return res.status(403).json({ "message": "passcode is incorrect" })
    }




    res.status(200).json({ message: "Employee found", employee });


  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }

})


router.get('/rnr-leaderboraddetails/:passcode', async (req, res) => {

  try {

    const { passcode } = req.params;

    const employee = await Admin.findOne({ passcode })

    if (!employee) {
      return res.status(403).json({ "message": "passcode is incorrect" })
    }



   const allData = await ERP.findOne().sort({ createdAt: -1 });
       
       // 3. Prepare response
       const response = { allData };
       
       // 4. Only add employee if exists
       if (allData && allData.EmpOfMonth) {
         response.findEmp = await Employees.findById(allData.EmpOfMonth);
       }
   
       // 5. Send response
       res.status(200).json(response);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }




})


router.get('/incentive-tree-Data',EmployeeAuthenticateToken, async(req,res) =>{
    try{
      const { userId } = req.user;
      
      const goalsheet = await GoalSheet.findOne({ owner: userId });

      const colors = 
        { 
        
         Orange: "#FFA500",
         Green: "#008000" 
        }

     

      let white =0;
      let orange=0;
      let green=0;

      goalsheet.goalSheetDetails.forEach((goalsheet)=>{
         if(goalsheet.incentiveStatusColor){

           const colorCode = goalsheet.incentiveStatusColor;

            if (colorCode === colors.Grey) {
              grey += goalsheet.incentive || 0;
            }
            else if (colorCode === colors.Orange) {
              orange += goalsheet.incentive || 0;
            }
            else{
              white += goalsheet.incentive || 0
            }
  }
      })

    
     
      return res.status(200).json({
        success: true,
        message: "Incentive tree data",
          white,
          orange,
          green
      });

    }
    catch(err){
         console.log(err)
         return res.status(500).json({ message: "Internal server error" });
    }

})




// get goal sheet 


router.get("/goalsheet/:id", EmployeeAuthenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const findGoalSheets = await GoalSheet.find({ owner: id });
    if (!findGoalSheets) {
      return res.status(402).json({ message: "No goalsheet found!!!" });
    }

    res.status(200).json(findGoalSheets);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});


router.get('/policies', EmployeeAuthenticateToken, async (req, res) => {
  try {
    const existingPolicies = await Policies.findOne();

    if (!existingPolicies) {
      return res.status(404).json({ success: false,
         message: "No policies found" });
    }

    return res.status(200).json({ success: true,
       Policies: existingPolicies });
  } catch (err) {
    console.error("Error fetching policies:", err);
    return res.status(500).json({ success:false,
      message:"Internal server error" });
  }
});



router.post("/upload-shortlistedsheet/:id",EmployeeAuthenticateToken ,excelUpload.single('ShortlistedCandidatesExcel'), async (req, res) => {
  try {

    console.log(req.file)
    
    const { id } = req.params;

    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    if(employee.shortlistedCandidates){
      const upload= await deleteFile(employee.shortlistedCandidates,"profilepics");
      console.log(upload)
    }

    let shortlistedCandidatesExcel = null;
    try{
          shortlistedCandidatesExcel = await uploadFile(req.file, "profilepics");   
          console.log(shortlistedCandidatesExcel)       
    }
    catch(err){
        console.log(err)
        return
    }


    if(shortlistedCandidatesExcel){
      employee.shortlistedCandidates = shortlistedCandidatesExcel;
    }

    await employee.save();

    res.status(200).json({
      message: "Shortlisted candidates excel uploaded Successfully",
      employeeId: employee._id,
      shortlistedCandidatesExcel: employee.shortlistedCandidates,
    });

  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
  finally{
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path); 
      console.log(`Deleted local file: ${req.file.path}`);
    }
  }
});

const dsrDataSchema =  z.object({
  candidateName: z.string().min(3,"Candidate name is required"),
  email :z.string().email().optional(),
  phone: z.string().min(10,"Phone number should be of at least 10 digits").max(10,"Phone number should be of at least 10 digits"),
  currentCompany:z.string().optional(),
  currentChannel: z.string().optional(),
  currentCTC: z.coerce.number().min(1,"Ctc is required"),
  currentLocation: z.string().min(3,"Current location is required"),
  recruiterName: z.string().min(3,"Recruiter name is required"),
  kamName: z.string().min(3,"KAM name is required"),
  currentDate: z.coerce.date()
})



router.post("/upload-dsr-by-employee",EmployeeAuthenticateToken,async(req,res)=>{
  try{
     
      const {error,success,data} = dsrDataSchema.safeParse(req.body)
 
      const userId = req.user.userId
     
      if (error) {

        console.log(error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })))
        return res.status(400).json({
          success: false,
          message: "Some fields are missing or erroneous" ,
        });
      }
   

      const existingCandidate = await DSR.findOne({
         $or: [{ phone: data.phone }, { email: data.email }]
      })

     
      if(existingCandidate){
        return res.status(400).send({
          success:false,
          message:"Candidate already exist in database"
        })
      }
    
      const newDSR = await DSR.create(data);
      
      return res.status(200).send({
        success:true,
        message:"DSR updated successfully"
      })

}
catch(err){
   console.log(err)
   res.status(500).send({
    success:false,
    message:"Internal server error"
   })
}

})





export default router;
