# SoulOnSummit

A full-stack trek management platform built to deliver a premium user experience for adventure seekers. 

## Project Overview

SoulOnSummit is an end-to-end booking platform designed for a trek and adventure agency. It provides an intuitive, high-performance customer-facing website for discovering and booking treks, and a robust administrative dashboard for managing inventory, departures, and customer bookings.

## Screenshots

*(Screenshots to be added)*
- Home Page Hero
- Trek Discovery Gallery
- Booking Checkout Flow
- Admin Dashboard

## Features

### Public/User Features
- **Trek Discovery**: Browse available treks, difficulty levels, and durations.
- **Detailed Itineraries**: View day-by-day schedules, elevation data, and inclusions.
- **Secure Booking**: Real-time availability checking and seat reservations.
- **User Dashboard**: Manage upcoming and past trips securely.
- **Authentication**: JWT-based login, registration, password resets, and email verification.

### Admin Features
- **Trek Management**: Create, edit, and publish trek itineraries and details.
- **Departure Management**: Schedule distinct departure dates and manage seat inventory.
- **Booking Management**: View customer bookings, manage statuses, and track revenue.
- **Role-Based Access Control**: Securely isolate admin functionalities.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Data Fetching**: React Query (TanStack Query)
- **Styling**: Tailwind CSS + Shadcn UI
- **Build Tool**: Vite

### Backend
- **Framework**: Spring Boot 3 (Java 21)
- **Security**: Spring Security (JWT)
- **Database Migrations**: Flyway
- **Data Access**: Spring Data JPA

### Database
- **Engine**: PostgreSQL

### Other
- **Authentication**: Custom JWT implementation
- **Storage**: AWS S3 / Supabase Storage (Compatible)
- **Payments**: *(Mocked/Integrable structure)*

## Folder Structure
See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for a detailed breakdown.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trekmanagement.git
   ```

2. **Database:**
   Ensure PostgreSQL is running on `localhost:5432` with a database named `trekmanagement`.

3. **Backend:**
   ```bash
   cd trekmanagement
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. **Frontend:**
   ```bash
   cd trek-management-frontend
   npm install
   npm run dev
   ```

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Security](docs/SECURITY.md)
- [Known Limitations](docs/KNOWN_LIMITATIONS.md)
- [Roadmap](docs/ROADMAP.md)

## License
MIT License
