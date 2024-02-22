import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const CandidateAllOtherJobsCards = () => {
    const navigate = useNavigate();
    const [otherJobs, setOtherJobs] = useState([]);
  
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
            "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-other-jobs",
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
          if(response.status==200) {
            console.log(response.data);
          const all = response.data;
          setOtherJobs(all.reverse());
          console.log(latest.reverse());
          }
        } catch (error) {
          console.error("Error fetching associates:", error);
          // Handle error and show appropriate message
        }
      };
  
      fetchAllOtherJobs();
    }, []);

  return (
    <div class="bg-white py-4 sm:py-8 lg:py-10">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          All Applied Jobs
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {otherJobs.map((otherJob) => (
              <div
                class="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl"
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
                <p className="text-sm text-gray-600 font-semibold">
                  Total Openings - <span className="text-blue-950">{otherJob?.Vacancies}</span>
                </p>
                {(otherJob?.appliedApplicants == decodedToken?.userId) ? (<p className="text-center text-md text-green-500 font-semibold">Already applied</p>) : ""}
                <Link to={`/all-jobs/${otherJob?._id}`} class="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                  <span class="text-md font-bold lg:text-md">
                    Know More
                  </span>
                </Link>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CandidateAllOtherJobsCards