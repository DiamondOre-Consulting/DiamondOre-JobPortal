import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";

const AdminERP = () => {
  const navigate = useNavigate();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); // Redirect to login page if not authenticated
    return;
  }

  const userName = decodedToken ? decodedToken.name : "No Name Found";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token found, redirect to login page
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  }, [decodedToken]);
  return (
    <div className="mx-5">
      <AdminNav />
      <h2 className="text-5xl px-10 font-bold text-gray-800">
        Welcome aboard, <span className="text-blue-900">{userName}</span>
      </h2>
      <div className="px-10 mt-6">
        <Link to={'/admin/erp-dashboard/add'} className="px-6 py-2 text-center text-gray-200 bg-blue-900 rounded-md sm:px-4 hover:bg-blue-950 transition ease-in duration-150">
          Add This Week's Data →
        </Link>
      </div>
      <HomeNews />
      <ERPTop5s />
      <RnRLeaderboard />
      <JoiningsForWeek />

      <AdminFooter />
    </div>
  );
};

export default AdminERP;
