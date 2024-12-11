import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";

const UpdateStatus = () => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [cvStatus, setCvStatus] = useState(null);
  const [screenStatus, setScreenStatus] = useState(null);
  const [intSchStatus, setIntSchStatus] = useState(null);
  const [interStatus, setInterStatus] = useState(null);
  const [shortlistedStatus, setShortlistedStatus] = useState(null);
  const [joinedStatus, setJoinedStatus] = useState(null);

  const { id1, id2 } = useParams();


  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); // Redirect to login page if not authenticated
    return;
  }

  useEffect(() => {
    if (!token) {
      // No token found, redirect to login page
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }

    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.diamondore.in/api/admin-confi/get-status/${id1}/${id2}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          ;
          setStatusData(response.data);
        }
      } catch (error) {

      }
    };

    fetchStatus();
  }, [decodedToken]);

  useEffect(() => {
    const fetchCandidatenDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.diamondore.in/api/admin-confi/all-candidates/${id1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setAdminDetails(response.data);

        } else {
          setAdminDetails("Error finding candidate with id: ", id1);
        }
      } catch (error) {

      }
    };

    fetchCandidatenDetail();
  }, [decodedToken]);

  const updateCvShortlisted = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-cv-shortlisted/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setCvStatus(true);

      }
    } catch (error) {
      setCvStatus(false);

    }
  };

  const updateScreening = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-screening/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // setCvStatus(true)
        setScreenStatus(true);

      }
    } catch (error) {
      // setCvStatus(false);
      setScreenStatus(false);

    }
  };

  const updateInterviewedScheduled = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-interviewscheduled/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // setCvStatus(true)
        setIntSchStatus(true);

      }
    } catch (error) {
      // setCvStatus(false);
      setIntSchStatus(false);

    }
  };

  const updateInterviewed = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-interviewed/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // setCvStatus(true)
        setInterStatus(true);

      }
    } catch (error) {
      // setCvStatus(false);
      setInterStatus(false);

    }
  };

  const updateShortlisted = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-shortlisted/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // setCvStatus(true)
        setShortlistedStatus(true);

      }
    } catch (error) {
      // setCvStatus(false);
      setShortlistedStatus(false);

    }
  };

  const updateJoined = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to login page if not authenticated
        return;
      }
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/update-joined/${id1}/${id2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // setCvStatus(true)
        setJoinedStatus(true);

      }
    } catch (error) {
      // setCvStatus(false);
      setJoinedStatus(false);

    }
  };

  return (
    <div className="bg-white  ">
      {/* <AdminNav /> */}
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200 sm:flex-row lg:h-90">
            <div className="order-first h-auto w-full rounded-lg bg-gray-300 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
              <a
                href="#"
                className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 h-full"
              >
                <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                <div className="sm:flex sm:justify-between items-center sm:gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {adminDetails?.name}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-gray-600">
                      Candidate
                    </p>
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
              </a>
            </div>

            <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
              <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl lg:text-4xl">
                Change Status Of Candidature
              </h2>

              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Applied?{" "}
                {statusData?.status.Applied ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <button className="px-3 py-2 rounded-md text-gray-100 bg-green-600">
                    Yes
                  </button>
                )}
              </p>
              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                CV Shortlisted?{" "}
                {statusData?.status?.CvShortlisted ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {cvStatus ? (
                      <p className="text-green-600 font-semibold">
                        CV has been shortlisted!!!
                      </p>
                    ) : (
                      <button
                        className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.Applied
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400"
                          }`}
                        onClick={() => {
                          if (statusData?.status.Applied) {
                            updateCvShortlisted();
                          } else {
                            alert("Please complete the previous step first!!!");
                          }
                        }}
                      >
                        Yes
                      </button>
                    )}
                  </>
                )}
              </p>

              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Screening?{" "}
                {statusData?.status.Screening ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {screenStatus ? (
                      <p className="text-green-600 font-semibold">
                        Screened Successfully!!!
                      </p>
                    ) : (
                      <button
                        className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.CvShortlisted
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400"
                          }`}
                        onClick={() => {
                          if (statusData?.status.CvShortlisted) {
                            updateScreening();
                          } else {
                            alert("Please complete the previous step first!!!");
                          }
                        }}
                      >
                        Yes
                      </button>
                    )}
                  </>
                )}
              </p>
              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Interview Scheduled?{" "}
                {statusData?.status.InterviewScheduled ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {intSchStatus ? (
                      <p className="text-green-600 font-semibold">
                        Interview Scheduled Successfully!!!
                      </p>
                    ) : (
                      <button
                        className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.Screening
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400"
                          }`}
                        onClick={() => {
                          if (statusData?.status.Screening) {
                            updateInterviewedScheduled();
                          } else {
                            alert("Please complete the previous step first!!!");
                          }
                        }}
                      >
                        Yes
                      </button>
                    )}
                  </>
                )}
              </p>
              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Interviewed?{" "}
                {statusData?.status.Interviewed ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {interStatus && (
                      <p className="text-green-600 font-semibold">
                        Interview is done!!!
                      </p>
                    )}
                    <button
                      className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.InterviewScheduled
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400"
                        }`}
                      onClick={() => {
                        if (statusData?.status.InterviewScheduled) {
                          updateInterviewed();
                        } else {
                          alert("Please complete the previous step first!!!");
                        }
                      }}
                    >
                      Yes
                    </button>
                  </>
                )}
              </p>
              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Shortlisted?{" "}
                {statusData?.status.Shortlisted ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {shortlistedStatus && (
                      <p className="text-green-600 font-semibold">
                        Candidate has been shortlisted!!!
                      </p>
                    )}
                    <button
                      className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.Interviewed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400"
                        }`}
                      onClick={() => {
                        if (statusData?.status.Interviewed) {
                          updateShortlisted();
                        } else {
                          alert("Please complete the previous step first!!!");
                        }
                      }}
                    >
                      Yes
                    </button>
                  </>
                )}
              </p>
              <p className="mb-2 max-w-md text-gray-600 font-semibold">
                Joined?{" "}
                {statusData?.status.Joined ? (
                  <span className="text-md text-green-600">Yes</span>
                ) : (
                  <>
                    {joinedStatus && (
                      <p className="text-green-600 font-semibold">
                        CV has Joined!!!
                      </p>
                    )}
                    <button
                      className={`px-5 py-1 rounded-md text-sm text-gray-100 ${statusData?.status.Shortlisted
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400"
                        }`}
                      onClick={() => {
                        if (statusData?.status.Shortlisted) {
                          updateJoined();
                        } else {
                          alert("Please complete the previous step first!!!");
                        }
                      }}
                    >
                      Yes
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <AdminFooter /> */}
    </div>
  );
};

export default UpdateStatus;
