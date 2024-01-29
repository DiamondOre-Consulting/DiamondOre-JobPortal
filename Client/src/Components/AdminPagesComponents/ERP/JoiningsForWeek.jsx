import React from "react";

const JoiningsForWeek = () => {
  return (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16"> */}
          {/* <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
            <img
              alt="Party"
              src="https://s3.tebi.io/generalpics/Top%205%20HR.png"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div> */}

          <h2 className="text-3xl mb-6 text-center px-10 font-bold text-gray-800">
            This week's Joinings
          </h2>
          <div className="lg:py-18">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      S. No.
                    </th>
                    <th scope="col" class="px-6 py-3">
                      HR Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">Silver</td>
                  </tr>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Microsoft Surface Pro
                    </th>
                    <td class="px-6 py-4">White</td>
                  </tr>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">Silver</td>
                  </tr>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">Silver</td>
                  </tr>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">Silver</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* </div> */}
        </div>
      </section>
    </div>
  );
};

export default JoiningsForWeek;
