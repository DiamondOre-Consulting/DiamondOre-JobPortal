import React, { useEffect, useState } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";

const HomeNewRecommend = () => {
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);
  const [empty, setEmpty] = useState(null);
  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); // Redirect to login page if not authenticated
    return;
  }

  useEffect(() => {
    const fetchLatestJobs = async () => {
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
          `${import.meta.env.VITE_BASE_URL}/candidates/recommended-jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("data", response);
        if (response.status === 200) {
          if (response.data.length === 0) {
            console.log("inside", response?.data);
            setEmpty(`No Job Found According to your prefrence `);
            setLoading(false);
            return;
          } else {
            const all = response.data.slice(-8);
            // const filteredJobs = all.filter(job => job.jobStatus === "true");
            // const latest = filteredJobs.slice(-7);
            // ;
            setLatestJobs(all);
            console.log(latestJobs);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          New Job Recommendations !!
        </h2>
        {loading ? (
          <div style={override}>
            <PropagateLoader
              color={"#023E8A"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            {latestJobs.length === 0 ? (
              <p className="text-center text-red-500 font-semibold">
                {empty}{" "}
                <Link
                  to={"/edit-prefrence-form"}
                  className="underline text-blue-600"
                >
                  click here
                </Link>{" "}
                to change your prefrence{" "}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 mb-4">
                {latestJobs.map((latestJob, index) => (
                  <div key={index}>
                    <div
                      href="#"
                      className="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl"
                    >
                      <h3 className="text-xl text-blue-950 font-bold">
                        {latestJob?.JobTitle}
                      </h3>
                      <div className="w-44 h-0.5 bg-blue-950 md:mb-6 "></div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Industry -{" "}
                        <span className="text-blue-950">
                          {latestJob?.Industry}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 font-semibold">
                        Channel -{" "}
                        <span className="text-blue-950">
                          {latestJob?.Channel}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 font-semibold">
                        Min. Experience -{" "}
                        <span className="text-blue-950">
                          {latestJob?.MinExperience} Year(s)
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 font-semibold"></p>
                      {latestJob?.appliedApplicants == decodedToken?.userId ? (
                        <p className="text-center text-md text-green-500 font-semibold">
                          Already applied
                        </p>
                      ) : (
                        ""
                      )}
                      <Link
                        to={`/all-jobs/${latestJob?._id}`}
                        className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2"
                      >
                        <span className="text-md font-bold lg:text-md">
                          Know More
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeNewRecommend;
