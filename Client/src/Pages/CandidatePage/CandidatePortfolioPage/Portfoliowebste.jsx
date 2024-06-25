import React from 'react';
import Hero from '../../../Components/CandidatePagesComponents/CandidatePortfolioComponent/PortfolioWebsitescomponents/Hero';
import About from '../../../Components/CandidatePagesComponents/CandidatePortfolioComponent/PortfolioWebsitescomponents/About';

const Portfoliowebsite = () => {
  return (
    <div className='flex '>
      {/* Left side background */}
      <div className='bg-bgcolor w-1/2 h-full fixed top-0 left-0'></div>
      
      {/* Right side background */}
      <div className='bg-white w-1/2 h-full fixed top-0 right-0'></div>
      
      {/* Content area */}
      <div className=' flex flex-col mx-auto'>
      <div className=''>
        <Hero />
      </div>
      <div className=''>
        <About />
      </div>

      </div>
    </div>
  );
}

export default Portfoliowebsite;
