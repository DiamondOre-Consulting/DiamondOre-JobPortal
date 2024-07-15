import React, { useState , useEffect} from 'react';
import axios from 'axios';

const AccountHandling = ({ userData }) => {
    const [rows, setRows] = useState([]);
    const [popupform, setPopUpForm] = useState(false);
    const [form, setForm] = useState({
        hrName: '',
        zone: '',
        channel: '',
        clientName: '',
        number: '',
    });

    useEffect(() => {
        // Load data from localStorage on component mount
        const storedRows = JSON.parse(localStorage.getItem('rows')) || [];
        setRows(storedRows);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRow = { ...form, id: rows.length + 1 };
        const updatedRows = [...rows, newRow];
        setRows(updatedRows);
        setForm({
            hrName: '',
            zone: '',
            channel: '',
            clientName: '',
            number: '',
        });
        // Save the updated rows to localStorage
        localStorage.setItem('rows', JSON.stringify(updatedRows));
        setPopUpForm(false)
    };
    return (
        <div>
            <h1 className='text-4xl font-bold'>Account Handling</h1>
            <div className='w-20 h-0.5 bg-blue-900'></div>

            <div className="relative w-full max-w-xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-4 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">
                <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
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
            <div className='flex justify-end mb-1'>
            <button className='bg-blue-900 px-4 py-2 text-gray-100 rounded-full' onClick={()=> setPopUpForm(true)}> Add Data</button>
            </div>
            <div className="flex flex-col mb-10">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden border">
                            <table className="md:w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
                                <thead className='border text-center'>
                                    <tr className='border text-center bg-gray-50'>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">S.No</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">HR Name</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Zone</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Channel</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Client Name</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Number</th>
                                        <th scope="col" className="px-6 py-3 border text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                                
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 text-center">
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm font-medium text-gray-800 dark:text-neutral-200">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.hrName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.zone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.channel}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.clientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap border text-sm text-gray-800 dark:text-neutral-200">{row.number}</td>
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


            {
                popupform && (
                    <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
                        <form onSubmit={handleSubmit} className=" rounded-lg shadow-xl bg-white w-4/5 sm:w-3/5 lg:w-1/4 mt-10 relative p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Datails</h2>
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
                                    name="number"
                                    placeholder="Number"
                                    value={form.number}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                                Upload Data
                            </button>
                            <button type="button" onClick={() => setPopUpForm(false)} className="mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md">
                                Close
                            </button>
                        </form>
                    </div>
                )
            }


        </div>
    );
};

export default AccountHandling;
