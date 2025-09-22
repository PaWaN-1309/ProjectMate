import { useState } from 'react'

export default function CreateProjectModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  if (!open) return null

  function submit(e) {
    e.preventDefault()
    onCreate({ title, description: desc })
    setTitle('')
    setDesc('')
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900'>Create New Project</h3>
          </div>
          <button 
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200'
          >
            <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Project Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder='Enter project title' 
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200' 
              required 
            />
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              placeholder='Describe your project...' 
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none' 
              rows={4} 
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <button 
              type='button' 
              onClick={onClose} 
              className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200'
            >
              Cancel
            </button>
            <button 
              type='submit' 
              className='flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
