import React from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateNav from '../../Components/CandidatePagesComponents/CandidateNav'
import CandidateFooter from '../../Components/CandidatePagesComponents/CandidateFooter'
import CandidateAllJobsCards from '../../Components/CandidatePagesComponents/CandidateAllJobsCards'

const CandidateAllJobs = () => {
  const navigate = useNavigate();

  
  return (
    <div className='bg-white mx-5'>
      <CandidateNav/>
      {/* <h2 className='text-5xl px-10 font-bold text-gray-800'>Welcome aboard, <span className='text-blue-900'>Name</span></h2> */}
      <CandidateAllJobsCards />
      {/* <HomeChannelwise /> */}
      <CandidateFooter/>
    </div>
  )
}

export default CandidateAllJobs;
