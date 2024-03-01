import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const CandidateAllJobsCards = () => {
  // const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenChannel, setIsOpenChannel] = useState(false);
  const [isOpenCtc, setIsOpenCtc] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showselectedcity, setShowSelectedcity] = useState("Select");
  const [showselectedchannel, setShowSelectedChannel] = useState("Select")
  const [allJobs, setAllJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [cities, setCities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedCtcRange, setSelectedCtcRange] = useState(null);
  const [showselectedctc, setShowSelectedctc] = useState("Select");
  const [ctcRanges, setCtcRanges] = useState([]);
  const { decodedToken } = useJwt(localStorage.getItem("token"));


  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  };


  useEffect(() => {
    const fetchAllJobs = async () => {
      try {

        // Fetch associates data from the backend
        const response = await axios.get(
          "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-jobs"
        );
        console.log(response.data)

        const uniquicities = [...new Set(response.data.map(job => job.City))];
        const uniquiChannels = [...new Set(response.data.map(job => job.Channel))];
        const uniquictc = [...new Set(response.data.map(job => job.MaxSalary))];
        console.log("Unique cities:", uniquicities);
        console.log("Unique channels:", uniquiChannels);
        console.log("uniqui ctc", uniquictc);
        setCities(uniquicities);
        setChannels(uniquiChannels);
        setCtcRanges(["1-5", "6-10", "11-15", "16-20"])
        console.log(uniquicities)
        if (response.status == 200) {
          console.log(response.data);
          const all = response.data;
          const filteredJobs = all.filter(job => job.JobStatus === true);
          // console.log(latestJobs);
          setAllJobs(filteredJobs);
          console.log("alljobs fil", allJobs)
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

  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const toggleDropdownChannel = () => {
    setIsOpenChannel(!isOpenChannel);
  };

  const toggleDropdownCtc = () => {
    setIsOpenCtc(!isOpenCtc);
  };

  //filter
  const filterJobs = () => {
    let filteredJobs = [...allJobs]; // Use the original list of jobs
    if (selectedCity) {
      filteredJobs = filteredJobs.filter(job => job.City === selectedCity);
    }
    if (selectedChannel) {
      filteredJobs = filteredJobs.filter(job => job.Channel === selectedChannel);
    }
    if (selectedCtcRange) {
      const [minCtc, maxCtc] = selectedCtcRange.split("-");
      filteredJobs = filteredJobs.filter(job => {
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
    setLatestJobs(allJobs); // Reset to the original list of jobs
  };



  return (
    <div class="sm:py-8 ">
      <div className="flex flex-wrap items-center justify-center mx-auto px-6 mb-16">
        <div className="relative">
          <h2 className="bg-blue-900 text-white px-4 py-2 text-center mb-1 border-md">City</h2>
          <button
            onClick={toggleDropdownCity}
            className="border flex align-center border-gray-400 text-black font-bold py-1 sm:px-2 md:px-4 lg:px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {showselectedcity}  <svg class="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
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
            {showselectedchannel}  <svg class="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
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
            {showselectedctc}  <svg class="h-5 w-5 text-gray-600 float-right " viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <polyline points="6 9 12 15 18 9" /></svg>
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
          className="flex justify-center mt-3 h-12 w-12 text-center items-center ml-4 bg-blue-900 hover:bg-blue-950 text-white font-bold py-0 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
        >
          <svg class="h-6 w-6 text-white text-center" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </button>
        <button
          onClick={handleClearFilters}
          className="ml-4 bg-red-500 hover:bg-red-600 mt-3  h-12 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Clear Filters
        </button>
      </div>
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 class="mb-1 text-center text-2xl font-bold text-blue-950  lg:text-3xl ">
          All Job Openings
        </h2>
        <div className="w-44 h-1 bg-blue-950 mx-auto  md:mb-12 mb-8"></div>
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
            <div class="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {latestJobs.map((latestJob) => (
                <div
                  class="flex flex-col justify-between h-64 overflow-hidden rounded-lg bg-white shadow-lg shadow-2xl-gray-200 p-4 shadow-lg hover:shadow-2xl "
                >
                  <h3 className="text-xl text-blue-950 font-bold">
                    {latestJob?.JobTitle}
                  </h3>
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
                  <Link to={`/all-jobs/${latestJob?._id}`} class="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                    <span class="text-md font-bold lg:text-md">
                      Know More
                    </span>
                  </Link>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default CandidateAllJobsCards;
