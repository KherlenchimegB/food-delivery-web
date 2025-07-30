# Personal Task Manager

A full-stack task management application built with Next.js, Express.js, Prisma, and PostgreSQL. Organize your projects and tasks efficiently with a beautiful, modern interface.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Project Organization**: Create multiple projects (Work, Personal, etc.)
- **Task Management**: Add, edit, complete, and delete tasks
- **Smart Filtering**: Filter tasks by status (all/active/completed)
- **Dashboard Analytics**: View task statistics and completion rates
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Instant feedback on all operations

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), Tailwind CSS, shadcn/ui |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL (Neon recommended) |
| ORM | Prisma |
| Authentication | JSON Web Tokens (JWT) |
| State Management | React Context API |

## 📦 Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   └── dashboard/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── index.ts
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended for easy setup)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=8000
NODE_ENV="development"
```

```bash
# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (if not exists)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the frontend development server
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Sign Up**: Create a new account at `/signup`
2. **Create Projects**: Organize your tasks into projects like "Work", "Personal", etc.
3. **Add Tasks**: Create tasks within your projects
4. **Manage Tasks**: Mark tasks as complete, edit, or delete them
5. **Filter & Track**: Use filters to focus on specific task types and track your progress

### API Endpoints

#### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login user

#### Projects
- `GET /projects` - Get all user projects
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Tasks
- `GET /tasks` - Get all tasks (with optional filters)
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id/toggle` - Toggle task completion
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/stats/dashboard` - Get dashboard statistics

## 🔧 Development

### Database Schema

```prisma
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  password String
  projects Project[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id     Int    @id @default(autoincrement())
  name   String
  userId Int
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks  Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  projectId Int
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter

## 🚀 Deployment

### Backend Deployment

1. Set up a PostgreSQL database (Neon, Supabase, or Railway)
2. Set environment variables on your hosting platform
3. Run database migrations: `npx prisma db push`
4. Deploy to your preferred platform (Vercel, Railway, Heroku)

### Frontend Deployment

1. Update `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy to Vercel, Netlify, or your preferred platform

## 🔮 Future Enhancements

- **Drag & Drop**: Reorder tasks with drag and drop functionality
- **Due Dates**: Add due dates and reminders for tasks
- **Labels & Tags**: Categorize tasks with custom labels
- **Team Collaboration**: Share projects with team members
- **Mobile App**: React Native or PWA version
- **Email Notifications**: Task reminders and updates
- **Analytics**: Advanced productivity insights and charts
- **Dark Mode**: Theme switching capability
- **Task Templates**: Predefined task templates for common workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database ORM by [Prisma](https://prisma.io/)

---

**Happy Task Managing! 🎯**