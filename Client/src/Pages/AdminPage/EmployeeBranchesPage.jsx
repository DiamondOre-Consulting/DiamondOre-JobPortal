import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmployessEditDetails from "../../Components/EmployeeComponents/EmployessEditDetails";
import crossIcon from "../../assets/crossIcon.svg";

const EmployeeBranchesPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState("");
  const [editEmployeeToggle, setEditEmployeeToggle] = useState(false);
  const [update, setUpdate] = useState(false);

  // get Employee Data

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
          console.log(response.data);
        }
      } catch (error) {}
    };

    getEmployeeData();
  }, []);

  const handleEditEmloyeeClick = () => {
    setEditEmployeeToggle((prev) => !prev);
  };

  const handleEditEmployeeBack = () => {
    setEditEmployeeToggle((prev) => !prev);
  };

  const employeename = employee?.name;

  //get team
  const teamId = employee?._id;
  console.log( "Team Id", teamId);

  const [mappedemp, setMappedemp] = useState([]);

  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/get-team/${teamId}`,
          {}
        );

        if (response.status === 200) {
          setMappedemp(response.data.team);
          console.log("team data is", response.data);
        }
      } catch (error) {
        console.log(error)
      }
    };

    getTeamMembers();
  }, [teamId]);

 

  const unassignedemp = async (employeeId) => {
    try {
      console.log("Unassigning employee with ID:", employeeId); // Debugging
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/unassign-from-teamlead/${id}`, // Use the teamLeadId from URL
        { employeeId } // Pass the employeeId in the request body
      );
      console.log("Response from server:", response.data); // Debugging
      if (response.status === 200) {
        alert("Employee successfully removed from the team!");
        // Instead of reloading the page, update the state or refetch data for a smoother user experience
        window.location.reload(); // Optional, reload if you want
      }
    } catch (error) {
      console.error("Error unmapping employee:", error.message);
      alert("Failed to unmap employee. Please try again.");
    }
  };


  console.log("enp",employee)

  return (
    <div className="realtive">
      {editEmployeeToggle && (
        <>
          {/* Overlay with opacity */}
          <div className="fixed left-0 z-20 w-full h-screen bg-black top-10 opacity-60 "></div>

          <div className="absolute z-40 ml-8 cursor-pointer">
            <img
              onClick={handleEditEmployeeBack}
              src={crossIcon}
              alt=""
              className="z-40 w-12 h-12 cursor-pointer"
            />
          </div>
          {/* Popup Form */}
          <div className="absolute inset-0 z-30 flex items-center justify-center mt-20 ">
            <div className="w-full max-w-lg p-6 rounded-lg mt-28">
              <EmployessEditDetails
                id={employee._id}
                handleEditEmployeeBack={handleEditEmployeeBack}
              />
            </div>
          </div>
        </>
      )}

      <div>
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <h1 className="text-3xl text-center uppercase">{employee.name} </h1>
            <p className="text-3xl ml-2"> ({employee?.empType})</p>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              className={`size-3 animate-ping ml-4 rounded-full ${
                employee.activeStatus ? "bg-green-700" : "bg-red-700"
              }`}
            ></div>
            <div
              className={`size-1 animate-ping absolute z-10 ml-4 rounded-full ${
                employee.activeStatus ? "bg-green-700" : "bg-red-700"
              }`}
            ></div>
          </div>
        </div>
        <div className="flex  w-fit  items-center">


        <div>
          {employee?.shortlistedCandidates && (
           <a
            className=" text-center p-4 text-white absolute  right-10 top-40 bg-green-600"
           href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(employee?.shortlistedCandidates)}`}
           target="_blank"
           rel="noopener noreferrer"
         >
           View Shortlisted Candidates
         </a>
          )}
        </div>

        <button
          onClick={handleEditEmloyeeClick}
          className="absolute px-3 py-2 font-medium text-white bg-blue-900 rounded-sm right-14"
        >
          {" "}
          Edit Employee{" "}
        </button>
        </div>
       
        
        <div className="w-20 h-1 mx-auto bg-blue-900"></div>{" "}
   
        <div className="grid grid-cols-1 gap-4 px-2 my-20 md:grid-cols-4 md:gap-10 md:px-20 ">
          {employee.accountHandler && (
            <Link
              to={`/admin-dashboard/each-account/${id}`}
              className="relative z-20 flex items-center justify-center overflow-hidden text-white transition-all bg-blue-900 rounded-md shadow-2xl h-60 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96"
            >
              <p className="relative z-10 text-xl cursor-pointer">
                Account Handling
              </p>
            </Link>
          )}

          <Link
            to={`/admin-dashboard/kpi/${id}`}
            className="relative flex items-center justify-center overflow-hidden text-white transition-all bg-blue-900 rounded-md shadow-2xl h-60 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96"
          >
            <p className="relative z-10 text-xl">KPI Score</p>
          </Link>

          <Link
            to={`/admin-dashboard/goal-sheet/${id}/${encodeURIComponent(
              employeename
            )}`}
            className="relative flex items-center justify-center overflow-hidden text-white transition-all bg-blue-900 rounded-md shadow-2xl h-60 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96"
          >
            <p className="relative z-10 text-xl">Goal Sheet</p>
          </Link>

          <Link
           to={`/admin-dashboard/incetive-tree/${id}`}
           className="relative flex items-center justify-center overflow-hidden text-white transition-all bg-blue-900 rounded-md shadow-2xl h-60 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96">

            <p className="relative z-10 text-xl">Incentive</p>
          </Link>
        </div>
      </div>

      {/* mapped employee */}
      <div>
        <p className="text-center text-2xl underline ">Mapped Employee</p>

        <div className="grid grid-cols-4 gap-y-6 text-white  gap-x-10 mt-10 ">
          {mappedemp?.map((emp) => (
            <>
              <div className="text-center ">
                <div className="bg-blue-900 p-4">
                  <p>{emp.name}</p>
                  <p
                    onClick={() => unassignedemp(emp._id)}
                    className="p-1 bg-red-600 cursor-pointer mt-2 text-white"
                  >
                    Remove
                  </p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeBranchesPage;
