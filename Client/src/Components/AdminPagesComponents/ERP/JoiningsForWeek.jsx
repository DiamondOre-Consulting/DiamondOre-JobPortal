import React from "react";

const JoiningsForWeek = ({ Joinings }) => {

  return (
    <div>
      <div className='mt-6 mb-10 overflow-scroll md:overflow-auto'>
        <h1 className='px-10 py-2 text-xl font-semibold text-center text-gray-900 uppercase'> This Week's Joinings</h1>
        <table className="w-full text-sm text-center text-gray-500 border rtl:text-right">
          <thead className="text-xs text-center text-gray-700 uppercase border bg-gray-50">
            <tr className="text-white bg-blue-950">
              <th scope="col" className="px-6 py-3">
                Channel
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
              <tr className="bg-white border-b hover:bg-gray-50 ">
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
