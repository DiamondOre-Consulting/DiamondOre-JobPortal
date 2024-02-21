import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import empimage from '../../assets/Asset.png'
import boy from '../../assets/Boyimage.jpg'
import rahulmathursir from '../../assets/20240201_105248.jpg'
import sakshimaam from '../../assets/sakshi maam.jpeg'
import neetumaam from '../../assets/neetu maam.jpeg'


const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <div className="h-96 sm:h-block md:h-96 lg:h-96 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${empimage})`, backgroundPosition: "top" }}>
                <div className=" inset-0 bg-black opacity-50"></div>
                <div className=" inset-0 flex items-center justify-center text-gray-900 text-center">
                    <div>
                        {/* <h1 className="text-3xl md:text-3xl lg:text-6xl font-bold  ">Diamond Ore Consulting Pvt Ltd</h1> */}

                    </div>
                </div>
            </div>

            <div>
                <h2 className='text-center  text-5xl font-bold mt-8'>About Us</h2>
                <div className="container  mx-auto my-10 p-8  justify-between grid grid-cols-1 md:grid-cols-2 gap-8 flex items-center ">
                    <div className='bg-blue-950 p-8 text-white hover:bg-white hover:text-black border-blue-950 shadow-2xl shadow-blue-950'>
                        <p className="mb-4">
                            We are a 20 people strong company with an extensive network and databases of sales force which enables us to recruit people in a 24 to a 48hours notice using our internal database and AI tools. Our specialization is working in the BFSI space for sales force hiring. But we can still provide ‘feet on street’ profiles to all the industries wherever there is a product or service is being sold, because we have a database of about 30,000 people which we can skim from.
                        </p>

                    </div>


                    <div className='bg-white p-8 text-black hover:bg-blue-950 hover:text-white shadow-2xl cursor-pointer hover:shadow-blue-950'>
                        <p className="mb-4">

                            We benefit from the diversity of India and the languages spoken and we have got specialists from all parts of India which help in making the searches very accurate and also to get references from the local population.
                            <p> We can cater to sales force and IT needs of all sectors because we have cross industry salespeople, moving from industries like insurance to real estate and from real estate to BFSI etc.</p>

                        </p>
                    </div>


                </div>

            </div>

            <section class="bg-blue-950 text-white">
                <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div class="mx-auto max-w-lg text-center">
                        <h2 class="text-3xl font-bold sm:text-4xl ">Our Features</h2>

                        <p class="mt-4 text-gray-300">
                        Unleash the power of our job portal with key features designed to revolutionize your hiring process. Experience advanced candidate matching, streamlined application tracking, personalized job alerts, and robust employer branding..
                        </p>
                    </div>

                    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                        <a
                            class="block rounded-xl border border-gray-800 shadow-lg bg-white text-black  p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg class="h-6 w-6 text-gray-900" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />  <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />  <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />  <line x1="11" y1="6" x2="20" y2="6" />  <line x1="11" y1="12" x2="20" y2="12" />  <line x1="11" y1="18" x2="20" y2="18" /></svg>

                            <h2 class="mt-4 text-xl font-bold text-black ">High Job Listing</h2>

                            <p class="mt-1 text-sm text-black">
                                Display detailed job listings with information such as job title, description, requirements, and application instructions.
                            </p>
                        </a>

                        <a
                            class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg class="h-6 w-6 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="6" x2="20" y2="6" />  <line x1="4" y1="18" x2="9" y2="18" />  <path d="M4 12h13a3 3 0 0 1 0 6h-4l2 -2m0 4l-2 -2" /></svg>


                            <h2 class="mt-4 text-xl font-bold text-white">Easy Process</h2>

                            <p class="mt-1 text-sm text-gray-300">
                                Simplified Job Search: Enjoy the simplicity of finding your ideal job with our easy-to-use search and filtering options. Your next career move is just a few clicks away.
                            </p>
                        </a>

                        <a
                            class="block rounded-xl border border-gray-800 shadow-lg p-8 shadow-xl bg-white text-black transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg class="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>


                            <h2 class="mt-4 text-xl font-bold  text-black">Constent Touch With Hr.</h2>

                            <p class="mt-1 text-sm  text-black">
                                Our platform keeps you in constant touch with HR representatives, ensuring you're informed at every step. Receive updates, feedback, and communicate seamlessly for a more personalized job application experience.
                            </p>
                        </a>






                    </div>

                    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                        <a
                            class="block rounded-xl border border-gray-800 shadow-lg bg-white text-black  p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg class="h-6 w-6 text-gray-900" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />  <line x1="12" y1="12" x2="12" y2="12.01" />  <line x1="8" y1="12" x2="8" y2="12.01" />  <line x1="16" y1="12" x2="16" y2="12.01" /></svg>

                            <h2 class="mt-4 text-xl font-bold text-black ">Regular Notification</h2>

                            <p class="mt-1 text-sm text-black">
                                Tailor your job preferences and let our system work for you. Our regular notifications provide curated job recommendations based on your profile, making your job search efficient, effective, and hassle-free.
                            </p>
                        </a>

                        <a
                            class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>



                            <h2 class="mt-4 text-xl font-bold text-white">Shorten Hiring Process</h2>

                            <p class="mt-1 text-sm text-gray-300">
                            Unlock the power of swift talent acquisition through our Shorten Hiring Process feature, optimizing your hiring procedures for a quicker, more effective recruitment process.
                            </p>
                        </a>

                        <a
                            class="block rounded-xl border border-gray-800 shadow-lg p-8 shadow-xl bg-white text-black transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                           <svg class="h-8 w-8 text-gray-900"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M4 7v-1a2 2 0 0 1 2 -2h2" />  <path d="M4 17v1a2 2 0 0 0 2 2h2" />  <path d="M16 4h2a2 2 0 0 1 2 2v1" />  <path d="M16 20h2a2 2 0 0 0 2 -2v-1" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>


                            <h2 class="mt-4 text-xl font-bold  text-black">Advanced Candidate Screening.</h2>

                            <p class="mt-1 text-sm  text-black">
                            Enhance your hiring process with sophisticated candidate screening tools, leveraging advanced algorithms to analyze and match candidates with specific skills and qualifications crucial for BFS roles.
                            </p>
                        </a>






                    </div>
                </div>
            </section>

            <div class="bg-white py-6 sm:py-8 lg:py-12">
                <div class="mx-auto max-w-screen-xl px-4 md:px-8">

                    <div class="mb-10 md:mb-16">
                        <h2 class="mb-4 text-center text-2xl font-bold text-blue-950 md:mb-6 lg:text-3xl">Meet our Team</h2>

                        <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Our team is the heartbeat of innovation, embodying diversity, passion, and expertise. Together, we strive for greatness, turning challenges into opportunities..</p>
                    </div>


                    <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-8 lg:gap-y-12">

                        <div class="flex flex-col items-center">
                            <div class="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <img src="https://media.licdn.com/dms/image/C4E03AQEZ_yJc3ebHOA/profile-displayphoto-shrink_800_800/0/1607527021305?e=1712793600&v=beta&t=7yQCc4QFgHkH7bY0EGCIId5I7i7wGqdzA9ONANU3_UA" loading="lazy" alt="Photo by Radu Florin" class="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div class="text-center font-bold text-blue-950 md:text-lg">Utsav Mathur</div>

                                <div class="flex justify-center">
                                    <div class="flex gap-4">
                                        <p class="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Director</p>
                                        <a href="https://www.linkedin.com/in/utsav-mathur-38886780/" target="_blank" class="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div class="flex flex-col items-center">
                            <div class="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <img src={rahulmathursir} loading="lazy" alt="Photo by christian ferrer" class="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div class="text-center font-bold text-blue-950 md:text-lg">Rahul Mathur</div>
                                <div class="flex justify-center">
                                    <div class="flex gap-4">
                                        <p class="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Director</p>
                                        <a href="https://www.linkedin.com/in/rahul-mathur-69017516/" target="_blank" class="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div class="flex flex-col items-center">
                            <div class="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <img src={neetumaam} loading="lazy" alt="Photo by Ayo Ogunseinde" class="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div class="text-center font-bold text-blue-950 md:text-lg">Neetu singh tomar</div>
                                <div class="flex justify-center">
                                    <div class="flex gap-4">
                                        <p class="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Manager</p>
                                        <a href="https://www.linkedin.com/in/rahul-mathur-69017516/" target="_blank" class="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div class="flex flex-col items-center">
                            <div class="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <img src={sakshimaam} loading="lazy" alt="Photo by Midas Hofstra" class="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div class="text-center font-bold text-blue-950 md:text-lg">Sakshi Jha</div>
                                <div class="flex justify-center">
                                    <div class="flex gap-4">
                                        <p class="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Project Manager</p>
                                        <a href="https://www.linkedin.com/in/sakshi-jha-58861a225/" target="_blank" class="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg class="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto my-10 p-8  justify-between grid grid-cols-1 md:grid-cols-2 gap-x-32 flex items-center ">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold  text-blue-950 ">Utsav Mathur</h2>
                    <div className='bg-gray-950 w-48 h-0.5 rounded-lg mb-4'></div>
                    <p className="text-gray-700 mb-4">
                        He has graduated in Business Administration from Symbiosis Pune with a dual specialization in Marketing and International Business. 5+ years of experience in international markets like Middle East and South Asia working with a Singapore based Supply Chain major where he has taken responsibilities in vendor development, supply chain optimization, business development. Furthermore he has 3 years of experience in the recruitment space, focusing on channel development, internal talent acquisition, process implementation, following a system oriented approach driving numbers.
                    </p>
                    <p className="text-gray-700">
                        He is a cost accountant and an associate from Insurance Institute of India.
                        He has 27+ years of experience and has led large teams in the past.
                        His last two assignments have been in Birla Sun Life and Aviva Life as VP Sales, VP Strategic Initiatives.
                    </p>
                </div>


                <div className='w-auto'>
                    <img src="https://media.licdn.com/dms/image/C4E03AQEZ_yJc3ebHOA/profile-displayphoto-shrink_800_800/0/1607527021305?e=1712793600&v=beta&t=7yQCc4QFgHkH7bY0EGCIId5I7i7wGqdzA9ONANU3_UA" alt="Rounded" className="rounded-full shadow-md mb-2" />
                    <h2 className="text-sm md:text-xl font-bold  text-blue-950  text-center "> The Director</h2>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AboutUs