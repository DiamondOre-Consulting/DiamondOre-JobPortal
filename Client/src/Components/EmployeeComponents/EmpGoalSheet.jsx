import React from 'react'

const EmpGoalSheet = () => {
    return (
        <>
            <div>
                <h1 className='text-3xl md:text-4xl font-bold'>Goal Sheet</h1>
                <div className='w-20 h-0.5 bg-blue-900'></div>



                <div className='md:overflow-auto overflow-scroll mt-10 w-72 md:w-full'>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 md:overflow-auto overflow-scroll border  ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                            <tr className=' text-white text-center'>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Month</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Year</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">No. of Joinings</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Revenue</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Cost</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Target</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">Cumulative Cost</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">CV Revenue</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">ACHYTD</th>
                                <th class="py-3 px-6 border text-center text-xs text-gray-800 font-bold">ACHMTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50 text-center ">


                                <td class="py-4 px-6 border-b border-gray-200">Select Month</td>
                                <td class="py-4 px-6 border-b border-gray-200">2024</td>
                                <td class="py-4 px-6 border-b border-gray-200">1</td>
                                <td class="py-4 px-6 border-b border-gray-200">2300</td>
                                <td class="py-4 px-6 border-b border-gray-200">4300</td>
                                <td class="py-4 px-6 border-b border-gray-200">1</td>
                                <td class="py-4 px-6 border-b border-gray-200">2300</td>
                                <td class="py-4 px-6 border-b border-gray-200">4300</td>
                                <td class="py-4 px-6 border-b border-gray-200">1</td>
                                <td class="py-4 px-6 border-b border-gray-200">2300</td>

                            </tr>



                        </tbody>
                    </table>
                </div>

               

            </div>
        </>
    )
}

export default EmpGoalSheet