import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Simple mock registration - just navigate to dashboard
    localStorage.setItem('user', JSON.stringify({ email, name }))
    navigate('/dashboard')
  }

  return (
    <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow'>
      <h2 className='text-2xl font-semibold mb-6 text-center'>Create your account</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Full name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            placeholder='Enter your full name' 
            required
          />
        </div>
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
            placeholder='Choose a password' 
            type='password'
            required
          />
        </div>
        <button 
          type='submit'
          className='w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        >
          Create account
        </button>
      </form>
      <p className='text-center text-sm text-gray-600 mt-4'>
        Already have an account? <Link to='/login' className='text-indigo-600 hover:text-indigo-800'>Sign in</Link>
      </p>
    </div>
  )
}
