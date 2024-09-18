import axios from "axios";
import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import Footer from "../HomePage/Footer";

const EachEmployeeGoalSheet = () => {
  const { id } = useParams();
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [employees, setEmployees] = useState([]);
  const [goalsheetform, setGoalSheetForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [goalSheetData, setGoalSheetData] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [noOfJoinings, setNoOfJoinings] = useState(0);
  const [revenue, setRevenue] = useState(null);
  const [cost, setCost] = useState(null);
  const [incentive, setInsentive] = useState(null);
  const [variableIncentive, setVariableIncentive] = useState(null);
  const [showSubmitLoader, setShowSubmitLoader] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("");
  const [allGoalSheetData, setAllGoalSheetData] = useState([]);
  const [filteredGoalSheetData, setFilteredGoalSheetData] = useState([]);

  // Submit the goal sheet form
  const handleSetGoalSheet = async (e) => {
    e.preventDefault();
    setShowSubmitLoader(true);

    try {
      const token = localStorage.getItem("token");

      // Convert values to numbers
      const noOfJoiningsNumber = Number(noOfJoinings);
      const revenueNumber = Number(revenue);
      const costNumber = Number(cost);
      const incentiveNumber = Number(incentive);
      const variableIncentiveNumber = Number(variableIncentive);

      // Validate conversion
      if (
        isNaN(noOfJoiningsNumber) ||
        isNaN(revenueNumber) ||
        isNaN(costNumber) ||
        isNaN(incentiveNumber) ||
        isNaN(variableIncentiveNumber)
      ) {
        console.error("One or more fields are not valid numbers");
        setShowSubmitLoader(false);
        return;
      }

      const response = await axios.post(
        "https://api.diamondore.in/api/admin-confi/set-goalsheet",
        {
          empId: id,
          year,
          month,
          noOfJoinings: noOfJoiningsNumber,
          revenue: revenueNumber,
          cost: costNumber,
          incentive: incentiveNumber,
          variableIncentive: variableIncentiveNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        setSnackbarOpen(true); // Open Snackbar on successful submission
        setCost("");
        setRevenue("");
        setNoOfJoinings("");
        setYear("");
        setMonth("");
        setInsentive("");
        setVariableIncentive("");
      } else {
        setSnackbarOpen(false);
        setCost("");
        setRevenue("");
        setNoOfJoinings("");
        setYear("");
        setInsentive("");
        setVariableIncentive("");
        setMonth(""); // Close Snackbar if submission fails
      }
    } catch (error) {
      console.error("Error setting goal sheet:", error);
      setShowSubmitLoader(false);

      if (error.response && error.response.status === 404) {
        console.log("Employee not found");
        setGoalSheetForm(false);
      } else {
        console.log("An error occurred");
      }
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // getGoalSheet

  useEffect(() => {
    const handleGoalSheet = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://api.diamondore.in/api/admin-confi/goalsheet/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setAllGoalSheetData(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleGoalSheet();
  }, []);

  // useEffect(() => {
  //   if (selectedYear) {
  //     const filteredData = allGoalSheetData.filter(
  //       (item) => item.year === parseInt(selectedYear)
  //     );
  //     setFilteredGoalSheetData(filteredData);
  //   } else {
  //     setFilteredGoalSheetData([]);
  //   }
  // }, [selectedYear, allGoalSheetData]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  // EDIT GOAL SHEET

  const [editYear, setEditYear] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editNoOfJoinings, setEditNoOfJoinings] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const [editRevenue, setEditRevenue] = useState(0);
  const [editIncentive, setEditIncentive] = useState(0);
  const [editVariableIncentive, setEditVariableIncentive] = useState(0);
  const [editMode, setEditMode] = useState(false); // To trigger the popup
  const [goalSheetToEdit, setGoalSheetToEdit] = useState({});

  const handleEditClick = (detail) => {
    console.log("editClicked");
    setEditMode(true); // Open the modal
    setEditYear(detail.year);
    setEditMonth(detail.month);
    setEditNoOfJoinings(detail.noOfJoinings);
    setEditCost(detail.cost);
    setEditRevenue(detail.revenue);
    setEditIncentive(detail.incentive);
    setEditVariableIncentive(detail.variableIncentive);
    setGoalSheetToEdit(detail);
  };

  const handleEditGoalSheet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://api.diamondore.in/api/admin-confi/edit-goalSheet",
        {
          empId: id,
          year: editYear,
          month: editMonth,
          noOfJoinings: editNoOfJoinings,
          cost: editCost,
          revenue: editRevenue,
          incentive: editIncentive,
          variableIncentive: editVariableIncentive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Success, close the modal and refresh data
        setEditMode(false);
        // Optionally, fetch updated goal sheet data here
        console.log("Goal sheet updated successfully");
      }
    } catch (error) {
      console.error("Error updating goal sheet:", error);
    }
  };

  return (
    <>
      {/* <AdminNav /> */}
      <div className="flex">
        <h1 className="mx-auto text-2xl md:text-4xl font-bold text-center mb-4">
          Goal Sheet
        </h1>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10 py-6 px-2 md:px-10">
        <div className=" md:col-1">
          <div className="bg-white border-blue-900  p-8 rounded-lg shadow-lg relative max-w-md md:w-full mb-10 md:mt-0">
            <h2 className="text-2xl mb-4">Update Goal Sheet</h2>
            <form onSubmit={handleSetGoalSheet}>
              <div className="mb-2">
                <div className="flex justify-between">
                  <select
                    className="w-full rounded-md py-2 px-2 "
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option>Select Year</option>
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                    <option value={2029}>2029</option>
                    <option value={2030}>2030</option>
                  </select>
                  <select
                    className="w-full rounded-md py-2 px-2 ml-2"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option>Select Month</option>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex flex-col">
                  <div className="">
                    <label htmlFor="revenue" className="block text-gray-700">
                      Revenue:
                    </label>
                    <input
                      type="number"
                      id="revenue"
                      value={revenue}
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      onChange={(e) => setRevenue(e.target.value)}
                    />
                  </div>

                  <div className="">
                    <label htmlFor="cost" className="block text-gray-700">
                      Cost:
                    </label>
                    <input
                      type="number"
                      id="cost"
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      No. Of Joinings:
                    </label>
                    <input
                      type="number"
                      id="noOfJoinings"
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      value={noOfJoinings}
                      onChange={(e) => setNoOfJoinings(e.target.value)}
                    />
                  </div>

                  <div className="">
                    <label htmlFor="incentive" className="block text-gray-700">
                      Incentive:
                    </label>
                    <input
                      type="number"
                      id="incentive"
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      value={incentive}
                      onChange={(e) => setInsentive(e.target.value)}
                    />
                  </div>

                  <div className="">
                    <label
                      htmlFor="variableIncentive"
                      className="block text-gray-700"
                    >
                      Variable Incentive:
                    </label>
                    <input
                      type="number"
                      id="variableIncentive"
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      value={variableIncentive}
                      onChange={(e) => setVariableIncentive(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-full"
                >
                  {showSubmitLoader ? (
                    <svg
                      className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Goal sheet updated successfully!
            </Alert>
          </Snackbar>
        </div>

        <div className="col-span-2">
          <div class="container mx-auto overflow-x-auto h-[500px] relative">
            <table id="example" class="table-auto w-full ">
              <thead className="sticky top-0 bg-blue-900 text-gray-100 text-xs shadow">
                <tr className="">
                  <th class="px-4  py-2">Year</th>
                  <th class="px-4  py-2">Month</th>
                  <th class="px-4 py-2 ">No. of Joinings</th>
                  <th class="px-4 py-2">Revenue</th>
                  <th class="px-4 py-2">Cost</th>
                  <th class="px-4 py-2">Target</th>
                  <th class="px-4 py-2">Cumulative Cost</th>
                  <th class="px-4 py-2">Cumulative Revenue</th>
                  <th class="px-4 py-2">YTD</th>
                  <th class="px-4 py-2">MTD</th>
                  <th class="px-4 py-2">Incentive</th>
                  <th class="px-4 y-2">Variable Incentive</th>
                  <th class="px-4 y-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {allGoalSheetData.length > 0 &&
                  allGoalSheetData.map((data) => (
                    <React.Fragment key={data._id}>
                      {data.goalSheetDetails.length > 0 ? (
                        data.goalSheetDetails.map((detail, index) => (
                          <tr
                            key={`${data._id}-${index}`}
                            className="text-center"
                          >
                            {" "}
                            <td className="border px-4 py-2">{detail.year}</td>
                            <td className="border px-4 py-2">
                              {" "}
                              {monthNames[detail.month] || "Unknown"}{" "}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.noOfJoinings}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.revenue}
                            </td>
                            <td className="border px-4 py-2">{detail.cost}</td>
                            <td className="border px-4 py-2">
                              {detail.target}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.cumulativeCost}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.cumulativeRevenue}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.achYTD}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.achMTD}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.incentive ?? "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.variableIncentive ?? "N/A"}
                            </td>
                            <td
                              className="border px-4 py-2 text-red-600 cursor-pointer"
                              onClick={() => handleEditClick(detail)}
                            >
                              Edit
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="11"
                            className="border px-4 py-2 text-center"
                          >
                            No details available
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*  */}

      <div className="p-4">
        {/* <div className="mb-4">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Select Year:</label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">-- Select Year --</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                </div> */}

        {/* {filteredGoalSheetData.length > 0 ? (
                    <div>
                        {filteredGoalSheetData.map((data) => (
                            <div key={data._id} className="mb-6 p-4 border border-gray-300 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Year: {data.year}</h3>
                                {data.goalSheetDetails.map((detail) => (
                                    <div key={detail._id} className="mb-4 p-2 border-b border-gray-200">
                                        <h4 className="text-md font-medium">Month: {detail.goalSheet.month}</h4>
                                        <p>No of Joining: {detail.goalSheet.noOfJoining}</p>
                                        <p>Cost: {detail.goalSheet.cost}</p>
                                        <p>Revenue: {detail.goalSheet.revenue}</p>
                                        <p>Target: {detail.goalSheet.target}</p>
                                        <p>Cumulative Cost: {detail.goalSheet.cumulativeCost}</p>
                                        <p>Cumulative Revenue: {detail.goalSheet.cumulativeRevenue}</p>
                                        <p>Achievement YTD: {detail.goalSheet.achYTD}</p>
                                        <p>Achievement MTD: {detail.goalSheet.achMTD}</p>
                                        <p>Incentive: {detail.goalSheet.incentive}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No data available for the selected year.</p>
                )} */}
      </div>
      {/* <Footer /> */}

      {editMode && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setEditMode(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form onSubmit={handleEditGoalSheet} className="space-y-4">
              <div className="flex justify-between space-x-4 items-center ">
                <div>
                  <label className="block text-gray-700">Year</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    placeholder="Year"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Month</label>
                  <input
                    type="number"
                    value={editMonth}
                    onChange={(e) => setEditMonth(e.target.value)}
                    placeholder="Month"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">No of Joinings</label>
                  <input
                    type="number"
                    value={editNoOfJoinings}
                    onChange={(e) => setEditNoOfJoinings(e.target.value)}
                    placeholder="No of Joinings"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4 items-center ">
                <div>
                  <label className="block text-gray-700">Cost</label>
                  <input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    placeholder="Cost"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Revenue</label>
                  <input
                    type="number"
                    value={editRevenue}
                    onChange={(e) => setEditRevenue(e.target.value)}
                    placeholder="Revenue"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Incentive</label>
                  <input
                    type="number"
                    value={editIncentive}
                    onChange={(e) => setEditIncentive(e.target.value)}
                    placeholder="Incentive"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700">
                  Variable Incentive
                </label>
                <input
                  type="number"
                  value={editVariableIncentive}
                  onChange={(e) => setEditVariableIncentive(e.target.value)}
                  placeholder="Variable Incentive"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EachEmployeeGoalSheet;
