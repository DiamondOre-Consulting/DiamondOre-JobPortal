import React, { useState } from 'react'

const Chatboot = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [delhi, setDelhi] = useState(null);
    const [channel, setChannel] = useState(null);
    const [userResponses, setUserResponses] = useState([]);

    const questions = [
        'What is your Name?',
        'what is your Email id ?',
        'What is your Phone No.',
        'What is your Prefered City',
        'What is your Prefered Channel'
    ];

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
        setCurrentQuestionIndex(0);
        setUserResponses({});
        if (isOpen) {
            setMessages([]);
        } else {
            setMessages([{ sender: 'chatbot', text: questions[currentQuestionIndex] }]);
        }
    };

    const closeChatbox = () => {
        setIsOpen(false);
        setCurrentQuestionIndex(0)
        setUserResponses({});

    };

    const sendMessage = () => {
        if (inputValue.trim() !== '') {
            let key;
            switch (currentQuestionIndex) {
                case 0:
                    key = 'name';
                    setName(inputValue);
                    break;
                case 1:
                    key = 'email';
                    setEmail(inputValue);
                    break;
                case 2:
                    key = 'phone';
                    setPhone(inputValue);
                    break;
                case 3:
                    key = 'delhi';
                    setDelhi(inputValue);
                    break;
                case 4:
                    key = 'channel';
                    setChannel(inputValue);
                    break;
                default:
                    break;
            }

            setUserResponses(prevResponses => ({
                ...prevResponses,
                [key]: inputValue
            }));

            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'user', text: inputValue },
                { sender: 'chatbot', text: questions[currentQuestionIndex + 1] }
            ]);

            setInputValue('');

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                
                console.log("User responses:", userResponses);
                // Perform actions with userResponses object
            }
        }
    };
    return (

        <div className="fixed bottom-4 right-8">
            <div className="chat-icon" onClick={toggleChatbox}>
                {!isOpen && (
                    <svg className="h-16 w-16 text-white cursor-pointer" fill="blue" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </div>
            {isOpen && (
                <div className="chatbox bg-white shadow-lg rounded-lg p-4 w-72">
                    <div className="chatbox-header flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2">
                        <span className="text-lg font-bold">Welcome</span>
                        <button className="text-red-500 hover:text-red-700" onClick={closeChatbox}>Close</button>
                    </div>
                    <div className="chatbox-body h-64 overflow-y-auto mb-4  scrollbar-none" style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}>
                        {messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender === 'user' ? 'text-right mb-2 ' : 'text-left mb-2'}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbox-input flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-grow border border-gray-300 rounded-l-lg px-2 py-2 focus:outline-none "
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage} className="bg-blue-950 text-white px-2 py-2 rounded-r-lg">Send</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chatboot