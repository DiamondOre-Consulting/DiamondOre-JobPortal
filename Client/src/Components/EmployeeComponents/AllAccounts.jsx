import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AllAccounts = () => {

    const [allAccountsData, setAllAccountsData] = useState([]);

    useEffect(() => {
        const fetchAllAccount = async () => {
            try {

                const response = await axios.get('http://localhost:5000/api/employee/accounts', {

                })

                if (response.status === 200) {
                    console.log("all accounts data ", response.data)
                    setAllAccountsData(response.data)
                }

            }
            catch (error) {
                console.log(error)
            }
        }

        fetchAllAccount();
    }, [])
    return (
        <>
            <div>

                <h1 className='text-3xl text-center'>All Accounts</h1>
                <div className='w-40 h-1 bg-blue-900 mx-auto'></div>

                <div>
                    <table id="example" class="table-auto w-full mt-10">
                        <thead className='sticky top-0 bg-blue-900 text-gray-100 text-xs shadow'>
                            <tr className=''>
                                <th class="px-4  py-2">HR Name</th>
                                <th class="px-4 py-2 ">Client Name</th>
                                <th class="px-4 py-2">Phone</th>
                                <th class="px-4 py-2">Zone</th>

                            </tr>
                        </thead>


                        <tbody>
                            {allAccountsData.length > 0 ? (
                                allAccountsData.map((data) => (
                                    <React.Fragment key={data._id}>
                                        {data.accountDetails.map((detail, index) => (
                                            <tr key={`${data._id}-${index}`} className='text-center'>
                                                <td className="border px-4 py-2">{detail.detail.hrName}</td>
                                                <td className="border px-4 py-2">{detail.detail.clientName}</td>
                                                <td className="border px-4 py-2">{detail.detail.phone}</td>
                                                <td className="border px-4 py-2">{detail.detail.zone}</td>

                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">No data available for the selected year.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>


            </div>

        </>
    )
}

export default AllAccounts