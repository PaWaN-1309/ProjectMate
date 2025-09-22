export default function ProjectCard({ project, onOpen }) {
  return (
    <div className='border rounded p-4 bg-white shadow'>
      <h3 className='font-semibold'>{project.title}</h3>
      <p className='text-sm text-gray-500'>{project.description}</p>
      <div className='mt-3'>
        <button onClick={() => onOpen(project)} className='px-3 py-1 bg-indigo-600 text-white rounded text-sm'>Open</button>
      </div>
    </div>
  )
}
