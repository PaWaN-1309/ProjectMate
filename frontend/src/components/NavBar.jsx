import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <header className='bg-white shadow'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/' className='font-semibold text-lg text-indigo-600'>ProjectMate</Link>
        <nav className='flex items-center space-x-4'>
          <Link to='/' className='text-sm text-gray-600 hover:text-indigo-600'>Home</Link>
          {user ? (
            <>
              <Link to='/dashboard' className='text-sm text-gray-600 hover:text-indigo-600'>Dashboard</Link>
              <span className='text-sm text-gray-500'>Welcome, {user.name}</span>
              <button 
                onClick={handleLogout}
                className='text-sm text-gray-600 hover:text-indigo-600'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm text-gray-600 hover:text-indigo-600'>Login</Link>
              <Link to='/register' className='text-sm text-gray-600 hover:text-indigo-600'>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
