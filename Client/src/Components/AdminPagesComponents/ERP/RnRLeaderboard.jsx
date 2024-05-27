import React from 'react'
import RNRintern from '..//..//..//assets/R & R _ Intern 1 BG r.png'
import RNRrecuiter from '..//..//..//assets/R & R _ Recruiter bg.png'

const RnRLeaderboard = ({ RnRinterns, RnRRecruiter }) => {
  return (
    <div>
      <section className='bg-gray-50'>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt="Party"
                src={RNRintern}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>

            <div className="lg:py-24">
              <div  className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table  className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead  className="text-xs text-gray-700 uppercase   ">
                    <tr className='bg-blue-900 text-white'>
                      <th scope="col"  className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Counts
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RnRinterns?.map((interns) => (
                      <tr  className="bg-white border-b   hover:bg-gray-50 ">
                        <th
                          scope="row"
                           className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {interns.title}
                        </th>
                        <td  className="px-6 py-4">{interns.name}</td>
                        <td  className="px-6 py-4">{interns.count}</td>
                        <td  className="px-6 py-4">{interns.percentage}</td>
                      </tr>

                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-gray-200'>
        <div  className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div  className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div  className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:h-full">
              <img
                alt="Party"
                src={RNRrecuiter}
                 className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>

            <div  className="lg:py-24">
              <div  className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table  className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead  className="text-xs text-gray-700 uppercase bg-gray-50  ">
                    <tr className='bg-blue-900 text-white'>
                      <th scope="col"  className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Counts
                      </th>
                      <th scope="col"  className="px-6 py-3">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RnRRecruiter?.map((recuiter) => (

                      <tr  className="bg-white border-b   hover:bg-gray-50 ">
                        <th
                          scope="row"
                           className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {recuiter.title}
                        </th>
                        <td  className="px-6 py-4">{recuiter.name}</td>
                        <td  className="px-6 py-4">{recuiter.count}</td>
                        <td  className="px-6 py-4">{recuiter.percentage}</td>
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