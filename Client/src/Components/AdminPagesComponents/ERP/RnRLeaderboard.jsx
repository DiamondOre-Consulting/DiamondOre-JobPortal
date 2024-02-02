import React from 'react'

const RnRLeaderboard = ({ RnRinterns, RnRRecruiter }) => {
  return (
    <div>
      <section className='bg-blue-950'>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt="Party"
                src="https://s3.tebi.io/generalpics/R%20%26%20R%20_%20Intern_2.png"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Counts
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RnRinterns?.map((interns) => (
                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {interns.title}
                        </th>
                        <td class="px-6 py-4">{interns.name}</td>
                        <td class="px-6 py-4">{interns.count}</td>
                        <td class="px-6 py-4">{interns.percentage}</td>
                      </tr>

                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-red-50'>
        <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div class="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full">
              <img
                alt="Party"
                src="https://s3.tebi.io/generalpics/R%20%26%20R%20_%20Recruiter_2.png"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div class="lg:py-24">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Counts
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RnRRecruiter?.map((recuiter) => (

                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {recuiter.title}
                        </th>
                        <td class="px-6 py-4">{recuiter.name}</td>
                        <td class="px-6 py-4">{recuiter.count}</td>
                        <td class="px-6 py-4">{recuiter.percentage}</td>
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
  )
}

export default RnRLeaderboard