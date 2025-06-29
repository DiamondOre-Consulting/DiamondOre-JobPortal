import React, { useState, useEffect, useRef } from "react";
import chatboat from "../../assets/Chatboat.svg";
import axios from "axios";
import popupimg from "../../assets/Logo robo recruiter 1.gif";
import certificate from "../../assets/startup.png";

const Chatboot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [welcomeopen, setWelcomeOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatboxBodyRef = useRef(null);

  const questions = [
    "What is your Name?",
    "What is your Email id?",
    "What is your Phone No?",
    "What is your Preferred City?",
    "What is your Preferred Channel?",
    "What is your Current CTC?",
  ];

  const introMessage = `Hi! Welcome to the Diamondore Consulting Pvt . Ltd. We're here to help you find your next career opportunity. To get started, please provide us with some information`;
  const endingMessage =
    "Thank you for providing your information. We will contact you soon";

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    setCurrentQuestionIndex(0);
    setMessages([]);

    if (!isOpen) {
      setMessages([{ sender: "chatbot", text: introMessage }]);
      setTimeout(() => {
        if (!isOpen) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "chatbot", text: questions[currentQuestionIndex] },
          ]);
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
      if (scrollEnabled && !welcomeopen) {
        // Check if scroll is enabled and welcome box is open
        const scrollPosition = window.scrollY;
        // Open the welcome box if the user scrolls down even a little bit
        if (scrollPosition > 50) {
          setWelcomeOpen(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollEnabled, welcomeopen]);

  const closeWelcomeBox = () => {
    setWelcomeOpen(false);
    setScrollEnabled(false); // Disable scroll after closing welcome box
  };

  const sendMessage = async (userDetails) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/send-chatbot`,
        userDetails
      );

      if (response.status === 201) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "chatbot", text: endingMessage },
        ]);
      }
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  const updateUserDetails = (key, value) => {
    setUserDetails((prevUserDetails) => {
      const updatedDetails = {
        ...prevUserDetails,
        [key]: value,
      };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const key = Object.keys(userDetails)[currentQuestionIndex];
      const updatedUserDetails = { ...userDetails, [key]: inputValue };

      setUserDetails(updatedUserDetails);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputValue },
      ]);
      setInputValue("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "chatbot", text: questions[currentQuestionIndex + 1] },
        ]);
      } else {
        sendMessage(updatedUserDetails);
      }
    }
  };

  const isSendButtonDisabled =
    messages[messages.length - 1]?.text === endingMessage;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        className={`fixed bottom-60 md:bottom-56 z-10 right-8 ${
          welcomeopen ? "block" : "hidden"
        }`}
      >
        <img
          id="certificateImage"
          src={certificate}
          alt="Certificate"
          className="h-28 w-38 cursor-pointer"
          onClick={openModal}
        />
      </div>

      <div
        className={`fixed bottom-32 z-10 sm:bottom-28 right-8 w-1/2 sm:w-1/4 md:w-1/4 bg-white shadow-lg p-3 ${
          welcomeopen ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border border-0 rounded-full overflow-hidden -mt-8">
            <img
              src={popupimg}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="bg-red-400 hover:bg-red-500 rounded-full text-gray-200 absolute top-1 right-4 text-sm px-2 py-1"
            onClick={closeWelcomeBox}
          >
            X
          </button>
        </div>
        <p className="text-xs mt-2 pb-2 font-bold">
          Hi I'm Robo Recruiter How may I Help You Today?
        </p>
      </div>

      <div className="fixed bottom-12 sm:bottom-8 right-8 z-10">
        <div
          className="chat-icon w-16 float-right cursor-pointer"
          onClick={toggleChatbox}
        >
          {!isOpen && <img src={chatboat} className="w-14" />}
        </div>
        {isOpen && (
          <div className="chatbox bg-white shadow-lg shadow-gray-400 rounded-lg p-4 w-72">
            <div className="chatbox-header flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2">
              <span className="text-lg font-bold">Welcome</span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={closeChatbox}
              >
                Close
              </button>
            </div>
            <div
              className="chatbox-body h-64 overflow-y-auto mb-4  scrollbar-none"
              style={{ scrollbarWidth: "none" }}
              ref={chatboxBodyRef}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    message.sender === "user"
                      ? "text-right mb-2 text-xs"
                      : "text-left mb-2 text-xs"
                  }`}
                >
                  {message.sender === "chatbot" &&
                  questions.includes(message.text) ? (
                    <span className="font-bold italic text-blue-950">
                      {message.text}
                    </span>
                  ) : (
                    <span className="font-bold">{message.text}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="chatbox-input flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-grow border border-gray-300 rounded-l-lg px-2 py-2 focus:outline-none  w-1/2"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className={`bg-blue-950 text-white px-2 py-2 rounded-r-lg ${
                  isSendButtonDisabled
                    ? "opapreferredCity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isSendButtonDisabled}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-gray-200 p-6 rounded-md w-full max-w-lg mx-4 transform transition-transform duration-500">
            <svg
              onClick={closeModal}
              class="h-6 w-6 float-right -mt-5 mb-2 -mr-4 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <img
              src={certificate}
              alt="Certificate"
              className="max-w-full max-h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatboot;
