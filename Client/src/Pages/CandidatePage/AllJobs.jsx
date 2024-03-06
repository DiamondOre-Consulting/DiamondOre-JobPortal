import React, {useEffect} from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useLocation } from 'react-router-dom'
import CandidateNav from '../../Components/CandidatePagesComponents/CandidateNav'
import CandidateFooter from '../../Components/CandidatePagesComponents/CandidateFooter'
import CandidateAllJobsCards from '../../Components/CandidatePagesComponents/CandidateAllJobsCards'
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';

const CandidateAllJobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { decodedToken } = useJwt(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token found, redirect to login page, except for the All Jobs page
      if (!location.pathname.includes('/all-jobs')) {
        navigate('/login');
      }
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [decodedToken, navigate, location]);


  return (
    <div className='bg-white '>
      {decodedToken ? <CandidateNav /> :<Navbar/>}
      {/* <h2 className='text-5xl px-10 font-bold text-gray-800'>Welcome aboard, <span className='text-blue-900'>Name</span></h2> */}
      <CandidateAllJobsCards />
      {/* <HomeChannelwise /> */}
      {decodedToken ? <CandidateFooter/>:<Footer/>}
      
    </div>
  )
}

export default CandidateAllJobs;
