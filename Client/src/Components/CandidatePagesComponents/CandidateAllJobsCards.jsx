import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const CandidateAllJobsCards = () => {
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);

  const { decodedToken } = useJwt(localStorage.getItem("token"));

  useEffect(() => {
    const fetchAllJobs = async () => {
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
          "http://localhost:5000/api/candidates/all-jobs"
        );
        if(response.status==200) {
          console.log(response.data);
        const all = response.data;
        const latest = all.slice(-7);
        // console.log(latestJobs);
        setLatestJobs(all.reverse());
        console.log(latest.reverse());
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllJobs();
  }, []);

  return (
    <div class="bg-white py-4 sm:py-8 lg:py-10">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          All Job Openings
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {latestJobs.map((latestJob) => (
              <div
                class="flex flex-col justify-between h-72 overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
              >
                <h3 className="text-2xl text-blue-950 font-bold">
                  {latestJob?.JobTitle}
                </h3>
                <p className="text-xl text-gray-600 font-semibold">
                  Industry - <span className="text-blue-950">{latestJob?.Industry}</span>
                </p>
                <p className="text-xl text-gray-600 font-semibold">Channel - <span className="text-blue-950">{latestJob?.Channel}</span></p>
                <p className="text-xl text-gray-600 font-semibold">
                  Min. Experience - <span className="text-blue-950">{latestJob?.MinExperience} Year(s)</span>
                </p>
                <p className="text-xl text-gray-600 font-semibold">
                  Total Openings - <span className="text-blue-950">{latestJob?.Vacancies}</span>
                </p>
                {(latestJob?.appliedApplicants == decodedToken?.userId) ? (<p className="text-center text-md text-green-500 font-semibold">Already applied</p>) : ""}
                <Link to={`/all-jobs/${latestJob?._id}`} class="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                  <span class="text-md font-bold lg:text-md">
                    Know More
                  </span>
                </Link>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateAllJobsCards;
