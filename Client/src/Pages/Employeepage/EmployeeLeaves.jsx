import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeNavbar from './EmployeeNavbar';
import Footer from '../HomePage/Footer';

const EmployeeLeaves = () => {

  const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];
  const [record, setRecord] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [totalLeavesis, setTotalLeavesis] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  console.log("token", decodedToken)
  const userId = decodedToken?.userId; // Accessing the ID from decoded token
  console.log(userId)



  useEffect(() => {
    const fetchEmployeeAndLeaveReport = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/employee-login");
          return;
        }

        // Fetch leave report

        const leaveReportResponse = await axios.get(
          `api.diamondore.in/api/employee/leave-report`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );
        if (leaveReportResponse.status === 200) {
          console.log("leave report response", leaveReportResponse.data);
          console.log(leaveReportResponse.data);
          const all = leaveReportResponse.data;
          const latest = all.slice(-1);
          console.log(latest);
          setTotalLeavesis(latest[0]);

          console.log("latest", totalLeavesis.totalLeaves);
          console.log(leaveReportResponse.data)
          setRecord(leaveReportResponse.data);

        }
      }
      catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchEmployeeAndLeaveReport();
  }, [id, navigate,]);

  return (
    <>

      <EmployeeNavbar />

      <div className='p-4'>
        <h2 className='text-center font-bold  mb-1 text-2xl mt-2 text-blue-950 mb-4 font-bold'>Attendence</h2>
        <div  className="relative overflow-x-auto mt-8 pt-8 mb-4 px-16">
        <span className='bg-blue-950 shadow-lg text-white  rounded-lg p-2 border-black m-4 '>totalleaves:- {totalLeavesis.totalLeaves}</span>
          <table  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gray-50 mt-4">
            <thead  className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">

              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                  Details
                </th>

                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                  Absent
                </th>
                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                  Late
                </th>
                <th scope="col" className="px-6 py-3 rounded-s-lg ">
                  Half Day
                </th>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  Adjectment
                </th>



              </tr>
            </thead>
            <tbody>
              {Month.map((month, index) => (
                <tr key={index}>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {month}
                  </th>
                  {/* Display attendance details for each month */}
                  <td className="px-6 py-4">
                    {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.absentDays || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.lateDays || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.halfDays || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {record.find(rec => rec.month === month && rec.year === new Date().getFullYear())?.adjustedLeaves || '-'}
                  </td>
                </tr>
              ))}




            </tbody>

          </table>
        </div>

      </div>
      <Footer />
    </>

  )
}

export default EmployeeLeaves