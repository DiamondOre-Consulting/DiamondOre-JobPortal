import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";


const AdminAllCandidatesCards = () => {
  const navigate = useNavigate();
  const [latestCandidates, setLatestCandidates] = useState([]);
  let [loading, setLoading] = useState(true);
  const { decodedToken } = useJwt(localStorage.getItem("token"));

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  };

  useEffect(() => {
    const fetchAllJobs = async () => {
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
          "https://api.diamondore.in/api/admin-confi/all-candidates",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.status == 200) {
          console.log(response.data);
          const all = response.data;
          // console.log(latestCandidates);
          setLatestCandidates(all.reverse());
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllJobs();
  }, []);

  return (
    <div className="bg-white py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
          All Candidates
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
              {latestCandidates.map((latestCandidate) => (
                <div>
                  <div
                    href="#"
                     className="flex flex-col justify-between h-48 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl"
                  >
                    <h3 className="text-sm text-blue-950 font-bold text-wrap">
                      Name - <span className="text-blue-950">{latestCandidate?.name}</span>
                    </h3>
                    <p className="text-sm text-gray-600 font-semibold flex flex-wrap">
                      Email - <span className="text-blue-950">{latestCandidate?.email}</span>
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Phone Number - <span className="text-blue-950">{latestCandidate?.phone}</span></p>

                    <Link to={`/admin-dashboard/each-candidate/${latestCandidate?._id}`}  className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                      <span  className="text-md font-bold lg:text-md">
                        Know More
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default AdminAllCandidatesCards;
