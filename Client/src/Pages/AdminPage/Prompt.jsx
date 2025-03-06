import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";




const Prompt = () => {
  const [sheet, setSheet] = useState(null);
  const [sheeturl, setsheeturl] = useState(null);
  const [showLoader2, setShowLoader2] = useState(false);
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [sendbulkjobspopup, setSendBulkJobsPopup] = useState(false);
  const fileInputRef = useRef(null);
  

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;
      if (tokenExpiration && tokenExpiration < Date.now()) {
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  }, [decodedToken, navigate]);

  // const handleUploadsheet = async (e) => {
  //   e.preventDefault();
  //   if(!sheet){
  //       alert("File not selected")
  //   }
  //   try {
  //     setShowLoader(true);
  //     const formData = new FormData();
  //     formData.append("myFile", sheet);

  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-dsr`,
  //       formData
  //     );

  //     if (response.status === 200) {
  //       setsheeturl(response.data); 
  //     }else {
  //       console.error("Failed to upload file:", response.data);
  //     }
  //   }catch (error) {
  //     console.error("Error uploading file:", error);
  //   }finally {
  //     setShowLoader(false);
  //   }
  // };
     
  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myFile", sheet);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-dsr-excel`,
        formData
      );

      if (response.status === 200) {        
        setsheeturl("");
        setSheet(null); 
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        alert("DSR added successfully");
      } else {
        console.error("Failed to submit DSR:", response.data);
      }
    } catch (error) {
      console.error("Error submitting DSR:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    console.log("enter")
    if(phone.length < 10){
      setError("Invalid phone number. Please enter at least 10 digits.");
      return;
    }
    try {
      setShowLoader2(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/findJobs/${phone}`
      );
      // Log the response for debugging
      if(response.data.success) {
        console.log(response.data);
        setProfile(response.data);
        setError("");
      }else{
        setError("No data found");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error searching for profile:", error);
      setError(error.response?.data || "An error occurred");
      setProfile(null);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setError("Suitable job not found !!");
        }
      }
    } finally {
      setShowLoader2(false);
    }
  };



  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [ctcStart, setCtcStart] = useState("");
  const [ctcEnd, setCtcEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [ recipientEmail ,setRecipientEmail] = useState("")




  const handlesendbulkjobs = async (e) => {
    
    e.preventDefault();
    if( !recipientEmail || !fromDate || !toDate || !location || !ctcStart || !ctcEnd){
      alert("Please fill al the fields")
      return 
    }
    setLoading(true);
    const formattedFromDate = fromDate;
    const formattedToDate = toDate;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/find-bulk-jobs`,
        {
          params: {
            recipientEmail,
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            location,
            ctcStart,
            ctcEnd,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        alert("Emails have been sent successfully!");
        setSendBulkJobsPopup(false)
        setFromDate("")
        setToDate("")
        setLocation("")
        setCtcStart("")
        setCtcEnd("")
        setRecipientEmail("")
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          alert("No candidates found.");
        } else {
          alert("An error occurred: " + error.response.data);
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  //   getting the DSR data
  const [dsrdata, setDSRData] = useState([]);
  const [locationData,setLocationData] = useState([])
  useEffect(() => {
    const getDSR = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/get-dsr-data`
        );
        if (response.status === 200){
          setDSRData(response.data.recruiters);
          setLocationData(response.data.cities)
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDSR();
  }, []);



  
  return (
    <>
      {/* <AdminNav /> */}
      <button
        className=" bg-blue-900 px-6 py-2 text-gray-100 float-right mr-0 md:mr-10 rounded-md"
        onClick={() => setSendBulkJobsPopup(true)}
      >
        Send Bulk Jobs
      </button>
      <div className="flex flex-col mt-20 md:mt-10">
        <h1 className="text-4xl ml-0 font-bold text-center">Prompt</h1>
        <div className="w-40 bg-blue-950 h-0.5 text-center mx-auto"></div>
      </div>

      <div className="md:flex justify-center align-center  items-center mt-10 px-4">
        <input
        ref={fileInputRef}
          type="file"
          id="myFile"
          name="myFile"
          accept=".pdf,.doc,.docx,.xlsx"
          className="border border-1"
          onChange={(e) => setSheet(e.target.files[0])}
          disabled={loading}
        />
        <button
          type="button"
          className={`bg-blue-950 ml-2 text-white p-2 px-12 flex items-center mt-2 md:mt-0 justify-center rounded-md ${
            sheeturl ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlesubmit}
          disabled={loading}
        >
          {loading ? (
            <svg
              aria-hidden="true"
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
                fill="currentFill"
              />
            </svg>
          ) : (
            <span className="relative z-10">Upload</span>
          )}
        </button>
       
      </div>

      <div className="relative pt-2">
        <div className="relative w-11/12 md:max-w-xl mx-auto bg-white rounded-full mt-4 mb-10">
          <input
            placeholder="Search by Phone"
            className="rounded-full w-full h-16 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-gray-100 focus:border-gray-100"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white transition duration-150 ease-in-out rounded-full outline-none right-3 top-3 bg-blue-950 sm:px-6 sm:text-base sm:font-medium hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950"
          >
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {showLoader2 ? (
        <div className="flex justify-center items-center">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
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
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        profile && (
          <div className="px-4 md:px-40 py-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Recommended Jobs For {profile?.candidateName}
            </h2>

            <div className="relative md:w-full w-80 overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Industry
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Channel
                    </th>
                    <th scope="col" className="px-6 py-3">
                      City
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Min Experience
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Max Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {profile.suitableJobs.map((job, index) => (
                    <tr key={index} className="bg-white border-b   ">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                        {job.Company}
                      </td>
                      <td className="px-6 py-4">{job.JobTitle}</td>
                      <td className="px-6 py-4">{job.Industry}</td>
                      <td className="px-6 py-4">{job.Channel}</td>
                      <td className="px-6 py-4">{job.City}</td>
                      <td className="px-6 py-4 text-center">
                        {job.MinExperience}
                      </td>
                      <td className="px-6 py-4 text-center">{job.MaxSalary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* <AdminFooter /> */}

      {sendbulkjobspopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Bulk Jobs Form</h2>
            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium">
                  Recruiter Name
                </label>
                <select
                    className="w-full min-w-[12rem] p-2 rounded-md"
                    defaultValue=""
                    onChange={handleSelect}
                  >
                    <option value="">Select Value</option>
                    {dsrdata?.map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                </select>

              </div> */}

                <div className=" font-medium space-y-2">
                  <label className="block" htmlFor="recipientEmail">Recipient's email</label>
                  <input 
                   className="rounded-md block w-full"
                   type="email" id="recipientEmail" 
                   name="recipientEmail" 
                   onChange={(e)=>{setRecipientEmail(e.target.value)}}
                   />
                </div>

              <div className="flex justify-between">
                <div>
                  <label className="block text-sm font-medium">From Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded-md w-full"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">To Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded-md w-full"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
              <select
                    className="w-full min-w-[12rem] p-2 rounded-md"
                    defaultValue=""
                    onChange={(e)=>{
                      console.log(e.target.value)
                      setLocation(e.target.value)
                    }}
                  >
                    <option value="">Select Value</option>
                    {locationData?.map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-x-2 ">
                <div>
                  <label className="block text-sm font-medium">CTC Start</label>
                  <input
                    type="number"
                    className="border p-2 rounded-md w-full"
                    value={ctcStart}
                    onChange={(e) => setCtcStart(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">CTC End</label>
                  <input
                    type="number"
                    className="border p-2 rounded-md w-full"
                    value={ctcEnd}
                    onChange={(e) => setCtcEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-200 px-4 py-2 rounded-md mr-2"
                onClick={() => setSendBulkJobsPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                onClick={handlesendbulkjobs}
                disabled={loading}
              >
                {loading ? (
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Prompt;
