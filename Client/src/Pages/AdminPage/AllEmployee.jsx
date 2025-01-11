import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import Snackbar from "@mui/material/Snackbar";
import { MdDelete } from "react-icons/md";
import PropagateLoader from "react-spinners/PropagateLoader";
import Alert from "@mui/material/Alert";

const AllEmployee = () => {
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  let [loading, setLoading] = useState(true);
  const [deleteActive, setDeleteActive] = useState(false);

  const navigate = useNavigate();
  const fetchAllEmployee = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        navigate("/admin-login");
        return;
      }

      const response = await axios.get(
        "https://api.diamondore.in/api/admin-confi/all-employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setActiveEmployees(response.data.activeEmployees);
        setInactiveEmployees(response.data.inactiveEmployees);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      // Handle error appropriately
    }
  };
  // Fetch all employees on component mount
  useEffect(() => {
    fetchAllEmployee();
  }, [navigate]);

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const deleteClick = async (cancelId) => {
    setDeleteActive(true);
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `https://api.diamondore.in/api/admin-confi/delete/employee/${cancelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      fetchAllEmployee();
    }

    setDeleteActive(false);
  };

  const activeClick = async (employeeId, status) => {
    setDeleteActive(true);
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `https://api.diamondore.in/api/admin-confi/update-status/employee/${employeeId}`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      fetchAllEmployee();
    }

    setDeleteActive(false);
  };

  const [policypopup, setPolicyPopup] = useState(false);
  const [files, setFiles] = useState({
    leave: null,
    performanceMenegement: null,
    holidayCalendar: null,
  });
  const [urls, setUrls] = useState({
    leave: "",
    performanceMenegement: "",
    holidayCalendar: "",
  });

  const handleFileChange = (e, field) => {
    setFiles({
      ...files,
      [field]: e.target.files[0],
    });
  };

  const getFileUrl = async (file, field) => {
    const formData = new FormData();
    formData.append("myFileImage", file);

    try {
      const response = await axios.post(
        "https://api.diamondore.in/api/admin-confi/get-policy-url",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUrls((prevUrls) => ({
        ...prevUrls,
        [field]: response.data, // Set the URL in the state for the corresponding field
      }));
    } catch (error) {
      console.error("Error fetching URL for file:", error);
    }
  };

  console.log(activeEmployees);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure URLs are ready for all fields before proceeding
    if (!urls.leave || !urls.performanceMenegement || !urls.holidayCalendar) {
      alert("Please upload all the policies.");
      return;
    }

    const policyData = {
      leave: urls.leave,
      performanceMenegement: urls.performanceMenegement,
      holidayCalendar: urls.holidayCalendar,
    };

    try {
      // Send the policy data to update all employees
      const response = await axios.post(
        "https://api.diamondore.in/api/admin-confi/upload-policies",
        policyData
      );
      alert(response.data.message);
      setPolicyPopup(false); // Close modal on success
    } catch (error) {
      alert("Error uploading policies.");
      console.error(error);
    }
  };

  const [maketlpopup, setMAkeTLPopUp] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  console.log(selectedEmployeeId);
  const makeTeamLead = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://api.diamondore.in/api/admin-confi/make-teamlead/${selectedEmployeeId}`
      );
      if (response.status === 200) {
        alert("Team Lead status updated successfully");
        setMAkeTLPopUp(false);
        setAssignPeoplePopup(true);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating Team Lead status");
    }
  };

  // assign team lead to the employee

  const [assignPeoplePopUp, setAssignPeoplePopup] = useState(false);

  const [employeeIds, setEmployeeIds] = useState([]); // List of employee IDs to be assigned
  // const [loading, setLoading] = useState(false); // Track the API call
  const [error, setError] = useState(null); // Track errors

  const assignEmployeeToTl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://api.diamondore.in/api/admin-confi/asign-to-teamlead/${selectedEmployeeId}`,
        { employeeIds }
      );

      if (response.status === 200) {
        alert("mapped successfully");
        console.log("Employees assigned successfully:", response.data);
        setAssignPeoplePopup(false);
        setEmployeeIds([]); // Reset selected employees
      }
    } catch (error) {
      console.error("Error assigning employees:", error);
      setError("Failed to assign employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  

  return (
    <>
      {/* <AdminNav /> */}
      <p
        className="float-right bg-blue-900 p-3 text-gray-100 rounded-md cursor-pointer"
        onClick={() => setPolicyPopup(true)}
      >
        upload policies
      </p>
      <div className="px-4">
        <div className="mx-auto mb-10 text-center ">
          <h1 className="text-4xl font-bold">All Employees</h1>
          <div className="w-20 h-1 mx-auto mt-2 bg-blue-900"></div>
        </div>

        {loading ? (
          <div style={override}>
            <PropagateLoader
              color={"#023E8A"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-4">
            {activeEmployees.map((emp, index) => (
              <Link
                to={`/admin-dashboard/employee/${emp?._id}`}
                className="relative flex justify-between p-5 overflow-hidden transition-all duration-500 transform bg-white shadow-xl cursor-pointer hover:shadow-2xl group rounded-xl"
                key={emp._id}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (window.confirm("Are you sure you want to delete?")) {
                      deleteClick(emp?._id);
                    }
                  }}
                  className="absolute top-0 left-0 z-10 p-1 text-[1.5rem] text-red-800 bg-red-200 shadow-md rounded-tl-xl"
                >
                  <MdDelete />
                </div>

                <div>
                  {/* {emp.empType.startsWith("TeamLeader") && (
                   
                  )} */}
 {emp.isTeamLead ? (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedEmployeeId(emp._id);
        setAssignPeoplePopup(true); // Show Assign Employees popup
      }}
      className="absolute top-0 right-0 bg-green-400 p-1 text-sm"
    >
      Assign Employees
    </div>
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedEmployeeId(emp._id);
        setMAkeTLPopUp(true); // Show Make TL popup
      }}
      className="absolute top-0 right-0 bg-yellow-400 p-1 text-sm"
    >
      Make TL
    </div>
  )}
                </div>

                <div className="flex">
                  <div className="w-1 h-full bg-blue-900 rounded-full"></div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="transition-all duration-500 transform w-fit">
                      <h1 className="font-bold text-gray-900">{emp?.name}</h1>
                      <p className="text-gray-400">{emp?.empType}</p>
                      <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                        Email: {emp?.email}
                      </p>
                      <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                        DOJ: {emp?.doj}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        className="flex mt-2 relative z-20 items-center gap-2 min-w-[6.8rem]"
                      >
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`statusAccepted${emp?._id}`}
                            className="font-semibold text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            A:
                          </label>
                          <input
                            id={`statusAccepted${emp?._id}`}
                            type="radio"
                            name={`status${emp?._id}`}
                            checked={emp?.activeStatus === true}
                            onChange={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              activeClick(emp?._id, true);
                            }}
                            value="ACCEPTED"
                            className="size-[15px] accent-green-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`statusRejected${emp?._id}`}
                            className="font-semibold text-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            R:
                          </label>
                          <input
                            id={`statusRejected${emp?._id}`}
                            type="radio"
                            name={`status${emp?._id}`}
                            checked={emp?.activeStatus === false}
                            onChange={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              activeClick(emp?._id, false);
                            }}
                            value="REJECTED"
                            className="size-[15px] accent-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ">
                  <div className="w-20 h-20 bg-blue-900 rounded-full -mr-14"></div>
                  <div className="z-10 w-5 h-5 -mr-10 bg-blue-900 rounded-full"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-16">
        <div className="mx-auto mb-10 text-center ">
          <h1 className="text-4xl font-bold">Exit Employees</h1>
          <div className="w-20 h-1 mx-auto mt-2 bg-blue-900"></div>
        </div>

        {loading ? (
          <div style={override}>
            <PropagateLoader
              color={"#023E8A"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-4">
            {inactiveEmployees.map((emp, index) => (
              <Link
                to={`/admin-dashboard/employee/${emp?._id}`}
                className="relative flex justify-between p-5 overflow-hidden transition-all duration-500 transform bg-white shadow-xl cursor-pointer hover:shadow-2xl group rounded-xl"
                key={emp._id}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (window.confirm("Are you sure you want to cancel?")) {
                      deleteClick(emp?._id);
                    }
                  }}
                  className="absolute top-0 left-0 z-10 p-1 text-[1.5rem] text-red-800 bg-red-200 shadow-md rounded-tl-xl"
                >
                  <MdDelete />
                </div>

                <div className="flex">
                  <div className="w-1 h-full bg-blue-900 rounded-full"></div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="transition-all duration-500 transform w-fit">
                      <h1 className="font-bold text-gray-900">{emp.name}</h1>
                      <p className="text-gray-400">{emp?.empType}</p>
                      <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                        Email: {emp?.email}
                      </p>
                      <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                        DOJ: {emp?.doj}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        className="flex mt-2 relative z-20 items-center gap-2 min-w-[6.8rem]"
                      >
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`statusAccepted${emp?._id}`}
                            className="font-semibold text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            A:
                          </label>
                          <input
                            id={`statusAccepted${emp?._id}`}
                            type="radio"
                            name={`status${emp?._id}`}
                            checked={emp?.activeStatus === true}
                            onChange={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              activeClick(emp?._id, true);
                            }}
                            value="true"
                            className="size-[15px] accent-green-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`statusRejected${emp?._id}`}
                            className="font-semibold text-red-500"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            R:
                          </label>
                          <input
                            id={`statusRejected${emp?._id}`}
                            type="radio"
                            name={`status${emp?._id}`}
                            checked={emp?.activeStatus === false}
                            onChange={(e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              activeClick(emp?._id, false);
                            }}
                            value="false"
                            className="size-[15px] accent-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ">
                  <div className="w-20 h-20 bg-blue-900 rounded-full -mr-14"></div>
                  <div className="z-10 w-5 h-5 -mr-10 bg-blue-900 rounded-full"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {policypopup && (
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
              <div>
                <label className="block text-gray-800  mb-1">
                  Leave Report
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e, "leave");
                    getFileUrl(e.target.files[0], "leave");
                  }}
                />
              </div>

              <div>
                <label className="block text-gray-800  mb-1">
                  Performance Management
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e, "performanceMenegement");
                    getFileUrl(e.target.files[0], "performanceMenegement");
                  }}
                />
              </div>

              <div>
                <label className="block text-gray-800  mb-1">
                  Holiday Calendar
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e, "holidayCalendar");
                    getFileUrl(e.target.files[0], "holidayCalendar");
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Upload Policies
              </button>
            </form>
          </div>
        </div>
      )}

      {/* make TL Popup */}
      {maketlpopup && (
        <>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setMAkeTLPopUp(false)} // Close modal when clicking outside
          >
            <div
              className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <form onSubmit={makeTeamLead} className="space-y-4">
                <p className="text-lg text-center uppercase text-blue-900">
                  MAKE TEAM LEADER
                </p>
                <div className="mx-auto bg-blue-900 h-1 w-20"></div>

                <div>
                  <label className="block text-gray-800  mb-1">Make TL</label>
                  <select className="w-full p-2">
                    <option>Select</option>
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Make TL
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {assignPeoplePopUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setAssignPeoplePopup(false)} // Close modal when clicking outside
        >
          <div
            className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form onSubmit={assignEmployeeToTl} className="space-y-4">
              <p className="text-lg text-center uppercase text-blue-900">
                Assign Employees to TL
              </p>
              <div className="mx-auto bg-blue-900 h-1 w-20"></div>

              {error && <p className="text-red-500">{error}</p>}

              <div>
                <label className="block text-gray-800 mb-1">
                  Select Employees
                </label>
                <div className="w-full p-2 border border-gray-300 rounded-md">
                  {activeEmployees && activeEmployees.length > 0 ? (
                    activeEmployees.map((emp) => (
                      <div key={emp._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={emp._id}
                          value={emp._id}
                          checked={employeeIds.includes(emp._id)}
                          onChange={(e) => {
                            const updatedIds = e.target.checked
                              ? [...employeeIds, emp._id]
                              : employeeIds.filter((id) => id !== emp._id);
                            setEmployeeIds(updatedIds);
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={emp._id} className="text-gray-800">
                          {emp.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No active employees available
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                // disabled={loading}
              >
                assign
                {/* {loading ? "Assigning..." : "Assign Employees"} */}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllEmployee;
