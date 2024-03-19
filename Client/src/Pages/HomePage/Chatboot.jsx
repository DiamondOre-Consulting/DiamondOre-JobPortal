import React, { useState, useEffect, useRef } from 'react'
import chatboat from '../../assets/Chatboat.svg'
import axios from "axios";
import popupimg from '../../assets/Logo robo recruiter 1.gif'

const Chatboot = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [welcomeopen, setWelcomeOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [userData, setUserData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: null,
        email: null,
        phone: null,
        preferredCity: null,
        preferredChannel: null,
        currentCTC: null,
    });
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const chatboxBodyRef = useRef(null);

    const questions = [
        'What is your Name?',
        'What is your Email id?',
        'What is your Phone No?',
        'What is your Preferred City?',
        'What is your Preferred Channel?',
        'What is your Current CTC?',
    ];

    const introMessage =
        `Hi! Welcome to the Diamondore Consulting Pvt . Ltd. We're here to help you find your next career opportunity. To get started, please provide us with some information`;
    const endingMessage = 'Thank you for providing your information. We will contact you soon';

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
        setCurrentQuestionIndex(0);
        setMessages([]);

        if (!isOpen) {
            setMessages([{ sender: 'chatbot', text: introMessage }]);
            setTimeout(() => {
                if (!isOpen) {
                    setMessages((prevMessages) => [...prevMessages, { sender: 'chatbot', text: questions[currentQuestionIndex] }]);
                }
            }, 1000);
        }
    };

    const closeChatbox = () => {
        setIsOpen(false);
        setCurrentQuestionIndex(0);
        setMessages([]);
    };



    useEffect(() => {
        const handleScroll = () => {
            if (scrollEnabled && !welcomeopen) { // Check if scroll is enabled and welcome box is open
                const scrollPosition = window.scrollY;
                // Open the welcome box if the user scrolls down even a little bit
                if (scrollPosition > 50) {
                    setWelcomeOpen(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollEnabled, welcomeopen]);

    const closeWelcomeBox = () => {
        setWelcomeOpen(false);
        setScrollEnabled(false); // Disable scroll after closing welcome box
    };


    const sendMessage = async (userDetails) => {
        try {
            const response = await axios.post('https://diamondore-jobportal-backend.onrender.com/api/admin-confi/send-chatbot', userDetails);

            if (response.status === 201) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'chatbot', text: endingMessage },
                ]);
                console.log('Response sent:', response.data);
            }
        } catch (error) {
            console.error('Error sending response:', error);
        }
    };

    const updateUserDetails = (key, value) => {
        setUserDetails(prevUserDetails => {
            const updatedDetails = {
                ...prevUserDetails,
                [key]: value
            };
            console.log("Updated user details:", updatedDetails);
            return updatedDetails;
        });
    };

    useEffect(() => {
        if (chatboxBodyRef.current) {
            chatboxBodyRef.current.scrollTop = chatboxBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
            const key = Object.keys(userDetails)[currentQuestionIndex];
            const updatedUserDetails = { ...userDetails, [key]: inputValue };

            setUserDetails(updatedUserDetails);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'user', text: inputValue },
            ]);
            setInputValue('');

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: 'chatbot', text: questions[currentQuestionIndex + 1] },
                ]);
            } else {
                sendMessage(updatedUserDetails);
            }
        }
    };



    const isSendButtonDisabled = messages[messages.length - 1]?.text === endingMessage;




    return (
        <div>
            <div className={`fixed bottom-32 sm:bottom-28 right-8 w-1/2 sm:w-1/4 md:w-1/4 bg-white shadow-lg p-3 ${welcomeopen ? 'block' : 'hidden'}`}>
                <div className='flex justify-center items-center'>
                    <div className='w-16 h-16 border border-0 rounded-full overflow-hidden -mt-8'>
                        <img
                            src={popupimg}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Close button in the top right corner */}


                    <button className="text-red-500 hover:text-red-700 absolute top-1 right-4 text-2xl" onClick={closeWelcomeBox} >
                        X
                    </button>


                </div>
                {/* Text centered */}
                <p className=" text-xs mt-2 pb-2 font-bold">Hi I'm Robo Recruiter How may I Help You Today?</p>
            </div>

            <div className="fixed bottom-12 sm:bottom-8 right-8">
                <div className="chat-icon w-16 float-right cursor-pointer" onClick={toggleChatbox}>
                    {!isOpen && <img src={chatboat} className="w-14" />}
                </div>
                {isOpen && (
                    <div className="chatbox bg-white shadow-lg shadow-gray-400 rounded-lg p-4 w-72">
                        <div className="chatbox-header flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2">
                            <span className="text-lg font-bold ">Welcome</span>
                            <button className="text-red-500 hover:text-red-700" onClick={closeChatbox}>
                                Close
                            </button>
                        </div>
                        <div
                            className="chatbox-body h-64 overflow-y-auto mb-4  scrollbar-none"
                            style={{ scrollbarWidth: 'none' }}
                            ref={chatboxBodyRef}
                        >
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${message.sender === 'user' ? 'text-right mb-2 text-xs' : 'text-left mb-2 text-xs'}`}
                                >
                                    {/* Apply bold styling to questions */}
                                    {message.sender === 'chatbot' && questions.includes(message.text) ? (
                                        <span className="font-bold italic text-blue-950">{message.text}</span>
                                    ) : (
                                        <span className='font-bold'>{message.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="chatbox-input flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="flex-grow border border-gray-300 rounded-l-lg px-2 py-2 focus:outline-none  w-1/2"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`bg-blue-950 text-white px-2 py-2 rounded-r-lg ${isSendButtonDisabled ? 'opapreferredCity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={isSendButtonDisabled}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chatboot