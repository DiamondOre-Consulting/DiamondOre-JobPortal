import React, { useState, useEffect } from 'react';
import tree from '../../assets/tree2.png';
import star from '../../assets/star.svg';
import basket from '../../assets/basket.png'
import axios from 'axios'
import { useParams } from 'react-router-dom';


// Define positions for both desktop and mobile
const initialPositions = [
  { top: '-7%', left: '47%', topMobile: '4%', leftMobile: '45%' },
  { top: '15%', left: '44%', topMobile: '15%', leftMobile: '47%' },
  { top: '28%', left: '54%', topMobile: '28%', leftMobile: '54%' },
  { top: '34%', left: '38%', topMobile: '34%', leftMobile: '38%' },
  { top: '55%', left: '62%', topMobile: '55%', leftMobile: '57%' },
  { top: '69%', left: '24%', topMobile: '69%', leftMobile: '25%' },
  { top: '74%', left: '68%', topMobile: '71%', leftMobile: '68%' },
  { top: '82%', left: '40%', topMobile: '82%', leftMobile: '34%' },
  { top: '85%', left: '60%', topMobile: '84%', leftMobile: '59%' },
  { top: '45%', left: '50%', topMobile: '45%', leftMobile: '50%' },
  { top: '54%', left: '39%', topMobile: '50%', leftMobile: '28%' },
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
  { "month": "Oct", "param1": "8", "param2": "5", "param3": "7" },
  { "month": "Nov", "param1": "3", "param2": "5", "param3": "7" },
  { "month": "Dec", "param1": "3", "param2": "5", "param3": "7" },
]));

const Incentive = () => {
  const { id } = useParams();
  const [apples, setApples] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [incentiveData,setIncentiveData] = useState()

  console.log(incentiveData)

  useEffect(() => {
    // Update isMobile state on window resize
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    useEffect(()=>{

            const handleIncentiveData = async () => {
              
                  try{
                    const baseURL=`${import.meta.env.VITE_BASE_URL}/employee/incentive-tree-Data`
                    console.log("token",localStorage.getItem("token"))
                    const params = new URLSearchParams();
                    if(id){
                      params.append('userId',id);
                    }

                    const url = `${baseURL}?${params.toString()}`;

                   
                      
                    const response = await axios.get(url,{
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      }
                    });

                    setIncentiveData(response.data)

                  }
                  catch(err){
                  console.log(err)
                  
                  return 
                  }

            }  

            handleIncentiveData()
        
    },[])

  return (
    <div className=''>
      <div className='flex justify-end'>
        <select className='p-2'>
          <option>Select Year</option>
          <option>2024</option>
          <option>2025</option>
          <option>2026</option>
          <option>2027</option>
          <option>2028</option>
          <option>2029</option>
          <option>2030</option>
        </select>
      </div>

      <div className='grid  grid-cols-1 md:grid-cols-3 gap-2 mt-4 md:mt-0'>

        {/* two buckets */}
        <div className=' px-10 flex justify-center'>

          <div className='flex justify-center items-end'>
            <div className='border border-1 border-black w-32 h-32'>
              <p className='bg-white border border-b-gray-500  text-gray-700 text-xs text-center uppercase py-2'>Yet to raise</p>
              <span>{incentiveData && incentiveData?.white}</span>
            </div>
            <div className='border border-1 border-black ml-6  w-32 h-32 '>
              <p className='bg-orange-600 text-gray-200 text-xs text-center uppercase py-2'>Invoice raised</p>
              <span>{incentiveData && incentiveData?.orange}</span>
            </div>
          </div>

        </div>
        <div className=''>
          <div className='flex justify-center items-center  relative'>
            <img src={tree} alt="Tree" className='w-full md:w-72 mt-0 md:-mt-14' />
            <div className="flex flex-col items-start md:items-center">
              
            </div>
          </div>
        </div>

        {/* onw bucket */}
        <div className=' px-10 flex justify-center'>

          <div className='flex justify-center items-end'>
            <div className='border border-1 border-black w-32 h-32'>
              <p className='bg-green-700 text-gray-200 text-xs text-center uppercase py-2'>paid</p>
              <span className=' w-full block text-lg'>{incentiveData && incentiveData?.green}</span>
            </div>

          </div>

        </div>
      </div>
      <div className='py-10' style={{ backgroundColor: '#79B311' }}>
      </div>
    </div>
  );
};

export default Incentive;
