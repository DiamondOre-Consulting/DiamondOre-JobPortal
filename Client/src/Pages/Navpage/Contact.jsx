import React from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import { Link } from 'react-router-dom'

const Contact = () => {
    return (
        <div>
            <Navbar />

            <section class="">
                <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                        <div class="lg:col-span-2 lg:py-12">
                            <p class="max-w-xl font-bold text-blue-950 text-4xl">
                               Diamond Ore Consulting Pvt Ltd
                            </p>

                            <div class="mt-8">
                                <a href="" class="text-2xl font-bold text-gray-600"> 0151 475 4450 </a>
                                <address class="mt-2 not-italic">B-127, Second Floor, B Block, Sector 63, Noida, Uttar Pradesh 201301</address>
                                <div className='flex my-3'>
                               <Link to ={'https://youtube.com/@DiamondOre-Career?si=mqRnjJzO1gzsU0lu'}> <svg class="h-8 w-8 text-gray-700 mr-3 hover:text-blue-950"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg></Link>
                                <Link to={'https://www.facebook.com/people/Diamond-Ore-Consulting-Pvt-Ltd/61555444963500/?mibextid=ZbWKwL'}><svg class="h-8 w-8 text-gray-700 mr-3 hover:text-blue-950"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg></Link>
                                <Link to={'https://www.instagram.com/diamondoreconsultingpvtltd/?igsh=ZG0zeW42Ynk5OTk5'}><svg class="h-8 w-8 text-gray-700 hover:text-blue-950"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="4" width="16" height="16" rx="4" />  <circle cx="12" cy="12" r="3" />  <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg></Link>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-md bg-blue-950 shadow-xl  lg:col-span-3 lg:p-12">
                            <form action="" class="space-y-3 p-4">
                                <h1 className='text-center font-serif text-3xl text-white mb-6'>Reach out to us</h1>
                                <div>
                                    <label class="sr-only" for="name">Name</label>
                                    <input
                                        class="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                        placeholder="Name"
                                        type="text"
                                        id="name"
                                    />
                                </div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="sr-only" for="email">Email</label>
                                        <input
                                            class="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                            placeholder="Email address"
                                            type="email"
                                            id="email"
                                        />
                                    </div>

                                    <div>
                                        <label class="sr-only" for="phone">Phone</label>
                                        <input
                                            class="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 p-3 text-sm"
                                            placeholder="Phone Number"
                                            type="tel"
                                            id="phone"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="sr-only" for="message">Message</label>

                                    <textarea
                                        class="w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm"
                                        placeholder="Message"
                                        rows="8"
                                        id="message"
                                    ></textarea>
                                </div>

                                <div class="mt-4">
                                    <button
                                        type="submit"
                                        class="inline-block w-full  rounded-lg bg-white px-5 py-3 font-medium text-black sm:w-auto"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


            <div class="relative h-64 w-full sm:w-full lg:h-full lg:w-full px-8">
                <iframe className='w-full rounded-md' src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56039.41861215709!2d77.3733795!3d28.6158626!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef068957c2f1%3A0xe72309664887757f!2sDiamond%20Ore%20Consulting%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1706784809360!5m2!1sen!2sin"  height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <Footer />
        </div>
    )
}

export default Contact