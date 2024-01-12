import React, {useEffect} from 'react'
import { useJwt } from "react-jwt";
import { useNavigate } from 'react-router-dom'
import CandidateNav from '../../Components/CandidatePagesComponents/CandidateNav'
import CandidateFooter from '../../Components/CandidatePagesComponents/CandidateFooter'
import CandidateAllAppliedJobsCards from '../../Components/CandidatePagesComponents/CandidateAllAppliedJobsCards'

const AllAppliedJobs = () => {
  const navigate = useNavigate();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not authenticated
      return;
    }

    const userName = decodedToken ? decodedToken.name : "No Name Found";

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login page
        navigate("/login");
      } else {
        const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds
  
        if (tokenExpiration && tokenExpiration < Date.now()) {
          // Token expired, remove from local storage and redirect to login page
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }, [decodedToken])

  return (
    <div className='bg-white mx-5'>
      <CandidateNav/>
      <CandidateAllAppliedJobsCards />
      <CandidateFooter/>
    </div>
  )
}

export default AllAppliedJobs;
