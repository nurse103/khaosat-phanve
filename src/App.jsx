import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import './styles/index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>@Bệnh viện Quân y 103 - Phiếu khảo sát kiến thức Phản vệ</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
