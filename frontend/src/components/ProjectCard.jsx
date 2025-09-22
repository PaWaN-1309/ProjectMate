export default function ProjectCard({ project, onOpen }) {
  return (
    <div className='group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer overflow-hidden'>
      {/* Header with gradient */}
      <div className='h-2 bg-gradient-to-r from-indigo-500 to-purple-500'></div>
      
      {/* Content */}
      <div className='p-6'>
        <div className='flex items-start justify-between mb-3'>
          <h3 className='font-bold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors duration-200'>
            {project.title}
          </h3>
          <div className='w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
        </div>
        
        <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2'>
          {project.description}
        </p>
        
        {/* Stats */}
        <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
          <span className='flex items-center space-x-1'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
            </svg>
            <span>5 tasks</span>
          </span>
          <span className='flex items-center space-x-1'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
            </svg>
            <span>3 members</span>
          </span>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={() => onOpen(project)} 
          className='w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md'
        >
          Open Project
        </button>
      </div>
    </div>
  )
}
