import { React, useState, useEffect } from 'react'
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

            console.log("API Response:", response.data);

            if (response.status === 201) {
                console.log("Data sent successfully");
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
            <Footer />
        </div>
    )
}

export default Contact