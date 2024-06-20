import React from 'react'
import Navbar from './Navbar'
import aboutimg from '../../assets/aboutusimg.png'
import potrait from '../../assets/potrait.png'
import Footer from './Footer'
import service1 from '../../assets/service1.png'
import service2 from '../../assets/service2.png'
import service3 from '../../assets/service3.png'



const Services = () => {
    return (
        <div>

            <Navbar />
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-2 mt-16'>
                <div><img src={service2}/></div>
                <div><img src={service3} /></div>
                <div className="hidden lg:block sm:hidden"><img src={service1} alt="Service 1"/></div>
            </div>

            <div  className="bg-white py-6 sm:py-8 lg:py-12">
                <div  className="mx-auto max-w-screen-2xl px-4 md:px-8">

                    <div  className="mb-10 md:mb-16">
                        <h2  className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl ">Our Services</h2>

                        <p  className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Empowering success through tailored management consulting, financial guidance, and innovative IT solutions, we elevate your journey towards excellence</p>
                    </div>


                    <div  className="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">

                        <a  href='https://www.referbiz.in/' target='_blank' className="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div  className="p-4 md:p-6">
                                <h3  className="mb-2 text-lg font-semibold md:text-xl">Management Consulting</h3>
                                <p  className="text-gray-200 text-sm">Unlock your business potential with our focused management consulting. Our proven strategies streamline operations, drive efficiency, and propel your organization towards sustainable growth. Trust our experts to navigate challenges and seize opportunities for lasting success</p>
                            </div>
                        </a>

                        <a  href='https://www.referbiz.in/' target='_blank' className="flex divide-x rounded-lg border bg-white text-black shadow-lg">
                            <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div  className="p-4 md:p-6">
                                <h3  className="mb-2 text-lg font-semibold md:text-xl">Mutual Funds - Midas</h3>
                                <p  className="text-gray-800 text-sm">Elevate Your Wealth with Midaas Mutual Funds. Expertly crafted investment strategies tailored to your goals. Let Midaas guide you towards financial prosperity and peace of mind. Take control of your future with our proven track record of success.</p>
                            </div>
                        </a>

                        <a href='https://www.cvgenie.in/' target='_blank'  className="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div  className="p-4 md:p-6">
                                <h3  className="mb-2 text-lg font-semibold md:text-xl">Resume Building</h3>
                                <p  className="text-gray-200 text-sm">Elevate Your Career with CV-Genie. Our tailored CV services ensure your strengths shine, opening doors to new opportunities. Trust us to craft a standout resume that accelerates your professional journey.</p>
                            </div>
                        </a>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-2 mt-4'>

                      <a href='https://www.referbiz.in/' target='_blank' className="flex divide-x rounded-lg border bg-white shadow-lg ">
                            <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div  className="p-4 md:p-6">
                                <h3  className="mb-2 text-lg font-semibold md:text-xl">Real Estate</h3>
                                <p  className="text-gray-500">Discover Your Ideal Property Solutions with Our Real Estate Expertise. Whether you're buying, selling, or investing, our tailored approach ensures you navigate the market with confidence. From dream homes to lucrative investments, we turn your real estate aspirations into reality.</p>
                            </div>
                        </a>

                        <a  href='https://www.doclabz.com/' target='_blank' className="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div  className="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div  className="p-4 md:p-6">
                                <h3  className="mb-2 text-lg font-semibold md:text-xl">IT Services</h3>
                                <p  className="text-gray-200">Empower Your Business with Expert IT Services. We specialize in creating dynamic websites that captivate your audience and drive growth. Our comprehensive approach ensures seamless integration and unparalleled user experiences. Trust DOC-Labz to elevate your online presence and propel your success in the digital landscape.</p>
                            </div>
                        </a>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Services