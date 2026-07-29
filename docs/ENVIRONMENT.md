# Environment Variables

This document outlines the required and optional environment variables needed to successfully build and deploy the SoulOnSummit application.

## Frontend (`trek-management-frontend/.env`)

Create a `.env` file in the root of the frontend directory.

```env
# The base URL of the backend API
VITE_API_URL=http://localhost:8080/api/v1
```

## Backend (`src/main/resources/application.properties` or environment mapping)

The backend uses standard Spring Boot properties. These can be overridden via environment variables in a production environment (e.g. Docker, Heroku, Render).

### Database (PostgreSQL / Supabase)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/trekmanagement
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
```

### JWT Authentication
```env
# A strong, secure 256-bit+ secret key used to sign the JSON Web Tokens
JWT_SECRET=your_super_secret_jwt_key_that_is_long_enough
# Token expiration time in milliseconds (e.g., 86400000 for 24 hours)
JWT_EXPIRATION=86400000
```

### Mail (Spring Mail)
*(Mocked/Configured for future implementation)*
```env
SPRING_MAIL_HOST=smtp.example.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@example.com
SPRING_MAIL_PASSWORD=your_email_password
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
```

### Payments
*(For future Stripe/Razorpay integration)*
```env
PAYMENT_GATEWAY_SECRET_KEY=sk_test_...
PAYMENT_GATEWAY_PUBLIC_KEY=pk_test_...
```

### Storage (Supabase / AWS S3)
*(For future image uploads)*
```env
STORAGE_BUCKET_NAME=trek-assets
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
STORAGE_REGION=us-east-1
```
