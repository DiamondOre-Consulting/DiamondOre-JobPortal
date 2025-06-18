import React, { useEffect } from "react";

const HomeNews = ({ employee, latestnews, profilePicUrl, empOfMonthDesc, recognitionType }) => {
  console.log(profilePicUrl)

  console.log(employee)
  return (
    <div className="mx-4 my-16 md:mx-10">
      {/* Employee of the month */}
      {latestnews?.map((newNews, ind) => (
        <div key={ind} id="alert-additional-content-3" className="p-4 mt-8 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
          <div className="flex items-center">
            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">Breaking News & Annoucement</h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
            {newNews.news}
          </div>
          {/* <div class="flex">
                    <button type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center   ">
                        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        View more
                    </button>
                    <button type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center     " data-dismiss-target="#alert-additional-content-3" aria-label="Close">
                        Dismiss
                    </button>
                </div> */}
        </div>
      ))}

      {/* Employee Of the Month  */}

      <div className='my-10 '>
        <div className='grid grid-cols-1 px-6 md:grid-cols-3'>
          <div className='col'>
           {profilePicUrl && 
           <div className='absolute mt-10 border border-2 border-blue-900 h-52 opacity-1 w-60 '></div>}

             {profilePicUrl &&<div><img className="relative object-cover h-52 bottom-1 left-10 w-60 " src={profilePicUrl || "https://easy-feedback.de/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it.jpg"} alt="" /></div>}
            
          </div>

          <div className='flex flex-col mt-20 md:col-span-2 md:mt-0 '>
            {/* <h1 className='text-3xl font-bold text-gray-700 uppercase md:text-5xl'>Employee of the month</h1> */}
           {recognitionType&& <h1 className='text-3xl font-bold text-gray-700 uppercase md:text-5xl'>{recognitionType}</h1>}

            <div className='mt-4'>
             {employee && employee?.name && <h1 className='text-xl font-bold capitilized'>{employee?.name}</h1>}

              {empOfMonthDesc&&<p>{empOfMonthDesc||""}</p>}
            </div>
          </div>

        </div>

      </div>
      {employee&&<div className='mx-auto bg-blue-900 w-60  h-0.5'></div>}
    </div>
  );
};

export default HomeNews;
