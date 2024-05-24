import React, { useEffect, useState } from 'react'
import image from '..//../assets/certificate.jpg'

const PopUpBox = ({ closeModal, setShowModal }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 1000);
    }, []);


    return (
        <div>
            <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                <div className={`bg-gray-200 p-6 rounded-md w-full max-w-lg mx-4 transform ${isVisible ? 'scale-100' : 'scale-90'} transition-transform duration-500`}>
                    <svg onClick={closeModal} class="h-6 w-6 float-right -mt-5 mb-2 -mr-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <img src={image} alt="" loading="lazy" />
                </div>
            </div>
        </div>
    )
}

export default PopUpBox