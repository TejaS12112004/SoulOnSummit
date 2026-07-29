# Project Structure

SoulOnSummit operates as a full-stack monorepo bridging a robust Spring Boot backend with a highly interactive React frontend.

## Top-Level Directories

### `/trek-management-frontend/`
The complete React 18 single-page application.
- **`src/assets/`**: Static images and global assets.
- **`src/components/`**: Shared reusable UI components (e.g., `ui/` for Shadcn components, `layout/` for Navbar/Footer).
- **`src/features/`**: Feature-based slices (Auth, Treks, Admin, User). Each slice contains its own `components`, `pages`, `hooks`, `types`, and `services`.
- **`src/layouts/`**: Core application wrappers controlling layout structures (Admin sidebar, User sidebar, Public layouts).
- **`src/constants/`**: Application-wide constants, especially `routes.ts`.
- **`src/api/`**: Axios client configuration, interceptors, and query key definitions.

### `/src/main/java/com/trekmanagement/`
The Spring Boot backend architecture. Organized strictly by feature/domain.
- **`admin/`**: Admin-specific administrative services and controllers.
- **`auth/`**: Authentication controllers, login/register DTOs, and JWT issue logic.
- **`booking/`**: Booking domain handling checkout flows, status updates, and customer history.
- **`common/`**: Shared utilities, global exception handlers, and generic DTOs.
- **`config/`**: Spring configuration classes (CORS, SecurityFilterChain, Swagger).
- **`security/`**: JWT filters, user details services, and authentication providers.
- **`trek/`**: Core catalog domain for Treks, itineraries, and departures.
- **`user/`**: User entity management and profile operations.

### `/src/main/resources/`
Backend configurations and assets.
- **`db/migration/`**: Flyway SQL migration scripts defining the database schema predictably.
- **`application.properties`**: Application configuration and environment profiles.

### `/docs/`
Contains all architectural, API, and engineering documentation artifacts.
