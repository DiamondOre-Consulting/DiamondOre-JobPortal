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

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Homemain/>} />

            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={<CandidateHome/>}/>
            <Route path="/all-jobs" element={<CandidateAllJobs/>} />
            <Route path="/all-jobs/:id" element={<EachJob />} />
            <Route path="/all-applied-jobs" element={<AllAppliedJobs />} />
            <Route path="/all-direct-jobs" element={<AllDirectJobs />} />
            <Route path="/all-agency-jobs" element={<AllAgencyJobs />} />
            <Route path="/all-banca-jobs" element={<AllBancaJobs />} />
            <Route path="/all-other-jobs" element={<AllOtherJobs />} />

            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/all-jobs" element={<AdminAllJobs />} />
            <Route path="/admin/all-jobs/:id" element={<AdminEachJob />} />
            <Route path="/admin/all-candidates" element={<AdminAllCandidates />} />
            <Route path="/admin/all-candidates/:id" element={<EachCandidate />} />
            <Route path="/update-status/:id1/:id2" element={<UpdateStatus />} />

            <Route path="/admin/erp-dashboard" element={<AdminERP />} />
          </Route> 
        </Routes>
      </Router>
    </>
  )
}

export default App
