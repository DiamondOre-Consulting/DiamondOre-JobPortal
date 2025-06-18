import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from 'axios';
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";
import HomeNews from "../../Components/AdminPagesComponents/ERP/ERPNews";
import ERPTop5s from "../../Components/AdminPagesComponents/ERP/ERPTop5s";
import RnRLeaderboard from "../../Components/AdminPagesComponents/ERP/RnRLeaderboard";
import JoiningsForWeek from "../../Components/AdminPagesComponents/ERP/JoiningsForWeek";
import Confetti from 'react-confetti';
import PropagateLoader from "react-spinners/PropagateLoader";

const InternRnrBoard = () => {
  const [employee, setEmployee] = useState(null);
  const [latestnews, setLatestNews] = useState([]);
  const [hrname, setHrName] = useState([]);
  const [client, setClient] = useState([]);
  const [RnRinterns, setRnRInterns] = useState([]);
  const [RnRRecruiter, setRnRRecruiter] = useState([]);
  const [joinings, setJoinings] = useState([]);
  const [empOfMonthDesc, setEmpOfMonthDesc] = useState(""); // New state for EmpOfMonthDesc
  const [recognitionType, setRecognitionType] = useState("")
  const [profilePicUrl, setProfilePicUrl] = useState("")



  const navigate = useNavigate();
  const { passcode } = useParams();
  const [allAccountsData, setAllAccountsData] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchAllAccount = async () => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/employee/all-AccountsforIntern/${passcode}`);
              if (response.status === 200) {
                  console.log("response",response.data)
                  setAllAccountsData(response.data);
                  setLoading(false)
              }
          } catch (error) {
            console.log(error)
          }
      }

      fetchAllAccount();
  }, []);

  const groupedData = allAccountsData.reduce((acc, account) => {
      if(account.activeStatus === false){
          return acc
      }
      const ownerName = account.ownerName;
      if (!acc[ownerName]) {
          acc[ownerName] = [];
      }
      acc[ownerName].push(account);
      
      return acc;
  }, {});
  

  console.log("groupedData",groupedData);

  

  



  useEffect(() => {

    
    const fetchData = async () => {
      try {
        // const passcode= 123456;
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employee/rnr-leaderboraddetails/${passcode}`,

        );



        if (response.status === 200) {
          const lastData = response.data.allData;
          const empdata = response.data.findEmp||"";
          if(empdata){
            setEmployee(empdata||"");          
          }
          setLatestNews(lastData.BreakingNews || []);
          setHrName(lastData.Top5HRs || []);
          setClient(lastData.Top5Clients || []);
          setRnRInterns(lastData.RnRInterns || []);
          setRnRRecruiter(lastData.RnRRecruiters || []);
          setJoinings(lastData.JoningsForWeek || []);
          setEmpOfMonthDesc(lastData.EmpOfMonthDesc || ""); 
          setRecognitionType(lastData.recognitionType || "");
          setProfilePicUrl(lastData.profilePic || "");
        } else {

        }
      } catch (e) {

      }
    };

    fetchData();
  }, [ navigate]);


  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    // Automatically stop the confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);


  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

};



  return (

    <div className="relative w-full overflow-x-hidden"> {showConfetti && <Confetti />}
      {/* <h2 className="px-4 py-4 text-3xl font-bold text-gray-800 md:text-5xl">
        Welcome aboard, <span className="text-blue-900">{decodedToken?.name}</span>
      </h2> */}

      <HomeNews employee={employee} profilePicUrl={profilePicUrl} latestnews={latestnews} empOfMonthDesc={empOfMonthDesc} recognitionType={recognitionType} /> {/* Pass EmpOfMonthDesc */}
      <ERPTop5s hrname={hrname} client={client} />
      <RnRLeaderboard RnRinterns={RnRinterns} RnRRecruiter={RnRRecruiter} />
      <JoiningsForWeek Joinings={joinings} />

      <>
            <div>
                <h1 className='text-3xl text-center'>All Accounts</h1>
                <div className='w-40 h-1 mx-auto mb-10 bg-blue-900'></div>

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

                        <div >
                            {Object.keys(groupedData).map(ownerName => (
                                <div key={ownerName}>
                                    <h2 className='mt-8 text-2xl font-bold text-center'> Account Holder : {ownerName}</h2>

                                    <div className='overflow-x-auto md:w-full '>
                                        <table id="example" className="w-full mt-4 table-auto ">
                                            <thead className='sticky top-0 text-xs text-gray-100 bg-blue-900 shadow'>
                                                <tr>
                                                    <th className="px-4 py-2">HR Name</th>
                                                    <th className="px-4 py-2">Client Name</th>
                                                    <th className="px-4 py-2">Channel</th>
                                                    <th className="px-4 py-2">Zone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              {groupedData[ownerName][0]?.accountDetails.map((account,index) =>
                                                  
                                                        <tr key={index} className='text-center'>
                                                            <td className="px-4 py-2 border">{account?.channels[0]?.hrDetails[0]?.hrName}</td>
                                                            <td className="px-4 py-2 border">{account?.clientName}</td>
                                                            <td className="px-4 py-2 border">{account?.channels[0]?.channelName}</td>
                                                            <td className="px-4 py-2 border">{account?.zoneName}</td>
                                                            
                                                        </tr>
                                                    
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {allAccountsData.length === 0 && (
                                <div className="mt-10 text-center">
                                    No data available .
                                </div>
                            )}
                        </div>
                }
            </div>
        </>

    </div>
  );
};

export default InternRnrBoard;
