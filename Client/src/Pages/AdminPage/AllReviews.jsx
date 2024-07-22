import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../Components/AdminPagesComponents/AdminNav';
import Footer from '../HomePage/Footer';
import bluediamond from '..//..//assets/bluediamond.png'; // Replace with the correct path to your image

const AllReviews = () => {
    const [allreviews, setAllReviews] = useState([]);
    const [popup, setPopUp] = useState(false); // State to control the popup
    const [reviewToDelete, setReviewToDelete] = useState(null); // State to store review ID for deletion
    const token = localStorage.getItem("token");
    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        try {
            const response = await axios.get('https://api.diamondore.in/api/candidates/all-reviews');
            if (response.status === 201) {
                setAllReviews(response.data);
            } else {
                console.error('Failed to fetch reviews:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleDeleteReview = async () => {
        if (!reviewToDelete) return;

        try {
            const response = await axios.delete(`https://api.diamondore.in/api/admin-confi/delete-review/${reviewToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                console.log('Review deleted successfully');
                fetchAllReviews(); // Fetch updated list after deletion
                closePopup(); // Close the popup after successful deletion
            } else {
                console.error('Failed to delete review:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const openPopup = (id) => {
        setReviewToDelete(id);
        setPopUp(true);
    };

    const closePopup = () => {
        setPopUp(false);
    };

    return (
        <>
            {/* <AdminNav /> */}
            <div>
                <h1 className='text-center font-bold text-3xl'>All Reviews</h1>
                <div className="main mt-10 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4 md:px-10 px-4 ">
                        {allreviews.map((review) => (
                            <div key={review._id} className="max-w-md">
                                <div className="bg-white shadow-xl rounded-md overflow-hidden h-full flex flex-col">
                                    <div className="relative h-6 bg-blue-900"></div>
                                    <div className="flex-1 p-6">
                                        <p className="text-lg font-bold text-gray-800">{review.reviewFor}'s Employee</p>
                                        <p className="mt-2 text-sm text-gray-600">{review.review}</p>
                                        <div className='flex justify-between items-center'>
                                            <div className="flex items-center mt-4 ">
                                                {Array.from({ length: review.diamonds }).map((_, index) => (
                                                    <img key={index} src={bluediamond} className="w-6 h-6 mr-1" alt="diamond" />
                                                ))}
                                            </div>
                                            <svg
                                                className="h-6 w-6 text-red-500 cursor-pointer"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                onClick={() => openPopup(review._id)} // Pass review._id to openPopup
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <line x1="4" y1="7" x2="20" y2="7" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                            </svg>
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

            {popup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md">
                        <div className="p-6 pt-0 text-center">
                            <svg class="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                                Are you sure you want to delete this Review?
                            </h3>
                            <button
                                onClick={handleDeleteReview} // Call handleDeleteReview directly
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
                            >
                                Yes, I'm sure
                            </button>
                            <button
                                onClick={closePopup}
                                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <Footer /> */}
        </>
    );
};

export default AllReviews;
