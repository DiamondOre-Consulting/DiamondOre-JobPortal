import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from 'axios';
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";

const AdminERP = () => {
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
  const [id, setId] = useState('')

  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

    if (tokenExpiration && tokenExpiration < Date.now()) {
      localStorage.removeItem("token");
      navigate("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/all-erp-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          console.log("adfdf",response.data)
          const lastData = response.data.allData;
          const empdata = response.data.findEmp;
          console.log(response.data.empdata)
          setEmployee(empdata);
          setId(lastData?._id)
          setLatestNews(lastData.BreakingNews || []);
          setHrName(lastData.Top5HRs || []);
          setClient(lastData.Top5Clients || []);
          setRnRInterns(lastData.RnRInterns || []);
          setRnRRecruiter(lastData.RnRRecruiters || []);
          setJoinings(lastData.JoningsForWeek || []);
          setEmpOfMonthDesc(lastData.EmpOfMonthDesc || ""); // Set EmpOfMonthDesc
          setRecognitionType(lastData.recognitionType || "");
          setProfilePicUrl(lastData.profilePic || "");
        } else {
          console.log("")
        }
      } catch (e) {
        console.log(e)
      }
    };

    fetchData();
  }, [decodedToken, navigate, token]);



  return (
    <div>
      <h2 className="px-4 text-3xl font-bold text-gray-800 md:text-5xl">
        Welcome aboard, <span className="text-blue-900">{decodedToken?.name}</span>
      </h2>
      <div className="flex gap-4 px-4 mt-6 md:px-10">
        <Link to='/admin-dashboard/add-erp' className="px-6 py-2 text-center text-gray-200 transition duration-150 ease-in bg-blue-900 rounded-md sm:px-4 hover:bg-blue-950">
          Add This Week's Data →
        </Link>
        <Link to={`/admin-dashboard/edit-erp/${id}`} className="px-6 py-2 text-center text-gray-200 transition duration-150 ease-in bg-blue-900 rounded-md sm:px-4 hover:bg-blue-950">
          Edit This Week's Data →
        </Link>
      </div>
      <HomeNews employee={employee} profilePicUrl={profilePicUrl} latestnews={latestnews} empOfMonthDesc={empOfMonthDesc} recognitionType={recognitionType} /> {/* Pass EmpOfMonthDesc */}
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={joinings} />
    </div>
  );
};

export default AdminERP;
