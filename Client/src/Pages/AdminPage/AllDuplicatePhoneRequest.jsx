import React, { useEffect, useState } from 'react';
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AllDuplicatePhoneRequest = () => {
    const [phonerequest, setAllPhoneRequest] = useState([]);
    const [popup, setShowPopup] = useState(false);
    const [status, setStatus] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [id, setId] = useState('');

    useEffect(() => {
        const fetchDuplicatePhoneRequest = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    // navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/admin-confi/duplicate-phone-requests",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    const requests = response.data;

                    // Extract unique employee and owner IDs
                    const employeeIds = Array.from(new Set(requests.flatMap(account => account.requests.map(request => request.reqDetail.employee))));
                    const ownerIds = Array.from(new Set(requests.map(account => account.owner)));

                    // Fetch employee names
                    const employeeDetails = await Promise.all(employeeIds.map(id =>
                        axios.get(`http://localhost:5000/api/admin-confi/all-employees/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(res => res.data)
                    ));

                    // Fetch owner names
                    const ownerDetails = await Promise.all(ownerIds.map(id =>
                        axios.get(`http://localhost:5000/api/admin-confi/all-employees/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(res => res.data)
                    ));

                    // Create a map of employee and owner IDs to names
                    const employeeMap = employeeDetails.reduce((map, employee) => {
                        map[employee._id] = employee.name;
                        return map;
                    }, {});

                    const ownerMap = ownerDetails.reduce((map, owner) => {
                        map[owner._id] = owner.name;
                        return map;
                    }, {});

                    // Add employee and owner names to the requests
                    const requestsWithNames = requests.map(account => ({
                        ...account,
                        ownerName: ownerMap[account.owner],
                        requests: account.requests.map(request => ({
                            ...request,
                            reqDetail: {
                                ...request.reqDetail,
                                employeeName: employeeMap[request.reqDetail.employee]
                            }
                        }))
                    }));

                    setAllPhoneRequest(requestsWithNames);
                    console.log("All duplicate phone requests with employee and owner names", requestsWithNames);
                }
            } catch (error) {
                console.error("Error fetching duplicate phone requests:", error);
            }
        };

        fetchDuplicatePhoneRequest();
    }, []);

    // Close the Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Open the popup by id
    const handleClick = (id) => {
        console.log(id)
        setId(id);
        setShowPopup(true)
    }

    // Update account handling 
    const updateaccounthandling = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(`http://localhost:5000/api/admin-confi/account-handling/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                console.log("account updated");
                setSnackbarOpen(true);
                setShowPopup(false);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h1 className='text-center font-bold text-xl md:text-3xl'>All Duplicate Account Phone Requests</h1>
            <div className="w-full pt-10 lg:w-full relative isolate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {phonerequest.map(account => (
                    account.requests.map(request => (
                        <div key={request._id} className="grid grid-rows-1 p-5 bg-white rounded-xl gap-y-2 w-full border border-slate-500/50 hover:shadow-[5px_5px_0_rgba(0,0,0,0.5)] transition-shadow duration-150 ease-linear cursor-pointer" onClick={() => handleClick(account._id)}>
                            <div className="flex flex-col gap-y-2.5">
                                <p className="text-xl font-semibold">Current Owner: {account.ownerName}</p>
                                <h3 className="text-lg font-semibold">Requested Owner: {request.reqDetail.employeeName}</h3>
                                <p className="text-xl font-semibold">Requested Phone: {request.reqDetail.accountPhone}</p>
                            </div>
                            <p className='flex'> Request Status:<span className={`text-base ml-2 ${request.reqDetail.status ? 'text-green-500' : 'text-red-500'}`}>{request.reqDetail.status ? 'Active' : 'Inactive'}</span></p>
                        </div>
                    ))
                ))}
            </div>

            {popup && (
                <div className="fixed inset-0 flex items-center bg-gray-900 bg-opacity-60 justify-center z-50">
                    <div className="bg-white shadow-md rounded-md p-6 w-3/4 max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Change Account Status</h2>
                        <form onSubmit={updateaccounthandling}>
                            <div className="mb-4">
                                <select
                                    className="w-full py-2 px-2"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Change Status</option>
                                    <option value='true'>Active</option>
                                    {/* <option value='false'>Inactive</option> */}
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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Status updated successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default AllDuplicatePhoneRequest;
