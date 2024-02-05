import React from 'react'
import { Link } from 'react-router-dom'

const PathSearch = ({ latestJobs }) => {

    return (
        <div>
            <div className="bg-white py-4 sm:py-6 lg:py-8">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <div className="mb-10 md:mb-16">
                        <h2 className="mb-4 text-center text-2xl font-bold text-black md:mb-6 lg:text-3xl font-serif sm:p-3"><span className='text-7xl text-blue-950'>4</span> Step Easy Process</h2>

                        <p className="mx-auto max-w-screen-md text-center text-black md:text-lg" style={{ fontFamily: "'Roboto', sans-serif" }}>Navigate our job portal seamlessly in 4 steps: Explore opportunities, tailor your profile, apply effortlessly, and embark on your career journey with ease.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 xl:grid-cols-4 xl:gap-8">


                        <div className="flex flex-col overflow-hidden rounded-lg  bg-blue-900 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">

                            <div className=' border-1 bg-white text-black w-10 p-2 text-center rounded-full m-2'>1</div>
                            <svg className="mt-8 mx-auto" width="64px" height="64px" viewBox="-3.6 -3.6 31.20 31.20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"><rect x="-3.6" y="-3.6" width="31.20" height="31.20" rx="15.6" fill="#FFFFFF" strokeWidth="0"></rect></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#1C274C"></path> <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#1C274C"></path> <path fillRule="evenodd" clipRule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z" fill="#1C274C"></path> </g></svg>
                            <div className="flex flex-1 flex-col py-4 px-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-white">
                                    <p className="transition duration-100 text-white font-serif">Register your Account</p>
                                    <div className='w-24 bg-gray-400 h-0.5 hover:w-48 mb-2 transition-width duration-300'></div>
                                </h2>

                                <p className="mb-8 text-gray-200 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Unlock a world of opportunities and seamless access by creating your account today. Join our community and experience the benefits of being part of.</p>

                            </div>

                        </div>

                        <div className="flex flex-col overflow-hidden rounded-lg bg-blue-900 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">
                            <div className=' border-1 bg-white text-black w-10 p-2 text-center rounded-full m-2'>2</div>

                            <svg
                                width="64px"
                                height="64px"
                                fill="#000000"
                                viewBox="-3.6 -3.6 31.20 31.20"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mt-8 mx-auto icon flat-line"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-3.6" y="-3.6" width="31.20" height="31.20" rx="15.6" fill="#FFFFFF" strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <rect
                                        id="secondary"
                                        x="5"
                                        y="5"
                                        width="14"
                                        height="18"
                                        rx="1"
                                        transform="translate(26 2) rotate(90)"
                                        style={{ fill: '#247c8a', strokeWidth: 2 }}
                                    ></rect>
                                    <path
                                        id="primary"
                                        d="M16,7H8V4A1,1,0,0,1,9,3h6a1,1,0,0,1,1,1Zm1,4H7m8,0v2m6,7V8a1,1,0,0,0-1-1H4A1,1,0,0,0,3,8V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20Z"
                                        style={{
                                            fill: 'none',
                                            stroke: '#1C274C',
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round',
                                            strokeWidth: 2,
                                        }}
                                    ></path>
                                </g>
                            </svg>

                            <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-white">
                                    <p className="transition duration-100 text-white font-serif">Search for your Job</p>
                                    <div className='w-24 bg-gray-400 h-0.5 mb-2 hover:w-48 transition-width duration-300'></div>
                                </h2>

                                <p className="mb-8 text-gray-200 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Our platform simplifies the job-hunting process, offering a seamless experience to navigate through diverse roles.Take control of your professional destiny by exploring a wide array of job listings at your fingertips</p>

                            </div>
                        </div>



                        <div className="flex flex-col overflow-hidden rounded-lg bg-blue-900 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">
                            <div className=' border-1 bg-white text-black w-10 p-2 text-center rounded-full m-2'>3</div>
                            <svg
                                className="mt-8 mx-auto"
                                width="64px"
                                height="64px"
                                viewBox="-7.5 -7.5 65.00 65.00"
                                id="Message_And_Communication_Icons"
                                version="1.1"
                                xmlSpace="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                fill="#000000"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-7.5" y="-7.5" width="65.00" height="65.00" rx="32.5" fill="#FFFFFF" strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <g>
                                            <path
                                                d="M5.8,14.3v19.3h38.3V14.3H5.8z M28.7,21.4c0.1-0.3,0.2-0.6,0.4-0.9l1,0.6c-0.1,0.2-0.2,0.4-0.3,0.6 c0,0.1,0,0.1,0,0.2l-1.2-0.2C28.6,21.6,28.7,21.5,28.7,21.4z M29.8,22.7c0.1,0.6,0.3,1.1,0.7,1.4c0.2,0.2,0.3,0.3,0.5,0.4l-0.6,1 c-0.3-0.2-0.5-0.4-0.8-0.6c-0.6-0.6-0.9-1.3-1.1-2.1L29.8,22.7z M36.7,26.6c-1.9,1.9-5,1.9-6.9,0.1l0.1,0.1H11.4v-1h-1v-4.1h16.9 l-0.2,1l2.3,3.6c1.7,0.5,3.6,0,4.9-1.3c1.9-1.9,2-4.8,0.3-6.8c0.7,0.2,1.4,0.6,2,1.2C38.7,21.5,38.7,24.7,36.7,26.6z"
                                                style={{ fill: '#247c8a' }}
                                            ></path>
                                            <g>
                                                <rect height="1.2" style={{ fill: '#1C274C' }} width="1.5" x="24.2" y="12.7"></rect>
                                            </g>
                                            <g>
                                                <polygon
                                                    points="44.8,34.9 43.6,34.9 43.6,12.2 6.4,12.2 6.4,34.9 5.2,34.9 5.2,11 44.8,11 "
                                                    style={{ fill: '#1C274C' }}
                                                ></polygon>
                                            </g>
                                            <g>
                                                <path
                                                    d="M44.7,39H5.3c-1.2,0-2.1-1-2.1-2.1v-2.5h19v1.2l5.7,0l0-1.3h19v2.5C46.9,38,45.9,39,44.7,39z M4.3,35.5v1.3c0,0.5,0.4,0.9,0.9,0.9h39.5c0.5,0,0.9-0.4,0.9-0.9v-1.3l-16.6,0c0,0.7-0.6,1.2-1.2,1.2h-5.7 c-0.7,0-1.2-0.6-1.2-1.2v0H4.3z"
                                                    style={{ fill: '#1C274C' }}
                                                ></path>
                                            </g>
                                        </g>
                                        <g>
                                            <path
                                                d="M32.4,27.9c-1.4,0-2.9-0.5-4-1.6c-2.2-2.2-2.2-5.8,0-8c2.2-2.2,5.8-2.2,8,0v0c0,0,0,0,0,0 c1.1,1.1,1.6,2.5,1.6,4c0,1.5-0.6,2.9-1.6,4C35.3,27.4,33.8,27.9,32.4,27.9z M32.4,17.9c-1.1,0-2.3,0.4-3.1,1.3 c-1.7,1.7-1.7,4.5,0,6.3c1.7,1.7,4.5,1.7,6.3,0c0.8-0.8,1.3-1.9,1.3-3.1c0-1.2-0.5-2.3-1.3-3.1v0C34.6,18.3,33.5,17.9,32.4,17.9 z"
                                                style={{ fill: '#1C274C' }}
                                            ></path>
                                        </g>
                                        <g>
                                            <rect
                                                height="1.2"
                                                style={{ fill: '#1C274C' }}
                                                transform="matrix(0.7071 0.7071 -0.7071 0.7071 31.3967 -18.896)"
                                                width="7.3"
                                                x="34.9"
                                                y="27.9"
                                            ></rect>
                                        </g>
                                        <g>
                                            <polygon
                                                points="28.8,26.5 9.8,26.5 9.8,21.2 27.3,21.2 27.3,22.4 11,22.4 11,25.3 28.8,25.3 "
                                                style={{ fill: '#1C274C' }}
                                            ></polygon>
                                        </g>
                                        <g>
                                            <circle cx="12.6" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                        <g>
                                            <circle cx="14.3" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                        <g>
                                            <circle cx="16" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                        <g>
                                            <circle cx="17.7" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                        <g>
                                            <circle cx="19.4" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                        <g>
                                            <circle cx="21.1" cy="23.8" r="0.5" style={{ fill: '#247c8a' }}></circle>
                                        </g>
                                    </g>
                                </g>
                            </svg>

                            <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-white">
                                    <p className="transition duration-100 text-white font-serif">Click On Apply Button</p>
                                    <div className='w-24 bg-gray-400 h-0.5 hover:w-48 mb-2 transition-width duration-300'></div>
                                </h2>

                                <p className="mb-6 text-gray-200 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Embark on a journey towards your dream career by submitting your application today. This is your opportunity to showcase your skills and passion, aligning with the vision of your ideal job</p>

                            </div>
                        </div>



                        <div className="flex flex-col overflow-hidden rounded-lg bg-blue-900 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">
                            <div className=' border-1 bg-white text-black w-10 p-2 text-center rounded-full m-2'>4</div>
                            <svg
                                className="mt-8 mx-auto"
                                width="64px"
                                height="64px"
                                viewBox="-3.6 -3.6 31.20 31.20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-3.6" y="-3.6" width="31.20" height="31.20" rx="15.6" fill="#FFFFFF" strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        opacity="0.5"
                                        d="M22 15.9998V14.9998C22 12.1714 21.9998 10.7576 21.1211 9.87891C20.2424 9.00023 18.8282 9.00023 15.9998 9.00023H7.99977C5.17135 9.00023 3.75713 9.00023 2.87845 9.87891C2 10.7574 2 12.1706 2 14.9976V14.9998V15.9998C2 18.8282 2 20.2424 2.87868 21.1211C3.75736 21.9998 5.17157 21.9998 8 21.9998H16H16C18.8284 21.9998 20.2426 21.9998 21.1213 21.1211C22 20.2424 22 18.8282 22 15.9998Z"
                                        fill="#1C274C"
                                    ></path>
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 4.02744L14.4306 5.98809C14.7001 6.30259 15.1736 6.33901 15.4881 6.06944C15.8026 5.79988 15.839 5.3264 15.5695 5.01191L12.5695 1.51191C12.427 1.34567 12.219 1.25 12 1.25C11.7811 1.25 11.5731 1.34567 11.4306 1.51191L8.43057 5.01191C8.161 5.3264 8.19743 5.79988 8.51192 6.06944C8.82641 6.33901 9.29989 6.30259 9.56946 5.98809L11.25 4.02744L11.25 15C11.25 15.4142 11.5858 15.75 12 15.75Z"
                                        fill="#1C274C"
                                    ></path>
                                </g>
                            </svg>

                            <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-white">
                                    <p className="transition duration-100 text-white font-serif">Get your job</p>
                                    <div className='w-24 bg-gray-400 h-0.5 mb-2 hover:w-48 transition-width duration-300'></div>
                                </h2>

                                <p className="mb-8 text-gray-200 text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>We understand the importance of finding the right career path, and we're here to help you every step of the way. Explore exciting opportunities, unleash your potential, and embark on a fulfilling professional journey.</p>

                            </div>
                        </div>

                    </div>
                </div>
            </div>



            <div className="bg-white py-6 sm:py-8 lg:py-12">
                <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                    <div className="mb-10 md:mb-16">
                        <h2 className="mb-4 text-center text-2xl font-bold text-black md:mb-6 lg:text-3xl font-serif">
                            Explore jobs
                        </h2>

                        <p className="mx-auto max-w-screen-md text-center text-black md:text-lg " style={{ fontFamily: "'Roboto', sans-serif" }}>

                            Embark on a journey of possibilities and discover your dream career with us. Explore exciting job opportunities tailored to your skills and aspirations.
                       
                        </p>
                    </div>



                    <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 xl:grid-cols-4 xl:gap-8">

                        {latestJobs.map((latestJob) => (
                            <div className="flex flex-col overflow-hidden rounded-lg bg-blue-900 p-4 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">
                                <div className="flex flex-1 flex-col py-4 ">
                                    <div className="mb-2 text-lg font-bold text-white text-left  font-serif ">{latestJob?.JobTitle}</div>

                                    <div className="mb-2 text-lg font-normal text-gray-200 text-left"style={{ fontFamily: "'Roboto', sans-serif" }}>Industry:- {latestJob?.Industry}</div>

                                    <div className="mb-2 text-lg font-normal text-gray-200 text-left"style={{ fontFamily: "'Roboto', sans-serif" }}>Channels:- {latestJob?.Channel}</div>

                                    <div className="mb-2 text-lg font-normal text-gray-200 text-left"style={{ fontFamily: "'Roboto', sans-serif" }}>Experience:- {latestJob?.MinExperience}</div>

                                   <Link to={'all-jobs/:id'}> <button className="px-4 py-2 bg-blue-950 text-gray-200 rounded-md hover:bg-white hover:text-black ">
                                        Know More
                                    </button> </Link>
                                </div>
                            </div>


                        ))}



                        <div className="flex flex-col overflow-hidden rounded-lg bg-blue-900 hover:bg-blue-950 shadow-lg shadow-gray-800 hover:shadow-2xl shadow-gray-900">
                            <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6">
                                <h2 className="mb-2 text-2xl font-semibold text-gray-200">

                                    <Link to={'/all-jobs'}
                                        className="transition duration-100 "
                                    >
                                        And many more...
                                    </Link>


                                </h2>
                                <p className="rounded-md bg-blue-950 cursor-pointer px-2 py-1 text-sm font-semibold text-gray-200 ">
                                    <svg className="w-6 h-6  mx-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default PathSearch
