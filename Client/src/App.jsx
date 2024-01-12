import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Homemain from "./Pages/HomePage/Homemain";
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import CandidateHome from "./Pages/CandidatePage/CandidateHome";
import CandidateAllJobs from "./Pages/CandidatePage/AllJobs";
import EachJob from "./Pages/CandidatePage/EachJob";
import AllAppliedJobs from "./Pages/CandidatePage/AllAppliedJobs";
import AllDirectJobs from "./Pages/CandidatePage/AllDirectJobs";
import AllAgencyJobs from "./Pages/CandidatePage/AllAgencyJobs";
import AllBancaJobs from "./Pages/CandidatePage/AllBancaJobs";

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
          </Route> 
        </Routes>
      </Router>
    </>
  )
}

export default App
