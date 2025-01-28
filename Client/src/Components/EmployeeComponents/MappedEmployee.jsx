import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MappedEmployee = ({ userData }) => {
    console.log("userdata",userData)
  const teamId = userData?.id
  console.log(teamId)
  const [mappedEmployee, setMappedEmployee] = useState([]);
  const [popup, setPopup] = useState(false);
  const [goalSheetData, setGoalSheetData] = useState([]);
  const [empId, setEmpId] = useState(null);

  // Fetch team members
  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        if (teamId) {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin-confi/get-team/${teamId}`
          );
          if (response.status === 200) {
            setMappedEmployee(response?.data?.team);
            console.log("Team data: is this ", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    getTeamMembers();
  }, [teamId]);

  const handleClick = (id) => {
    setEmpId(id);
    console.log("empid",empId)
    setPopup(true);
  };

  // Fetch goal sheet data
  useEffect(() => {
    const handleGoalSheet = async () => {
      try {
        if (empId) {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/employee/goalsheet/${empId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
           
            setGoalSheetData(response.data);
            console.log("Goal Sheet Data:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching goal sheet data:", error);
      }
    };

    handleGoalSheet();
  }, [empId]);





  return (
    <>
      <div>
        <p className="text-center text-xl font-bold mb-4">All Mapped Employees</p>
        <div className="grid grid-cols-3 gap-10">
          {mappedEmployee?.map((emp) => (
            <div
              onClick={() => handleClick(emp?._id)}
              className="relative flex justify-between p-5 overflow-hidden transition-all duration-500 transform bg-white shadow-xl cursor-pointer hover:shadow-2xl group rounded-xl"
              key={emp._id}
            >
              <div className="flex">
                <div className="w-1 h-full bg-blue-900 rounded-full"></div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="transition-all duration-500 transform w-fit">
                    <h1 className="font-bold text-gray-900">{emp.name}</h1>
                    <p className="text-gray-400">{emp?.empType}</p>
                    <p className="text-xs text-gray-500">
                      Email: {emp?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      DOJ: {emp?.doj}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="w-20 h-20 bg-blue-900 rounded-full -mr-14"></div>
                <div className="z-10 w-5 h-5 -mr-10 bg-blue-900 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {popup && (
     <div className="container mx-auto overflow-x-auto h-[500px] relative mt-8">
     <table className="w-full table-auto border-collapse">
       <thead className="sticky top-0 text-xs text-gray-100 bg-blue-900 shadow">
         <tr>
           <th className="px-4 py-2">Year</th>
           <th className="px-4 py-2">Month</th>
           <th className="px-4 py-2">No. of Joinings</th>
           <th className="px-4 py-2">Revenue</th>
           <th className="px-4 py-2">Cost</th>
           <th className="px-4 py-2">Target</th>
           <th className="px-4 py-2">Cumulative Cost</th>
           <th className="px-4 py-2">Cumulative Revenue</th>
           <th className="px-4 py-2">YTD</th>
           <th className="px-4 py-2">MTD</th>
           <th className="px-4 py-2">Incentive</th>
           <th className="px-4 py-2">Leakage</th>
       
         </tr>
       </thead>
       <tbody>
         {goalSheetData.length > 0 ? (
           goalSheetData.map((data, index) => 
             data.goalSheetDetails.map((detail, detailIndex) => (
               <tr key={`${index}-${detailIndex}`} className="text-center">
                 <td className="px-4 py-2 border">{detail.year}</td>
                 <td className="px-4 py-2 border">{detail.month}</td>
                 <td className="px-4 py-2 border">{detail.noOfJoinings}</td>
                 <td className="px-4 py-2 border">{detail.revenue}</td>
                 <td className="px-4 py-2 border">{detail.cost}</td>
                 <td className="px-4 py-2 border">{detail.target}</td>
                 <td className="px-4 py-2 border">{detail.cumulativeCost}</td>
                 <td className="px-4 py-2 border">{detail.cumulativeRevenue}</td>
                 <td className="px-4 py-2 border">{detail.achYTD}</td>
                 <td className="px-4 py-2 border">{detail.achMTD}</td>
                 <td className="px-4 py-2 border">{detail.incentive ?? "N/A"}</td>
                 <td className="px-4 py-2 border">{detail.leakage ?? "N/A"}</td>
               
               </tr>
             ))
           )
         ) : (
           <tr>
             <td colSpan="13" className="px-4 py-2 text-center border">
               No details available
             </td>
           </tr>
         )}
       </tbody>
     </table>
   </div>
   
      )}
    </>
  );
};

export default MappedEmployee;
