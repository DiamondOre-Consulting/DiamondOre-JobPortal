import React from 'react'
import Navbar from '../HomePage/Navbar'
import Footer from '../HomePage/Footer'
import cvimg from '../../assets/5.svg'
import { Link } from 'react-router-dom'

const Cvdashboard = () => {
    return (
        <div>
            <Navbar />
            <h1 className='text-5xl font-bold text-center'>Create Your Own CV</h1>
            <div class=" py-6 sm:py-8 lg:py-18 ">
                <div class="mx-auto max-w-screen-xl px-4 md:px-8">
                    

                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 sm:grid-cols-1 md:gap-0 ">
                        <div class="flex flex-col items-center md:p-4 ">
                            <button class="  flex-col items-center lg:flex  outline-2 outline-offset-2 w-1/2  outline-dashed"><div class="h-30 lg:w-38 flex w-24 items-center justify-center rounded-md border-2 border-dashed border-white lg:h-48"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 67 67" class="w-18"><path stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M53.904 35.152v-14.38l-13.8-13.694H21.986c-5.608 0-10.443 4.332-10.443 9.678v27.867c0 5.647 4.516 10.088 10.443 10.088 1.384 0 7.452-.1 10.486 0"></path><path stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M39.389 7.048v7.55c0 3.685 3.13 6.675 6.997 6.683 3.585.008 7.254.01 7.502-.005"></path><path stroke="#200E32" stroke-linecap="round" stroke-width="1.5" d="M44.732 54.304L62.784 54.304"></path><path stroke="#200E32" stroke-linecap="round" stroke-width="1.5" d="M54.575 62.583L54.575 45.633"></path><ellipse cx="12.045" cy="12.045" fill="url(#grad-0.1866318090793464)" rx="12.045" ry="12.045" transform="matrix(1 0 0 -1 41.943 66.107)"></ellipse><path fill="#fff" fill-rule="evenodd" d="M54.93 49.636a.7.7 0 10-1.4 0v3.726h-3.727a.7.7 0 100 1.4h3.727v3.727a.7.7 0 101.4 0v-3.727h3.726a.7.7 0 100-1.4H54.93v-3.727z" clip-rule="evenodd"></path><defs><linearGradient id="grad-0.1866318090793464" x1="0" x2="24.09" y1="12.045" y2="12.045" gradientUnits="userSpaceOnUse"><stop stop-color="#EC008C"></stop><stop offset="1" stop-color="#FC6767"></stop></linearGradient></defs></svg></div><Link to={'/cv-form'} className='mb-4'><span class="mt-[1px] text-sm font-bold uppercase bg-blue-950 p-3 text-white rounded-full ">Create Free CV</span> </Link></button>
                        </div>
                        <div class="flex flex-col items-center md:p-4 ">
                        <button class="  flex-col items-center lg:flex  outline-2 outline-offset-2 w-1/2  outline-dashed hover:shadow-lg"><div class="h-30 lg:w-38 flex w-24 items-center justify-center rounded-md border-2 border-dashed border-white lg:h-48"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 67 67" class="w-18"><path stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M53.904 35.152v-14.38l-13.8-13.694H21.986c-5.608 0-10.443 4.332-10.443 9.678v27.867c0 5.647 4.516 10.088 10.443 10.088 1.384 0 7.452-.1 10.486 0"></path><path stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M39.389 7.048v7.55c0 3.685 3.13 6.675 6.997 6.683 3.585.008 7.254.01 7.502-.005"></path><path stroke="#200E32" stroke-linecap="round" stroke-width="1.5" d="M44.732 54.304L62.784 54.304"></path><path stroke="#200E32" stroke-linecap="round" stroke-width="1.5" d="M54.575 62.583L54.575 45.633"></path><ellipse cx="12.045" cy="12.045" fill="url(#grad-0.1866318090793464)" rx="12.045" ry="12.045" transform="matrix(1 0 0 -1 41.943 66.107)"></ellipse><path fill="#fff" fill-rule="evenodd" d="M54.93 49.636a.7.7 0 10-1.4 0v3.726h-3.727a.7.7 0 100 1.4h3.727v3.727a.7.7 0 101.4 0v-3.727h3.726a.7.7 0 100-1.4H54.93v-3.727z" clip-rule="evenodd"></path><defs><linearGradient id="grad-0.1866318090793464" x1="0" x2="24.09" y1="12.045" y2="12.045" gradientUnits="userSpaceOnUse"><stop stop-color="#EC008C"></stop><stop offset="1" stop-color="#FC6767"></stop></linearGradient></defs></svg></div><Link to={'cv-dashboard'} className='mb-4'><span class="mt-[1px] text-sm font-bold uppercase bg-blue-950 p-3 text-white rounded-full ">Create Your Impactfull CV</span> </Link></button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Cvdashboard