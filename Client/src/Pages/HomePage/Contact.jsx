import { React, useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import { useJwt } from "react-jwt";
import axios from "axios";

const Contact = () => {
    const [Name, setName] = useState(null);
    const [Email, setEmail] = useState(null);
    const [Message, setMsg] = useState(null);
    const [sucesss, setsucess] = useState(null);
    const [error, setError] = useState(null)


    const sendmessage = async (e) => {
        setError(null)
        e.preventDefault();

        if (!Name || !Email || !Message) {
            setError("Filling all the feild are compulsory.")
        }
        // const formData = { Name, Email, Message };
        try {
            const response = await axios.post(
                'https://api.diamondore.in/api/candidates/help-contact',
                {
                    Name,
                    Email,
                    Message
                }
            );

            

            if (response.status === 201) {
                
                setsucess("Data Sent Sucessfully");
                setName('');
                setEmail('');
                setMsg('');
            } else {
                console.log("error occured");

            }

        } catch (error) {
            console.log('Error:', error);
            if (error.response) {
                const status = error.response.status;
                if (status === 500) {
                    setError("something went wrong")
                }
            }
        }
    };


    // popup And calback

    const [showPopup, setShowPopup] = useState(false);
    const [name, setname] = useState('');
    const [phone, setPhone] = useState('');
    const [showsubmitloader, setShowSubmitLoader] = useState(false);
    const badgeRef = useRef(null);
    const [popup, setPopUp] = useState(false)

    const submitCallReq = async (e) => {
        e.preventDefault();
        setShowSubmitLoader(true);
        
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

            <section className="mt-12">
                <div className="mx-auto max-w-screen-xl px-6 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                        <div className="lg:col-span-2 lg:py-12">
                            <p className="max-w-xl font-bold text-blue-950 text-4xl">
                                Diamond Ore Consulting Pvt Ltd
                            </p>

                            <div className="mt-8">
                                <a href="" className="text-xl font-bold text-gray-600">+91 9773693017</a><br></br>
                                <a href="" className="text-xl font-bold text-gray-600">hr@diamondore.in</a>
                                <address className="mt-2 not-italic">B-127, Second Floor, B Block, Sector 63, Noida, Uttar Pradesh 201301</address>
                                <div className='flex my-3'>
                                    <Link to={'https://youtube.com/@DiamondOre-Career?si=mqRnjJzO1gzsU0lu'}> <svg className="h-8 w-8 text-gray-700 mr-3 hover:text-blue-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg></Link>
                                    <Link to={'https://www.facebook.com/people/Diamond-Ore-Consulting-Pvt-Ltd/61555444963500/?mibextid=ZbWKwL'}><svg className="h-8 w-8 text-gray-700 mr-3 hover:text-blue-950" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg></Link>
                                    <Link to={'https://www.instagram.com/diamondoreconsultingpvtltd/?igsh=ZG0zeW42Ynk5OTk5'}><svg className="h-8 w-8 text-gray-700 hover:text-blue-950" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="4" y="4" width="16" height="16" rx="4" />  <circle cx="12" cy="12" r="3" />  <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg></Link>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md bg-blue-950 shadow-xl  lg:col-span-3 lg:p-12">
                            <form className="space-y-3 p-4">
                                <h1 className='text-center  text-3xl text-white mb-6'>Reach out to us</h1>
                                <p className='text-white'>Filling all the fields are mandatory.
                                    <span className='text-red-500 text-2xl mb-2'>*</span></p>
                                <div>
                                    <label className="sr-only" htmlFor="name">Name</label>
                                    <input
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                        placeholder="Name"
                                        type="text"
                                        id="name"
                                        value={Name || ""}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="sr-only" htmlFor="email">Email</label>
                                        <input
                                            className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                            placeholder="Email address"
                                            type="email"
                                            id="email"
                                            value={Email || ""}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                </div>

                                <div>
                                    <label className="sr-only" htmlFor="message">Message</label>

                                    <textarea
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                        placeholder="Message"
                                        rows="8"
                                        id="message"
                                        value={Message || ""}
                                        onChange={(e) => setMsg(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="inline-block w-full  rounded-lg bg-white px-5 py-3 font-medium text-black sm:w-auto"
                                        onClick={sendmessage}
                                    >
                                        Send Message
                                    </button>
                                    {sucesss && (
                                        <div className="flex items-center justify-center bg-green-500 mt-3 p-4 rounded-md">
                                            <p className="text-center text-sm text-3xl text-gray-200">{sucesss}</p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
                                            <p className="text-center text-sm text-red-500">{error}</p>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


            <div className="relative  w-full sm:w-full lg:h-full lg:w-full px-8 mb-16">
                <iframe className='w-full rounded-md border border-blue-950 border-5' src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56039.41861215709!2d77.3733795!3d28.6158626!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068957c2f1%3A0xe72309664887757f!2sDiamond%20Ore%20Consulting%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1706784809360!5m2!1sen!2sin" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>


            {/* pop up */}
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
                        <h2 className="text-2xl mb-4">Get A Call Back From Our Team</h2>
                        <form onSubmit={submitCallReq}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
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

export default Contact