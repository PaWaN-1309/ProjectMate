import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <NavBar />
      <main className='container mx-auto px-4 py-8 flex-1'>
        <Outlet />
      </main>
      <footer className='text-center text-sm text-gray-500 py-4'>
        © ProjectMate • Minimal project tracker
      </footer>
    </div>
  )
}
