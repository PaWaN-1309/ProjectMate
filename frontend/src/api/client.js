// API client for ProjectMate backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

// Remove auth token and user data
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  }

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    
    // Handle auth errors
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      logout()
      window.location.href = '/login'
    }
    
    throw error
  }
}

// Auth API functions
export async function register(data) {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: data
    })
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return { ok: true, user: response.data.user, token: response.data.token }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function login(data) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: data
    })
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return { ok: true, user: response.data.user, token: response.data.token }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiRequest('/auth/me')
    return { ok: true, user: response.data.user }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Project API functions
export async function listProjects() {
  try {
    const response = await apiRequest('/projects')
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export async function getProject(id) {
  try {
    const response = await apiRequest(`/projects/${id}`)
    return { ok: true, project: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function createProject(payload) {
  try {
    // Convert title to name if needed
    const projectData = {
      name: payload.title || payload.name,
      description: payload.description,
      color: payload.color || 'indigo'
    }
    
    const response = await apiRequest('/projects', {
      method: 'POST',
      body: projectData
    })
    
    return { ok: true, project: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function updateProject(id, payload) {
  try {
    const response = await apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: payload
    })
    
    return { ok: true, project: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function deleteProject(id) {
  try {
    const response = await apiRequest(`/projects/${id}`, {
      method: 'DELETE'
    })
    
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function addProjectMember(projectId, email) {
  try {
    // First, find the user by email - we need to get their userId
    // The backend's addMember endpoint expects userId, not email
    // So we'll send the email and let the backend handle the lookup
    const response = await apiRequest(`/projects/${projectId}/members`, {
      method: 'POST',
      body: { 
        email,
        role: 'member'
      }
    })
    
    return { ok: true, member: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function removeProjectMember(projectId, userId) {
  try {
    const response = await apiRequest(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE'
    })
    
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Task API functions
export async function getProjectTasks(projectId) {
  try {
    const response = await apiRequest(`/tasks/projects/${projectId}/tasks`)
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return []
  }
}

export async function createTask(projectId, payload) {
  try {
    const response = await apiRequest(`/tasks/projects/${projectId}/tasks`, {
      method: 'POST',
      body: payload
    })
    
    return { ok: true, task: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function updateTask(taskId, payload) {
  try {
    const response = await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: payload
    })
    
    return { ok: true, task: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function updateTaskStatus(taskId, status) {
  try {
    const response = await apiRequest(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: { status }
    })
    
    return { ok: true, task: response.data }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
    
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}

// Utility functions
export const isLoggedIn = () => {
  return !!getAuthToken()
}

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    return null
  }
}
