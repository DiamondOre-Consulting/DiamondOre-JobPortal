import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from 'axios';
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";
import Confetti from 'react-confetti';

const EmployeeRnrBoard = () => {
  const [employee, setEmployee] = useState(null);
  const [latestnews, setLatestNews] = useState([]);
  const [hrname, setHrName] = useState([]);
  const [client, setClient] = useState([]);
  const [RnRinterns, setRnRInterns] = useState([]);
  const [RnRRecruiter, setRnRRecruiter] = useState([]);
  const [joinings, setJoinings] = useState([]);
  const [empOfMonthDesc, setEmpOfMonthDesc] = useState(""); // New state for EmpOfMonthDesc
  const [recognitionType, setRecognitionType] = useState("")
  const [profilePicUrl, setProfilePicUrl] = useState("")

  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(token);
  const navigate = useNavigate();
  const { passcode } = useParams();
  



  useEffect(() => {

    const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

    if (tokenExpiration && tokenExpiration < Date.now()) {
      localStorage.removeItem("token");
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        // const passcode= 123456;
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employee/rnr-leaderboraddetails/${passcode}`,

        );



        if (response.status === 200) {
          const lastData = response.data.allData;
          const empdata = response.data.findEmp;
          setEmployee(empdata);          
          setLatestNews(lastData.BreakingNews || []);
          setHrName(lastData.Top5HRs || []);
          setClient(lastData.Top5Clients || []);
          setRnRInterns(lastData.RnRInterns || []);
          setRnRRecruiter(lastData.RnRRecruiters || []);
          setJoinings(lastData.JoningsForWeek || []);
          setEmpOfMonthDesc(lastData.EmpOfMonthDesc || ""); 
          setRecognitionType(lastData.recognitionType || "");
          setProfilePicUrl(lastData.profilePic || "");
        } else {

        }
      } catch (e) {

      }
    };

    fetchData();
  }, [decodedToken, navigate, token]);


  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    // Automatically stop the confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);


  return (

    <div className="relative w-full overflow-x-hidden"> {showConfetti && <Confetti />}
      {/* <h2 className="px-4 py-4 text-3xl font-bold text-gray-800 md:text-5xl">
        Welcome aboard, <span className="text-blue-900">{decodedToken?.name}</span>
      </h2> */}

      <HomeNews employee={employee} profilePicUrl={profilePicUrl} latestnews={latestnews} empOfMonthDesc={empOfMonthDesc} recognitionType={recognitionType} /> {/* Pass EmpOfMonthDesc */}
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={joinings} />

    </div>
  );
};

export default EmployeeRnrBoard;
