import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Termsofservices = () => {
    return (
        <div>
            <Navbar />
            <div className='mt-24'>
                <div className='flex justify-center items-center'> <h1 className='text-center text-3xl font-bold text-blue-950'>Terms Of Services</h1><svg  className="h-16 w-16 text-blue-900" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />  <rect x="9" y="3" width="6" height="4" rx="2" />  <path d="M9 14l2 2l4 -4" /></svg></div>
                <div className='w-36 bg-blue-950 items-center h-1 text-cetner mx-auto border rounded '></div>
            </div>
        
            <div  className="grid gap-4 sm:grid-cols-1 md:gap-8 xl:grid-cols-1 px-8 sm:px-2 xl:px-12 mt-8">
                <div  className="flex divide-x rounded-lg border bg-gray-50 text-white shadow-lg shadow-gray-800">
                    <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                        <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div  className="p-4 md:p-6">
                        <h3  className="mb-2 text-lg font-semibold md:text-xl text-gray-700">Services</h3>
                        <p  className="text-gray-700 text-sm">Unlock your business potential with our focused management consulting. Our proven strategies streamline operations, drive efficiency, and propel your organization towards sustainable growth. Trust our experts to navigate challenges and seize opportunities for lasting successUnlock your business potential with our focused management consulting. Our proven strategies streamline operations, drive efficiency, and propel your organization towards sustainable growth. Trust our experts to navigate challenges and seize opportunities for lasting success</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Termsofservices