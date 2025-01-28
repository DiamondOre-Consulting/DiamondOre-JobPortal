import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactPaginate from "react-paginate";

const CandidateAllJobsCards = () => {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenChannel, setIsOpenChannel] = useState(false);
  const [isOpenCtc, setIsOpenCtc] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showselectedcity, setShowSelectedcity] = useState("Select");
  const [showselectedchannel, setShowSelectedChannel] = useState("Select");
  const [allJobs, setAllJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [cities, setCities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedCtcRange, setSelectedCtcRange] = useState(null);
  const [showselectedctc, setShowSelectedctc] = useState("Select");
  const [ctcRanges, setCtcRanges] = useState([]);
  const { decodedToken } = useJwt(localStorage.getItem("token"));

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
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/candidates/all-jobs`
        );

        const uniquicities = [
          ...new Set(response.data.map((job) => job.City)),
        ];
        const uniquiChannels = [
          ...new Set(response.data.map((job) => job.Channel)),
        ];
        const uniquictc = [
          ...new Set(response.data.map((job) => job.MaxSalary)),
        ];
        setCities(uniquicities);
        setChannels(uniquiChannels);
        setCtcRanges(["1-5", "6-10", "11-15", "16-20"]);
        if (response.status === 200) {
          const all = response.data;
          const filteredJobs = all.filter((job) => job.JobStatus === "true");
          setAllJobs(filteredJobs);
          setLatestJobs(filteredJobs.reverse());
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
      }
    };

    fetchAllJobs();
  }, []);

  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const toggleDropdownChannel = () => {
    setIsOpenChannel(!isOpenChannel);
  };

  const toggleDropdownCtc = () => {
    setIsOpenCtc(!isOpenCtc);
  };

  const filterJobs = () => {
    let filteredJobs = [...allJobs];
    if (selectedCity) {
      filteredJobs = filteredJobs.filter((job) => job.City === selectedCity);
    }
    if (selectedChannel) {
      filteredJobs = filteredJobs.filter(
        (job) => job.Channel === selectedChannel
      );
    }
    if (selectedCtcRange) {
      const [minCtc, maxCtc] = selectedCtcRange.split("-");
      filteredJobs = filteredJobs.filter((job) => {
        const ctc = parseFloat(job.MaxSalary);
        return ctc >= parseFloat(minCtc) && ctc <= parseFloat(maxCtc);
      });
    }
    return filteredJobs;
  };

  const handleSearch = () => {
    const filteredJobs = filterJobs();
    setLatestJobs(filteredJobs);
  };

  const handleClearFilters = () => {
    setSelectedCity(null);
    setSelectedChannel(null);
    setShowSelectedcity("City");
    setShowSelectedChannel("Channel");
    setSelectedCtcRange(null);
    setLatestJobs(allJobs);
  };

  return (
    <div className="sm:py-8 mt-24">
      <div className="flex flex-wrap items-center justify-center mx-auto  mb-16">
        <div className="relative">
          <h2 className="bg-blue-900 text-white px-4 py-2 text-center mb-1 border-md">City</h2>
          <button
            onClick={toggleDropdownCity}
            className="border mx-2 flex align-center border-gray-400 text-black font-bold py-1 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {showselectedcity}  <svg className="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
          </button>

          {isOpenCity && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 overflow-y-auto max-h-60">
              <ul>
                {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{showselectedcity}</li> */}
                {cities.map((city, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCity(city);
                      setShowSelectedcity(city)
                      toggleDropdownCity();
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative ">
          <h2 className="bg-blue-900 text-white px-4 py-2 text-center mb-1 border-md mx-2">Channels</h2>
          <button
            onClick={toggleDropdownChannel}
            className="border mx-2 flex align-center border-gray-400 text-black font-bold py-1 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {showselectedchannel}  <svg className="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {isOpenChannel && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 overflow-y-auto max-h-60">
              <ul>
                {channels.map((channel, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowSelectedChannel(channel);
                      toggleDropdownChannel();
                    }}
                  >
                    {channel}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>


        <div className="relative ">
          <h2 className="bg-blue-900 text-white px-4 py-2 text-center mb-1 border-md mx-2">CTC</h2>
          <button
            onClick={toggleDropdownCtc}
            className="border mx-2 flex align-center border-gray-400 text-black font-bold py-1 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {showselectedctc}  <svg className="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {isOpenCtc && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 overflow-y-auto max-h-60">
              <ul>
                {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"onClick={setSelectedCtcRange(null)}>{showselectedctc}</li> */}
                {ctcRanges.map((range, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCtcRange(range);
                      setShowSelectedctc(range);
                      toggleDropdownCtc();
                    }}
                  >
                    {range}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="flex justify-center mt-3 h-12 w-12 text-center items-center ml-4 bg-blue-900 hover:bg-blue-950 text-white font-bold py-0 px-10 rounded-md focus:outline-none focus:shadow-outline"
          type="button"
        >
          Search
        </button>
        <button
          onClick={handleClearFilters}
          className="ml-4 bg-red-500 hover:bg-red-600 mt-3  h-12 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          <svg class="h-8 w-8 text-gray-100" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
        </button>
      </div>
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-1 text-center text-2xl font-bold text-blue-950 lg:text-3xl ">
          All Job Openings
        </h2>
        <div className="w-44 h-1 bg-blue-950 mx-auto md:mb-12 mb-8"></div>
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
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {latestJobs
              .slice(pagesVisited, pagesVisited + jobsPerPage)
              .map((latestJob) => (
                <div
                  key={latestJob._id}
                  className="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl "
                >
                  <h3 className="text-xl text-blue-950 font-bold">
                    {latestJob?.JobTitle}
                  </h3>
                  <div className="w-44 h-0.5 bg-blue-950 md:mb-6 "></div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Industry -{" "}
                    <span className="text-blue-950">{latestJob?.Industry}</span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">
                    Channel -{" "}
                    <span className="text-blue-950">{latestJob?.Channel}</span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">
                    Min. Experience -{" "}
                    <span className="text-blue-950">
                      {latestJob?.MinExperience} Year(s)
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 font-semibold"></p>
                  {latestJob?.appliedApplicants == decodedToken?.userId && (
                    <p className="text-center text-md text-green-500 font-semibold">
                      Already applied
                    </p>
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
              ))}
          </div>
        )}
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

export default CandidateAllJobsCards;
