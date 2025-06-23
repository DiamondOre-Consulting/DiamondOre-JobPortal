import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UpdateStatus = () => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    cvShortlisted: false,
    screening: false,
    interviewScheduled: false,
    interviewed: false,
    shortlisted: false,
    joined: false
  });

  const { id1, id2 } = useParams();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login");
    return null;
  }

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

      if (tokenExpiration && tokenExpiration < Date.now()) {
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }

    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/get-status/${id1}/${id2}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setStatusData(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch status data");
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, [decodedToken, id1, id2, token, navigate]);

  useEffect(() => {
    const fetchCandidateDetail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-candidates/${id1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setAdminDetails(response.data);
        } else {
          console.error("Error finding candidate with id:", id1);
        }
      } catch (error) {
        toast.error("Failed to fetch candidate details");
        console.error("Error fetching candidate details:", error);
      }
    };

    fetchCandidateDetail();
  }, [decodedToken, id1, token]);

  const updateStatus = async (type) => {
    const endpointMap = {
      cvShortlisted: "update-cv-shortlisted",
      screening: "update-screening",
      interviewScheduled: "update-interviewscheduled",
      interviewed: "update-interviewed",
      shortlisted: "update-shortlisted",
      joined: "update-joined"
    };

    const statusKeyMap = {
      cvShortlisted: "CvShortlisted",
      screening: "Screening",
      interviewScheduled: "InterviewScheduled",
      interviewed: "Interviewed",
      shortlisted: "Shortlisted",
      joined: "Joined"
    };

    const statusLabels = {
      cvShortlisted: "CV Shortlisted",
      screening: "Screening",
      interviewScheduled: "Interview Scheduled",
      interviewed: "Interviewed",
      shortlisted: "Shortlisted",
      joined: "Joined"
    };

    try {
      setLoadingStates(prev => ({ ...prev, [type]: true }));

      // Optimistic UI update
      setStatusData(prev => ({
        ...prev,
        status: {
          ...prev.status,
          [statusKeyMap[type]]: true
        }
      }));

      // API call
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/${endpointMap[type]}/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Verify with server
      const statusResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/get-status/${id1}/${id2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (statusResponse.status === 200) {
        setStatusData(statusResponse.data);
        toast.success(`${statusLabels[type]} status updated successfully!`);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      // Revert on error
      setStatusData(prev => ({
        ...prev,
        status: {
          ...prev.status,
          [statusKeyMap[type]]: false
        }
      }));
      toast.error(`Failed to update ${statusLabels[type]} status`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const StatusButton = ({ statusType, currentStatus, requiredStatus }) => {
    const isLoading = loadingStates[statusType];
    const isComplete = statusData?.status[currentStatus] || false;
    const isEnabled = requiredStatus ? statusData?.status[requiredStatus] : true;

    return (
      <div className="flex items-center gap-2">
        {isComplete ? (
          <span className="flex items-center text-green-600">
            <FaCheck className="mr-1" /> Yes
          </span>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin text-blue-500 text-lg mr-2" />
                <span className="text-sm text-gray-500">Updating...</span>
              </div>
            ) : (
              <button
                className={`px-5 py-1 rounded-md text-sm text-gray-100 ${
                  isEnabled
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (isEnabled) {
                    updateStatus(statusType);
                  } else {
                    toast.error("Please complete the previous step first!");
                  }
                }}
                disabled={!isEnabled || isLoading}
              >
                Yes
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  if (!statusData || !adminDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200 sm:flex-row lg:h-90">
            {/* Candidate Profile Section */}
            <div className="order-first h-auto w-full rounded-lg bg-gray-300 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
              <div className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 h-full">
                <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                <div className="sm:flex sm:justify-between items-center sm:gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {adminDetails?.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-gray-600">Candidate</p>
                  </div>

                  <div className="hidden sm:block sm:shrink-0">
                    <img
                      alt={`Photo of ${adminDetails?.name}`}
                      src={adminDetails?.profilePic}
                      className="h-20 w-20 rounded-lg object-cover shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="max-w-[40ch] text-md text-gray-500">
                    {adminDetails?.email}
                  </p>
                </div>
                <div className="mt-1">
                  <p className="max-w-[40ch] text-md text-gray-500">
                    {adminDetails?.phone}
                  </p>
                </div>

                <dl className="mt-8 flex gap-4 sm:gap-6">
                  <div className="flex">
                    <a
                      href={adminDetails?.resume}
                      className="text-sm font-semibold text-gray-100 bg-blue-900 hover:bg-blue-950 rounded-md px-5 py-2"
                    >
                      Download Resume
                    </a>
                  </div>
                </dl>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
              <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl lg:text-4xl">
                Change Status Of Candidature
              </h2>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Applied?{" "}
                {statusData?.status.Applied ? (
                  <span className="flex items-center text-green-600">
                    <FaCheck className="mr-1" /> Yes
                  </span>
                ) : (
                  <button className="px-3 py-2 rounded-md text-gray-100 bg-green-600">
                    Yes
                  </button>
                )}
              </div>
              
              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                CV Shortlisted?{" "}
                <StatusButton 
                  statusType="cvShortlisted" 
                  currentStatus="CvShortlisted"
                  requiredStatus="Applied" 
                />
              </div>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Screening?{" "}
                <StatusButton 
                  statusType="screening" 
                  currentStatus="Screening"
                  requiredStatus="CvShortlisted" 
                />
              </div>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Interview Scheduled?{" "}
                <StatusButton 
                  statusType="interviewScheduled" 
                  currentStatus="InterviewScheduled"
                  requiredStatus="Screening" 
                />
              </div>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Interviewed?{" "}
                <StatusButton 
                  statusType="interviewed" 
                  currentStatus="Interviewed"
                  requiredStatus="InterviewScheduled" 
                />
              </div>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Shortlisted?{" "}
                <StatusButton 
                  statusType="shortlisted" 
                  currentStatus="Shortlisted"
                  requiredStatus="Interviewed" 
                />
              </div>

              <div className="mb-2 max-w-md text-gray-600 font-semibold flex items-center gap-2">
                Joined?{" "}
                <StatusButton 
                  statusType="joined" 
                  currentStatus="Joined"
                  requiredStatus="Shortlisted" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;