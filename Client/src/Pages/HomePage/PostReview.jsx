import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import diamond from '..//..//assets/diamond.png';
import bluediamond from '..//..//assets/bluediamond.png';
import RatingStars from 'react-rating-stars-component';
import { motion } from "framer-motion";
import axios from 'axios'

const PostReview = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviewFor, setReviewFor] = useState('');
    const [diamonds, setDiamonds] = useState(0); // State for rating, 0 means no diamonds
    const [review, setReview] = useState('');
    const [popup, setPopUp] = useState(false)
    const [loader, setLoader] = useState(false);
    const [allreviews, setAllReviews] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const handleRatingChange = (rating) => {
        setDiamonds(rating);
    };


    const handleCardClick = (reviewId) => {
        // Handle click event, e.g., expand the card
        console.log(`Clicked card with ID ${reviewId}`);
      };

    // post review
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPopUp(true)
        setLoader(true)

        try {
            const response = await axios.post('https://api.diamondore.in/api/candidates/post-review',
                {
                    name,
                    email,
                    reviewFor,
                    diamonds,
                    review,

                });

            if (response.status === 200) {
                console.log(response.data)
                console.log("Review posted sucessfully!!!")
                setPopUp(false);
                setLoader(false);
                setRefresh(!refresh);
                setName('');
                setEmail('');
                setReview('');
                setDiamonds('');
                setReviewFor('')

            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    setError("Review for and diamonds are required fields!!!");
                    setPopUp(false)
                    setLoader(false)
                } else {
                    setError("Something went wrong!!!");
                    setPopUp(false);
                    setLoader(false)
                }
            }
        }
    };

    //all review

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const response = await axios.get('https://api.diamondore.in/api/candidates/all-reviews');
                if (response.status === 201) {
                    console.log(response.data);
                    setAllReviews(response.data)
                } else {
                    console.error('Failed to fetch reviews:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchAllReviews();
    }, [refresh]); // Adding an empty dependency array ensures it runs only once


    return (
        <>
            <Navbar />

            <div className='mt-28'>
                <h1 className='font-bold text-4xl text-center'>Reviews</h1>

                <div className='grid  grid-cols-1 md:grid-cols-12 border-1  md:gap-4 px-10 mt-10'>
                    <div className='md:col-span-4'>
                        <form className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-lg" onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-bold mb-6">Post Review</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                                    Name: <span className='text-gray-500 text-xs'>(optional)</span>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                    Email: <span className='text-gray-500 text-xs'>(optional)</span>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="reviewFor">
                                <span className='text-red-600 text-lg'>*</span> Review For:
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={reviewFor}
                                    onChange={(e) => setReviewFor(e.target.value)}
                                >
                                    <option value="">Review For</option>
                                    <option value="SBI">SBI (State Bank of India)</option>
                                    <option value="Kotak Life Insurance">Kotak Life Insurance</option>
                                    <option value="Agarwal Packers and Movers">Agarwal Packers and Movers</option>
                                    <option value="Aditya Birla Capital">Aditya Birla Capital</option>
                                    <option value="TMI">TMI (Kotak Bank)</option>
                                    <option value="Care Health">Care Health</option>
                                    <option value="Motilal Oswal">Motilal Oswal</option>
                                    <option value="Edelweiss Tokio Life">Edelweiss Tokio Life</option>
                                    <option value="IndiaFirst Life Insurance">IndiaFirst Life Insurance</option>
                                    <option value="Canara HSBC">Canara HSBC</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                <span className='text-red-600 text-lg'>*</span> Rating:
                                    <div className='flex mt-2 cursor-pointer'>
                                        <RatingStars
                                            count={5}
                                            value={diamonds}
                                            onChange={handleRatingChange}
                                            size={40}
                                            activeColor="#FFD700" // Diamond color
                                            emptyIcon={<img src={diamond} className='w-8 ml-2' alt="diamond" />}
                                            filledIcon={<img src={bluediamond} className='w-8 ml-2' alt="diamond" />}
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="review">
                                    Review:  <span className='text-gray-500 text-xs'>(optional)</span>
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="review"
                                    rows="5"
                                    placeholder="Enter your feedback"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                ></textarea>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={loader}>
                                {loader ? (
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
                    <div className="col-span-8">
                        <div className="main mt-10 md:mt-0">
                            <div className="grid  grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                                {allreviews.map((review) => (
                                    <div key={review._id} className="max-w-md">
                                        <div className="bg-white shadow-xl rounded-md overflow-hidden h-full flex flex-col">
                                            <div className="relative h-6 bg-blue-900"></div>
                                            <div className="flex-1 p-6">
                                                <p className="text-lg font-bold text-gray-800">{review.reviewFor}'s Employee</p>
                                                {/* <div className='bg-blue-900 w-20 h-0.5'></div> */}
                                                <p className="mt-2 text-sm text-gray-600">{review.review}</p>

                                                <div className="flex items-center mt-4">
                                                    {Array.from({ length: review.diamonds }).map((_, index) => (
                                                        <img key={index} src={bluediamond} className="w-6 h-6 mr-1" alt="diamond" />
                                                    ))}
                                                </div>
                                              
                                            </div>
                                            <div className="absolute top-0 left-4 h-4 w-1 bg-blue-900 rounded-full"></div>
                                            <div className="absolute top-0 right-4 h-4 w-1 bg-blue-900 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

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
                                    Thank You for Your Review!
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        We appreciate your feedback. Your review helps us improve our service.
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
        </>
    );
};

export default PostReview;
