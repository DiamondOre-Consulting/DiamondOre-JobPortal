import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const EachEmployeeAccounts = () => {
    const [showpopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [accountdetail, seAccountDetail] = useState([]);
    const { id } = useParams();
    const [deletepopup, setDeletePopup] = useState(false);
    const [northData, setNorthData] = useState([])
    const [eastData, setEastData] = useState([])
    const [southData, setSouthData] = useState([])
    const [westData, setWestData] = useState([])
    const [centralData, setCentralData] = useState([])
    const [allData, setAllData] = useState([])
    const [listId, setListId] = useState()
    const token = localStorage.getItem("token");


    console.log("test", accountdetail)

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://api.diamondore.in/api/employee/accounts/${id}`);

            if (response.status === 200) {
console.log("accounts details  also",response.data)
                seAccountDetail(response.data);
                setNorthData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "north"));
                setEastData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "east"));
                setSouthData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "south"));
                setWestData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "west"));
                setCentralData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "central"));
                setAllData(response.data.findAccount.accountDetails.filter(item => (item.zoneName).toLowerCase() === "all"));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        fetchData();
    }, []);

    console.log("northData", northData)
    console.log("eastData", eastData)
    console.log("southData", southData)
    console.log("westData", westData)

    const [employees, setEmployees] = useState([]);
    const [accountid, setAccountId] = useState('');

    console.log(employees)

    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {

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
                    setEmployees(response?.data.allEmployees);
                    
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, []);


    const handleClick = (id) => {
        setAccountId(id);
        setShowPopup(true)
    }

    console.log(listId)

    const handleEdit = async () => {
        const response = await axios.put(
            `https://api.diamondore.in/api/employee/accounts/change-owner/${id}/${listId}/${accountid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            fetchData()
            setShowPopup(false)
        }
        setDeletePopup(false)
    }


    const handleDeleteClick = async (deleteId) => {

        setAccountId(deleteId)
        setDeletePopup(true)

    }

    const handleDelete = async () => {
        const response = await axios.delete(
            `https://api.diamondore.in/api/employee/accounts/delete/${id}/${accountid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            fetchData()
            setDeletePopup(false)
        }
        setDeletePopup(false)
    }
    return (
        <>

            <h1 className='text-4xl font-bold text-center'>Accounts</h1>

            <div>

                <div className='overflow-x-auto md:w-full w-80'>
                    <table className="w-full mt-4 divide-y divide-gray-200 ">
                        <thead className='text-center border'>
                            <tr className='text-center bg-gray-100 border'>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">S.No</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">HR Name</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Zone</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Channel</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">phone</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Client Name</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Joinings</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Amount</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-center divide-y divide-gray-200">
                            {allData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}
                            {centralData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}
                            {westData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}
                            {eastData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{westData.length + index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}
                            {northData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{eastData.length + westData.length + 1 + index}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}

                            {southData?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{northData.length + eastData.length + westData.length + 1 + index}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount || 0}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}




                        </tbody>
                        {/* <tbody className="text-center divide-y divide-gray-200 ">
                            {accountdetail?.findAccount?.accountDetails?.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border whitespace-nowrap ">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border whitespace-nowrap ">{row?.detail?.hrName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border whitespace-nowrap ">{row?.detail?.zoneName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border whitespace-nowrap ">{row?.detail?.channel}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border whitespace-nowrap ">{row?.detail?.clientName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border whitespace-nowrap ">{row?.detail?.phone}</td>
                                    <td className='px-4 py-2 text-xs border cursor-pointer'> <span className='text-red-400 hover:underline' onClick={() => handleClick(row._id)}>Edit </span> / <span onClick={() => handleDeleteClick(row._id)} className='text-red-600 hover:underline'>Delete</span></td>
                                </tr>
                            ))}

                            {accountdetail?.length === 0 && (
                                <div className="mt-10 text-center">
                                    No data available .
                                </div>
                            )}
                        </tbody> */}
                    </table>

                </div>
            </div>





            {showpopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
                    <div className="w-3/4 max-w-md p-6 bg-white rounded-md shadow-md">
                        <h2 className="mb-4 text-lg font-semibold">Change Account Owner</h2>
                        <form>


                            <div className="mb-4">
                                <select
                                    className="w-full px-2 py-2"
                                    // value={formData.EmpOfMonth}
                                    // onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
                                    onChange={(e) => setListId(e.target.value)}
                                >
                                    <option value="">Change Owner</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id} >
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 mr-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">Close</button>
                                <button type="submit" className="px-4 py-2 text-white bg-orange-400 rounded-md hover:bg-orange-500" onClick={handleEdit}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {deletepopup && (
                <div id="modelConfirm" className="fixed inset-0 z-50 w-full h-full px-4 overflow-y-auto bg-gray-900 bg-opacity-60">
                    <div className="relative max-w-md mx-auto bg-white rounded-md shadow-xl top-40">
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
                            <svg className="w-20 h-20 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="mt-5 mb-6 text-xl font-normal text-gray-500">Are you sure you want to delete this Account?</h3>
                            <button onClick={handleDelete}
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
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