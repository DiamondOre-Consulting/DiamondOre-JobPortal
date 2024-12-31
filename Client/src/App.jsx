import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Homemain from "./Pages/HomePage/Homemain";
import Signup from './Pages/CandidatePage/Signup'
import Login from './Pages/CandidatePage/Login'
import CandidateHome from "./Pages/CandidatePage/CandidateHome";
import CandidateAllJobs from "./Pages/CandidatePage/AllJobs";
import EachJob from "./Pages/CandidatePage/EachJob";
import AllAppliedJobs from "./Pages/CandidatePage/AllAppliedJobs";
import AllDirectJobs from "./Pages/CandidatePage/AllDirectJobs";
import AllAgencyJobs from "./Pages/CandidatePage/AllAgencyJobs";
import AllBancaJobs from "./Pages/CandidatePage/AllBancaJobs";
import AllOtherJobs from "./Pages/CandidatePage/AllOtherJobs";
import AdminSignup from "./Pages/AdminPage/AdminSignup";
import AdminLogin from "./Pages/AdminPage/AdminLogin";
import AdminDashboard from "./Pages/AdminPage/AdminDashboard";
import EachCandidate from "./Pages/AdminPage/EachCandidate";
import AdminEachJob from "./Pages/AdminPage/EachJob";
import UpdateStatus from "./Pages/AdminPage/UpdateStatus";
import AdminAllJobs from "./Pages/AdminPage/AllJobs";
import AdminAllCandidates from "./Pages/AdminPage/AllCandidates";
import AdminERP from "./Pages/AdminPage/AdminERP";
import AddNewERP from "./Pages/AdminPage/AddNewERP";
import PathSearch from "./Pages/HomePage/PathSearch";
import AboutUs from "./Pages/HomePage/AboutUs";
import Services from "./Pages/HomePage/Services";
import Contact from "./Pages/HomePage/Contact";
import Employeelogin from "./Pages/Employeepage/Employeelogin";
import Employeedashboard from "./Pages/Employeepage/Employeedashboard";
import AddJobs from "./Pages/AdminPage/Addjobs";
import Employeesignup from "./Pages/AdminPage/Employeesignup";
import CandidateEditprofile from "./Components/CandidatePagesComponents/CandidateEditprofile";
import AdminEditprofile from "./Components/AdminPagesComponents/AdminEditprofile";
import EmployeeLeaves from "./Pages/Employeepage/EmployeeLeaves";
import AdminEmployeeAttendence from "./Components/AdminPagesComponents/AdminEmployeeAttendence";
import AdminEditAttendence from "./Components/AdminPagesComponents/AdminEditAttendence";
import AdminEditPerfomence from "./Components/AdminPagesComponents/AdminEditPerfomence";
import Beourclient from "./Pages/HomePage/Beourclient";
import PrefrenceForm from "./Components/CandidatePagesComponents/PrefrenceForm";
import EmployeePerformence from "./Pages/Employeepage/EmployeePerformence";
import FAQ from "./Pages/HomePage/FAQ";
import Termsofservices from "./Pages/HomePage/Termsofservices";
import Privicypolicy from "./Pages/HomePage/Privicypolicy";
import EditPrefrenceform from "./Components/CandidatePagesComponents/EditPrefrenceform";
import Cvdashboard from "./Pages/Cvpage/Cvdashboard";
import Cvform from "./Pages/Cvpage/Cvform";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useState } from "react";
import ForgotPassword from "./Pages/CandidatePage/ForgotPassword";
import Adminforgotpassword from "./Pages/AdminPage/Adminforgotpassword";
import ErrorPage from './Pages/HomePage/ErrorPage'
import FreeConsultation from "./Pages/HomePage/FreeConsultation";
import Prompt from "./Pages/AdminPage/Prompt";
import Portfolio from "./Pages/CandidatePage/CandidatePortfolioPage/Portfolio";
import Portfoliowebste from "./Pages/CandidatePage/CandidatePortfolioPage/Portfoliowebste";
import SearchJob from "./Pages/HomePage/SearchJob";
import PostReview from "./Pages/HomePage/PostReview";
import AllReviews from "./Pages/AdminPage/AllReviews";
import EmpDrawerSidebar from "./Components/EmployeeComponents/EmpDrawerSidebar";
import AllEmployee from "./Pages/AdminPage/AllEmployee";
import EachEmployeeGoalSheet from "./Pages/AdminPage/EachEmployeeGoalSheet";
import AdminDrawerSidebar from "./Components/AdminPagesComponents/AdminDrawerSidebar";
import EmployeeRnrBoard from '../src/Pages/Employeepage/EmployeeRnrBoard'
import Snowfall from 'react-snowfall'
import AuthVerify from "./Pages/AdminPage/AuthVerify";
import EmpAuthVerify from "./Pages/Employeepage/EmpAuthVerify";

function App() {
  let [loading, setLoading] = useState(true);

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", 
    flexDirection:'column'

  };

  useState(()=>{
    setTimeout(()=>{
      setLoading(false)
    },1000)
  },[])
  return (
    <> {
      loading ?
      <>
      <div style={override}>
        <ScaleLoader
          color={'#023E8A'}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
          <p className="text-black text-center mt-2 font-bold text-2xl">Loading opportunities....</p>
        </div>
  
        </>
         :
      <Router>
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" , zIndex:"10000000" }}>
            <Snowfall />
          </div>
        <Routes>
      
              

              
          <Route path="/" element={<Homemain/>} />
           
            <Route path="/about" element={<AboutUs/>}/>
            <Route path='/services' element={<Services/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path='/search-job' element={<SearchJob/>}/>
            <Route path="/post-review" element={<PostReview/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/get-free-consultation' element={<FreeConsultation/>}/>
            <Route path='/cv-dashboard' element={<Cvdashboard/>}/>
            <Route path='/cv-form'element={<Cvform/>}/>
            <Route path='/be-our-client' element={<Beourclient/>}/>
            <Route path='/fAQ'element={<FAQ/>}/>
            <Route path='/terms-of-services'element={<Termsofservices/>}/>
            <Route path='/privicy-policy'element={<Privicypolicy/>}/>
            <Route path='/prefrence-form' element={<PrefrenceForm/>}/>
            <Route path='/edit-prefrence-form' element={<EditPrefrenceform/>}/>
            <Route path="/dashboard" element={<CandidateHome/>}/>
            <Route path="/all-jobs" element={<CandidateAllJobs/>} />
            <Route path="/all-jobs/:id" element={<EachJob />} />
            <Route path="/all-applied-jobs" element={<AllAppliedJobs />} />
            <Route path="/all-direct-jobs" element={<AllDirectJobs />} />
            <Route path="/all-agency-jobs" element={<AllAgencyJobs />} />
            <Route path="/all-banca-jobs" element={<AllBancaJobs />} />
            <Route path="/all-other-jobs" element={<AllOtherJobs />} />
            <Route path='/edit/profile-page' element={<CandidateEditprofile/>}/>
            <Route path="/portfolio" element={<Portfolio/>}/>
            <Route path="/my-portfolio" element={<Portfoliowebste/>}/>
            <Route path='/admin/edit-profile'element={<AdminEditprofile/>} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path='/admin/forgot-password' element={<Adminforgotpassword/>}/>
            {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
            <Route element={<AuthVerify/>}>
            <Route path="/admin-dashboard/*" element={<AdminDrawerSidebar/>}/>
            <Route path="/admin/all-jobs" element={<AdminAllJobs />} />
            <Route path='/admin/all-employee' element={<AllEmployee/>}/>
            <Route path='/admin/goal-sheet/:id' element={<EachEmployeeGoalSheet/>}/>
            <Route path="/admin/add-jobs" element={<AddJobs />} />
            <Route path="/admin/prompt" element={<Prompt/>}/>
            <Route path="/admin/all-jobs/:id" element={<AdminEachJob />} />
            <Route path="/admin/all-candidates" element={<AdminAllCandidates />} />
            <Route path="/admin/all-candidates/:id" element={<EachCandidate />} />
            <Route path="/update-status/:id1/:id2" element={<UpdateStatus />} />
            <Route path="/admin/erp-dashboard" element={<AdminERP />} />
            <Route path="/admin/erp-dashboard/add" element={<AddNewERP />} />
            <Route path='/admin-all-employee'element={<AdminEmployeeAttendence/>}/>
            <Route path='/admin-all-employee/attendence/:id'element={<AdminEditAttendence/>}/>
            <Route path='/admin-all-employee/performence/:id'element={<AdminEditPerfomence/>}/>
            <Route path='/admin/all-reviews' element={<AllReviews/>}/>
            </Route>
            <Route path='/employee-signup' element={<Employeesignup/>}/>
        
            <Route path='/employee-login'element={<Employeelogin/>}/>
            {/* <Route path='/employee-dashboard' element={<Employeedashboard/>}/> */}
            <Route element={<EmpAuthVerify/>}>
            <Route path='/employee-leaves' element={<EmployeeLeaves/>}/>
            <Route path='/employee-performence'element={<EmployeePerformence/>}/>
            <Route path="/employee-dashboard/*" element={<EmpDrawerSidebar />} />
            <Route path ='*' element ={<ErrorPage/>}/>
            <Route path='/employee-rnrboard/:passcode' element={<EmployeeRnrBoard />} />
            </Route>
        </Routes>
      </Router>
}
    </>
  )
}

export default App
