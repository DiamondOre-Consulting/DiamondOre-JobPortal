import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const FAQ = () => {

    const [openQuestions, setOpenQuestions] = useState([]);

    const questions = {
      0: {
        question: 'What is ReferBiz?',
        answer: 'ReferBiz is a unique platform that offers an Affiliate Model for individuals to turn their network connections into a source of income and professional advancement. Through our innovative referral-focused approach, users can refer qualified candidates to job opportunities and earn incentives for their successful referrals.',
      },
      1: {
        question: 'How does the Affiliate Model work?',
        answer: 'Our Affiliate Model revolves around referrals, where users introduce suitable candidates to open job positions within our network. Upon successful placement, affiliates receive incentives as rewards for their contributions.',
      },
      2: {
        question: 'Who can participate in the Affiliate Model?',
        answer: 'Our Affiliate Model is open to individuals from all backgrounds, including industry professionals, students, and well-connected individuals. Whether youre actively involved in recruiting or simply have a vast network, you can join our Affiliate Model and start referring candidates today',
      },
      3: {
        question: 'What are the incentives for affiliates?',
        answer: 'Affiliates earn incentives for each successful referral that leads to a candidate placement. These incentives are designed to motivate affiliates to grow their referral network and enhance their earning potential. Additionally, top performers may qualify for special rewards and recognition',
      },
    };
  
    const toggleQuestion = (index) => {
      if (openQuestions.includes(index)) {
        setOpenQuestions(openQuestions.filter((item) => item !== index));
      } else {
        setOpenQuestions([...openQuestions, index]);
      }
    };
  
  return (
    <div>
        <Navbar/>
        <div>
            <h1 className='text-center text-3xl font-bold text-blue-950'>Frequently Asked Question</h1>
            <div className='w-72 bg-blue-950 items-center h-1 text-cetner mx-auto border rounded mt-2'></div>
        </div>
            {/* faq section  */}
            <div className="bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16 mt-2">
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            Navigate through our comprehensive FAQ section to find answers to common queries and gain deeper insights into our platform's functionalities
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-md border-t px-8">
        {Object.keys(questions).map((index) => (
          <div className="border-b" key={index}>
            <div
              className="flex cursor-pointer justify-between gap-2 py-4 text-black hover:text-indigo-500 active:text-indigo-600"
              onClick={() => toggleQuestion(parseInt(index))}
            >
              <span className="font-semibold transition duration-100 md:text-lg">
                {questions[index].question}
              </span>
              <span
                className={`transform ${openQuestions.includes(parseInt(index)) ? 'rotate-180' : ''
                  } text-indigo-500`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>

            <p
              className={`mb-4 ${openQuestions.includes(parseInt(index)) ? 'block' : 'hidden'
                } text-gray-500`}
            >
              {questions[index].answer}
            </p>
          </div>
        ))}
      </div>
        <Footer/>
    </div>
  )
}

export default FAQ