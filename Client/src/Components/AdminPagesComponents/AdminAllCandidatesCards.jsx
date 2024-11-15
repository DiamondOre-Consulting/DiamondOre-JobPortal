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
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate,setStartDate]=useState("")
  const [endDate,setEndDate] = useState("")
  



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

  const handleEndDateChange= (e)=>{

    const selectedDate= e.target.value;
   
    if(new Date(selectedDate)>new Date(Date.now)){
      setEndDate(selectedDate)
    }
    else{
      setEndDate(selectedDate)

    }

  }

  console.log("startDate",startDate)
  console.log("endDate",endDate)

  





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
          ;
          const all = response.data;
          // 
          setLatestCandidates(all.reverse());
          console.log("candidates data",response.data)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching associates:", error);
        // Handle error and show appropriate message
      }
    };

    fetchAllJobs();
  }, []);

  
  // filter 
  const filteredCandidates = latestCandidates.filter((candidate) =>
    candidate.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    candidate.phone.startsWith(searchQuery)
  );


  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadExcelSheet = async()=>{
     
    try{
      const token = localStorage.getItem("token");
      setLoading(true);

       const response = await axios.post('https://api.diamondore.in/api/admin-confi/download-excel',{
          startDate,
          endDate
       },{
        headers:{
             Authorization: `Bearer ${token}`
        },
          responseType: 'blob',  
        
       })

       console.log(response.data)

       if (response.data instanceof Blob) {
       
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response.data);  
        link.download = 'candidates.xlsx';              
  
   
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
      } else {
        console.error('Expected a Blob, but got', response.data);
      }
 
    }
    catch(error){
         console.log(error)
    }
    finally{
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
            <div className="ml-7 text-lg font-medium"><span>Download Candidate Data</span></div>
      <div className="flex justify-end items-center  mb-10">
            

           <div className="w-full gap-4 flex items-center justify-center h-full ">
            <input className=" bg-blue-400 text-white rounded-md"  value={startDate} onChange={handleStartDateChange} type="date" min="2023-01-03" />
            <input className="bg-blue-400 text-white rounded-md"  value={endDate} onChange={handleEndDateChange} type="date" />
            <button onClick={handleDownloadExcelSheet} className="bg-blue-900 hover:bg-blue-700 p-2 rounded-md ml-4 text-white" >Download</button>
           </div>

      <div class="relative p-3 border border-gray-200 rounded-lg w-full max-w-lg">
        <input type="text" class="rounded-md p-3 w-full" placeholder="Search By Name | Phone" value={searchQuery} onChange={handleSearchInputChange}/>

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
              {filteredCandidates.map((latestCandidate) => (
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
