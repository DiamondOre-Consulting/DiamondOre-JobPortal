import axios from "axios";
import React, { useEffect, useState } from "react";

const EmployeePolicies = () => {
  const [userData, setUserData] = useState();
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
          `${import.meta.env.VITE_BASE_URL}/employee/policies`,
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


  return (
    <div>
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
    </div>
  );
};

export default EmployeePolicies;
