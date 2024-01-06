import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Homemain from "./Pages/HomePage/Homemain";
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import CandidateHome from "./Pages/CandidatePage/CandidateHome";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Homemain/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/candidate-home" element={<CandidateHome/>}/>
          </Route> 
        </Routes>
      </Router>
    </>
  )
}

export default App
