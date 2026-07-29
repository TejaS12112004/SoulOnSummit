# Deployment Guide

## Production Profiles
The backend utilizes Spring profiles. Use the `prod` profile to connect to external databases and enable stricter security configurations.

## Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS Amplify for global CDN edge serving and automatic CI/CD.
- **Backend**: Render, AWS Elastic Beanstalk, or a containerized deployment on AWS ECS/EKS.
- **Database**: Supabase (PostgreSQL), AWS RDS, or Render Managed DB.

## Build Commands

### Frontend Build
```bash
cd trek-management-frontend
npm install
npm run build
```
This generates a static production bundle in `trek-management-frontend/dist/`.

### Backend Build
```bash
./mvnw clean package -DskipTests
```
This generates a standalone executable jar file at `target/trekmanagement-0.0.1-SNAPSHOT.jar`.

## Deployment Steps

1. **Database Allocation**: Spin up a PostgreSQL instance (e.g., via Supabase). Retrieve the connection string.
2. **Backend Deployment**:
   - Set the necessary environment variables in the hosting environment (see `ENVIRONMENT.md`).
   - Deploy the generated `.jar` file or run via Docker.
   - Spring Boot and Flyway will automatically run the schema migrations upon the first start.
3. **Frontend Deployment**:
   - Link the frontend repo to Vercel/Netlify.
   - Set the `VITE_API_URL` to point to the live backend domain.
   - Deploy.

## Rollback Strategy
- **Frontend**: One-click rollback via Vercel/Netlify deployment history.
- **Backend**: Redeploy the previous verified `.jar` or Docker image. Flyway handles schema versioning but data rollbacks require manual DB snapshots.

## Supabase Considerations
If using Supabase Postgres, ensure IPv4 connection strings or connection poolers (PgBouncer) are configured correctly if your backend environment doesn't natively support IPv6.
