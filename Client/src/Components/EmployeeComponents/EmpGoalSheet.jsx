import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmpGoalSheet = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [allGoalSheetData, setAllGoalSheetData] = useState([]);
  const [filteredGoalSheetData, setFilteredGoalSheetData] = useState([]);
   const [tickermessage , setgetTickerMessage] = useState("");
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
          console.log("all goal sheet data",response.data)
          setFilteredData(response.data);
          const alldata = response.data?.[0].goalSheetDetails;
          setgetTickerMessage(response.data[0].YTDLessTickerMessage);
          setAllGoalSheetData(alldata);
          setFilteredGoalSheetData(alldata); // Initialize with all data
        }
      } catch (error) {
        console.log(error)
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

   const [filteredData, setFilteredData] = useState([]);
  const totals = filteredData
  .flatMap((data) => data.goalSheetDetails) // Flatten all goalSheetDetails
  .reduce(
    (acc, detail) => {
      acc.noOfJoinings += detail.noOfJoinings;
      acc.revenue += detail.revenue;
      acc.cost += detail.cost;
      acc.target += detail.target;
      return acc;
    },
    { noOfJoinings: 0, revenue: 0, cost: 0, target: 0 }
  );


  return (
    <>
      <div>
      {tickermessage && (
        <>
          <div class="bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto w-full animate-pulse">
            <svg
              viewBox="0 0 24 24"
              class="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
            >
              <path
                fill="currentColor"
                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
              ></path>
            </svg>
            <span class="text-red-800">{tickermessage}</span>
          </div>
        </>
      )}
        <h1 className='text-3xl font-bold md:text-4xl'>Goal Sheet</h1>
        <div className='w-20 h-0.5 bg-blue-900'></div>

        <div className='col-span-2 mt-10'>


          <div className='container relative mx-auto overflow-x-auto h-96 md:w-full w-72'>
            <table className='w-full table-auto'>
              <thead className='sticky top-0 text-xs text-gray-100 bg-blue-900 shadow'>
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
                  <th className='px-4 py-2'>Leakage</th>
                </tr>
              </thead>

              <tbody>
                {filteredGoalSheetData.length > 0 ? (
                  filteredGoalSheetData.map((data, index) => (
                    <tr key={data._id} className='text-center'>
                      <td className='px-4 py-2 border'>{data.year}</td>
                      <td className='px-4 py-2 border'> {monthNames[data.month] || 'Unknown'}</td>
                      <td className='px-4 py-2 border'>{data.noOfJoinings}</td>
                      <td className='px-4 py-2 border'>{data.revenue}</td>
                      <td className='px-4 py-2 border'>{data.cost}</td>
                      <td className='px-4 py-2 border'>{data.target}</td>
                      <td className='px-4 py-2 border'>{data.cumulativeCost}</td>
                      <td className='px-4 py-2 border'>{data.cumulativeRevenue}</td>
                      <td className='px-4 py-2 border'>{data.achYTD}</td>
                      <td className='px-4 py-2 border'>{data.achMTD}</td>
                      <td className='px-4 py-2 border'>{data.incentive}</td>
                      <td className='px-4 py-2 border'>{data?.leakage || "NA"}</td>
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
              <tr className="border border-1 bg-blue-400 text-center w-full">
                <td colSpan="2" className="font-bold">
                  Grand Total
                </td>
                <td className="font-bold">{totals.noOfJoinings}</td>
                <td className="font-bold">{totals.revenue}</td>
                <td className="font-bold">{totals.cost}</td>
                <td className="font-bold">{totals.target}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmpGoalSheet;
