import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const CandidateAllOtherJobsCards = () => {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  const [otherJobs, setOtherJobs] = useState([]);

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  };

  const { decodedToken } = useJwt(localStorage.getItem("token"));

  useEffect(() => {
    const fetchAllOtherJobs = async () => {
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
          "https://api.diamondore.in/api/candidates/all-other-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 200) {
          ;
          const all = response.data;
          const filteredJobs = all.filter(job => job.jobStatus === "true");
          setOtherJobs(filteredJobs.reverse());
          setLoading(false)

        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllOtherJobs();
  }, []);

  return (
    <div className="bg-white py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          All Applied Jobs
        </h2>
        {
          loading ?
            <div style={override}>
              <PropagateLoader
                color={'#023E8A'}
                loading={loading}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div> :

            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {otherJobs.map((otherJob) => (
                <div
                  className="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl"
                >
                  <h3 className="text-xl text-blue-950 font-bold">
                    {otherJob?.JobTitle}
                  </h3>
                  <div className="w-44 h-0.5 bg-blue-950 md:mb-6 "></div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Industry - <span className="text-blue-950">{otherJob?.Industry}</span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">Channel - <span className="text-blue-950">{otherJob?.Channel}</span></p>
                  <p className="text-sm text-gray-600 font-semibold">
                    Min. Experience - <span className="text-blue-950">{otherJob?.MinExperience} Year(s)</span>
                  </p>

                  {(otherJob?.appliedApplicants == decodedToken?.userId) ? (<p className="text-center text-md text-green-500 font-semibold">Already applied</p>) : ""}
                  <Link to={`/all-jobs/${otherJob?._id}`} className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                    <span className="text-md font-bold lg:text-md">
                      Know More
                    </span>
                  </Link>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

export default CandidateAllOtherJobsCards