import React from "react";

const JoiningsForWeek = ({ Joinings }) => {
  return (
    <div>
      <div className='mt-6 mb-10 md:overflow-auto overflow-scroll'>
        <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'> This Week's Joinings</h1>
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center border">
            <tr className="bg-blue-950 text-white">
              <th scope="col" className="px-6 py-3">
                position
              </th>
              <th scope="col" className="px-6 py-3">
                No. of joinings
              </th>
            </tr>
          </thead>
          <tbody>
            {Joinings?.map((join) => (
              <tr className="bg-white border-b  hover:bg-gray-50 ">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {join.names}
                </th>
                <td className="px-6 py-4">{join.noOfJoinings}</td>
              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JoiningsForWeek;
