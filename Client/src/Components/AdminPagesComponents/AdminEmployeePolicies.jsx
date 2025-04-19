import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { LoaderCircle } from 'lucide-react';

const AdminEmployeePolicies = () => {
  const [userData, setUserData] = useState();
  const [policyPopup, setPolicyPopup] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading,setLoading] = useState(false)
  const holidayFileRef = useRef()
  const performanceManagementFileRef = useRef()
  const leavePoliciesFileRef = useRef()
  
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          navigate("/employee-login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/policies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          setUserData(response.data.Policies.Policies);
        } else {
          setUserData("Did not get any response!!!");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchPolicyData();
  }, []);


  const handleFileChange = (file,index) => {
    
    setFiles(prevFiles => {
      const newFiles = [...prevFiles]; 
      newFiles[index] = file; 
      return newFiles; 
    });
 
   
  };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      // Ensure URLs are ready for all fields before proceeding
       const formData = new FormData()
       for(let file of files){
        formData.append("policies",file)
       }
  
      try {
        // Send the policy data to update all employees
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-policies`,
          formData,{
            headers: {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        alert("files uploaded successfully");
        setPolicyPopup(false); // Close modal on success
      } catch (error) {
        console.error(error);
        alert("Error uploading policies.");
      }
      finally{
        setLoading(false)
      }
    };



  return (
    <div>
        <p
        className="float-right bg-blue-900 p-3 text-gray-100 rounded-md cursor-pointer"
        onClick={() => setPolicyPopup(true)}
      >
        upload policies
      </p>
      <p className="text-3xl text-center uppercase ">All Policies</p>
      <div className="w-20 mx-auto h-1 bg-blue-900 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-content-center place-items-center">
      <a target="_blank"  // Opens the link in a new tab
         rel="noopener noreferrer" 
         href={userData?.leave} className="bg-blue-900 cursor-pointer text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
         Leave Report
        </a>
        <a  
        target="_blank"  // Opens the link in a new tab
        rel="noopener noreferrer"  
         href={userData?.performanceMenegement} className="bg-blue-900 cursor-pointer text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
         Performance Management
        </a>
        <a  
        target="_blank"  // Opens the link in a new tab
        rel="noopener noreferrer"  
        href={userData?.holidayCalendar} className="bg-blue-900 cursor-pointer  text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
          Holiday Calendar
        </a>
      </div>
      {policyPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setPolicyPopup(false)} // Close modal when clicking outside
        >
          <div
            className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-lg text-center uppercase text-blue-900">
                Upload policies
              </p>
              <div className="mx-auto bg-blue-900 h-1 w-20"></div>
              <div className="">
                <label className="block text-gray-800  mb-1">
                  Leave Report
                </label>
                <div className="relative">
                <input
                  ref={leavePoliciesFileRef}
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e.target.files[0],0);
                  }}
                />
                <button type="button" onClick={(e)=>{
                  handleRemove(0)
                  if (leavePoliciesFileRef.current) {
                    leavePoliciesFileRef.current.value = "";
                  }
                  }} className="absolute top-0 right-0">X</button>
                </div>
              </div>

              <div>
                <label className="block text-gray-800  mb-1">
                  Performance Management
                </label>
                <div className="relative">
                <input
                ref={performanceManagementFileRef}
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e.target.files[0],1);
                  }}
                />
                <button type="button" onClick={(e)=>{handleRemove(1)
                  if (performanceManagementFileRef.current) {
                    performanceManagementFileRef.current.value = "";
                  }
                }} className="absolute top-0 right-0">X</button>
                </div>
              </div>

              <div>
                <label className="block text-gray-800  mb-1">
                  Holiday Calendar
                </label>
                <div className="relative">
                <input
                ref={holidayFileRef}
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e.target.files[0],2);
                  }}
                />
                 <button type="button" onClick={(e)=>{handleRemove(2)
                  if (holidayFileRef.current) {
                    holidayFileRef.current.value = "";
                  }
                 }} className="absolute top-0 right-0">X</button>
                 </div>
              </div>
              <button
                type="submit"
                className="w-full p-2 text-white  bg-blue-600 rounded-md hover:bg-blue-700"

              >
                {loading? <div className="flex justify-center">
                        <LoaderCircle className="animate-spin w-5 h-5" />
                    </div> : "Upload Policies"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEmployeePolicies;
