import Register from './components/Register'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import DocumentUpload from './components/DocumentUpload'
import MedicalVault from './components/MedicalVault'
import SymptomChecker from './components/SymptomChecker'
import HealthStats from './components/HealthStats'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/vault" element={<MedicalVault />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/stats" element={<HealthStats />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
