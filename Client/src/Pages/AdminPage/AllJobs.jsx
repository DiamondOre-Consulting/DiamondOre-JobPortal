import React, { useEffect } from "react";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import AdminAllJobsCards from "../../Components/AdminPagesComponents/AdminAllJobsCards";

const AdminAllJobs = () => {
  const navigate = useNavigate();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); // Redirect to admin-login page if not authenticated
    return;
  }

  const userName = decodedToken ? decodedToken.name : "No Name Found";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token found, redirect to admin-login page
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to admin-login page
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  }, [decodedToken]);

  

  return (
    <div className="bg-white  ">
      {/* <AdminNav /> */}
      <AdminAllJobsCards />
      {/* <AdminFooter /> */}


    
    </div>
  );
};

export default AdminAllJobs;
