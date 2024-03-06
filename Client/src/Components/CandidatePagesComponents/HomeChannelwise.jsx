import React from "react";
import { Link } from "react-router-dom";

const HomeChannelwise = () => {
  return (
    <div  className="bg-white py-6 sm:py-8 lg:py-12">
      <div  className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2  className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl ">
          Channelwise Jobs
        </h2>


        <div  className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <Link
              to={'/all-banca-jobs'}
               className="flex flex-col justify-center h-auto overflow-hidden rounded-lg  p-4 shadow-lg"
            >
              <div  className="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer shadow-xl shadow-gray-200 hover:bg-blue-950 hover:shadow-blue-900 text-gray-800 hover:text-gray-200">
                <span  className="text-md font-bold lg:text-md">
                  Banca Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-direct-jobs'}
               className="flex flex-col justify-center h-auto overflow-hidden rounded-lg p-4 shadow-lg"
            >
              <div  className="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer shadow-xl shadow-gray-200 hover:bg-blue-950 hover:shadow-blue-900 text-gray-800 hover:text-gray-200">
                <span  className="text-md font-bold lg:text-md">
                  Direct Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-agency-jobs'}
               className="flex flex-col justify-center h-auto overflow-hidden rounded-lg  p-4 shadow-lg"
            >
              <div  className="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer shadow-xl shadow-gray-200 hover:bg-blue-950 hover:shadow-blue-900 text-gray-800 hover:text-gray-200">
                <span  className="text-md font-bold lg:text-md">
                  Agency Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-other-jobs'}
               className="flex flex-col justify-center h-auto overflow-hidden rounded-lg  p-4 shadow-lg"
            >
              <div  className="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span  className="text-md font-bold lg:text-md">
                  Others
                </span>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeChannelwise;
