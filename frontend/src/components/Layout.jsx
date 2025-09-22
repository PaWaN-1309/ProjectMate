import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50'>
      <NavBar />
      <main className='container mx-auto px-4 py-8 flex-1'>
        <Outlet />
      </main>
      <footer className='bg-white/80 backdrop-blur-sm border-t border-gray-100'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-xs'>P</span>
              </div>
              <span className='font-bold text-gray-900'>ProjectMate</span>
            </div>
            <div className='text-center md:text-right'>
              <p className='text-sm text-gray-600 mb-1'>
                © 2025 ProjectMate • Built for students
              </p>
              <p className='text-xs text-gray-500'>
                Minimal project & task management
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
