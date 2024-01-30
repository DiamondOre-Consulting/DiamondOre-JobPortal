import React, { useState,useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PathSearch from './PathSearch'
import JobsReviews from './JobsReviews'
import StatsPartners from './StatsPartners'
import HeroNav from './HeroNav'
import axios from "axios";

const Homemain = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  useEffect(() => {
      const fetchLatestJobs = async () => {
        try {
         
          // Fetch associates data from the backend
          const response = await axios.get(
            "http://localhost:5000/api/candidates/all-jobs"
          );
          console.log(response.data);
          const all = response.data;
          const latest = all.slice(-3);
          // console.log(latestJobs);
          setLatestJobs(latest.reverse());
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
      <JobsReviews/>
      <Footer/>
    </div>
  )
}

export default Homemain

