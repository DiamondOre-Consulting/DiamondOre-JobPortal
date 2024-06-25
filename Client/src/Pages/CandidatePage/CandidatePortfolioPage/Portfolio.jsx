import React from 'react'
import { PortfolioForm } from '../../../Components/CandidatePagesComponents/CandidatePortfolioComponent/PortfolioForm'
import PortfolioPreview from '../../../Components/CandidatePagesComponents/CandidatePortfolioComponent/PortfolioPreview'

const Portfolio = () => {
  return (
    
    <div className='bg-gray-50 min-h-screen overflow-y-auto'>
        <div className='grid grid-cols-3 gap-10 px-10'>
            <div className='col-span-1 border'><PortfolioForm/></div>
            <div className='col-span-2 border'><PortfolioPreview/></div>
        
        
        </div>
        
    
    </div>
  )
}

export default Portfolio