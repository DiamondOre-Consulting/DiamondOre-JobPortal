import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const CandidateAllJobsCards = () => {
  // const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);

  const { decodedToken } = useJwt(localStorage.getItem("token"));

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {

        // Fetch associates data from the backend
        const response = await axios.get(
          "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-jobs"
        );
        console.log(response.data)
        if(response.status==200) {
          console.log(response.data);
        const all = response.data;
        // console.log(latestJobs);
        setLatestJobs(all.reverse());
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllJobs();
  }, []);

  return (
    <div class=" py-4 sm:py-8 lg:py-10">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-1 text-center text-2xl font-bold text-blue-950  lg:text-3xl font-serif">
          All Job Openings
        </h2>
        <div className="w-44 h-1 bg-blue-950 mx-auto  md:mb-12 mb-8"></div>

        <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {latestJobs.map((latestJob) => (
              <div
                class="flex flex-col justify-between h-72 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl "
              >
                <h3 className="text-2xl text-blue-950 font-bold">
                  {latestJob?.JobTitle}
                </h3>
                <div className="w-44 h-0.5 bg-blue-950   md:mb-6 "></div>
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
                <Link to={`/all-jobs/${latestJob?._id}`} class="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
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
