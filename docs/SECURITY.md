# Security Architecture

SoulOnSummit employs a robust security model to protect user data, secure API endpoints, and ensure administrative integrity.

## Authentication & Authorization
- **JSON Web Tokens (JWT)**: Stateless authentication. Tokens are signed with a securely configured 256-bit+ HMAC SHA algorithm.
- **Role-Based Access Control (RBAC)**: Enforced centrally via Spring Security `@PreAuthorize("hasRole('ADMIN')")`. The frontend mirrors this logic via `ProtectedRoute` wrappers to conditionally hide UI elements.
- **Password Hashing**: User passwords are cryptographically hashed using **BCrypt** with a sufficient work factor. Raw passwords are never stored or logged.

## Data Protection
- **SQL Injection Protection**: Prevented fundamentally via Spring Data JPA and Hibernate, which use parameterized queries exclusively.
- **XSS (Cross-Site Scripting) Protection**: React automatically escapes rendering outputs. The backend global exception handler prevents detailed stack traces from leaking via API responses.
- **CSRF (Cross-Site Request Forgery)**: Mitigated by the stateless nature of JWTs passed via the `Authorization: Bearer` header, avoiding cookie-based attack vectors.

## Network Security
- **CORS (Cross-Origin Resource Sharing)**: Configured tightly in Spring Boot to only accept requests from known frontend origin domains (e.g., `http://localhost:5173` and production URLs).
- **Rate Limiting**: (Conceptual structure) Handled at the infrastructure layer (e.g., Vercel, AWS API Gateway, or Nginx).

## Input Validation
- **Backend**: Strict payload validation using `jakarta.validation.constraints` (`@NotNull`, `@Email`, `@Size`). The global exception handler traps `MethodArgumentNotValidException` and normalizes the output.
- **Frontend**: Controlled client-side form validation mapping directly to backend contracts to provide immediate user feedback.

## Secrets Management
- No secrets (API keys, JWT secrets, DB passwords) are committed to the codebase.
- Environment variables (`.env` or server configurations) are solely responsible for injecting sensitive credentials.
