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

  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(localStorage.getItem("token"));
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
          "https://api.diamondore.in/api/employee/all-erp-data", 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          
        )
        if(response.status===200){
        const lastData = response.data.reverse()[0];

        console.log(lastData.EmpOfMonth)
        console.log(response.data.reverse()[0]);

         setempofthemonth(lastData.EmpOfMonth);  //emp of the mounth
         //breaking news
         if (lastData.BreakingNews && lastData.BreakingNews.length > 0) {
          console.log("news", lastData.BreakingNews[0]);
          setlatestnews(lastData.BreakingNews)
         } 
        else {
          console.log("BreakingNews array is empty or undefined");
        }
          //top hr
        if (lastData.Top5HRs && lastData.Top5HRs.length > 0) {
          console.log("Top5Hr", lastData.Top5HRs);
          sethrname(lastData.Top5HRs)
         } 
        else {
          console.log("top 5 hr array is empty");
        }

        //top 5 client 

        if (lastData.Top5Clients && lastData.Top5Clients.length > 0) {
          console.log("Top5Clients", lastData.Top5Clients);
          setclient(lastData.Top5Clients)
         } 
        else {
          console.log("top 5 client array is empty");
        }

        //Rnr recuiter
        if (lastData.RnRRecruiters && lastData.RnRRecruiters.length > 0) {
          console.log("RnrRecuiters", lastData.RnRRecruiters);
          setRnRRecruiter(lastData.RnRRecruiters);
         } 
        else {
          console.log("Rnr recuiiter array is empty");
        }

         //Rnr interns
         if (lastData.RnRInterns && lastData.RnRInterns.length > 0) {
          console.log("Rnrrec", lastData.RnRInterns);
          setRnRinterns(lastData.RnRInterns);
         } 
        else {
          console.log("Rnr interns array is empty");
        }

        //Joinings
        if (lastData.JoningsForWeek && lastData.JoningsForWeek.length > 0) {
          console.log("joinings", lastData.JoningsForWeek);
          setjoinings(lastData.JoningsForWeek);
         } 
        else {
          console.log("joinings array is empty");
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
      <HomeNews empofthemonth={empofthemonth} latestnews={latestnews} />
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={Joinings} />
      <EmployeeFooter/>
  
  </div>
  )
}

export default Employeedashboard   