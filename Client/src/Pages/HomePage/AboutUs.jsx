import React, { useEffect, useState, useRef } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import aboutimg from '../../assets/aboutusimg.png'
import boy from '../../assets/Boyimage.jpg'
import rahulmathursir from '../../assets/20240201_105248.jpg'
import sakshimaam from '../../assets/sakshi maam.jpg'
import neetumaam from '../../assets/neetu maam.jpeg'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import utsavmathur from '..//../assets/Utsav Mathurr.jpg'
import axios from 'axios'



const AboutUs = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showsubmitloader, setShowSubmitLoader] = useState(false);
    const badgeRef = useRef(null);
    const [popup, setPopUp] = useState(false)

    const submitCallReq = async (e) => {
        e.preventDefault();
        setShowSubmitLoader(true);
        console.log("details of the person ", name, phone);
        // const payload = { name, phone };

        try {
            const response = await axios.post('https://api.diamondore.in/api/candidates/request-call', {
                name, phone
            });

            if (response.status === 200) {
                // Handle successful form submission (e.g., show a success message, close the popup)
                // alert('Form submitted successfully!');
                setShowSubmitLoader(false);
                closePopup();
                setPopUp(true);
            } else {
                // Handle form submission error
                alert('Failed to submit the form');
                setShowSubmitLoader(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error.message);
            alert('An error occurred while submitting the form');
            setShowSubmitLoader(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const badgePosition = scrollPercentage * (window.innerHeight - badgeRef.current.offsetHeight);
            badgeRef.current.style.top = `${badgePosition}px`;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div>
            <Navbar />
            <div className="h-96 sm:h-44 md:h-96 lg:h-96 bg-cover bg-center overflow-hidden mt-10" style={{ backgroundImage: `url(${aboutimg})`, backgroundPosition: "top" }}>
                <div className=" inset-0 bg-black opacity-50"></div>
                <div className=" inset-0 flex items-center justify-center text-gray-900 text-center">
                    <div>
                        {/* <h1 className="text-3xl md:text-3xl lg:text-6xl font-bold  ">About Us</h1> */}

                    </div>
                </div>
            </div>


            <div>
                <h2 className='text-center  text-5xl font-bold mt-8'>About Us</h2>
                <div className="container  mx-auto my-10 p-8  justify-between grid grid-cols-1 md:grid-cols-2 gap-8 flex items-center ">
                    <div className='bg-blue-950 p-8 text-white hover:bg-white hover:text-black border-blue-950 shadow-2xl shadow-blue-950'>
                        <p className="mb-4">
                            We are  100+ people strong company with an extensive network and databases of sales force which enables us to recruit people in a 24 to a 48hours notice using our internal database and AI tools. Our specialization is working in the BFSI space for sales force hiring. But we can still provide ‘feet on street’ profiles to all the industries wherever there is a product or service is being sold, because we have a database of about 30,000 people which we can skim from.
                        </p>

                    </div>


                    <div className='mb-4 bg-white p-8 text-black hover:bg-blue-950 hover:text-white shadow-2xl cursor-pointer hover:shadow-blue-950'>

                        <p> We benefit from the diversity of India and the languages spoken and we have got specialists from all parts of India which help in making the searches very accurate and also to get references from the local population.</p>
                        <p> We can cater to sales force and IT needs of all sectors because we have cross industry salespeople, moving from industries like insurance to real estate and from real estate to BFSI etc.</p>


                    </div>


                </div>

            </div>

            <section className="bg-blue-950 text-white">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-lg text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl ">Our Features</h2>

                        <p className="mt-4 text-gray-300">
                            Unleash the power of our job portal with key features designed to revolutionize your hiring process. Experience advanced candidate matching, streamlined application tracking, personalized job alerts, and robust employer branding..
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                        <a
                            className="block rounded-xl border border-gray-800 shadow-lg bg-white text-black  p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-6 w-6 text-gray-900" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />  <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />  <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />  <line x1="11" y1="6" x2="20" y2="6" />  <line x1="11" y1="12" x2="20" y2="12" />  <line x1="11" y1="18" x2="20" y2="18" /></svg>

                            <h2 className="mt-4 text-xl font-bold text-black ">High Job Listing</h2>

                            <p className="mt-1 text-sm text-black">
                                Display detailed job listings with information such as job title, description, requirements, and application instructions.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-6 w-6 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="6" x2="20" y2="6" />  <line x1="4" y1="18" x2="9" y2="18" />  <path d="M4 12h13a3 3 0 0 1 0 6h-4l2 -2m0 4l-2 -2" /></svg>


                            <h2 className="mt-4 text-xl font-bold text-white">Easy Process</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Simplified Job Search: Enjoy the simplicity of finding your ideal job with our easy-to-use search and filtering options. Your next career move is just a few clicks away.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 shadow-lg p-8 shadow-xl bg-white text-black transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>


                            <h2 className="mt-4 text-xl font-bold  text-black">Constant Touch With HR</h2>

                            <p className="mt-1 text-sm  text-black">
                                Our platform keeps you in constant touch with HR representatives, ensuring you're informed at every step. Receive updates, feedback, and communicate seamlessly for a more personalized job application experience.
                            </p>
                        </a>






                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                        <a
                            className="block rounded-xl border border-gray-800 shadow-lg bg-white text-black  p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-6 w-6 text-gray-900" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />  <line x1="12" y1="12" x2="12" y2="12.01" />  <line x1="8" y1="12" x2="8" y2="12.01" />  <line x1="16" y1="12" x2="16" y2="12.01" /></svg>

                            <h2 className="mt-4 text-xl font-bold text-black ">Regular Notification</h2>

                            <p className="mt-1 text-sm text-black">
                                Tailor your job preferences and let our system work for you. Our regular notifications provide curated job recommendations based on your profile, making your job search efficient, effective, and hassle-free.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>



                            <h2 className="mt-4 text-xl font-bold text-white">Shorten Hiring Process</h2>

                            <p className="mt-1 text-sm text-gray-300">
                                Unlock the power of swift talent acquisition through our Shorten Hiring Process feature, optimizing your hiring procedures for a quicker, more effective recruitment process.
                            </p>
                        </a>

                        <a
                            className="block rounded-xl border border-gray-800 shadow-lg p-8 shadow-xl bg-white text-black transition hover:border-white-500/10 hover:shadow-white-500/10"

                        >
                            <svg className="h-8 w-8 text-gray-900" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 7v-1a2 2 0 0 1 2 -2h2" />  <path d="M4 17v1a2 2 0 0 0 2 2h2" />  <path d="M16 4h2a2 2 0 0 1 2 2v1" />  <path d="M16 20h2a2 2 0 0 0 2 -2v-1" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>


                            <h2 className="mt-4 text-xl font-bold  text-black">Advanced Candidate Screening</h2>

                            <p className="mt-1 text-sm  text-black">
                                Enhance your hiring process with sophisticated candidate screening tools, leveraging advanced algorithms to analyze and match candidates with specific skills and qualifications crucial for BFS roles.
                            </p>
                        </a>






                    </div>
                </div>
            </section>

            <div className="bg-white py-6 sm:py-8 lg:py-12" id='ourteam'>
                <div className="mx-auto max-w-screen-xl px-4 md:px-8">

                    <div className="mb-10 md:mb-16">
                        <h2 className="mb-4 text-center text-2xl font-bold text-blue-950 md:mb-6 lg:text-3xl">Meet our Team</h2>

                        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Our team is the heartbeat of innovation, embodying diversity, passion, and expertise. Together, we strive for greatness, turning challenges into opportunities..</p>
                    </div>


                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-8 lg:gap-y-12">

                        <div className="flex flex-col items-center">
                            <div className="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <LazyLoadImage src={utsavmathur} loading="lazy" effect="blur" alt="Photo by Radu Florin" className="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div className="text-center font-bold text-blue-950 md:text-lg">Utsav Mathur</div>

                                <div className="flex justify-center">
                                    <div className="flex gap-4">
                                        <p className="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Director</p>
                                        <a href='https://www.linkedin.com/in/utsav-mathur-38886780/' target="_blank" className="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div className="flex flex-col items-center">
                            <div className="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <LazyLoadImage src={rahulmathursir} loading="lazy" effect="blur" alt="Photo by christian ferrer" className="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div className="text-center font-bold text-blue-950 md:text-lg">Rahul Mathur</div>
                                <div className="flex justify-center">
                                    <div className="flex gap-4">
                                        <p className="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Director</p>
                                        <a href="https://www.linkedin.com/in/rahul-mathur-69017516/" target="_blank" className="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div className="flex flex-col items-center">
                            <div className="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <LazyLoadImage src={neetumaam} loading="lazy" effect="blur" alt="Photo by Ayo Ogunseinde" className="h-full w-full object-cover object-center object-top" />
                            </div>

                            <div>
                                <div className="text-center font-bold text-blue-950 md:text-lg">Neetu singh tomar</div>
                                <div className="flex justify-center">
                                    <div className="flex gap-4">
                                        <p className="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Manager</p>
                                        <a href="https://www.linkedin.com/in/neetu-tomar-756ab818?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" className="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div className="flex flex-col items-center">
                            <div className="mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-lg md:mb-4 md:h-32 md:w-32">
                                <LazyLoadImage src={sakshimaam} loading="lazy" effect="blur" alt="Photo by Midas Hofstra" className="h-full w-full object-cover object-center" />
                            </div>

                            <div>
                                <div className="text-center font-bold text-blue-950 md:text-lg">Sakshi Jha</div>
                                <div className="flex justify-center">
                                    <div className="flex gap-4">
                                        <p className="mb-3 text-center text-sm text-blue-950 md:mb-4 md:text-base">Project Manager</p>
                                        <a href="https://www.linkedin.com/in/sakshi-jha-58861a225/" target="_blank" className="text-blue-900 transition duration-100 hover:text-blue-950 active:text-gray-600">
                                            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

            <div className=" mx-20 my-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-x-32">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-950">Utsav Mathur</h2>
                    <div className='bg-gray-950 w-48 h-0.5 rounded-lg mb-8'></div>
                    <p className="text-gray-700 mb-8">
                        He has graduated in Business Administration from Symbiosis Pune with a dual specialization in Marketing and International Business. 5+ years of experience in international markets like Middle East and South Asia working with a Singapore based Supply Chain major where he has taken responsibilities in vendor development, supply chain optimization, business development. Furthermore he has 3 years of experience in the recruitment space, focusing on channel development, internal talent acquisition, process implementation, following a system oriented approach driving numbers.
                    </p>
                    <p className="text-gray-700">
                        He is a cost accountant and an associate from Insurance Institute of India.
                        He has 27+ years of experience and has led large teams in the past.
                        His last two assignments have been in Birla Sun Life and Aviva Life as VP Sales, VP Strategic Initiatives.
                    </p>
                </div>
                <div className='rounded-full w-full h-full' style={{ backgroundImage: `url('${utsavmathur}')`, backgroundPosition: "top", backgroundSize: "cover" }}></div>
            </div>



            <div className="fixed right-0 top-0 h-full w-6 bg-transparent pointer-events-none flex items-end justify-center">
                <div
                    ref={badgeRef}
                    className="absolute right-0 w-40 mt-0 bg-gradient-to-r from-blue-900 to-gray-900 text-white text-center pb-6 pt-4 cursor-pointer pointer-events-auto shadow-lg transform transition-transform duration-300 hover:scale-105 mb-6 ribbon-2"
                    onClick={() => setShowPopup(true)}
                >
                    <div className='flex'>
                        <span className='ml-2'> Get a call</span>
                        <svg class="h-6 w-6 text-gray-100 ml-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />  <path d="M15 7a2 2 0 0 1 2 2" />  <path d="M15 3a6 6 0 0 1 6 6" /></svg>
                    </div>

                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-md md:w-full mx-10 md:mx-0">
                        <button className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-3xl hover:bg-gray-100 px-2" onClick={closePopup}>
                            &times;
                        </button>
                        <h2 className="text-2xl mb-4">Request a Call Back from Our Team</h2>
                        <form onSubmit={submitCallReq}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700">Phone:</label>
                                <input
                                    type="phone"
                                    id="phone"
                                    className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950" disabled={showsubmitloader}>
                                {showsubmitloader ? (
                                    <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                ) : (
                                    <span className="relative z-10">Submit</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}


            {popup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" data-behavior="cancel" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Thank you for contacting us!
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        We'll respond to you soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button type="button" data-behavior="commit" onClick={() => setPopUp(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Okay
                            </button>
                            <button type="button" data-behavior="cancel" onClick={() => setPopUp(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>

            )}

            <Footer />
        </div>





    )
}

export default AboutUs