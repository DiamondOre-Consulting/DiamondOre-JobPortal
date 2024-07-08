import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import diamond from '..//..//assets/diamond.png'
import bluediamond from '..//..//assets/bluediamond.png'
const PostReview = () => {
    return (
        <>
            <Navbar />

            <div className='mt-28 '>
                <h1 className='font-bold text-4xl text-center'>Post Review</h1>

                <div className='grid grid-cols-12 border-1 h-screen gap-4 px-10 mt-10'>

                    <div className='col-span-4 border'>

                        <form class="max-w-md mx-auto  p-6 bg-white border rounded-lg shadow-lg">
                            <h2 class="text-2xl font-bold mb-6 ">Post Review</h2>
                            <div class="mb-4">
                                <label class="block text-gray-700 font-bold mb-2" for="name">
                                    Name:
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Enter your name" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 font-bold mb-2" for="email">
                                    Email:
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email" />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 font-bold mb-2" for="email">
                                    Review For:
                                </label>
                                <select className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
                                    <option>Review For</option>
                                    <option>ABC</option>
                                    <option>DEF</option>
                                </select>

                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 font-bold mb-2" for="email">
                                    Review:
                                    <div className='flex mt-2 cursor-pointer'>
                                    <img src={diamond} className='w-8' alt=""/>
                                    <img src={diamond} className='w-8 ml-2' alt="" />
                                    <img src={diamond} className='w-8 ml-2' alt="" />
                                    <img src={diamond} className='w-8 ml-2' alt="" />
                                    <img src={diamond} className='w-8 ml-2' alt="" />
                                    </div>
                                  
                                </label>
                               
                            </div>


                            <div class="mb-4">
                                <label class="block text-gray-700 font-bold mb-2" for="feedback">
                                    Review:
                                </label>
                                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="feedback" rows="5" placeholder="Enter your feedback"></textarea>
                            </div>
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Submit
                            </button>
                        </form>

                    </div>
                    <div className='border-1 border col-span-8'>

                    </div>

                </div>


            </div>

            <Footer />
        </>
    )
}

export default PostReview