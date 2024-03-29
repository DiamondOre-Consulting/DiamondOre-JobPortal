import React, { useEffect } from "react";

const HomeNews = ({ empofthemonth, latestnews, hrname }) => {

  return (
    <div className="mx-10 my-16">
      {/* Employee of the month */}
      <h2 className="text-3xl sm:text-sm mb-6 lg:text-3xl text-center px-10 font-bold text-gray-800 font-bold ">
        Employee Of The Month
      </h2>
      <div className="flex justify-center mb-16">
        <a
          href="#"
          className="relative block overflow-hidden bg-blue-950 shadow-lg shadow-gray-600 rounded-md border-gray-100 p-4 sm:p-6 lg:p-8"
        >
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

          <div className="sm:flex sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl capitalize">
                {empofthemonth}
              </h3>

              <p className="mt-1 text-xs font-medium text-gray-200">
                Employee Of The Month
              </p>
            </div>

            <div className="hidden sm:block sm:shrink-0">
              <img
                alt="Paul Clapton"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                className="h-16 w-16 rounded-lg object-cover shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="max-w-[40ch] text-sm text-gray-300">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit
              illum provident a, ipsa maiores deleniti consectetur nobis et eaque.
            </p>
          </div>

          <dl className="mt-6 flex gap-4 sm:gap-6">
            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-400">Published</dt>
              <dd className="text-xs text-gray-500">31st June, 2021</dd>
            </div>

            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-400">Reading time</dt>
              <dd className="text-xs text-gray-400">3 minute</dd>
            </div>
          </dl>
        </a>
      </div>

      {/* Announcements */}
      <h2 className="text-3xl mb-6 text-center px-10 font-bold text-gray-800 ">
        Breaking News & Announcements
      </h2>
      
      <div className="space-y-4">
        {latestnews?.map((newNews) => (
          <details className="group">
            <summary className="flex cursor-pointer items-center shadow-lg shadow-gray-200 justify-start gap-5 rounded-md bg-blue-950 px-4 py-3">
              <p className="font-semibold text-gray-200">{newNews.serialNumber}</p>
              <h2 className="font-medium text-gray-200">
                {newNews.news}
              </h2>
            </summary>
          </details>
        ))}
      </div>
 
    </div>
  );
};

export default HomeNews;
