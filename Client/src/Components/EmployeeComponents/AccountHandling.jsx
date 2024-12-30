import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { formControlClasses } from '@mui/material';

const AccountHandling = ({ userData }) => {
    const [rows, setRows] = useState([]);
    const [popupform, setPopUpForm] = useState(false);
    const [showSubmitLoader, setShowSubmitLoader] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [accountdetails, setAccountDetails] = useState([])
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        hrName: '',
        zoneName: '',
        channelName: '',
        clientName: '',
        hrPhone: '',
    });
    const token = localStorage.getItem("token");


    const [eastArray, setEastArray] = useState([]);
    const [westArray, setWestArray] = useState([]);
    const [northArray, setNorthArray] = useState([])
    const [southArray, setSouthArray] = useState([])
    const [allArray, setAllArray] = useState([])
    const [centralArray, setCentralArray] = useState([])

    console.log(form)

    console.log(accountdetails)


    console.log("east", eastArray)
    console.log("west", westArray)
    console.log("north", northArray)
    console.log("south", southArray)

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`https://api.diamondore.in/api/employee/accounts/${userData?.id}`);

            if (response.status === 200) {
                setRows(response.data);

                setAccountDetails(response.data);
                console.log("check")
                console.log("res", response.data)

                setEastArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "east"))
                setWestArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "west"))
                setNorthArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "north"))
                setSouthArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "south"))
                setCentralArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "central"))
                setAllArray(response.data.findAccount.accountDetails.filter(item => item.zoneName === "all"))




            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        fetchData();
    }, [refresh, userData?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("text", name, value)
        setForm({ ...form, [name]: value.toLowerCase() });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setShowSubmitLoader(true);
        setError('')
        console.log(form)
        try {
            const response = await axios.post('https://api.diamondore.in/api/employee/set-account-handling', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setForm({
                    hrName: '',
                    zoneName: '',
                    channelName: '',
                    clientName: '',
                    hrPhone: '',
                });
                setShowSubmitLoader(false);
                setSnackbarOpen(true);
                setPopUpForm(false);
                // window.location.reload();
                setRefresh(!refresh);
                setRows([...rows, response.data]);
                setForm({
                    hrName: '',
                    zoneName: '',
                    channelName: '',
                    clientName: '',
                    hrPhone: '',
                });


            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const { message } = error.response.data;

                setError(message);
                setForm({
                    hrName: '',
                    zoneName: '',
                    channelName: '',
                    clientName: '',
                    hrPhone: '',
                });

            }


            setShowSubmitLoader(false);

        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    let a = 0;

    console.log(accountdetails?.findAccount?.accountDetails)
    // const tableData = accountdetails?.accountHandling?.accountDetails.flatMap((zone) => {
    //     return zone.channels.map((channel) => {
    //       return channel.hrDetails.map((hrDetail) => ({
    //         zoneName: zone.zoneName,
    //         channelName: channel.channelName,
    //         hrName: hrDetail.hrName,
    //         hrPhone: hrDetail.hrPhone,
    //         clientName: zone.clientName || "N/A",  // Default to "N/A" if clientName is not available
    //       }));
    //     });
    //   }).flat(); 

    console.log("object", accountdetails)

    const handleDelete = async (accountId) => {
        const response = await axios.delete(
            `https://api.diamondore.in/api/employee/accounts/delete/${accountdetails?.findAccount?.owner}/${accountId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            fetchData()
        }
    }

    return (
        <div>

            <h1 className='text-3xl font-bold md:text-4xl'>Account Handling</h1>
            <div className='w-20 h-0.5 bg-blue-900'></div>

            <div className="relative flex flex-col items-start justify-between w-full max-w-xl px-4 py-4 my-8 space-y-4 border-2 border-gray-400 border-dotted rounded-lg shadow-lg md:my-10 sm:flex-row sm:space-y-0 sm:space-x-6">
                <div className='flex'>
                    <span className="absolute top-0 left-0 px-2 py-1 text-xs font-medium text-gray-100 bg-blue-900 border-b-2 border-r-2 border-gray-400 border-dotted rounded-tl-lg rounded-br-lg ">
                        Account Handler
                    </span>
                    <div className="flex justify-center w-full sm:justify-start sm:w-auto">
                        <img className="object-cover w-20 h-20 mt-3 mr-3 rounded-full" src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="User" />
                    </div>
                    <div className="flex flex-col items-center w-full sm:w-auto sm:items-start">
                        <p className="mb-2 text-2xl font-semibold font-display " itemProp="author">
                            {userData?.name}
                        </p>
                        <div className="mb-4 text-gray-600 md:text-lg">
                            <p>Email: {userData?.email}</p>
                            {/* <p>Team Leader: Amaan</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-end mb-1'>
                <button className='px-4 py-2 text-gray-100 bg-blue-900 rounded-full' onClick={() => setPopUpForm(true)}> Add Data</button>
            </div>
            <div className="flex flex-col mb-10 w-72 md:w-full">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden border">
                            <table className="divide-y divide-gray-200 md:w-full ">
                                <thead className='text-center border'>
                                    <tr className='text-center bg-gray-200 border'>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">S.No</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">HR Name</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">Zone</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">Channel</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">phone</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">Client Name</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">Joinings</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border border-gray-500 ">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase border ">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="text-center divide-y divide-gray-200">
                                    {allArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {centralArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {westArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {eastArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{westArray.length + index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {northArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{eastArray.length + westArray.length + 1 + index}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {southArray?.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 border border-gray-500 whitespace-nowrap ">{northArray.length + eastArray.length + westArray.length + 1 + index}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.zoneName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.channelName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.channels[0]?.hrDetails[0]?.hrPhone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.clientName[0]}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.joinings}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800 border border-gray-500 whitespace-nowrap ">{row?.amount}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-center border whitespace-nowrap">
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    if (window.confirm('Are you sure you want to delete?')) {
                                                        handleDelete(row?._id)
                                                    }
                                                }} type="button" className="inline-flex items-center text-sm font-semibold text-blue-600 border border-transparent rounded-lg gap-x-2 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none ">Delete</button>
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
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50'>
                    <form onSubmit={handleSubmit} className="relative w-4/5 p-6 mt-10 bg-white rounded-lg shadow-xl sm:w-3/5 lg:w-1/4">
                        <h2 className="mb-4 text-xl font-semibold">Add Details</h2>
                        {error && (
                            <div className="mt-4 text-sm text-red-500">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="hrName"
                                placeholder="HR Name"
                                value={form.hrName}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                            <select className='p-2 rounded-md' onChange={handleInputChange} name="zoneName" id="">
                                <option value="">Select a zone</option>
                                <option value="all">All</option>
                                <option value="central">Central</option>
                                <option value="north">North</option>
                                <option value="south">South</option>
                                <option value="east">East</option>
                                <option value="west">West</option>
                            </select>
                            <input
                                type="text"
                                name="channelName"
                                placeholder="Channel"
                                value={form.channelName}
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
                                name="hrPhone"
                                placeholder="phone"
                                value={form.hrPhone}
                                onChange={handleInputChange}
                                className="px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md">
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
                        <button type="button" onClick={() => setPopUpForm(false)} className="px-4 py-2 mt-4 ml-2 text-white bg-gray-600 rounded-md">
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
