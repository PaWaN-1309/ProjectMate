# Backend API (minimal contract)

Auth
- POST /api/auth/register  { name, email, password } -> 201 { user }
- POST /api/auth/login     { email, password } -> 200 { token }

Projects
- GET /api/projects -> 200 [{ id, title, description, ownerId }]
- POST /api/projects { title, description } -> 201 { project }
- GET /api/projects/:id -> 200 { project }

Tasks
- POST /api/projects/:id/tasks { title, assignedTo } -> 201 { task }
- GET /api/projects/:id/tasks -> 200 [{ task }]
- PATCH /api/tasks/:taskId -> 200 { task }

Members
- POST /api/projects/:id/invite { email } -> 200 { invited: true }

Authentication: Bearer token (JWT) on protected routes.
