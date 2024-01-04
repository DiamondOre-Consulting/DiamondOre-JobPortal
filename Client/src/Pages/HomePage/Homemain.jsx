import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PathSearch from './PathSearch'
import JobsReviews from './JobsReviews'
import StatsPartners from './StatsPartners'
import HeroNav from './HeroNav'

const Homemain = () => {
  return (
    <div>
      <Navbar/>
      <HeroNav/>
      <StatsPartners/>
      <PathSearch/>
      <JobsReviews/>
      <Footer/>
    </div>
  )
}

export default Homemain

