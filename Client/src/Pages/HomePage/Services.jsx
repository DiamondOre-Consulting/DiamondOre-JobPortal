import React from 'react'
import Navbar from './Navbar'
import potrait from '../../assets/potrait.png'
import Footer from './Footer'

const Services = () => {
    return (
        <div>

            <Navbar />
            <section className="px-12 sm:px-6 overflow-hidden flex flex-between sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24 mr-0 xxs:mr-0">
          <div className="mx-auto max-w-xl text-left ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-5xl font-bold text-gray-700 md:text-5xl sm:text-2xl font-serif">
            <span className="text-blue-950">Diamond Ore Consulting Pvt Ltd</span>
            </h2>

            <p className="text-2xl text-gray-500 md:mt-4">
            Your dynamic workforce solution partner! 
            </p>

            <div className="mt-4 md:mt-8">
              <a
                href="#"
                className="inline-block rounded bg-blue-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
              >
                Our Services
              </a>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex justify-center px-10 ">
        <img
          alt="Image by Freepik"
          src={potrait}
          className="h-56 w-4/6 object-cover rounded-b-full rounded-t-md sm:h-full"
        />
        </div>
      </section>

            <div class="bg-white py-6 sm:py-8 lg:py-12">
                <div class="mx-auto max-w-screen-2xl px-4 md:px-8">

                    <div class="mb-10 md:mb-16">
                        <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Our Services</h2>

                        <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text but is random or otherwise generated.</p>
                    </div>


                    <div class="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Growth</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white text-black shadow-lg">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Security</h3>
                                <p class="text-gray-800">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Cloud</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white shadow-lg ">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Speed</h3>
                                <p class="text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Support</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white shadow-lg">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Dark Mode</h3>
                                <p class="text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                    </div>


                    <div class="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3 mt-8">

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Growth</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white text-black shadow-lg">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Security</h3>
                                <p class="text-gray-800">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Cloud</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white shadow-lg">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Speed</h3>
                                <p class="text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-blue-950 text-white shadow-lg shadow-blue-900">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Support</h3>
                                <p class="text-gray-200">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                        <div class="flex divide-x rounded-lg border bg-white shadow-lg">
                            <div class="flex items-center p-2 text-indigo-500 md:p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div class="p-4 md:p-6">
                                <h3 class="mb-2 text-lg font-semibold md:text-xl">Dark Mode</h3>
                                <p class="text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>
                            </div>
                        </div>

                    </div>


                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Services