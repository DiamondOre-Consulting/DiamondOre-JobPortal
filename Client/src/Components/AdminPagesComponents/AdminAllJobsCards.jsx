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
  const [popup, setPopUP] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null);

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
          "https://api.diamondore.in/api/admin-confi/all-jobs"
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


  const deleteJob = async () => {
    try {
      const response = await axios.put(
        `https://api.diamondore.in/api/admin-confi/remove-job/${jobToDelete}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setPopUP(false);
        setLatestJobs(latestJobs.filter((job) => job._id !== jobToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (id) => {
    setJobToDelete(id);
    setPopUP(true)
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

                    <div className="p-1 border border-0 shadow-xl border-rounded h-fit rounded-full hover:bg-red-900 cursor-pointer" onClick={() => handleDeleteClick(latestJob?._id)}>
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

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 -mt-6 -mr-4 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setPopUP(false)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>

            <div className=" pt-0 text-center">
              <svg className="w-10 h-10 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to delete this job?</h3>
              <button
                onClick={deleteJob}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setPopUP(false)}
                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllJobsCards;
