import React from "react";

const JoiningsForWeek = ({ Joinings }) => {
  console.log(Joinings)
  return (
    <div>
      <div className='mt-6 mb-10 md:overflow-auto overflow-scroll'>
        <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'> This Week's Joinings</h1>
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center border">
            <tr className="bg-blue-950 text-white">
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Client
              </th>
              <th scope="col" className="px-6 py-3">
               Location
              </th>
              <th scope="col" className="px-6 py-3">
               Recruiter name 
              </th>
              <th scope="col" className="px-6 py-3">
               Team Leader
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

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {join.client}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {join.location}
                </th>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {join.recruiterName}
                </th>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {join.teamLeaderName}
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
