import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logout, isLoggedIn, getStoredUser } from '../api/client'

export default function NavBar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn()) {
      const userData = getStoredUser()
      setUser(userData)
    }
  }, [location.pathname]) // Re-check on route changes

  function handleLogout() {
    logout()
    setUser(null)
    navigate('/')
  }

  return (
    <header className='bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>P</span>
          </div>
          <span className='font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            ProjectMate
          </span>
        </Link>

        {/* Navigation */}
        <nav className='flex items-center space-x-6'>
          <Link 
            to='/' 
            className='text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200'
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to='/dashboard' 
                className='text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200'
              >
                Dashboard
              </Link>
              
              {/* User Menu */}
              <div className='flex items-center space-x-4 pl-4 border-l border-gray-200'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-medium text-sm'>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-gray-700'>
                    {user.name}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className='text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200'
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className='flex items-center space-x-3'>
              <Link 
                to='/login' 
                className='text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200'
              >
                Login
              </Link>
              <Link 
                to='/register' 
                className='px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md'
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
