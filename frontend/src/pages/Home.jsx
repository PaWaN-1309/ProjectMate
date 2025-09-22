import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='max-w-3xl mx-auto text-center py-16'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4'>ProjectMate</h1>
      <p className='text-gray-600 mb-8'>A minimal project & task tracker for students. Create projects, invite members, and manage tasks with a simple kanban.</p>

      <div className='flex justify-center gap-4'>
        <Link to='/register' className='px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>Get Started</Link>
        <Link to='/login' className='px-6 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50'>Sign in</Link>
      </div>
    </div>
  )
}
