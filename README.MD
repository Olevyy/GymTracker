# GymTracker

A full-stack fitness app for tracking workouts, browsing exercises and viewing workout history or statistics.

## Demo

### 1. Navigation & Heatmap
### 2. Exercises & 1RM History
### 3. Weekly Summary
### 4. Workout Flow & PR Detection

## Features
- **User authentication**: Secure JWT-based login and registration.
- **Optimized Performance**: Sets are logged locally for zero latency and synced to the backend only upon workout completion.
- **Workout History**: Detailed logs of past sessions, personal records with charts, muscle Heatmaps, last week and overall summary.
- **Exercise Database**: Advanced filtering by muscle group and category.
- **Templates**: Create reusable workout plans for quick session starts.



## Tech Stack
- **Backend**: Django REST Framework, PostgreSQL, JWT Auth
- **Frontend**: React Native (Expo), TypeScript, NativeWind
- **Infrastructure**: Docker, Google Cloud Run, Google Cloud SQL

### Production Deployment
The backend is deployed on Google Cloud Run with Google Cloud SQL as the database. The mobile app connects to the production API via the configured endpoint.

## Code Structure

```
GymTracker/
├── backend/ (Django REST Framework)
│   ├── users/ - Authentication and user management
│   ├── exercises/ - Exercise CRUD, search, filtering, data import
│   ├── workouts/ - Workout logging, history, stats, heatmaps, workoutExercise, workoutExerciseSet
│   └── templates/ - Template creation, editing, deletion
├── mobile/ (React Native with Expo)
│   ├── app/ - Screens (tabs, auth, flows)
│   ├── components/ - UI components
│   ├── contexts/ - Global state AuthContext, WorkoutContext - manages local workout state
│   ├── hooks/ - Data fetching & persistence
│   ├── services/ - API clients 
│   └── types/ - TypeScript interfaces (Exercise, Workout)
└── docker/ - Containerization and orchestration
```

## Setup

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for mobile development)
- Python 3.13+ (for backend development)

### Local Development
1. Clone the repository:
   ```
   git clone <repo-url>
   cd GymTracker
   ```
2. **Backend setup with docker**:
   ```
   cd docker
   docker-compose up
   ```

3. **Mobile Setup**:
   ```
   cd mobile
   npm install
   npx expo start
   ```

