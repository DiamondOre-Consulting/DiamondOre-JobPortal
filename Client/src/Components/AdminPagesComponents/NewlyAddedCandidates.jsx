import React, { useEffect, useState } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";

const NewlyAddedCandidates = () => {
  const navigate = useNavigate();
  const [latestCandidates, setlatestCandidates] = useState([]);

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); 
    return;
  }

  useEffect(() => {
    const fetchNewlyAddedCandidates = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Token not found in local storage, handle the error or redirect to the login page
          console.error("No token found");
          navigate("/admin-login");
          return;
        }

        // Fetch associates data from the backend
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-candidates`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        ;
        const all = response.data;
        const latest = all.slice(-7);
        // 
        setlatestCandidates(latest.reverse());
        ;
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Handle error and show appropriate message
      }
    };

    fetchNewlyAddedCandidates();
  }, []);

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          Newly Added Candidates
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {latestCandidates.map((latestCandidate) => (
            <div>
              <div
                href="#"
                className="flex flex-col justify-between h-48 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl "
              >
                <h3 className="text-sm text-blue-950 font-bold">
                  Name - <span className="text-blue-950">{latestCandidate?.name}</span>
                </h3>
                <p className="text-sm text-gray-600 font-semibold flex flex-wrap">
                  Email - <span className="text-blue-950">{latestCandidate?.email}</span>
                </p>
                <p className="text-sm text-gray-600 font-semibold">Phone Number - <span className="text-blue-950">{latestCandidate?.phone}</span></p>
                {/* <p className="text-xl text-gray-600 font-semibold">
                  Min. Experience - <span className="text-blue-950">{latestJob?.MinExperience} Year(s)</span>
                </p>
                <p className="text-xl text-gray-600 font-semibold">
                  
                </p> */}
                <Link to={`/admin-dashboard/each-candidate/${latestCandidate?._id}`} className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                  <span className="text-md font-bold lg:text-md">
                    Know More
                  </span>
                </Link>
              </div>
            </div>
          ))}

          <div>
            <div
              className="flex flex-col justify-center h-48 overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
            >
              <Link to={`/admin-dashboard/all-candidates`} className="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200">
                <span className="text-md font-bold lg:text-md">
                  All Candidates
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewlyAddedCandidates;
