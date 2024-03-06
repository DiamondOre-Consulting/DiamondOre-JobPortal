import React from "react";

const JoiningsForWeek = ({ Joinings }) => {
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

          <h2 className="text-3xl mb-6 text-center px-10 font-bold text-gray-800 ">
            This week's Joinings
          </h2>
          <div className="lg:py-18">
            <div  className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="bg-blue-950 text-white">
                    <th scope="col"  className="px-6 py-3">
                      position
                    </th>
                    <th scope="col"  className="px-6 py-3">
                      No.joinings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Joinings?.map((join) => (
                    <tr  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                         className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                       {join.names}
                      </th>
                      <td  className="px-6 py-4">{join.noOfJoinings}</td>
                    </tr>

                  ))}

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
