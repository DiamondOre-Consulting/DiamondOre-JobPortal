import React from 'react'

const EmpGoalSheet = () => {
    return (
        <>
            <div>
                <h1 className='text-4xl font-bold'>Goal Sheet</h1>
                <div className='w-20 h-0.5 bg-blue-900'></div>



                <div className='relative overflow-x-auto'>
                <table class="w-full table-auto overflow-x-scroll mt-10">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Month</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Year</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">No. of Joinings</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Revenue</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Cost</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Target</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Cumulative Cost</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">CV Revenue</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">ACHYTD</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">ACHMTD</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr>
                            <td class="py-4 px-2 border-b border-gray-200">Select Month</td>
                            <td class="py-4 px-2 border-b border-gray-200">2024</td>
                            <td class="py-4 px-2 border-b border-gray-200">1</td>
                            <td class="py-4 px-2 border-b border-gray-200">2300</td>
                            <td class="py-4 px-2 border-b border-gray-200">4300</td>
                            <td class="py-4 px-2 border-b border-gray-200">1</td>
                            <td class="py-4 px-2 border-b border-gray-200">2300</td>
                            <td class="py-4 px-2 border-b border-gray-200">4300</td>
                            <td class="py-4 px-2 border-b border-gray-200">1</td>
                            <td class="py-4 px-2 border-b border-gray-200">2300</td>
                        </tr>
                    </tbody>
                </table>

                </div>

            </div>
        </>
    )
}

export default EmpGoalSheet