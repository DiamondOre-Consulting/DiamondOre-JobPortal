import React, { useEffect, useState } from "react";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const AdminEachJob = () => {
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [jobsApplied, setJobsApplied] = useState(null);

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

    const fetchJobDetails = async () => {
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
          `https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/all-jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 201) {
          console.log(response.data);
          setJobDetails(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobDetails();
  }, [decodedToken]);

  useEffect(() => {
    const fetchJobsAppliedApplicants = async () => {
      try {
        const response = await axios.get(
          `https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/applied-candidates/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response.data.reverse());
          const applieds = response.data.reverse();
          setJobsApplied(applieds);
        }
      } catch (error) {
        console.log("Error in fetching job details!!!", error);
      }
    };

    fetchJobsAppliedApplicants();
  }, [decodedToken]);

  return (
    <div className="bg-white mx-5">
      <AdminNav />
      <div>
        <h1 className="text-center text-5xl text-bold py-lg">Each Job</h1>
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200 lg:h-90 md:h-90">
              <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
                <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl lg:text-4xl">
                  {jobDetails?.JobTitle}
                </h2>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  Industry:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.Industry}
                  </span>
                </p>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  Channel:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.Channel}
                  </span>
                </p>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  No. of openings:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.Vacancies}
                  </span>
                </p>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  Min. Experience:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.MinExperience} Year(s)
                  </span>
                </p>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  CTC:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.MaxSalary} LPA
                  </span>
                </p>

                <p className="mb-8 max-w-md text-gray-800 text-xl">
                  Location:{" "}
                  <span className="text-blue-950 font-semibold">
                    {jobDetails?.City}, {jobDetails?.State}, {jobDetails?.Zone}{" "}
                    India
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-8">
        <h1 className="text-center text-5xl text-bold py-lg">
          Applicants Applied For This Position
        </h1>
        <div class="mt-10 mx-10 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {jobsApplied?.map((jobs) => (
            <div>
              <div
                href="#"
                class="flex flex-col justify-between h-72 overflow-hidden rounded-lg bg-gray-200 p-4 shadow-lg"
              >
                <h3 className="text-2xl text-blue-950 font-bold text-wrap">
                  Name -{" "}
                  <span className="text-blue-950">{jobs?.name}</span>
                </h3>
                <p className="text-xl text-gray-600 font-semibold flex flex-wrap">
                  Email -{" "}
                  <span className="text-blue-950">
                    {jobs?.email}
                  </span>
                </p>
                <p className="text-xl text-gray-600 font-semibold">
                  Phone Number -{" "}
                  <span className="text-blue-950">
                    {jobs?.phone}
                  </span>
                </p>
                <a
                  href={jobs?.resume}
                  class="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200"
                >
                  <span class="text-md font-bold lg:text-md">Download Resume</span>
                </a>
                <Link
                  to={`/update-status/${jobs?._id}/${id}`}
                  class="cursor-pointer w-full flex-col rounded-lg bg-white p-4 text-center hover:bg-blue-950 text-gray-800 hover:text-gray-200"
                >
                  <span class="text-md font-bold lg:text-md">Update Status</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminEachJob;
