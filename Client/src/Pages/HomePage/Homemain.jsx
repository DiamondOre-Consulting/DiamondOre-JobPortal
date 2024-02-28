import React, { useState,useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PathSearch from './PathSearch'
import JobsReviews from './JobsReviews'
import StatsPartners from './StatsPartners'
import HeroNav from './HeroNav'
import axios from "axios";
import Chatboot from './Chatboot'
import CvSection from './CvSection'

const Homemain = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  useEffect(() => {
      const fetchLatestJobs = async () => {
        try {
         
          // Fetch associates data from the backend
          const response = await axios.get(
            "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-jobs"
          );
          console.log(response.data);
          const all = response.data;
          const filteredJobs = all.filter(job => job.JobStatus === true);
          const latest = filteredJobs.slice(-3).reverse();
          // console.log(latestJobs);
          setLatestJobs(latest);
          console.log(latest);
        } catch (error) {
          console.error("Error fetching associates:", error);
          // Handle error and show appropriate message
        }
      };
  
      fetchLatestJobs();
    }, []);
  return (
    <div>
      <Navbar/>
      <HeroNav/>
      <StatsPartners/>
      <PathSearch latestJobs={latestJobs}/>
      <CvSection/>
      <JobsReviews/>
      <Footer/>
      <Chatboot/>
    </div>
  )
}

export default Homemain

