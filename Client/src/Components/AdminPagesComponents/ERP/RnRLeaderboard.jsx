import React from 'react'
import RNRintern from '..//..//..//assets/R & R _ Intern 1 BG r.png'
import RNRrecuiter from '..//..//..//assets/R & R _ Recruiter bg.png'

const RnRLeaderboard = ({ RnRinterns, RnRRecruiter }) => {
  return (
    <div>
      <div className='mt-20 px-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10'>
          <div className='md:overflow-auto overflow-scroll'>
            <h1 className='uppercase text-2xl font-semibold  text-gray-900 px-10 py-2 text-center'>R & R LeaderBoard</h1>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-1 ">
              <thead className="text-xs text-gray-700 uppercase   text-center">
                <tr className='bg-blue-900 text-white'>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Counts
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {RnRinterns?.map((interns) => (
                  <tr className="bg-white border-b hover:bg-gray-50 text-center">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {interns.title}
                    </th>
                    <td className="px-6 py-4">{interns.name}</td>
                    <td className="px-6 py-4">{interns.count}</td>
                    <td className="px-6 py-4">{interns.percentage}</td>
                  </tr>

                ))}

              </tbody>
            </table>
          </div>
          <div className='md:overflow-auto overflow-scroll'>
            <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'>R & R LeaderBoard Recruiter</h1>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-1 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                <tr className='bg-blue-900 text-white text-center'>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Counts
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {RnRRecruiter?.map((recuiter) => (

                  <tr className="bg-white border-b hover:bg-gray-50 text-center ">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
                    >
                      {recuiter.title}
                    </th>
                    <td className="px-6 py-4">{recuiter.name}</td>
                    <td className="px-6 py-4">{recuiter.count}</td>
                    <td className="px-6 py-4">{recuiter.percentage}</td>
                  </tr>

                ))}

              </tbody>
            </table>
          </div>



        </div>
      </div>
    </div>
  )
}

export default RnRLeaderboard