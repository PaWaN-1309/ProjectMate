import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import { listProjects, createProject } from '../api/client'

function TaskColumn({ title, tasks, onAddTask, onDrop, columnKey }) {
  const [newTask, setNewTask] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!newTask.trim()) return
    onAddTask(columnKey, newTask.trim())
    setNewTask('')
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    const sourceColumn = e.dataTransfer.getData('sourceColumn')
    
    if (sourceColumn !== columnKey) {
      onDrop(taskId, sourceColumn, columnKey)
    }
  }

  return (
    <div 
      className={`flex-1 bg-white rounded p-4 shadow min-h-[300px] transition-colors ${
        isDragOver ? 'bg-indigo-50 border-2 border-indigo-300 border-dashed' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className='font-semibold mb-3 flex items-center justify-between'>
        {title}
        <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
          {tasks.length}
        </span>
      </h3>
      
      <form onSubmit={handleSubmit} className='mb-3'>
        <input 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder='Add task...' 
          className='w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />
      </form>

      <div className='space-y-2'>
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className='p-3 border rounded bg-gray-50 cursor-grab hover:bg-gray-100 hover:shadow-md transition-all active:cursor-grabbing'
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task.id)
              e.dataTransfer.setData('sourceColumn', columnKey)
              e.dataTransfer.effectAllowed = 'move'
            }}
          >
            <div className='font-medium text-sm'>{task.title}</div>
            <div className='text-xs text-gray-500 mt-1'>
              {task.assignedTo ? `Assigned to: ${task.assignedTo}` : 'Unassigned'}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className='text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded'>
            Drop tasks here or add new ones above
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState('projects')
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [creating, setCreating] = useState(false)
  
  // Mock task data for selected project
  const [tasks, setTasks] = useState({
    todo: [
      { id: 't1', title: 'Define project requirements', assignedTo: 'John Doe', createdAt: '2025-09-20', createdBy: 'You' },
      { id: 't2', title: 'Create wireframes', assignedTo: '', createdAt: '2025-09-21', createdBy: 'You' }
    ],
    inprogress: [
      { id: 't3', title: 'Set up development environment', assignedTo: 'Jane Smith', createdAt: '2025-09-19', createdBy: 'John Doe' }
    ],
    completed: [
      { id: 't4', title: 'Initial project setup', assignedTo: 'You', createdAt: '2025-09-18', createdBy: 'You' }
    ]
  })

  const [members, setMembers] = useState(['You', 'John Doe', 'Jane Smith'])
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    async function load() {
      const res = await listProjects()
      setProjects(res)
    }
    load()
  }, [])

  async function handleCreate(payload) {
    const res = await createProject(payload)
    if (res?.project) setProjects((p) => [res.project, ...p])
  }

  function handleProjectOpen(project) {
    setSelectedProject(project)
    setTab('board')
  }

  function handleAddTask(column, taskTitle) {
    const newTask = {
      id: `t${Date.now()}`,
      title: taskTitle,
      assignedTo: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'You'
    }
    setTasks(prev => ({
      ...prev,
      [column]: [...prev[column], newTask]
    }))
  }

  function handleTaskDrop(taskId, sourceColumn, targetColumn) {
    setTasks(prev => {
      // Find the task in the source column
      const taskToMove = prev[sourceColumn].find(task => task.id === taskId)
      if (!taskToMove) return prev

      // Remove task from source column
      const newSourceTasks = prev[sourceColumn].filter(task => task.id !== taskId)
      
      // Add task to target column
      const newTargetTasks = [...prev[targetColumn], taskToMove]

      return {
        ...prev,
        [sourceColumn]: newSourceTasks,
        [targetColumn]: newTargetTasks
      }
    })
  }

  function handleInviteMember(e) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setMembers(prev => [...prev, inviteEmail.trim()])
    setInviteEmail('')
  }

  function getAllTasks() {
    return [...tasks.todo, ...tasks.inprogress, ...tasks.completed]
  }

  return (
    <div>
      {!selectedProject ? (
        // Projects List View
        <>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>My Projects</h2>
              <p className='text-gray-600'>Manage and organize your academic projects</p>
            </div>
            <button 
              onClick={() => setCreating(true)} 
              className='mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              <span>New Project</span>
            </button>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={handleProjectOpen} />
              ))}
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>No projects yet</h3>
              <p className='text-gray-600 mb-6'>Create your first project to get started</p>
              <button 
                onClick={() => setCreating(true)}
                className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200'
              >
                Create First Project
              </button>
            </div>
          )}

          <CreateProjectModal open={creating} onClose={() => setCreating(false)} onCreate={handleCreate} />
        </>
      ) : (
        // Project Detail View
        <>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8'>
            <button 
              onClick={() => setSelectedProject(null)} 
              className='inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 font-medium transition-colors duration-200'
            >
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
              </svg>
              Back to Projects
            </button>
            
            <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
              <div className='mb-4 lg:mb-0'>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>{selectedProject.title}</h2>
                <p className='text-gray-600 text-lg'>{selectedProject.description}</p>
              </div>
              
              <div className='flex flex-wrap gap-2'>
                <button 
                  onClick={() => setTab('board')} 
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    tab==='board'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Board
                </button>
                <button 
                  onClick={() => setTab('members')} 
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    tab==='members'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Members
                </button>
                <button 
                  onClick={() => setTab('tasks')} 
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    tab==='tasks'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Tasks
                </button>
              </div>
            </div>
          </div>

          {tab === 'board' && (
            <div className='flex gap-4'>
              <TaskColumn 
                title='To do' 
                tasks={tasks.todo} 
                onAddTask={handleAddTask}
                onDrop={handleTaskDrop}
                columnKey='todo'
              />
              <TaskColumn 
                title='In progress' 
                tasks={tasks.inprogress} 
                onAddTask={handleAddTask}
                onDrop={handleTaskDrop}
                columnKey='inprogress'
              />
              <TaskColumn 
                title='Completed' 
                tasks={tasks.completed} 
                onAddTask={handleAddTask}
                onDrop={handleTaskDrop}
                columnKey='completed'
              />
            </div>
          )}

          {tab === 'members' && (
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold mb-4'>Project Members</h3>
              
              <div className='mb-6'>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {members.map((member, idx) => (
                    <span key={idx} className='px-3 py-1 bg-gray-100 rounded-full text-sm'>
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className='font-medium mb-2'>Invite new member</h4>
              <form onSubmit={handleInviteMember} className='flex gap-2'>
                <input 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder='Member email' 
                  className='flex-1 p-2 border rounded' 
                  type='email'
                />
                <button type='submit' className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'>
                  Invite
                </button>
              </form>
            </div>
          )}

          {tab === 'tasks' && (
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold mb-4'>All Tasks</h3>
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='text-sm text-gray-600 border-b'>
                      <th className='pb-2'>Title</th>
                      <th className='pb-2'>Status</th>
                      <th className='pb-2'>Created by</th>
                      <th className='pb-2'>Created at</th>
                      <th className='pb-2'>Assigned to</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllTasks().map((task) => {
                      let status = 'To do'
                      if (tasks.inprogress.find(t => t.id === task.id)) status = 'In progress'
                      if (tasks.completed.find(t => t.id === task.id)) status = 'Completed'
                      
                      return (
                        <tr key={task.id} className='border-b'>
                          <td className='py-2'>{task.title}</td>
                          <td className='py-2'>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              status === 'Completed' ? 'bg-green-100 text-green-800' :
                              status === 'In progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className='py-2'>{task.createdBy}</td>
                          <td className='py-2'>{task.createdAt}</td>
                          <td className='py-2'>{task.assignedTo || '-'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
