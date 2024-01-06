import React from 'react'
import CandidateNav from './CandidateNav'
import SideMenu from './SideMenu'
import JobsData from './JobsData'

const CandidateHome = () => {
  return (
    <div>
      <CandidateNav/>
      <div className='flex'>
        <SideMenu/>
        <JobsData/>
      </div>
      
    </div>
  )
}

export default CandidateHome
