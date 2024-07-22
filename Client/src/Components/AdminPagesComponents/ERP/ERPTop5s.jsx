import React from "react";
import top5hr from '..//..//..//assets/Top 5 HR bg removed.png'
import top5client from '..//..//..//assets/Top 5 Clients Clear BG.png'

const ERPTop5s = ({ hrname, client }) => {
  return (
    <div>
      <div className='mt-10 md:mt-20 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className=''>
            <h1 className='uppercase text-2xl font-semibold  text-gray-900 px-10 py-2 text-center'> Top 5 hr</h1>
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 border border-1">
              <thead className="text-xs text-gray-700 uppercase bg-white  ">
                <tr className="bg-blue-900 text-white">
                  <th scope="col" className="px-6 py-3">
                    serial No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Top5hrs
                  </th>
                </tr>

                {hrname?.map((hrs) => (
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {hrs.serialNumber}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {hrs.name}
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
          <div className=''>
            <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'> Top 5 Clients</h1>
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 border border-1">
              <thead className="text-xs text-gray-700 uppercase bg-white  ">
                <tr className="bg-blue-900 text-white">
                  <th scope="col" className="px-6 py-3">
                    S. No.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Top5Client
                  </th>
                </tr>
              </thead>
              <tbody>
                {client?.map((cl) => (
                  <tr className="bg-white">
                    <th scope="col" className="px-6 py-3">
                      {cl.serialNumber}
                    </th>
                    <th scope="col" className="px-6 py-3">
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
  );
};

export default ERPTop5s;
