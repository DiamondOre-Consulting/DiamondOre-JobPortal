import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmpGoalSheet = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [allGoalSheetData, setAllGoalSheetData] = useState([]);
  const [filteredGoalSheetData, setFilteredGoalSheetData] = useState([]);

  useEffect(() => {
    const handleGoalSheet = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.diamondore.in/api/employee/my-goalsheet', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const alldata = response.data?.[0].goalSheetDetails;
          setAllGoalSheetData(alldata);
          setFilteredGoalSheetData(alldata); // Initialize with all data
        }
      } catch (error) {
        
      }
    };

    handleGoalSheet();
  }, []);

  // Handle year change and filter data
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setSelectedYear(selectedYear);
    
    if (selectedYear) {
      const filteredData = allGoalSheetData.filter((data) => data.year === selectedYear);
      setFilteredGoalSheetData(filteredData);
    } else {
      setFilteredGoalSheetData(allGoalSheetData); // Reset to all data if no year is selected
    }
  };


  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  return (
    <>
      <div>
        <h1 className='text-3xl md:text-4xl font-bold'>Goal Sheet</h1>
        <div className='w-20 h-0.5 bg-blue-900'></div>

        <div className='col-span-2 mt-10'>
         

          <div className='container mx-auto overflow-x-auto h-96 md:w-full w-72 relative'>
            <table className='table-auto w-full'>
              <thead className='sticky top-0 bg-blue-900 text-gray-100 text-xs shadow'>
                <tr>
                <th className='px-4 py-2'>Year</th> 
                  <th className='px-4 py-2'>Month</th>
                  <th className='px-4 py-2'>No. of Joinings</th>
                  <th className='px-4 py-2'>Revenue</th>
                  <th className='px-4 py-2'>Cost</th>
                  <th className='px-4 py-2'>Target</th>
                  <th className='px-4 py-2'>Cumulative Cost</th>
                  <th className='px-4 py-2'>Cumulative Revenue</th>
                  <th className='px-4 py-2'>YTD</th>
                  <th className='px-4 py-2'>MTD</th>
                  <th className='px-4 py-2'>Incentive</th>
                  <th className='px-4 py-2'>Variable Incentive</th>
                </tr>
              </thead>

              <tbody>
                {filteredGoalSheetData.length > 0 ? (
                  filteredGoalSheetData.map((data, index) => (
                    <tr key={data._id} className='text-center'>
                        <td className='border px-4 py-2'>{data.year}</td>
                      <td className='border px-4 py-2'> {monthNames[data.month] || 'Unknown'}</td>
                      <td className='border px-4 py-2'>{data.noOfJoinings}</td>
                      <td className='border px-4 py-2'>{data.revenue}</td>
                      <td className='border px-4 py-2'>{data.cost}</td>
                      <td className='border px-4 py-2'>{data.target}</td>
                      <td className='border px-4 py-2'>{data.cumulativeCost}</td>
                      <td className='border px-4 py-2'>{data.cumulativeRevenue}</td>
                      <td className='border px-4 py-2'>{data.achYTD}</td>
                      <td className='border px-4 py-2'>{data.achMTD}</td>
                      <td className='border px-4 py-2'>{data.incentive}</td>
                      <td className='border px-4 py-2'>{data.variableIncentive}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='10' className='text-center'>
                      no data is there  
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmpGoalSheet;
