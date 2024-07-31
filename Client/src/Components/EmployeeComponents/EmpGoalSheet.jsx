import axios from 'axios';
import React, { useEffect, useState } from 'react'

const EmpGoalSheet = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [allGoalSheetData, setAllGoalSheetData] = useState([]);
    const [filteredGoalSheetData, setFilteredGoalSheetData] = useState([]);


    useEffect(() => {
        const handleGoalSheet = async () => {

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://api.diamondore.in/api/employee/my-goalsheet`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }

                )

                if (response.status === 200) {
                    console.log("responsedata", response.data)
                    setAllGoalSheetData(response.data);

                }
            }
            catch (error) {
                console.log(error)
            }
        }

        handleGoalSheet();
    }, [])



    useEffect(() => {
        if (selectedYear) {
            const filteredData = allGoalSheetData.filter(item => item.year === parseInt(selectedYear));
            setFilteredGoalSheetData(filteredData);
        } else {
            setFilteredGoalSheetData([]);
        }
    }, [selectedYear, allGoalSheetData]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };


    return (
        <>
            <div>
                <h1 className='text-3xl md:text-4xl font-bold'>Goal Sheet</h1>
                <div className='w-20 h-0.5 bg-blue-900'></div>



                <div className='col-span-2'>

                    <select className='float-right mb-4 py-2 px-2 rounded-full' value={selectedYear}
                        onChange={handleYearChange}>
                        <option>Select Year</option>
                        {
                            allGoalSheetData.map((y) => (
                                <option value={y.year} key={y.year}>{y.year}</option>
                            ))
                        }
                    </select>
                    <div class="container mx-auto overflow-x-auto h-96 md:w-full w-72 relative">
                        <table id="example" class="table-auto w-full ">
                            <thead className='sticky top-0 bg-blue-900 text-gray-100 text-xs shadow'>
                                <tr className=''>
                                    <th class="px-4  py-2">Month</th>
                                    <th class="px-4 py-2 ">No. of Joinings</th>
                                    <th class="px-4 py-2">Revenue</th>
                                    <th class="px-4 py-2">Cost</th>
                                    <th class="px-4 py-2">Target</th>
                                    <th class="px-4 py-2">Cumulative Cost</th>
                                    <th class="px-4 py-2">Cumulative Revenue</th>
                                    <th class="px-4 py-2">achYTD</th>
                                    <th class="px-4 py-2">achMTD</th>
                                    <th class="px-4 py-2">Incentive</th>

                                </tr>
                            </thead>


                            <tbody>
                                {filteredGoalSheetData.length > 0 ? (
                                    filteredGoalSheetData.map((data) => (
                                        <React.Fragment key={data._id}>
                                            {data.goalSheetDetails.map((detail, index) => (
                                                <tr key={`${data._id}-${index}`} className='text-center'>
                                                    <td className="border px-4 py-2">{detail.goalSheet.month}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.noOfJoining}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.revenue}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.cost}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.target}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.cumulativeCost}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.cumulativeRevenue}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.achYTD}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.achMTD}</td>
                                                    <td className="border px-4 py-2">{detail.goalSheet.incentive}</td>
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



            </div>
            {/* <span className='border p-2 mt-4 border-2 border-gray-500 flex justify-end inline'>
                        Incentive
                 </span> */}
        </>
    )
}

export default EmpGoalSheet