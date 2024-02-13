import React, { useEffect, useState } from 'react'
import EmployeeNavbar from './EmployeeNavbar'
import Footer from '../HomePage/Footer'
import { useJwt } from "react-jwt";
import axios from 'axios';

const EmployeeLeaves = () => {

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchAllEmployee = async () => {
      try {
        // Fetch associates data from the backend
        const response = await axios.get(
          // "http://localhost:5000/api/admin-confi/all-employees",
          
        );
        if (response.status == 200) {
          console.log(response.data);
          setEmployees(response.data)
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllEmployee();
  }, []);

  return (
    <>
      {employees.map((emp) => {
        return (
          <tr>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700 object-cover w-4 cursor-pointer"><img onClick={() => handleOpen(emp)} src={emp.profilePic} /></td>
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{emp.name}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{emp.email}</td>
          </tr>

        )
      })}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="bg-blue-950 text-center">
            <tr className='text-center'>
              <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Month</th>
              <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Absent</th>
              <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Late</th>
              <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">HalfDay</th>
              <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Adjectment</th>



            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr class="odd:bg-gray-50 text-center">
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">John Doe</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">Web Developer</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">$120,000</td>
            </tr>

            <tr class="odd:bg-gray-50 text-center">
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Jane Doe</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">04/11/1980</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">Web Designer</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">$100,000</td>
            </tr>

            <tr class="odd:bg-gray-50 text-center">
              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gary Barlow</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">Singer</td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">$20,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>

  )
}

export default EmployeeLeaves