import React from 'react'

const EmpGoalSheet = () => {
    return (
        <>
            <div>
                <h1 className='text-4xl font-bold'>Goal Sheet</h1>
                <div className='w-20 h-0.5 bg-blue-900'></div>


                <table class="w-full table-fixed mt-10">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Month</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Number Of Joinings</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Revenew</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Cost</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Target</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">Comulative Cost</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">CV Revenew</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">ACHYTD</th>
                            <th class=" py-4 px-2 border text-center text-xs text-gray-800 font-bold">ACHMTD</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr>
                            <td class="py-4 px-6 border-b border-gray-200">Month</td>
                            <td class="py-4 px-6 border-b border-gray-200 ">1</td>
                            <td class="py-4 px-6 border-b border-gray-200">2300</td>
                            <td class="py-4 px-6 border-b border-gray-200">4300</td>
                            <td class="py-4 px-6 border-b border-gray-200">1</td>
                            <td class="py-4 px-6 border-b border-gray-200">2300</td>
                            <td class="py-4 px-6 border-b border-gray-200">4300</td>
                            <td class="py-4 px-6 border-b border-gray-200 ">1</td>
                            <td class="py-4 px-6 border-b border-gray-200">2300</td>
                           
                        </tr>
                    
                  
                     
                      
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default EmpGoalSheet