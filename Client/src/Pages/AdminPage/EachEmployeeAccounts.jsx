import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const EachEmployeeAccounts = () => {
    const [showpopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [accountdetail, seAccountDetail] = useState([]);
    const { id } = useParams();
    const [deletepopup, setDeletePopup] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/employee/accounts/${id}`);

                if (response.status === 200) {
                    console.log("Account handling data", response.data);
                    seAccountDetail(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);



    const [employees, setEmployees] = useState([]);
    const [accountid, setAccountId] = useState('');

    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "https://api.diamondore.in/api/admin-confi/all-employees",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    setEmployees(response.data);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, []);


    const handleClick = (id) => {
        console.log(id)
        setAccountId(id);
        setShowPopup(true)

    }


    const handledeleteclick = (id) => {
        console.log(id);
        setAccountId(id)
        setDeletePopup(true)
    }
    return (
        <>

            <h1 className='text-center font-bold text-4xl text-center'>Accounts</h1>

            <div>


                <table className="md:w-full divide-y divide-gray-200 dark:divide-neutral-700 mt-4 ">
                    <thead className='border text-center'>
                        <tr className='border text-center bg-gray-100'>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">S.No</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">HR Name</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Zone</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Channel</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Client Name</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">phone</th>
                            <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 text-center ">
                        {accountdetail?.findAccount?.accountDetails?.map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm font-medium text-gray-800 dark:text-neutral-200">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.hrName}</td>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.zone}</td>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.channel}</td>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.clientName}</td>
                                <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.phone}</td>
                                <td className='borrder px-4 py-2 text-xs cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handledeleteclick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                            </tr>
                        ))}

                        {accountdetail?.length === 0 && (
                            <div className="text-center mt-10">
                                No data available .
                            </div>
                        )}
                    </tbody>
                </table>
            </div>





            {showpopup && (
                <div className="fixed inset-0 flex items-center bg-gray-900 bg-opacity-60 justify-center z-50">
                    <div className="bg-white shadow-md rounded-md p-6 w-3/4 max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Change Account Owner</h2>
                        <form>


                            <div className="mb-4">
                                <select
                                    className="w-full py-2 px-2"
                                // value={formData.EmpOfMonth}
                                // onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
                                >
                                    <option value="">Change Owner</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2">Close</button>
                                <button type="submit" className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {deletepopup && (
                <div id="modelConfirm" className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
                    <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
                        <div className="flex justify-end p-2">
                            <button onClick={() => setDeletePopup(false)}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 pt-0 text-center">
                            <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to delete this Course?</h3>
                            <a href="#"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </a>
                            <a href="#" onClick={() => setDeletePopup(false)}
                                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                                data-modal-toggle="delete-user-modal">
                                No, cancel
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EachEmployeeAccounts