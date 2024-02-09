import React from "react";
import top5hr from '..//..//..//assets/Top 5 HR bg removed.png'
import top5client from '..//..//..//assets/Top 5 Clients Clear BG.png'

const ERPTop5s = ({ hrname, client }) => {
  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt="Party"
                src={top5hr}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-blue-900 text-white">
                      <th scope="col" class="px-6 py-3">
                        serial No
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Top5hrs
                      </th>
                    </tr>

                    {hrname?.map((hrs) => (
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          {hrs.serialNumber}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {hrs.name}
                        </th>
                      </tr>
                    ))}
                  </thead>
                  <tbody>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
<hr className="bg-black"></hr>
      <section className="bg-gray-200">
        <div class="mx-auto py-24 max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full">
              <img
                alt="Party"
                src={top5client}
                class="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-blue-900 text-white">
                      <th scope="col" class="px-6 py-3">
                        S. No.
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Top5Client
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {client?.map((cl) => (
                      <tr className="bg-white">
                        <th scope="col" class="px-6 py-3">
                          {cl.serialNumber}
                        </th>
                        <th scope="col" class="px-6 py-3">
                          {cl.name}
                        </th>
                      </tr>
                    ))}


                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ERPTop5s;
