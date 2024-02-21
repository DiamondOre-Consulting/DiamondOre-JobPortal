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


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Homemain/>} />
            <Route path="/about" element={<AboutUs/>}/>
            <Route path='/services' element={<Services/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path='/be-our-client' element={<Beourclient/>}/>
            <Route path='/prefrence-form' element={<PrefrenceForm/>}/>
            <Route path="/dashboard" element={<CandidateHome/>}/>
            <Route path="/all-jobs" element={<CandidateAllJobs/>} />
            <Route path="/all-jobs/:id" element={<EachJob />} />
            <Route path="/all-applied-jobs" element={<AllAppliedJobs />} />
            <Route path="/all-direct-jobs" element={<AllDirectJobs />} />
            <Route path="/all-agency-jobs" element={<AllAgencyJobs />} />
            <Route path="/all-banca-jobs" element={<AllBancaJobs />} />
            <Route path="/all-other-jobs" element={<AllOtherJobs />} />
            <Route path='/edit/profile-page' element={<CandidateEditprofile/>}/>
            <Route path='/admin/edit-profile'element={<AdminEditprofile/>} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/all-jobs" element={<AdminAllJobs />} />
            <Route path="/admin/add-jobs" element={<AddJobs />} />
            <Route path="/admin/all-jobs/:id" element={<AdminEachJob />} />
            <Route path="/admin/all-candidates" element={<AdminAllCandidates />} />
            <Route path="/admin/all-candidates/:id" element={<EachCandidate />} />
            <Route path="/update-status/:id1/:id2" element={<UpdateStatus />} />
            <Route path="/admin/erp-dashboard" element={<AdminERP />} />
            <Route path="/admin/erp-dashboard/add" element={<AddNewERP />} />
            <Route path='/admin-all-employee'element={<AdminEmployeeAttendence/>}/>
            <Route path='/admin-all-employee/attendence/:id'element={<AdminEditAttendence/>}/>
            <Route path='/admin-all-employee/performence/:id'element={<AdminEditPerfomence/>}/>
            <Route path='/employee-signup' element={<Employeesignup/>}/>
            <Route path='/employee-login'element={<Employeelogin/>}/>
            <Route path='/employee-dashboard' element={<Employeedashboard/>}/>
            <Route path='/employee-leaves' element={<EmployeeLeaves/>}/>
            <Route path='/employee-performence'element={<EmployeePerformence/>}/>
          </Route> 
        </Routes>
      </Router>
    </>
  )
}

export default App
