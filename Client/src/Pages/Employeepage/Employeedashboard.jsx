import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from 'axios';

import Navbar from "../HomePage/Navbar";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import Footer from "../HomePage/Footer";
import EmployeeNavbar from "./EmployeeNavbar";
import { EmployeeFooter } from "./EmployeeFooter";

const Employeedashboard = () => {
  const [empofthemonth, setempofthemonth] = useState(null);
  const [latestnews, setlatestnews] = useState(null);
  const [hrname, sethrname] = useState(null)
  const [client, setclient] = useState(null);
  const [RnRinterns, setRnRinterns] = useState(null);
  const [RnRRecruiter, setRnRRecruiter] = useState(null);
  const [Joinings, setjoinings] = useState(null);
  const [empOfMonthDesc, setEmpOfMonthDesc] = useState(""); 
  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [recognitionType , setRecognitionType] = useState("")
  const navigate = useNavigate();


  const userName = decodedToken ? decodedToken.name : "No Name Found";
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/employee-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/employee-login");
      }
    }
    const fetchdata = async () => {
      try{
        const response = await axios.get(
          "http://localhost:5000/api/employee/all-erp-data", 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          
        )
        if(response.status === 200){
          console.log(response.data)
        const lastData = response.data.reverse()[0];
        const latest= response.data.allData;
        setRecognitionType(lastData.recognitionType || "");
        setEmpOfMonthDesc(latest.EmpOfMonthDesc || "");
        

         setempofthemonth(lastData.EmpOfMonth);  //emp of the mounth
         //breaking news
         if (lastData.BreakingNews && lastData.BreakingNews.length > 0) {
          
          setlatestnews(lastData.BreakingNews)
         } 
        else {
          
        }
          //top hr
        if (lastData.Top5HRs && lastData.Top5HRs.length > 0) {
          
          sethrname(lastData.Top5HRs)
         } 
        else {
          
        }

        //top 5 client 

        if (lastData.Top5Clients && lastData.Top5Clients.length > 0) {
          
          setclient(lastData.Top5Clients)
         } 
        else {
          
        }

        //Rnr recuiter
        if (lastData.RnRRecruiters && lastData.RnRRecruiters.length > 0) {
          
          setRnRRecruiter(lastData.RnRRecruiters);
         } 
        else {
          
        }

         //Rnr interns
         if (lastData.RnRInterns && lastData.RnRInterns.length > 0) {
          
          setRnRinterns(lastData.RnRInterns);
         } 
        else {
          
        }

        //Joinings
        if (lastData.JoningsForWeek && lastData.JoningsForWeek.length > 0) {
          
          setjoinings(lastData.JoningsForWeek);
         } 
        else {
          
        }
       
        }
        else{
          console.log("error occured")
        }
      }
      catch(e){
        console.log("error occured", e)
      }
     
    }
 
    fetchdata()
  }, [decodedToken]);
     
  return (
    <div className=" ">
      <EmployeeNavbar/>
      <h2 className="text-5xl px-10 font-bold text-gray-800">
        Welcome aboard <span className="text-blue-900">{userName} </span>
      </h2>
      <HomeNews empofthemonth={empofthemonth} latestnews={latestnews} empOfMonthDesc={empOfMonthDesc} recognitionType={recognitionType}/>
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={Joinings} />
      <EmployeeFooter/>
  
  </div>
  )
}

export default Employeedashboard   