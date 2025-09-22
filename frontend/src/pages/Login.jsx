import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Simple mock login - just navigate to dashboard
    localStorage.setItem('user', JSON.stringify({ email, name: 'Demo User' }))
    navigate('/dashboard')
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4'>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Welcome back</h2>
          <p className='text-gray-600'>Sign in to your ProjectMate account</p>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200' 
                placeholder='Enter your email' 
                type='email'
                required
              />
            </div>
            
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200' 
                placeholder='Enter your password' 
                type='password'
                required
              />
            </div>

            <button 
              type='submit'
              className='w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-center text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link to='/register' className='font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200'>
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
