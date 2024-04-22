import React from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import cvimg from '../../assets/5.svg'
import { Link } from 'react-router-dom'

const Cvdashboard = () => {
    return (
        <div>
            <Navbar />
            <h1 className='text-2xl sm:text-2xl lg:text-3xl md:text-4xl font-serif text-center'>Create Your Own CV</h1>
            <div className='mx-auto w-28 h-1 bg-blue-950'></div>
            <div className=" py-6 sm:py-8 lg:py-18">
                <div className="mx-auto max-w-screen-xl px-4 md:px-8 bg-white shadow-xl rounded-md p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:grid-cols-1 md:gap-0 ">
                        <div className="flex flex-col items-center justify-cetner md:p-4">         
                          <img src='https://resume.reachmore.in/wp-content/uploads/2023/04/cv-1.png' className='w-1/2'/>
                         <Link to={'/cv-form'}><button className='text-cetner bg-blue-950 rounded-md text-white p-2 mt-4'>Create Your Free CV</button></Link> 
                        </div>
                        <div className="flex flex-col items-center md:p-4 ">
                        <img src='https://resume.reachmore.in/wp-content/uploads/elementor/thumbs/content-q5o0plnhjih7vuukntguq16uqn83zcmrbuh4zzltoo.webp' className='w-1/2'/>
                          <a href='https://www.cvgenie.in/' target='_blank'><button className='text-cetner p-2 bg-blue-950 rounded-md text-white mt-4'>Create a premium CV</button></a>                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Cvdashboard