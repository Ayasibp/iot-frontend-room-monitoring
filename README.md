# IoT Room Monitoring Dashboard

A modern, real-time IoT monitoring dashboard for operating theater rooms built with React, TypeScript, and Bun.

## Features

- 🔐 **Authentication**: Secure login with JWT tokens and automatic token refresh
- 📊 **Real-time Monitoring**: Live sensor data updates every 2 seconds
- 🏥 **Room Management**: Monitor multiple operating theater rooms
- 📈 **ACH Calculations**: Display theoretical and empirical Air Changes per Hour
- 💉 **Medical Gas Tracking**: Monitor oxygen, nitrous oxide, air, vacuum, instrument air, and CO₂
- ⏱️ **Timer Controls**: Operation stopwatch and countdown (admin only)
- 👥 **User Management**: Admin panel for creating and managing users
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based routing)
- **State Management**:
  - Zustand (client state: auth)
  - TanStack Query (server state: API data)
- **HTTP Client**: Ky (with auto-refresh interceptor)
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner

## Prerequisites

- Bun 1.0+ installed
- Backend API running at `http://localhost:8080`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iot-frontend-room-monitoring
```

2. Install dependencies:
```bash
bun install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL:
```
VITE_API_URL=http://localhost:8080
```

## Development

Start the development server:
```bash
bun run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
bun run build
```

Preview the production build:
```bash
bun run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── ACHWidget.tsx    # ACH display widget
│   ├── AppLayout.tsx    # Main application layout
│   ├── CountdownWidget.tsx
│   ├── SensorCard.tsx
│   └── StopwatchWidget.tsx
├── lib/
│   ├── api.ts           # HTTP client with auto-refresh
│   ├── constants.ts     # App constants and thresholds
│   └── utils.ts         # Utility functions
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard page
│   ├── login.tsx        # Login page
│   ├── register.tsx     # Registration info page
│   ├── room.$roomId.tsx # Room monitoring page
│   └── settings.tsx     # Admin settings page
├── services/            # API service functions
│   ├── admin.service.ts
│   ├── auth.service.ts
│   └── room.service.ts
├── store/
│   └── auth.ts          # Zustand auth store
├── types/               # TypeScript type definitions
│   ├── auth.ts
│   └── theater.ts
└── main.tsx             # Application entry point
```

## Default Credentials

Use these credentials to log in (from backend):
- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

> **Note**: Change these credentials in production!

## Features by Role

### User Role
- View dashboard with all rooms
- Monitor individual room details
- View real-time sensor data
- View ACH calculations
- View timer states (read-only)

### Admin Role
- All user features plus:
- Control operation stopwatch (start/stop/reset)
- Access settings page
- Create new users
- Manage user roles

## API Integration

The frontend connects to the backend API at the URL specified in `.env`:

### Required Endpoints
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /theater/state?room={id}` - Get room state
- `POST /theater/timer/op` - Control operation timer (admin)
- `GET /admin/users` - List users (admin)
- `POST /admin/users` - Create user (admin)

## Environment Variables

```env
VITE_API_URL=http://localhost:8080  # Backend API URL
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
