import React, { useEffect } from "react";

const HomeNews = ({ employee, latestnews, hrname }) => {

  return (
    <div className="mx-4 md:mx-10 my-16">
      {/* Employee of the month */}
      {latestnews?.map((newNews) => (
        <div id="alert-additional-content-3" class="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 mt-8" role="alert">
          <div class="flex items-center">
            <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <h3 class="text-lg font-medium">Breaking News & Annoucement</h3>
          </div>
          <div class="mt-2 mb-4 text-sm">
            {newNews.news}
          </div>
          {/* <div class="flex">
                    <button type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        View more
                    </button>
                    <button type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800" data-dismiss-target="#alert-additional-content-3" aria-label="Close">
                        Dismiss
                    </button>
                </div> */}
        </div>
      ))}

      {/* Employee Of the Month  */}

      <div className='my-10 '>
        <div className='grid grid-cols-1 md:grid-cols-3 px-6'>
          <div className='col'>
            <div className='absolute border border-blue-900 border-2 opacity-1 h-40 w-60 mt-10 '></div>
            <div><img className="relative bottom-1 left-10  w-60 h-40 " src="https://easy-feedback.de/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it.jpg" alt="" /></div>
          </div>

          <div className='md:col-span-2  mt-20 md:mt-0 flex flex-col '>
            <h1 className='uppercase font-bold text-3xl md:text-5xl text-gray-700'>Employee of the month</h1>

            <div className='mt-4'>
              <h1 className='font-bold text-xl capitilized'>{employee?.name}</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quisquam ratione facere quaerat quam. Iste dolorum, quod sed nihil sint, debitis vel illo, voluptas labore odit nulla dolore? Libero exercitationem fuga harum quo! Delectus sequi ut est sunt, a doloremque ipsum impedit culpa maiores possimus suscipit nostrum id quidem, odio nihil aut expedita, perspiciatis repudiandae. Soluta voluptates rerum hic odit?</p>
            </div>
          </div>

        </div>

      </div>
      <div className='mx-auto bg-blue-900 w-60  h-0.5'></div>
    </div>
  );
};

export default HomeNews;
