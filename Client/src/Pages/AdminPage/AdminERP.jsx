import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useJwt } from 'react-jwt'
import AdminNav from '../../Components/AdminPagesComponents/AdminNav'
import AdminFooter from '../../Components/AdminPagesComponents/AdminFooter'

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
      }, [decodedToken])
  return (
    <div className='bg-white mx-5'>
        <AdminNav />
        <h1 className='text-5xl text-center text-blue-950 font-bold'>Main Content</h1>
        <AdminFooter />
    </div>
  )
}

export default AdminERP