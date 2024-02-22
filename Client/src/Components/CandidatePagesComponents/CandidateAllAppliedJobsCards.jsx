import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const CandidateAllAppliedJobsCards = () => {
    const navigate = useNavigate();
    const [appliedJobs, setAppliedJobs] = useState([]);
  
    const { decodedToken } = useJwt(localStorage.getItem("token"));
  
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
            "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-applied-jobs",
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
          );
          if(response.status==200) {
            console.log(response.data);
          const all = response.data;
          setAppliedJobs(all.reverse());
          console.log(latest.reverse());
          }
        } catch (error) {
          console.error("Error fetching associates:", error);
          // Handle error and show appropriate message
        }
      };
  
      fetchAllAppliedJobs();
    }, []);

  return (
    <div class="bg-white py-4 sm:py-8 lg:py-10">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl ">
          All Applied Jobs
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {appliedJobs.map((appliedJob) => (
              <div
                class="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-blue-900 p-4 shadow-lg shadow-blue-900 hover:bg-blue-950 hover:shadow-blue-950"
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
                <p className="text-sm text-gray-300 font-semibold">
                  Total Openings - <span className="text-gray-200">{appliedJob?.Vacancies}</span>
                </p>
                {(appliedJob?.appliedApplicants == decodedToken?.userId) ? (<p className="text-center text-md text-green-500 font-semibold">Already applied</p>) : ""}
                <Link to={`/all-jobs/${appliedJob?._id}`} class="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200 hover:border hover:border-white">
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

export default CandidateAllAppliedJobsCards