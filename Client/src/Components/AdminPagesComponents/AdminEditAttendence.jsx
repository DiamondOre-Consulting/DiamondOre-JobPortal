import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditAttendence = () => {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id);

    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login"); // Redirect to login page if not authenticated
      return;
    }


    useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
            // No token found, redirect to login page
            navigate("/admin-login");
          } else {
            const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

            if (tokenExpiration && tokenExpiration < Date.now()) {
              // Token expired, remove from local storage and redirect to login page
              localStorage.removeItem("token");
              navigate("/admin-login");
            }
          }

        const fetchEmployee = async () => {
            try {
                  const token = localStorage.getItem("token");

                  if (!token) {
                    // Token not found in local storage, handle the error or redirect to the login page
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                  }

                // Fetch associates data from the backend
                const response = await axios.get(
                    `http://localhost:5000/api/admin-confi/all-employees/${id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                );
                if (response.status == 201) {
                    console.log(response.data);
                    setEmployeeDetails(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchEmployee();
    }, []);


    const initialMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const [months, setMonths] = useState(() => {
        return [{ name: 'January', absent: '', late: '', halfDay: '', adjustment: '' }];
    });


    const handleInputChange = (index, fieldName, value) => {
        const updatedMonths = [...months];
        updatedMonths[index][fieldName] = value;
        setMonths(updatedMonths);
    };

   
    const handleAddRow = () => {
        const newMonthIndex = months.length;
        const newMonthName = initialMonthNames[newMonthIndex];
        setMonths([...months, { name: newMonthName, absent: '', late: '', halfDay: '', adjustment: '' }]);
    };
    return (
        <div>
            <h1 className='text-3xl font-bold font-serif text-center my-12'>Employee Attendence</h1>
            <div class="flex justify-center">
                <div class="max-w-md w-full mx-4">
                    <div class="bg-white shadow-md shadow-gray-400 rounded-lg p-6 flex flex-col items-center justify-center">
                        <img class="w-24 h-24 rounded-full mb-4" src={employeeDetails?.profilePic} alt="Employee Image" />
                        <h2 class="text-xl font-semibold mb-2">{employeeDetails?.name}</h2>
                        <p class="text-gray-700 text-sm">{employeeDetails?.email}</p>
                        
                    </div>
                </div>
            </div>
            <div className="overflow-hidden border-b border-gray-200 p-8 text-center px-16">
                <table className="min-w-full text-center">
                    <thead className="bg-blue-950 text-center">
                        <tr className='text-center'>
                            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Month</th>
                            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Absent</th>
                            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Late</th>
                            <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">HalfDay</th>
                            <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Adjectment</th>
                            <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Save</th>
                            <th scope="colgroup" className="px-2 py-3 text-center text-xs font-medium text-gray-100 uppercase tracking-wider">Rows</th>


                        </tr>
                    </thead>
                    <tbody className="bg-white border ">
                        {months.map((month, index) => (
                            <tr key={index} className='border border-1 border-blue-950'>
                                <td className="px-2 py-2 whitespace-nowrap">{month.name}</td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <input type='number' value={month.absent} onChange={(e) => handleInputChange(index, 'absent', e.target.value)} />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <input type='number' value={month.late} onChange={(e) => handleInputChange(index, 'late', e.target.value)} />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <input type='number' value={month.halfDay} onChange={(e) => handleInputChange(index, 'halfDay', e.target.value)} />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <input type='number' value={month.adjustment} onChange={(e) => handleInputChange(index, 'adjustment', e.target.value)} />
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <button type='submit' className='bg-blue-950 text-white p-2 rounded-md' >Save Data</button>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    <button type='submit' className='bg-blue-950 text-white p-2 rounded-md' onClick={handleAddRow}>Add Rows</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminEditAttendence