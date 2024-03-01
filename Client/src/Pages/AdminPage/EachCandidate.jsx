import React, { useEffect, useState } from "react";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const EachCandidate = () => {
  const navigate = useNavigate();
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [candidateApplied, setCandidateApplied] = useState(null);

  const { id } = useParams();
  console.log(id);

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); // Redirect to login page if not authenticated
    return;
  }

  const userName = decodedToken ? decodedToken.name : "No Name Found";

  useEffect(() => {
    const token = localStorage.getItem("token");
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

    const fetchCandidate = async () => {
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
          `https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/all-candidates/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 201) {
          console.log(response.data);
          setCandidateDetails(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCandidate();
  }, [decodedToken]);

  useEffect(() => {
    const fetchCandidateAppliedJobs = async () => {
        try {
            const response = await axios.get(`https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/all-applied-jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status===200) {
                console.log(response.data.reverse());
                const applieds = response.data.reverse();
                setCandidateApplied(applieds)
            }

        } catch(error) {
            console.log("Error in fetching candidate details!!!", error)
        }
    }

    fetchCandidateAppliedJobs();
  }, [decodedToken])

  return (
    <div className="bg-white  ">
      <AdminNav />
      <div className="my-2 flex flex-col justify-between text-center">
        <div class="bg-white py-6 sm:py-8 lg:py-12">
          <h2 class="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
            Each Candidate
          </h2>
          <div class="mx-auto max-w-screen-lg rounded-lg bg-gray-200">
            <div class="grid gap-8 sm:grid-cols-2">
              <div class="flex flex-col items-center justify-center px-10 sm:items-start md:py-10 lg:py-18 h-80">
                <h1 class="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-left md:text-3xl">
                  {candidateDetails?.name}
                </h1>

                <p class="mb-4 text-center text-gray-500 sm:text-left md:text-lg">
                  Email:{" "}
                  <span className="font-semibold">
                    {candidateDetails?.email}
                  </span>
                </p>

                <p class="mb-4 text-center text-gray-500 sm:text-left md:text-lg">
                  Phone Number:{" "}
                  <span className="font-semibold">
                    {candidateDetails?.phone}
                  </span>
                </p>

                <a
                  href={candidateDetails?.resume}
                  class="inline-block items-left rounded-lg bg-blue-950 px-8 py-3 text-center text-sm font-semibold text-gray-100  transition duration-100 hover:bg-blue-950 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  Download Resume
                </a>
              </div>

              <div class="relative h-80 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
                <img
                  src={candidateDetails?.profilePic}
                  loading="lazy"
                  alt={`Profile pic of ${candidateDetails?.name}`}
                  class="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white py-6 sm:py-8 lg:py-12">
          <h2 class="mb-8 mt-10 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
            Jobs Applied By <span className="text-blue-950">{candidateDetails?.name}</span>
          </h2>
          <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
              {candidateApplied?.map((job) => (
                 <div className="float-left">
                 <div
                   href="#"
                   class="flex flex-col justify-between items-start h-64 overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg hover:shadow-2xl"
                 >
                   <h3 className="text-2xl text-blue-950 font-bold">
                     {job?.JobTitle}
                   </h3>

                   <p className="text-xl text-gray-600 font-semibold">
                     Industry - <span className="text-blue-950">{job?.Industry}</span>
                   </p>
                   <p className="text-xl text-gray-600 font-semibold">Channel - <span className="text-blue-950">{job?.Channel}</span></p>
                   <p className="text-xl text-gray-600 font-semibold float-left">Min. Experience - <span className="text-blue-950">{job?.MinExperience} Year(s)</span> </p>
                   
                 </div>
               </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default EachCandidate;
