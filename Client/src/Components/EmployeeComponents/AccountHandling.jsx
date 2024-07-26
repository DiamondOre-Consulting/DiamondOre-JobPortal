import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AccountHandling = ({ userData }) => {
    const [rows, setRows] = useState([]);
    const [popupform, setPopUpForm] = useState(false);
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [accountdetails , setAccountDetails] = useState([])
    const [form, setForm] = useState({
        hrName: '',
        zone: '',
        channel: '',
        clientName: '',
        phone: '',
    });

    console.log("userdata", userData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/employee/accounts/${userData?.id}`);

                if (response.status === 200) {
                    setRows(response.data);
                    console.log("Account handling data", response.data);
                    setAccountDetails(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [refresh , userData?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setShowSubmitLoader(true);
        try {
            const response = await axios.put('http://localhost:5000/api/employee/set-account-handling', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                console.log("data", response.data);
                setRows([...rows, response.data]);
                setForm({
                    hrName: '',
                    zone: '',
                    channel: '',
                    clientName: '',
                    phone: '',
                });
                setShowSubmitLoader(false);
                setSnackbarOpen(true);
                setPopUpForm(false);
                setRefresh(!refresh);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            setShowSubmitLoader(false);
            setPopUpForm(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
        <div>
            <h1 className='text-3xl md:text-4xl font-bold'>Account Handling</h1>
            <div className='w-20 h-0.5 bg-blue-900'></div>

            <div className="relative w-full max-w-xl my-8 md:my-10 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-4 border-2 border-dotted border-gray-400 dark:border-gray-400 shadow-lg rounded-lg justify-between">
                <div className='flex'>
                    <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-blue-900 text-gray-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dotted ">
                        Account Handler
                    </span>
                    <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                        <img className="object-cover w-20 h-20 mt-3 mr-3 rounded-full" src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="User" />
                    </div>
                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                        <p className="font-display mb-2 text-2xl font-semibold dark:text-gray-200" itemProp="author">
                            {userData?.name}
                        </p>
                        <div className="mb-4 md:text-lg text-gray-600">
                            <p>Email: {userData?.email}</p>
                            <p>Team Leader: Amaan</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-end mb-1'>
                <button className='bg-blue-900 px-4 py-2 text-gray-100 rounded-full' onClick={() => setPopUpForm(true)}> Add Data</button>
            </div>
            <div className="flex flex-col mb-10 w-72 md:w-full">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden border">
                            <table className="md:w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
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

                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 text-center">
                                    {accountdetails?.findAccount?.accountDetails?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm font-medium text-gray-800 dark:text-neutral-200">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.hrName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.zone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.channel}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.clientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.detail.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-center text-sm font-medium">
                                                <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {popupform && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
                    <form onSubmit={handleSubmit} className=" rounded-lg shadow-xl bg-white w-4/5 sm:w-3/5 lg:w-1/4 mt-10 relative p-6">
                        <h2 className="text-xl font-semibold mb-4">Add Details</h2>
                        <div className="grid gap-4 grid-cols-1">
                            <input
                                type="text"
                                name="hrName"
                                placeholder="HR Name"
                                value={form.hrName}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="zone"
                                placeholder="Zone"
                                value={form.zone}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="channel"
                                placeholder="Channel"
                                value={form.channel}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="clientName"
                                placeholder="Client Name"
                                value={form.clientName}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="phone"
                                value={form.phone}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                            {showSubmitLoader ? (
                                <svg
                                    className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            ) : (
                                'Submit'
                            )}
                        </button>
                        <button type="button" onClick={() => setPopUpForm(false)} className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md">
                            Close
                        </button>
                    </form>
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Account details updated successfully!
                </Alert>
            </Snackbar>

        </div>
    );
};

export default AccountHandling;
