# ProjectMate Backend API

A RESTful API backend for ProjectMate - A collaborative project management application built with Express.js, MongoDB, and JWT authentication.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 📋 **Project Management**: Create, update, delete projects with member management
- ✅ **Task Management**: Full CRUD operations with drag-and-drop support
- 👥 **Team Collaboration**: Invite system with role-based permissions
- 🔒 **Security**: Rate limiting, input validation, and security headers
- 📊 **Data Validation**: Comprehensive input validation with express-validator
- 🗄️ **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── projectController.js # Project management
│   ├── taskController.js    # Task management
│   └── invitationController.js # Team invitations
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Global error handling
│   ├── projectAuth.js       # Project-level authorization
│   ├── rateLimiter.js       # Rate limiting
│   └── validation.js        # Input validation rules
├── models/
│   ├── User.js              # User schema
│   ├── Project.js           # Project schema
│   ├── Task.js              # Task schema
│   ├── Invitation.js        # Invitation schema
│   └── index.js             # Model exports
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── projectRoutes.js     # Project routes
│   ├── taskRoutes.js        # Task routes
│   ├── invitationRoutes.js  # Invitation routes
│   └── index.js             # Route aggregation
├── utils/
│   ├── tokenUtils.js        # JWT utilities
│   ├── responseUtils.js     # Response formatting
│   └── helpers.js           # General utilities
├── .env                     # Environment variables
├── .env.example             # Environment template
├── index.js                 # Server entry point
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectMate/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/projectmate
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - Local: Start your MongoDB service
   - Cloud: Ensure your MongoDB Atlas cluster is running

5. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `PUT /deactivate` - Deactivate account

### Projects (`/api/projects`)
- `GET /` - Get all user projects
- `POST /` - Create new project
- `GET /:id` - Get single project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/members` - Add member to project
- `DELETE /:id/members/:userId` - Remove member

### Tasks (`/api/tasks`)
- `GET /projects/:projectId/tasks` - Get project tasks
- `POST /projects/:projectId/tasks` - Create new task
- `GET /:id` - Get single task
- `PUT /:id` - Update task
- `PUT /:id/status` - Update task status (drag & drop)
- `DELETE /:id` - Delete task
- `POST /:id/comments` - Add comment to task
- `PUT /projects/:projectId/tasks/reorder` - Reorder tasks

### Invitations (`/api/invitations`)
- `GET /` - Get user invitations
- `POST /projects/:projectId/invite` - Send invitation
- `PUT /:id/respond` - Respond to invitation
- `DELETE /:id` - Cancel invitation
- `GET /projects/:projectId` - Get project invitations

### Utility
- `GET /api/health` - Health check endpoint
- `GET /` - API information

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation on all inputs
- **Password Hashing**: Secure bcrypt hashing
- **CORS Protection**: Configurable cross-origin policies
- **Security Headers**: Helmet.js for security headers
- **JWT Expiration**: Configurable token expiration

## Data Models

### User
- Personal information (name, email)
- Authentication (hashed password)
- Project associations
- Role management

### Project
- Project details (name, description, color)
- Member management with roles
- Task associations
- Status tracking

### Task
- Task information (title, description)
- Status management (todo, inprogress, completed)
- Assignment and priority
- Comments and attachments support

### Invitation
- Project invitation system
- Role-based invitations
- Expiration handling

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Code Style
- Follow ES6+ standards
- Use async/await for asynchronous operations
- Implement proper error handling
- Add comments for complex logic

## Deployment

### Environment Variables
Ensure all production environment variables are set:
- `NODE_ENV=production`
- `MONGODB_URI` - Production database URL
- `JWT_SECRET` - Strong, unique secret key
- `FRONTEND_URL` - Production frontend URL

### Production Considerations
- Use process managers (PM2, etc.)
- Set up proper logging
- Configure reverse proxy (Nginx)
- Enable SSL/TLS
- Set up monitoring and health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.