import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/Logo.png'

const Footer = () => {
  return (
    <div>
      <footer className="bg-white">
        <div className="pb-16 pt-4 sm:pt-10 lg:pt-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="grid grid-cols-2 gap-12 border-t pt-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-8 lg:pt-12">
                <div className="col-span-full lg:col-span-2">
                <div className="mb-4 w-3/4">
                    <img src={Logo} alt="" />
                </div>

                <p className="text-gray-500 sm:pr-8">Empowering Success, Enriching Lives. Your journey starts here with <b>Diamond Ore consolting Pvt Ltd.</b>".</p>
                </div>

                <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Products</div>

                <nav className="flex flex-col gap-4">
                    <div>
                    <Link to={'/all-jobs'} href="#" className="text-gray-500 transition duration-100 hover:text-blue-950 active:text-bg blue-950 ">Jobs</Link>
                    </div>

                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">CV genie</a>
                    </div>

                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Be Our Client</a>
                    </div>

                </nav>
                </div>

                <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Company</div>

                <nav className="flex flex-col gap-4">
                    <div>
                    <Link to={'/about'} className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">About</Link>
                    </div>

                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Team</a>
                    </div>

                    <div>
                    <Link to={'/admin-login'} className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Admin login</Link>
                    </div>

                    <div>
                    <Link to={'/employee-login'} className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Employee login</Link>
                    </div>
                </nav>
                </div>
                

                <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Support</div>

                <nav className="flex flex-col gap-4">
                    <div>
                    <Link to={'/contact'} href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Contact Us</Link>
                    </div>

                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">FAQ</a>
                    </div> 
                </nav>
                </div>
                

                <div>
                <div className="mb-4 font-bold uppercase tracking-widest text-gray-800">Legal</div>

                <nav className="flex flex-col gap-4">
                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Terms of Service</a>
                    </div>

                    <div>
                    <a href="#" className="text-gray-500 transition duration-100 hover:text-indigo-500 active:text-indigo-600">Privacy Policy</a>
                    </div>

                   
                </nav>
                </div>
            </div>
            </div>
        </div>

        <div className="bg-gray-100">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex items-center align-center justify-between gap-4 ">
                <span className="text-sm text-gray-400"> © 2024 - Diamond Ore Pvt Ltd . All rights reserved. </span>

                <div className="flex gap-4">
                <a href="https://www.instagram.com/diamondoreconsultingpvtltd?igsh=ZG0zeW42Ynk5OTk5" target="_blank" className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600">
                    <svg className="h-5 w-5 hover:text-blue-950" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </a>

                <a href="https://www.youtube.com/@DiamondOre-Career" target="_blank" className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600">
                <svg class="h-6 w-6 text-gray-500 hover:text-blue-950"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>

                <a href="https://www.facebook.com/profile.php?id=61555444963500&mibextid=ZbWKwL" target="_blank" className="text-gray-400 transition duration-100 hover:text-blue-950 active:text-gray-600">
                <svg class="h-6 w-6 text-gray-400 hover:text-blue-950"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                </a>
                </div>
            </div>
            </div>
        </div>
    </footer>
    </div>
  )
}

export default Footer
