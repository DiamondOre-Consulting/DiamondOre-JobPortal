import axios from "axios";
import React, { useEffect, useState } from "react";

const EmployeePolicies = () => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          navigate("/employee-login");
          return;
        }

        const response = await axios.get(
          "https://api.diamondore.in/api/employee/user-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
         
          setUserData(response.data.Policies[0]);
          console.log("myuserdata",response.data.Policies[0]);
        } else {
          setUserData("Did not get any response!!!");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData)
  return (
    <div>
      <p className="text-3xl text-center uppercase ">All Policies</p>
      <div className="w-20 mx-auto h-1 bg-blue-900 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-content-center place-items-center">
      <a href={userData?.leave} className="bg-blue-900 cursor-pointer text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
          <a href={userData?.leave}>Leave Report</a>
        </a>
        <a href={userData?.performanceMenegement} className="bg-blue-900 cursor-pointer text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
          <a href={userData?.performanceMenegement}> performance Menegement</a>
        </a>
        <a href={userData?.holidayCalendar} className="bg-blue-900 cursor-pointer  text-gray-200 text-xl w-full border border-1 h-60 text-center flex items-center  justify-center">
          <a href={userData?.holidayCalendar}> Holiday Calendar</a>
        </a>
      </div>
    </div>
  );
};

export default EmployeePolicies;