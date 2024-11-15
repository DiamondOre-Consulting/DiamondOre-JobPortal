import React, { useEffect, useState  } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from 'axios';
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";

const EmployeeRnrBoard = () => {
  const [employee, setEmployee] = useState(null);
  const [latestnews, setLatestNews] = useState([]);
  const [hrname, setHrName] = useState([]);
  const [client, setClient] = useState([]);
  const [RnRinterns, setRnRInterns] = useState([]);
  const [RnRRecruiter, setRnRRecruiter] = useState([]);
  const [joinings, setJoinings] = useState([]);
  const [empOfMonthDesc, setEmpOfMonthDesc] = useState(""); // New state for EmpOfMonthDesc

  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(token);
  const navigate = useNavigate();
  const {passcode} = useParams();

  console.log(employee)

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
          `https://api.diamondore.in/api/employee/rnr-leaderboraddetails/${passcode}`,
          
        );

        console.log("Response",response.data)

        if (response.status === 200) {
          const lastData = response.data.allData;
          const empdata = response.data.findEmp;
          setEmployee(empdata);
          console.log("employee data", response.data);
          setLatestNews(lastData.BreakingNews || []);
          setHrName(lastData.Top5HRs || []);
          setClient(lastData.Top5Clients || []);
          setRnRInterns(lastData.RnRInterns || []);
          setRnRRecruiter(lastData.RnRRecruiters || []);
          setJoinings(lastData.JoningsForWeek || []);
          setEmpOfMonthDesc(lastData.EmpOfMonthDesc || ""); // Set EmpOfMonthDesc
        } else {
          console.log("Error occurred: Non-200 status code");
        }
      } catch (e) {
        console.log("Error occurred:", e);
      }
    };

    fetchData();
  }, [decodedToken, navigate, token]);

  return (
    <div>
      <h2 className="text-3xl md:text-5xl px-4 font-bold text-gray-800">
        Welcome aboard, <span className="text-blue-900">{decodedToken?.name}</span>
      </h2>
     
      <HomeNews employee={employee} latestnews={latestnews} empOfMonthDesc={empOfMonthDesc} /> {/* Pass EmpOfMonthDesc */}
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={joinings} />
    </div>
  );
};

export default EmployeeRnrBoard;
