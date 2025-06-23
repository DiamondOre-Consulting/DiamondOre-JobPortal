import {BrowserRouter, Routes,Route} from 'react-router-dom' 
import LandingPage from './pages/LandingPage'
import KpiPage from './pages/Employees'
import KpiData from './pages/KpiData'

function App() {

  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kpi" element={<KpiPage />} />  
        <Route path="/employee-kpi/:empId" element={<KpiData />} />      
      </Routes>
  </BrowserRouter>
  )
}

export default App
