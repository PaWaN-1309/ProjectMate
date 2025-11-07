import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import { 
  listProjects, 
  createProject, 
  getProjectTasks, 
  createTask, 
  updateTaskStatus,
  addProjectMember,
  isLoggedIn,
  getStoredUser 
} from '../api/client'

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
            key={task._id || task.id} 
            className='p-3 border rounded bg-gray-50 cursor-grab hover:bg-gray-100 hover:shadow-md transition-all active:cursor-grabbing'
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task._id || task.id)
              e.dataTransfer.setData('sourceColumn', columnKey)
              e.dataTransfer.effectAllowed = 'move'
            }}
          >
            <div className='font-medium text-sm'>{task.title}</div>
            <div className='text-xs text-gray-500 mt-1'>
              {task.assignedTo ? (
                typeof task.assignedTo === 'object' 
                  ? `Assigned to: ${task.assignedTo.name}`
                  : `Assigned to: ${task.assignedTo}`
              ) : 'Unassigned'}
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Task management states
  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    completed: []
  })
  const [tasksLoading, setTasksLoading] = useState(false)

  // Member management states  
  const [members, setMembers] = useState([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const navigate = useNavigate()
  const currentUser = getStoredUser()

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    
    loadProjects()
  }, [navigate])

  useEffect(() => {
    if (selectedProject) {
      loadProjectTasks()
      loadProjectMembers()
    }
  }, [selectedProject])

  async function loadProjects() {
    try {
      setLoading(true)
      const projectsData = await listProjects()
      setProjects(projectsData)
      setError('')
    } catch (err) {
      setError('Failed to load projects. Please try again.')
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadProjectTasks() {
    if (!selectedProject) return
    
    try {
      setTasksLoading(true)
      const tasksData = await getProjectTasks(selectedProject.id || selectedProject._id)
      
      // Organize tasks by status
      const organizedTasks = {
        todo: tasksData.filter(task => task.status === 'todo'),
        inprogress: tasksData.filter(task => task.status === 'inprogress'),
        completed: tasksData.filter(task => task.status === 'completed')
      }
      
      setTasks(organizedTasks)
    } catch (err) {
      console.error('Error loading tasks:', err)
      // Keep existing tasks on error
    } finally {
      setTasksLoading(false)
    }
  }

  function loadProjectMembers() {
    if (!selectedProject) return
    
    // Extract members from project data
    const projectMembers = []
    
    // Add owner
    if (selectedProject.owner) {
      projectMembers.push({
        id: selectedProject.owner._id || selectedProject.owner.id,
        name: selectedProject.owner.name,
        email: selectedProject.owner.email,
        role: 'owner'
      })
    }
    
    // Add other members
    if (selectedProject.members && Array.isArray(selectedProject.members)) {
      selectedProject.members.forEach(member => {
        const memberData = member.user || member
        projectMembers.push({
          id: memberData._id || memberData.id,
          name: memberData.name,
          email: memberData.email,
          role: member.role || 'member'
        })
      })
    }
    
    setMembers(projectMembers)
  }

  async function handleCreate(payload) {
    try {
      const res = await createProject(payload)
      if (res?.ok && res.project) {
        setProjects(p => [res.project, ...p])
        return true
      } else {
        setError(res?.error || 'Failed to create project')
        return false
      }
    } catch (err) {
      setError('Failed to create project. Please try again.')
      return false
    }
  }

  function handleProjectOpen(project) {
    setSelectedProject(project)
    setTab('board')
  }

  async function handleAddTask(column, taskTitle) {
    if (!selectedProject || !taskTitle.trim()) return

    try {
      const taskData = {
        title: taskTitle.trim(),
        description: '',
        status: column,
        priority: 'medium'
      }

      const res = await createTask(selectedProject.id || selectedProject._id, taskData)
      
      if (res?.ok && res.task) {
        setTasks(prev => ({
          ...prev,
          [column]: [...prev[column], res.task]
        }))
      } else {
        console.error('Failed to create task:', res?.error)
      }
    } catch (err) {
      console.error('Error creating task:', err)
    }
  }

  async function handleTaskDrop(taskId, sourceColumn, targetColumn) {
    if (sourceColumn === targetColumn) return

    // Optimistic update
    setTasks(prev => {
      const taskToMove = prev[sourceColumn].find(task => (task.id || task._id) === taskId)
      if (!taskToMove) return prev

      // Remove task from source column
      const newSourceTasks = prev[sourceColumn].filter(task => (task.id || task._id) !== taskId)
      
      // Add task to target column with updated status
      const updatedTask = { ...taskToMove, status: targetColumn }
      const newTargetTasks = [...prev[targetColumn], updatedTask]

      return {
        ...prev,
        [sourceColumn]: newSourceTasks,
        [targetColumn]: newTargetTasks
      }
    })

    // Update task status in backend
    try {
      const res = await updateTaskStatus(taskId, targetColumn)
      if (!res?.ok) {
        console.error('Failed to update task status:', res?.error)
        // Revert on failure
        loadProjectTasks()
      }
    } catch (err) {
      console.error('Error updating task status:', err)
      // Revert on failure
      loadProjectTasks()
    }
  }

  async function handleInviteMember(e) {
    e.preventDefault()
    if (!inviteEmail.trim() || !selectedProject) return
    
    try {
      setInviteLoading(true)
      setError('')
      setSuccessMessage('')
      const res = await addProjectMember(selectedProject.id || selectedProject._id, inviteEmail.trim())
      
      if (res?.ok) {
        setInviteEmail('')
        setSuccessMessage(`${inviteEmail.trim()} added as member!`)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
        // Reload project members
        loadProjectMembers()
      } else {
        setError(res?.error || 'Failed to add member')
      }
    } catch (err) {
      setError('Failed to add member. Please try again.')
    } finally {
      setInviteLoading(false)
    }
  }

  function getAllTasks() {
    return [...tasks.todo, ...tasks.inprogress, ...tasks.completed]
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <svg className='animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          <p className='text-gray-600'>Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl'>
          <p className='text-red-600 text-sm'>{error}</p>
        </div>
      )}
      
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
                <ProjectCard key={project._id || project.id} project={project} onOpen={handleProjectOpen} />
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
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>{selectedProject.name || selectedProject.title}</h2>
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
              {tasksLoading ? (
                <div className='flex-1 flex items-center justify-center py-12'>
                  <div className='text-center'>
                    <svg className='animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <p className='text-gray-600'>Loading tasks...</p>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          {tab === 'members' && (
            <div className='bg-white p-6 rounded shadow'>
              <h3 className='font-semibold mb-4'>Project Members</h3>
              
              {error && (
                <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                  <p className='text-red-600 text-sm'>{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-xl'>
                  <p className='text-green-600 text-sm'>✓ {successMessage}</p>
                </div>
              )}
              
              <div className='mb-6'>
                <div className='space-y-2 mb-4'>
                  {members.map((member) => (
                    <div key={member.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center'>
                          <span className='text-white text-sm font-medium'>
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className='font-medium text-sm'>{member.name}</div>
                          <div className='text-xs text-gray-500'>{member.email}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.role === 'owner' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                  
                  {members.length === 0 && (
                    <p className='text-gray-500 text-sm'>No members found</p>
                  )}
                </div>
              </div>

              <h4 className='font-medium mb-2'>Invite new member</h4>
              <form onSubmit={handleInviteMember} className='flex gap-2'>
                <input 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder='Enter member email to add' 
                  className='flex-1 p-2 border rounded' 
                  type='email'
                  disabled={inviteLoading}
                />
                <button 
                  type='submit' 
                  disabled={inviteLoading}
                  className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {inviteLoading ? 'Adding...' : 'Add Member'}
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
                      const statusMap = {
                        'todo': 'To do',
                        'inprogress': 'In progress', 
                        'completed': 'Completed'
                      }
                      
                      const status = statusMap[task.status] || 'To do'
                      
                      return (
                        <tr key={task._id || task.id} className='border-b'>
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
                          <td className='py-2'>
                            {task.createdBy ? (
                              typeof task.createdBy === 'object' 
                                ? task.createdBy.name 
                                : task.createdBy
                            ) : currentUser?.name || 'Unknown'}
                          </td>
                          <td className='py-2'>
                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className='py-2'>
                            {task.assignedTo ? (
                              typeof task.assignedTo === 'object' 
                                ? task.assignedTo.name
                                : task.assignedTo
                            ) : '-'}
                          </td>
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
