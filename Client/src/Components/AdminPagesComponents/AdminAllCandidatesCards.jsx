import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactPaginate from "react-paginate";



const AdminAllCandidatesCards = () => {
  const navigate = useNavigate();
  const [latestCandidates, setLatestCandidates] = useState([]);
  let   [loading, setLoading] = useState(true);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pageNumber, setPageNumber] = useState(0);
  const jobsPerPage = 20;
  const [totalPages,setTotalPages] = useState(null)
  const [totalPagesForSearched,setTotalPagesForSearched] = useState(null)
  const [searchedCandidatePageNumber,setSearchedCandidatePageNumber] = useState(0)

  
 

  const changePage = ({ selected }) => {
    if(!searchQuery){
      setPageNumber(selected);
    }
    if(searchQuery){
      setSearchedCandidatePageNumber(selected);
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  };

  const minDate = "2024-01-01";

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    if (new Date(selectedDate) < new Date(minDate)) {
      alert(`Start date cannot be before ${minDate}.`);
      setStartDate("");

    }
    else {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (e) => {

    const selectedDate = e.target.value;

    if (new Date(selectedDate) > new Date(Date.now)) {
      setEndDate(selectedDate)
    }
    else {
      setEndDate(selectedDate)

    }

  }



  useEffect(() => {
    
    if(searchQuery==""){
      console.log("enter")
      const fetchAllJobs = async () => {
        try {
          setLoading(true)
          const token = localStorage.getItem("token");
  
          if (!token) {
            // Token not found in local storage, handle the error or redirect to the login page
            
            navigate("/admin-login");
            return;
          }
  
          const query = new URLSearchParams();
  
          query.append("page", pageNumber)
          query.append("limit", jobsPerPage)
  
          // Fetch associates data from the backend
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin-confi/all-candidates/?${query.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (response.status == 200) {
  
            
           
            
            setTotalPagesForSearched(null)
            setLatestCandidates(response.data.allCandidates);
            setTotalPages(response.data.totalPages)
            
          }
        } catch (error) {
          console.error("Error fetching associates:", error);
          // Handle error and show appropriate message
        }
        finally{
          setLoading(false)
        }
      };
  
      fetchAllJobs();
    }

   
  }, [pageNumber,searchQuery]);
 



  function useDebounce(query,delay){
      const [debouncedQuery, setDebouncedQuery] = useState(query);
      
      useEffect(()=>{
        const handler = setTimeout(()=>{
          setDebouncedQuery(query)
        },delay);                                                       
        return ()=>clearTimeout(handler);
      },[query,delay])
      
      return debouncedQuery;
       
  }

  const debouncedQuery = useDebounce(searchQuery,500);
  
  useEffect(() => {
    if (debouncedQuery) { 
          try{
               setLoading(true)
                const searchCall = async()=>{

                  const token = localStorage.getItem("token");
               
                  if (!token) {
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                  }

                const query = new URLSearchParams()

                query.append("searchTerm", searchQuery);
                query.append("page",searchedCandidatePageNumber)
                query.append("limit",6)
              
                const response = await axios.get(
                  `${import.meta.env.VITE_BASE_URL}/admin-confi/search-candidate?${query.toString()}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
               
                 
                if(response.data.success==true){
                  setTotalPagesForSearched(response.data.totalPages)
                  setTotalPages(null)
                  setLatestCandidates(response.data.searchedCandidate)
                  
                }
            }

        searchCall();
      }
      catch(err){

      }
      finally{
        setLoading(false)
      }

    

    }
  }, [debouncedQuery,searchedCandidatePageNumber]);


  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadExcelSheet = async () => {

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-confi/download-excel`, {
        startDate,
        endDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob',

      })



      if (response.data instanceof Blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);
        link.download = 'candidates.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Expected a Blob, but got ', response.data);
      }                  
    }
    catch (error) {

    }
    finally {
      setLoading(false)
    }


  }



  return (
    <div className="bg-white py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
          All Candidates
        </h2>


        {/* Search bar */}
        <div className=" text-xl font-semibold text-blue-950">Download Candidate Data</div>
        <div className="flex gap-3 mt-20 md:mt-0  flex-col md:flex-row justify-end items-center md:h-24 h-20  mb-10">


          <div className="w-full gap-4 flex items-center h-full ">


            <div className="flex flex-col">
              <label className="" htmlFor="">Start Date</label>
              <input className=" bg-blue-400 text-white rounded-md " value={startDate} onChange={handleStartDateChange} type="date" min="2023-01-03" />

            </div>

            <div className="flex flex-col">
              <label className="" htmlFor="">End Date</label>
              <input className="bg-blue-400 text-white rounded-md" value={endDate}
                onChange={handleEndDateChange} type="date" />

            </div>

            <button onClick={handleDownloadExcelSheet} className="bg-blue-900 hover:bg-blue-700 p-2 rounded-md ml-4 mt-6 text-white" >Download</button>
          </div>

          <div class="relative p-3 border border-gray-200 rounded-lg w-full  max-w-lg">
            <input type="text" class="rounded-md p-3 w-full " placeholder="Search By Name | Phone" value={searchQuery} onChange={handleSearchInputChange} />

            <button type="submit" class="absolute right-6 top-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

          </div>
        </div>
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
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
              {latestCandidates?.map((latestCandidate) => (
                <div key={latestCandidate._id}>
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

                    <Link to={`/admin-dashboard/each-candidate/${latestCandidate?._id}`} className="cursor-pointer w-full flex-col rounded-lg bg-blue-900 p-4 text-center text-white hover:bg-white hover:text-black-100 hover:text-gray-900 border border-blue-950 mt-2">
                      <span className="text-md font-bold lg:text-md">
                        Know More
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
        }
         {latestCandidates.length===0&&<div className="mx-auto w-fit">No candidates found</div>}
         {latestCandidates.length!==0&&<ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={totalPagesForSearched|| totalPages}
            onPageChange={changePage}
            containerClassName={"pagination flex justify-center mt-8  gap-0 md:gap-2 shadow-lg px-10 py-4 "}
            previousLinkClassName={"pagination__link border border-gray-300 bg-gray-400 text-black rounded-l px-2 py-1 md:px-4 md:py-2  "}
            nextLinkClassName={"pagination__link  rounded-r bg-blue-950 text-white px-2 py-1 md:px-4 md:py-2 "}
            disabledClassName={"pagination__link--disabled opacity-50"}
            activeClassName={"pagination__link--active bg-blue-500 text-white"}
            pageLinkClassName={"pagination__link border border-gray-300  px-1 py-1 md:px-3 md:py-1"}
          />}
      </div>
    </div>
  );
};

export default AdminAllCandidatesCards;
