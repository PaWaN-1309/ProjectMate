import { useState } from 'react'

export default function CreateProjectModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Creating project with:', { title, description: desc })
      const success = await onCreate({ title, description: desc })
      if (success) {
        setTitle('')
        setDesc('')
        onClose()
      }
    } catch (err) {
      setError('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
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
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Project Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder='Enter project title' 
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200' 
              required 
              minLength={2}
              maxLength={100}
              disabled={loading}
            />
            <p className='text-xs text-gray-500 mt-1'>{title.length}/100 characters</p>
          </div>
          
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              placeholder='Describe your project (minimum 10 characters)...' 
              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none' 
              rows={4} 
              minLength={10}
              maxLength={500}
              disabled={loading}
            />
            <p className={`text-xs mt-1 ${desc.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
              {desc.length}/500 characters {desc.length < 10 ? '(minimum 10 required)' : ''}
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <button 
              type='button' 
              onClick={onClose} 
              disabled={loading}
              className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button 
              type='submit' 
              disabled={loading || title.length < 2 || desc.length < 10}
              className='flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              title={title.length < 2 ? 'Title too short (min 2 chars)' : desc.length < 10 ? 'Description too short (min 10 chars)' : ''}
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
