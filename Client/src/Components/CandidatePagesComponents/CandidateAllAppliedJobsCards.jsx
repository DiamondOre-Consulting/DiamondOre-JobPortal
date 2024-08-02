import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const CandidateAllAppliedJobsCards = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  let [loading, setLoading] = useState(true);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [empty, setEmpty] = useState(null);

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  };

  useEffect(() => {
    const fetchAllAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Token not found in local storage, handle the error or redirect to the login page
          console.error("No token found");
          navigate("/login");
          return;
        }

        // Fetch associates data from the backend
        const response = await axios.get(
          "https://api.diamondore.in/api/candidates/all-applied-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          if (response.data.length === 0) {
            setEmpty(`You have not applied to any job yet`)
            setLoading(false);
            return;
          }
          ;
          const all = response.data;
          const filteredJobs = all.filter(job => job.JobStatus === true);
          setAppliedJobs(filteredJobs.reverse());
          setLoading(false)
          

        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllAppliedJobs();
  }, []);

  return (
    <div className="bg-white py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl ">
          All Applied Jobs
        </h2>
        {
          loading ? (
            <div style={override}>
              <PropagateLoader
                color={'#023E8A'}
                loading={loading}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>) :
            (
              <>
                {appliedJobs.length === 0 ? (
                  <p className="text-center text-red-500 font-semibold">{empty} <Link to={'/all-jobs'} className="underline text-blue-600">click here</Link> to sieze the opportunity</p>
                ) : (
                  < div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {appliedJobs.map((appliedJob) => (
                      <div
                        className="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-blue-900 p-4 shadow-lg shadow-blue-900 hover:bg-blue-950 hover:shadow-blue-950"
                      >
                        <h3 className="text-xl text-gray-100 font-bold">
                          {appliedJob?.JobTitle}
                        </h3>
                        <div className="w-44 h-0.5 bg-white md:mb-4 "></div>
                        <p className="text-sm text-gray-300 font-semibold">
                          Industry - <span className="text-gray-200">{appliedJob?.Industry}</span>
                        </p>
                        <p className="text-sm text-gray-300 font-semibold">Channel - <span className="text-gray-300">{appliedJob?.Channel}</span></p>
                        <p className="text-sm text-gray-300 font-semibold">
                          Min. Experience - <span className="text-gray-200">{appliedJob?.MinExperience} Year(s)</span>
                        </p>
                        {(appliedJob?.JobStatus == false) ? (<p className="text-center text-md text-green-500 font-semibold">Job Has Been Closed</p>) : ""}
                        {(appliedJob?.appliedApplicants == decodedToken?.userId) ? (<div className="bg-red"><p className="text-center text-md text-green-500 font-semibold p-2 ">Already applied</p></div>) : ""}
                        <Link to={`/all-jobs/${appliedJob?._id}`} className="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200 hover:border hover:border-white">
                          <span className="text-md font-bold lg:text-md">
                            Know More
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
      </div>
    </div>
  )
}

export default CandidateAllAppliedJobsCards