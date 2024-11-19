import axios from 'axios'
import React, { useEffect, useState } from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";

const AllAccounts = () => {
    const [allAccountsData, setAllAccountsData] = useState([]);
    let [loading, setLoading] = useState(true);;

    useEffect(() => {
        const fetchAllAccount = async () => {
            try {
                const response = await axios.get('https://api.diamondore.in/api/employee/accounts');
                if (response.status === 200) {
                    setAllAccountsData(response.data);
                    setLoading(false)
                }
            } catch (error) {
                
            }
        }

        fetchAllAccount();
    }, []);

    const groupedData = allAccountsData.reduce((acc, account) => {
        const ownerName = account.ownerName;
        if (!acc[ownerName]) {
            acc[ownerName] = [];
        }
        acc[ownerName].push(account);
        return acc;
    }, {});


    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    };

    return (
        <>
            <div>
                <h1 className='text-3xl text-center'>All Accounts</h1>
                <div className='w-40 h-1 bg-blue-900 mx-auto mb-10'></div>

                {
                    loading ?
                        <div style={override}>
                            <PropagateLoader
                                color={'#023E8A'}
                                loading={loading}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div> :

                        <div >
                            {Object.keys(groupedData).map(ownerName => (
                                <div key={ownerName}>
                                    <h2 className='text-2xl text-center mt-8 font-bold'> Account Holder : {ownerName}</h2>

                                    <div className='md:w-full w-72 overflow-x-auto'>
                                        <table id="example" className="table-auto w-full mt-4 ">
                                            <thead className='sticky top-0 bg-blue-900 text-gray-100 text-xs shadow'>
                                                <tr>
                                                    <th className="px-4 py-2">HR Name</th>
                                                    <th className="px-4 py-2">Client Name</th>
                                                    <th className="px-4 py-2">Phone</th>
                                                    <th className="px-4 py-2">Zone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupedData[ownerName].flatMap(account =>
                                                    account.accountDetails.map((detail, index) => (
                                                        <tr key={`${account._id}-${index}`} className='text-center'>
                                                            <td className="border px-4 py-2">{detail.detail.hrName}</td>
                                                            <td className="border px-4 py-2">{detail.detail.clientName}</td>
                                                            <td className="border px-4 py-2">{detail.detail.phone}</td>
                                                            <td className="border px-4 py-2">{detail.detail.zone}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {allAccountsData.length === 0 && (
                                <div className="text-center mt-10">
                                    No data available .
                                </div>
                            )}
                        </div>
                }
            </div>
        </>
    );
}

export default AllAccounts;
