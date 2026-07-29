# Architecture

## Frontend Architecture
The frontend is built with **React 18** and **TypeScript** using **Vite**.
- **Component-Driven Design**: Organized via a feature-based folder structure (e.g. `src/features/treks`).
- **Styling**: Tailwind CSS extended with specific design tokens via Shadcn UI components.
- **Routing**: `react-router-dom` using nested layouts (`AuthLayout`, `UserLayout`, `AdminLayout`, `PublicLayout`).
- **State Management**: Server state is managed by `@tanstack/react-query` to handle caching, background fetching, and loading/error states. Client UI state relies on React `useState` and context providers.
- **Performance**: Code-splitting via dynamic imports in routing. Optimized image loading and responsive Tailwind classes ensure solid Web Vitals.
- **Accessibility & Reliability**: Centralized Error Boundaries, Axios interceptors, global focus traps via Radix UI primitives, and `aria` attribute management.

## Backend Architecture
Built with **Spring Boot 3 (Java 21)** following an MVC layered architecture:
- **Controllers**: Handle HTTP requests, define API contracts, and perform DTO validations.
- **Services**: Encapsulate business logic.
- **Repositories**: Interface with the PostgreSQL database via Spring Data JPA.
- **Mappers**: Isolate entity-to-DTO conversion logic to prevent domain leakage.

## Database Relationships
- **PostgreSQL**: Used as the primary operational database.
- **Flyway**: Manages database schemas predictably.
- **Core Entities**: 
  - `User` (1-to-many Bookings)
  - `Trek` (1-to-many Departures)
  - `Departure` (1-to-many Bookings)
  - `Booking` (1-to-many Participants)

## Authentication Flow
- **Registration**: Users submit details; passwords hashed via BCrypt. 
- **Login**: Authenticated users receive a JWT (JSON Web Token) which is included in the `Authorization` header of subsequent requests.
- **Email Verification**: (Structure implemented) Sends verification token upon registration.

## Authorization (RBAC)
- **Roles**: `ROLE_USER` and `ROLE_ADMIN`.
- Evaluated globally on backend endpoints via Spring Security rules and `@PreAuthorize`. 
- Reflected in the frontend using a `ProtectedRoute` wrapper checking the decoded user role against route requirements.

## Booking Lifecycle
1. User views **Trek** details and selects a scheduled **Departure**.
2. User proceeds to the Booking flow and enters participant details.
3. System validates available seats and locks inventory temporarily.
4. Booking is created as `PENDING`.
5. Upon successful payment (mocked), status updates to `CONFIRMED`.

## Storage Buckets
- Abstract interface implemented for cloud storage compatibility (AWS S3, Supabase Storage) to serve and store trek cover images, gallery assets, and user avatars.

## React Query Flow
- API endpoints map directly to custom React hooks (e.g., `useTreks`, `useBooking`). 
- Mutations gracefully invalidate specific queries (e.g., updating a booking automatically triggers a refetch of `useAdminBookings`), ensuring UI synchrony without full page reloads.
