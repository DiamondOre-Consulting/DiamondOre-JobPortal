import React from 'react'

const KPIscore = () => {
  return (
    <>
            <div>
                <h1 className='text-4xl font-bold'>KPI Score</h1>
                <div className='w-20 h-0.5 bg-blue-900'></div>


               
                <table class="w-full table-auto overflow-x-auto mt-10">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Month</th>
                            <th class="py-4 px-2 border text-center text-xs text-gray-800 font-bold">Cost/Revenue</th>
                          
                            
                        </tr>
                    </thead>
                    <tbody class="bg-white text-center">
                        <tr>
                            <td class="py-4 px-2 border-b border-gray-200">Select Month</td>
                            <td class="py-4 px-2 border-b border-gray-200">43434</td>
                        
                       
                        </tr>
                    </tbody>
                </table>
            </div>
    
    </>
  )
}

export default KPIscore