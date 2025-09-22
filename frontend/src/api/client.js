// Minimal API client with mock functions to be replaced by real backend calls later.
const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function register(data) {
  await wait()
  return { ok: true, user: { id: 'u1', name: data.name, email: data.email } }
}

export async function login(data) {
  await wait()
  return { ok: true, token: 'mock-token' }
}

export async function listProjects() {
  await wait()
  return [{ id: 'p1', title: 'Sample Project', description: 'Example' }]
}

export async function createProject(payload) {
  await wait()
  return { ok: true, project: { id: 'p' + Date.now(), ...payload } }
}
