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
    <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow'>
      <h2 className='text-2xl font-semibold mb-6 text-center'>Sign in to ProjectMate</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            placeholder='Enter your email' 
            type='email'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Password</label>
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            placeholder='Enter your password' 
            type='password'
            required
          />
        </div>
        <button 
          type='submit'
          className='w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        >
          Sign in
        </button>
      </form>
      <p className='text-center text-sm text-gray-600 mt-4'>
        Don't have an account? <Link to='/register' className='text-indigo-600 hover:text-indigo-800'>Sign up</Link>
      </p>
    </div>
  )
}
