import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import Footer from "../HomePage/Footer";

const EachEmployeeGoalSheet = () => {
  const { id } = useParams();
  const { employeename } = useParams();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [editMode, setEditMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [goalsheetform, setGoalSheetForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [goalSheetData, setGoalSheetData] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [prevYear, setPrevYear] = useState(null);
  const [goalListId, setGoalListId] = useState();
  const [prevMonth, setPrevMonth] = useState(null);
  const [noOfJoinings, setNoOfJoinings] = useState(0);
  const [revenue, setRevenue] = useState(null);
  const [cost, setCost] = useState(null);
  const [incentive, setInsentive] = useState(null);
  const [leakage, setLeakage] = useState(null);
  const [showSubmitLoader, setShowSubmitLoader] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("");
  const [allGoalSheetData, setAllGoalSheetData] = useState([]);
  const [filteredGoalSheetData, setFilteredGoalSheetData] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [deletePopup,setDeletePopup] = useState(false)

  const [mailYearSelectData,setMailYearSelectData] = useState([])
  const [mailSelectedYear,setMailSelectedYear] = useState(null)

 

  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const colors = [
    { name: "Orange", code: "#FFA500" },
    { name: "Green", code: "#008000" },
  ];


  const [sheetId,setSheetId]= useState(null)




  const [employee, setEmployee] = useState();
  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setEmployee(response.data);
          
        }
      } catch (error) {}
    };

    getEmployeeData();
  }, []);

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
      const leakageNumber = Number(leakage);

      // Validate conversion
      if (
        isNaN(noOfJoiningsNumber) ||
        isNaN(revenueNumber) ||
        isNaN(costNumber) ||
        isNaN(incentiveNumber) ||
        isNaN(leakageNumber)
      ) {
        console.error("One or more fields are not valid numbers");
        setShowSubmitLoader(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/set-goalsheet`,
        {
          empId: id,
          year,
          month,
          noOfJoinings: noOfJoiningsNumber,
          revenue: revenueNumber,
          cost: costNumber,
          incentive: incentiveNumber,
          leakage: leakageNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setTrigger((prev) => prev + 1);
        setSnackbarOpen(true); // Open Snackbar on successful submission
        setCost("");
        setRevenue("");
        setNoOfJoinings("");
        setYear("");
        setMonth("");
        setInsentive("");
        setLeakage("");
      } else {
        setSnackbarOpen(false);
        setCost("");
        setRevenue("");
        setNoOfJoinings("");
        setYear("");
        setInsentive("");
        setLeakage("");
        setMonth(""); // Close Snackbar if submission fails
      }
    } catch (error) {
      console.error("Error setting goal sheet:", error);
      setShowSubmitLoader(false);

      if (error.response && error.response.status === 404) {
        setGoalSheetForm(false);
      } else {
      }
    } finally {
      setShowSubmitLoader(false);
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };


  const handleDeleteGoalSheet = async(e) =>{
    e.preventDefault();
    setShowSubmitLoader(true);
     try{

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/delete-goalsheet/${id}/${sheetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if(response.status==200){
        setTrigger((prev) => prev + 1);
        alert(response.data.message)
      }
      setDeletePopup(false)
     }catch(err){
       console.log(err)
       alert(err.response.data.message)
       return 
     }
     finally{
      setShowSubmitLoader(true);
     }
  } 

  // getGoalSheet

  const handleEditGoalSheet = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Send the updated goal sheet data to the server
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/edit-goalSheet`,
        {
          prevYear: prevYear,
          prevMonth: prevMonth,
          empId: id,
          year: editYear,
          month: editMonth,
          noOfJoinings: editNoOfJoinings,
          cost: editCost,
          revenue: editRevenue,
          sheetId: goalListId,
          incentive: editIncentive,
          leakage: editleakage,
          selectedColor:selectedColor
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTrigger((prev) => prev + 1);

        // Trigger a re-fetch of the goal sheet data
        // This will trigger useEffect to fetch updated data
        setEditMode(false); // Close the edit mode/modal

        // Optionally, you can display a success message
      }
    } catch (error) {
      console.error("Error updating goal sheet:", error);
    }
  };

  //get goal sheeht
  //get also ticker message
  const [tickermessage, setgetTickerMessage] = useState("");

  useEffect(() => {
    const handleGoalSheet = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/goalsheet/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        if (response.status === 200) {
          setAllGoalSheetData(response.data); // Update the goal sheet data
          setgetTickerMessage(response.data[0].YTDLessTickerMessage);
          // You can verify the data here
         
          const years = [...new Set(response.data[0].goalSheetDetails.map(item => item.year))].sort((a, b) => b - a);
          setMailYearSelectData(years)
          setFilteredData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleGoalSheet();
  }, [trigger]);


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
  const [editleakage, setEditLeakage] = useState(0);
  

  const [goalSheetToEdit, setGoalSheetToEdit] = useState({});

  const handleEditClick = (detail) => {
    setGoalListId(detail?._id);
    setPrevYear(detail?.year);
    setPrevMonth(detail?.month);
    setEditMode(true); // Open the modal
    setEditYear(detail.year);
    setEditMonth(detail.month);
    setEditNoOfJoinings(detail.noOfJoinings);
    setEditCost(detail.cost);
    setEditRevenue(detail.revenue);
    setEditIncentive(detail.incentive);
    setEditLeakage(detail.leakage);
    setGoalSheetToEdit(detail);
  };

  const handleDeleteClick = (sheetId) => {
    setSheetId(sheetId);
    setDeletePopup(true);
  }

  const [filteredData, setFilteredData] = useState([]);
  const [selectedYearchange, setSelectedYearchange] = useState("All");

  const handleYearChanging = (year) => {
    setSelectedYear(year);

    if (year === "All") {
      setFilteredData(allGoalSheetData);
    } else {
      const filtered = allGoalSheetData.map((data) => ({
        ...data,
        goalSheetDetails: data.goalSheetDetails.filter(
          (detail) => detail.year === parseInt(year)
        ),
      }));
      setFilteredData(filtered);
    }
  };


  
  const grandTotal = useMemo(() => {
    return filteredData
      .flatMap((data) => data.goalSheetDetails)
      .reduce((acc, detail) => {
        acc.noOfJoinings += detail.noOfJoinings || 0;
        acc.revenue += detail.revenue || 0;
        acc.cost += detail.cost || 0;
        acc.target += detail.target || 0;
        return acc;
      }, { noOfJoinings: 0, revenue: 0, cost: 0, target: 0 });
  }, [filteredData]);


   

  const totals = useMemo(() => {
    return filteredData
      .flatMap((data) => data.goalSheetDetails)
      .filter((detail) => detail.year === Number(mailSelectedYear))
      .reduce(
        (acc, detail) => {
          acc.noOfJoinings += detail.noOfJoinings || 0;
          acc.revenue += detail.revenue || 0;
          acc.cost += detail.cost || 0;
          acc.target += detail.target || 0;
          return acc;
        },
        { noOfJoinings: 0, revenue: 0, cost: 0, target: 0 }
      );
  }, [filteredData, mailSelectedYear]);


  

  // for uploading joining Excel
  const [file, setFile] = useState(null); // Selected file
  const [loading, setLoading] = useState(false); // Loader state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const hanndleUpload = async () => {
    if (!file) {
      alert("Please attach File.");
      return;
    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("myFileImage", file);

      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-joiningsheet/${id}`,
        formData,
        {
          headers:{
             Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

     

      if (response.status === 200) {
        setLoading(false);
        alert("File Uploaded  Successfully");
        setFile("");
      }
    } catch (error) {
      console.log(error);
      alert("Error in uploading File", error);
      setLoading(false);
    }
  };

  const [updateTicker, setUpdateTicker] = useState(false);
  const [tickerMessage, setTickerMessage] = useState("");

  
  const fireTicker = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/fire-ticker/${id}`,
        {
          tickerMessage,
        }
      );

      if (response.status === 200) {
        
        alert(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error Firing Ticker", error);
      alert("Failed To trigger the ticker");
    }
  };

  //send mail to the admin about Goal Sheet
  const [sendEmialPopup, setSendEmailPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [totalCosts, setTotalCosts] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("");
  const [expectedRevenue, setExpectedRevenue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMail = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/send-mail/${id}`,
        {
          mailSelectedYear,
          description,
          total_costs: totals.cost,
          total_revenue: totals.revenue,
          expected_revenue: totals.target,
        }
      );

      alert("Email sent successfully!");
      setIsLoading(false);
      setSendEmailPopup(false);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
     
      
       {/* Popup Modal */}
       {open && (
        <div className="fixed z-[18888] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            <h2 className="text-lg font-semibold mb-4">Choose a Color</h2>

            {/* Color Options */}
            <div className="flex gap-4 justify-center">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className={`w-16 h-16 rounded-full cursor-pointer border-4 transition-all ${
                    selectedColor === color.code ? "border-black scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => 
                    {setSelectedColor(color.code)
                    setOpen(false)}
                  }
                ></div>
              ))}
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setOpen(false)} 
              className="mt-4 bg-gray-300 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
      <div className="flex">
        <h1 className="mx-auto mb-4 text-2xl font-bold text-center md:text-4xl">
          Goal Sheet {employeename}
        </h1>

        <div>
          {employee?.joiningExcel && (
            <a
              className=" text-center p-4 text-white  bg-green-600"
              href={employee?.joiningExcel}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Uploaded Joinings
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 px-2 py-6 md:grid-cols-3 md:gap-10 md:px-10">
        <div className=" md:col-1">
          <div className="relative max-w-md p-8 mb-10 bg-white border-blue-900 rounded-lg shadow-lg md:w-full md:mt-0">
            <h2 className="mb-4 text-2xl">Update Goal Sheet</h2>
            <form onSubmit={handleSetGoalSheet}>
              <div className="mb-2">
                <div className="flex justify-between">
                  <select
                    className="w-full px-2 py-2 rounded-md "
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
                    className="w-full px-2 py-2 ml-2 rounded-md"
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
                    <label htmlFor="leakage" className="block text-gray-700">
                      Leakage:
                    </label>
                    <input
                      type="number"
                      id="leakage"
                      className="w-full px-3 py-2 border border-gray-500 rounded-lg"
                      value={leakage}
                      onChange={(e) => setLeakage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
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
          <div className="mb-4 flex  justify-between items-end">
            <div>
              <label htmlFor="yearFilter" className="mr-2  uppercase">
                Filter by Year:
              </label>
              <select
                id="yearFilter"
                className="px-2 py-1 border"
                value={selectedYearchange}
                onChange={(e) => handleYearChanging(e.target.value)}
              >
                <option value="All">All</option>
                {[
                  ...new Set(
                    allGoalSheetData.flatMap((d) =>
                      d.goalSheetDetails.map((detail) => detail.year)
                    )
                  ),
                ].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex float-right ">
              <input
                className="border border-1"
                onChange={handleFileChange}
                type="file"
              />{" "}
              <p
                className="bg-black text-gray-100 p-2 cursor-pointer"
                onClick={hanndleUpload}
                disable={loading}
              >
                {loading ? "uploading..." : "Upload Joinings"}
              </p>
              <p
                className="p-2 bg-black text-white  w-fit  mx-4 cursor-pointer "
                onClick={() => setSendEmailPopup(true)}
              >
                Send Email
              </p>
            </div>
          </div>

          <div className="container mx-auto overflow-x-auto h-[500px] relative">
            <table id="example" className="w-full table-auto ">
              <thead className="sticky top-0 text-xs text-gray-100 bg-blue-900 shadow">
                <tr className="">
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2 ">No. of Joinings</th>
                  <th className="px-4 py-2">Revenue</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Target</th>
                  <th className="px-4 py-2">Cumulative Cost</th>
                  <th className="px-4 py-2">Cumulative Revenue</th>
                  <th className="px-4 py-2">YTD</th>
                  <th className="px-4 py-2">MTD</th>
                  <th className="px-4 py-2">Incentive</th>
                  <th className="px-4 y-2">Leakage</th>
                  <th className="px-4 y-2">Action</th>
                  <th className="px-4 y-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 &&
                  filteredData.map((data) =>
                    data.goalSheetDetails.length > 0 ? (
                      data.goalSheetDetails?.map((detail, index) => (
                        <tr
                          key={`${data._id}-${index}`}
                          className="text-center"
                        >
                          <td className="px-4 py-2 border">{detail.year}</td>
                          <td className="px-4 py-2 border">
                            {monthNames[detail.month] || "Unknown"}{" "}
                          </td>
                          <td className="px-4 py-2 border">
                            {detail.noOfJoinings}
                          </td>
                          <td className="px-4 py-2 border">{detail.revenue}</td>
                          <td className="px-4 py-2 border">{detail.cost}</td>
                          <td className="px-4 py-2 border">{detail.target}</td>
                          <td className="px-4 py-2 border">
                            {detail.cumulativeCost}
                          </td>
                          <td className="px-4 py-2 border">
                            {detail.cumulativeRevenue.toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-2 border cursor-pointer ${
                              detail.achYTD < 2.5 ? "bg-red-400" : "bg-white"
                            }`}
                            onClick={() => setUpdateTicker(true)}
                          >
                            {detail.achYTD}
                          </td>
                          <td className="px-4 py-2 border">{detail.achMTD}</td>
                          <td 
                         
                          className={`px-4 py-2 border`}
                          style={{ backgroundColor: detail?.incentiveStatusColor }}
                          >
                            {detail.incentive ?? "N/A"}
                          </td>
                          <td className="px-4 py-2 border">
                            {detail.leakage ?? "N/A"}
                          </td>
                          <td
                            className="px-4 py-2 text-red-600 border cursor-pointer"
                            onClick={() => {
                              handleEditClick(detail);
                            }}
                          >
                            Edit
                          </td>
                          <td
                            className="px-4 py-2 text-red-600 border cursor-pointer"
                            onClick={() => {
                              handleDeleteClick(detail?._id);
                            }}
                          >
                            Delete
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={data._id}>
                        <td
                          colSpan="13"
                          className="px-4 py-2 text-center border"
                        >
                          No details available
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
              <tr className="border border-1 bg-blue-400 text-center w-full">
                <td colSpan="2" className="font-bold">
                  Grand Total
                </td>
                <td className="font-bold">{grandTotal?.noOfJoinings}</td>
                <td className="font-bold">{grandTotal?.revenue}</td>
                <td className="font-bold">{grandTotal?.cost}</td>
                <td className="font-bold">{grandTotal?.target}</td>
              </tr>
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
                        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            <div key={data._id} className="p-4 mb-6 border border-gray-300 rounded-md shadow-md">
                                <h3 className="mb-2 text-lg font-semibold">Year: {data.year}</h3>
                                {data.goalSheetDetails.map((detail) => (
                                    <div key={detail._id} className="p-2 mb-4 border-b border-gray-200">
                                        <h4 className="font-medium text-md">Month: {detail.goalSheet.month}</h4>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setEditMode(false)} // Close modal when clicking outside
        >
          <div
            className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form onSubmit={handleEditGoalSheet} className="space-y-4">
              <div className="flex items-center justify-between space-x-4 ">
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

              <div className="flex items-center justify-between space-x-4 ">
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
                <label className="block text-gray-700">Leakage</label>
                <input
                  type="number"
                  value={editleakage}
                  onChange={(e) => setEditLeakage(e.target.value)}
                  placeholder="Leakage"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div  
              onClick={() =>{setOpen(prev=>!prev)}} 
              className="border-gray-600 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" >
                Set incentive status
              </div>

              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {updateTicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setUpdateTicker(false)} // Close modal when clicking outside
        >
          <div
            className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fireTicker();
                setUpdateTicker(false); // Close modal after firing the ticker
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-4">
                  Write Description
                </label>
                <textarea
                  rows={4}
                  value={tickerMessage}
                  onChange={(e) => setTickerMessage(e.target.value)}
                  placeholder="Enter the ticker message here"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Fire Ticker
              </button>
            </form>
          </div>
        </div>
      )}

    {deletePopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
                {/* Close button */}
                <button
                  onClick={() => setDeletePopup(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">Are you sure?</h2>
                <p className="text-gray-600 text-center mb-6">
                  This action cannot be undone.
                </p>

                <div className="flex justify-between">
                  <button
                    onClick={() => setDeletePopup(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteGoalSheet}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

      {sendEmialPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-lg font-bold   text-center uppercase">
              Send Email to Employess
            </h2>
            <div className="bg-blue-900 w-40 h-1 mx-auto mb-4"></div>
            <form onSubmit={sendMail} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter the description"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select year
                </label>
                <select
                  value={mailSelectedYear}
                  onChange={(e) => setMailSelectedYear(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Year --</option>
                  {mailYearSelectData.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Total Costs
                </label>
                <input
                  type="number"
                  value={totals.cost}
                  onChange={(e) => setTotalCosts(e.target.value)}
                  placeholder="Enter total costs"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Total Revenue
                </label>
                <input
                  type="number"
                  value={totals.revenue}
                  onChange={(e) => setTotalRevenue(e.target.value)}
                  placeholder="Enter total revenue"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Expected Revenue
                </label>
                <input
                  type="number"
                  value={totals.target}
                  onChange={(e) => setExpectedRevenue(e.target.value)}
                  placeholder="Enter expected revenue"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
              <button
                type="button"
                onClick={() => setSendEmailPopup(false)}
                className="w-full mt-2 p-2 text-gray-700 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};




export default EachEmployeeGoalSheet;
