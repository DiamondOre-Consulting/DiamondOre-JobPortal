import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useJwt } from 'react-jwt'
import AdminNav from '../../Components/AdminPagesComponents/AdminNav'
import JobsWithMostApplicants from '../../Components/AdminPagesComponents/JobsWithMostApplicants'
import NewlyAddedCandidates from '../../Components/AdminPagesComponents/NewlyAddedCandidates'
import AdminFooter from '../../Components/AdminPagesComponents/AdminFooter'

const AdminDashboard = () => {
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
      }, [decodedToken])
      
  return (
    <div className='bg-white'>
        {/* <AdminNav /> */}
        <h2 className='text-2xl md:text-5xl px-2 md:px-10 font-bold text-gray-800'>Welcome aboard, <span className='text-blue-900'>{userName}</span></h2>
        <JobsWithMostApplicants />
        <NewlyAddedCandidates />
       
    </div>
  )
}

export default AdminDashboard