import React from "react";
import { Link } from "react-router-dom";

const HomeChannelwise = () => {
  return (
    <div class="bg-white py-6 sm:py-8 lg:py-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          Channelwise Jobs
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <Link
              to={'/all-banca-jobs'}
              class="flex flex-col justify-center h-auto overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
            >
              <div class="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span class="text-md font-bold lg:text-md">
                  Banca Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-direct-jobs'}
              class="flex flex-col justify-center h-auto overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
            >
              <div class="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span class="text-md font-bold lg:text-md">
                  Direct Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-agency-jobs'}
              class="flex flex-col justify-center h-auto overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
            >
              <div class="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span class="text-md font-bold lg:text-md">
                  Agency Channel
                </span>
              </div>
            </Link>
          </div>

          <div>
            <Link
              to={'/all-other-jobs'}
              class="flex flex-col justify-center h-auto overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
            >
              <div class="w-full flex-col rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span class="text-md font-bold lg:text-md">
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
