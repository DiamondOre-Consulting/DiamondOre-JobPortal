import React, { useState, useEffect } from 'react';
import tree from '../../assets/tree2.png';
import star from '../../assets/star.svg';
import basket from '../../assets/basket.png'

// Define positions for both desktop and mobile
const initialPositions = [
  { top: '-5%', left: '48.6%', topMobile: '4%', leftMobile: '45%' },
  { top: '15%', left: '48%', topMobile: '15%', leftMobile: '47%' },
  { top: '28%', left: '54%', topMobile: '28%', leftMobile: '54%' },
  { top: '34%', left: '44%', topMobile: '34%', leftMobile: '38%' },
  { top: '55%', left: '57%', topMobile: '55%', leftMobile: '57%' },
  { top: '69%', left: '40%', topMobile: '69%', leftMobile: '25%' },
  { top: '71%', left: '56%', topMobile: '71%', leftMobile: '68%' },
  { top: '82%', left: '44%', topMobile: '82%', leftMobile: '34%' },
  { top: '87%', left: '55%', topMobile: '84%', leftMobile: '59%' },
  { top: '45%', left: '50%', topMobile: '45%', leftMobile: '50%' },
  { top: '50%', left: '43%', topMobile: '50%', leftMobile: '28%' },
  { top: '69%', left: '47%', topMobile: '69%', leftMobile: '47%' },
];

localStorage.setItem('incentive', JSON.stringify([
  { "month": "Jan", "param1": "2", "param2": "4", "param3": "6" },
  { "month": "Feb", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Mar", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Apr", "param1": "8", "param2": "5", "param3": "7" },
  { "month": 'may', 'param1': '5', 'param2': '4', 'param3': '4' },
  { "month": "June", "param1": "2", "param2": "4", "param3": "6" },
  { "month": "july", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Aug", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Sep", "param1": "8", "param2": "5", "param3": "7" },
  {"month": "Oct", "param1": "8", "param2": "5", "param3": "7" },
  { "month": "Nov", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Dec", "param1": "3", "param2": "5", "param3": "7" },
]));

const Incentive = () => {
  const [apples, setApples] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    // Update isMobile state on window resize
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem('incentive');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setApples(parsedData);
      } catch (error) {
        console.error('Error parsing JSON from local storage:', error);
      }
    }
  }, []);

  return (
    <div className=''>
      <div className='flex justify-end'>
        <select className='p-2'>
          <option>Select Year</option>
        </select>
      </div>
      <div className='flex justify-center items-center relative'>
        <img src={tree} alt="Tree" className='w-full md:w-1/4 mt-0 md:-mt-14' />
        {apples.length > 0 ? apples.map((apple, index) => (
          <div
            key={index}
            className='absolute fruit flex flex-col items-center'
            style={{
              top: isMobile ? initialPositions[index].topMobile : initialPositions[index].top,
              left: isMobile ? initialPositions[index].leftMobile : initialPositions[index].left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className='relative'>
              <img src={star} className='w-10 h-10' alt="" />
            </div>
            <div className='flex flex-col items-center group relative'>
              <span className='text-xs text-gray-50 -mt-6'>{apple.month}</span>
              <div className=''>
                <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-2 text-sm text-gray-100 rounded-t-lg rounded-bl-lg absolute left-1/2 -translate-x-1/3 translate-y-2 opacity-0 m-2 mx-auto'>
                  <div className='w-full text-xs py-2' style={{ width: "90px" }}>
                    <p>{apple.param1} : Monthly</p>
                    <p>{apple.param2} : YTD</p>
                    <p>{apple.param3} : KAM</p>
                  </div>
                </span>
              </div>
            </div>
          </div>
        )) : <div>No data found.</div>}
      </div>

       
      <div className='py-10' style={{ backgroundColor: '#79B311' }}>
        {/* Placeholder for content below the tree */}
      </div>
    </div>
  );
};

export default Incentive;
