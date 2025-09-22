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
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center'>
      <form onSubmit={submit} className='bg-white p-6 rounded shadow w-full max-w-md'>
        <h3 className='text-lg font-semibold mb-4'>Create Project</h3>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Title' className='w-full border rounded p-2 mb-3' required />
        <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder='Description' className='w-full border rounded p-2 mb-3' rows={4} />
        <div className='flex justify-end gap-2'>
          <button type='button' onClick={onClose} className='px-3 py-1 border rounded'>Cancel</button>
          <button type='submit' className='px-3 py-1 bg-indigo-600 text-white rounded'>Create</button>
        </div>
      </form>
    </div>
  )
}
