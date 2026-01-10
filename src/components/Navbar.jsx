import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            📋 Khảo sát kiến thức phản vệ
          </Link>
          
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded transition ${
                isActive('/') 
                  ? 'bg-blue-600' 
                  : 'hover:bg-blue-700'
              }`}
            >
              Làm khảo sát
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded transition ${
                isActive('/admin') 
                  ? 'bg-blue-600' 
                  : 'hover:bg-blue-700'
              }`}
            >
              Thông kê kết quả
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
