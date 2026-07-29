# Contributing Guidelines

## Code Style
- **Frontend**: TypeScript strict mode enabled. Prettier is used for formatting, ESLint (Oxlint) for code quality. 
- **Backend**: Java 21 adhering to standard Spring Boot idioms. Maven serves as the build lifecycle manager.

## Branch Naming
Please follow consistent branch naming structures:
- `feature/description` (e.g., `feature/add-wishlist`)
- `bugfix/description` (e.g., `bugfix/fix-pagination-overflow`)
- `hotfix/description` (for urgent production issues)
- `chore/description` (e.g., `chore/update-dependencies`)

## Commit Conventions
We use conventional commits:
- `feat: added new trek filtering system`
- `fix: resolved horizontal overflow on mobile tables`
- `docs: updated api documentation`
- `style: refined button padding and hover states`
- `refactor: simplified auth layout component`

## Pull Request Process
1. Ensure `npm run lint` and `npm run build` pass successfully locally for frontend changes.
2. Ensure `./mvnw test` passes for backend changes.
3. Request a review from at least one core contributor.
4. Squash and merge upon approval.

## Project Structure (TL;DR)
- `trek-management-frontend/`: Contains the React/Vite SPA.
- `src/main/java/com/trekmanagement/`: Contains the Spring Boot application logic.
- `docs/`: Contains all documentation artifacts.
