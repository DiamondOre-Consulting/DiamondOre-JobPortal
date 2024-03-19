import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactPaginate from "react-paginate";


const AdminAllJobsCards = () => {
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  let [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const jobsPerPage = 20;
  const pagesVisited = pageNumber * jobsPerPage;
  const pageCount = Math.ceil(latestJobs.length / jobsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


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
          "https://diamondore-jobportal-backend.onrender.com/api/admin-confi/all-jobs"
        );
        if (response.status == 200) {
          console.log(response.data);
          const all = response.data;
          const filteredJobs = all.filter(job => job.JobStatus === true);
          // console.log(latestJobs);
          setLatestJobs(filteredJobs.reverse());
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllJobs();
  }, []);


  const deleteJob = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://diamondore-jobportal-backend.onrender.com/api/admin-confi/remove-job/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // Job has been deleted successfully, update the state
        alert('Do you Want to delete This Job')
        setLatestJobs(latestJobs.filter(job => job._id !== id));


      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl ">
          All Job Openings
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
              {latestJobs.slice(pagesVisited, pagesVisited + jobsPerPage).map((latestJob) => (
                <div
                  key={latestJob?._id}
                  className="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl "
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl text-blue-950 font-bold">
                        {latestJob?.JobTitle}
                      </h3>
                    </div>

                    <div className="p-1 border border-0 shadow-xl border-rounded h-fit rounded-full hover:bg-red-900 cursor-pointer" onClick={() => deleteJob(latestJob._id)}>
                      <svg className="w-[22px] h-[22px] text-red-800 dark:text-white hover:text-gray-100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-44 h-0.5 bg-blue-950 md:mb-6 "></div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Industry - <span className="text-blue-950">{latestJob?.Industry}</span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">Channel - <span className="text-blue-950">{latestJob?.Channel}</span></p>
                  <p className="text-sm text-gray-600 font-semibold">
                    Min. Experience - <span className="text-blue-950">{latestJob?.MinExperience} Year(s)</span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">

                  </p>
                  {(latestJob?.appliedApplicants == decodedToken?.userId) ? (<p className="text-center text-md text-green-500 font-semibold">Already applied</p>) : ""}
                  <Link to={`/admin/all-jobs/${latestJob?._id}`} className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                    <span className="text-md font-bold lg:text-md">
                      Know More
                    </span>
                  </Link>
                </div>
              ))}
            </div>
        }
        <div className="flex justify-center items-center mt-8 ">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination flex justify-center mt-8  gap-0 md:gap-2 shadow-lg px-10 py-4 "}
            previousLinkClassName={"pagination__link border border-gray-300 bg-gray-400 text-black rounded-l px-2 py-1 md:px-4 md:py-2  "}
            nextLinkClassName={"pagination__link  rounded-r bg-blue-950 text-white px-2 py-1 md:px-4 md:py-2 "}
            disabledClassName={"pagination__link--disabled opacity-50"}
            activeClassName={"pagination__link--active bg-blue-500 text-white"}
            pageLinkClassName={"pagination__link border border-gray-300  px-1 py-1 md:px-3 md:py-1"}
          />

        </div>
      </div>
    </div>
  );
};

export default AdminAllJobsCards;
