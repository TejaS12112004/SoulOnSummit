# API Documentation

Base URL: `/api/v1`

## Authentication

### `POST /auth/login`
- **Auth Required**: No
- **Request DTO**: `{ email, password }`
- **Response DTO**: `{ token, user: { id, firstName, lastName, email, role } }`
- **Description**: Authenticates user and returns JWT.
- **Errors**: `401 Unauthorized`

### `POST /auth/register`
- **Auth Required**: No
- **Request DTO**: `{ firstName, lastName, email, password }`
- **Response DTO**: `UserResponse`
- **Description**: Registers a new user.
- **Errors**: `400 Bad Request` (Email exists)

## Users

### `GET /users/me`
- **Auth Required**: Yes
- **Roles**: `USER`, `ADMIN`
- **Response DTO**: `UserResponse`
- **Description**: Retrieves current user's profile.

## Treks

### `GET /treks`
- **Auth Required**: No
- **Description**: Returns paginated list of published treks.

### `GET /treks/{id}`
- **Auth Required**: No
- **Description**: Retrieves detailed trek information including active departures.

## Departures

### `GET /departures/trek/{trekId}`
- **Auth Required**: No
- **Description**: Fetches available departure dates for a specific trek.

## Bookings

### `POST /bookings`
- **Auth Required**: Yes
- **Roles**: `USER`
- **Request DTO**: `{ departureId, participants: [{ name, age, gender }] }`
- **Response DTO**: `BookingResponse`
- **Description**: Creates a new booking reservation.

### `GET /bookings/me`
- **Auth Required**: Yes
- **Roles**: `USER`
- **Description**: Retrieves all bookings for the authenticated user.

### `GET /bookings/{id}`
- **Auth Required**: Yes
- **Roles**: `USER`, `ADMIN`
- **Description**: Retrieves detailed booking information.

## Admin

### `GET /admin/treks`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Description**: Retrieves all treks (published and drafts).

### `POST /admin/treks`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Request DTO**: `TrekRequest`
- **Description**: Creates a new trek.

### `PUT /admin/treks/{id}`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Description**: Updates an existing trek.

### `DELETE /admin/treks/{id}`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Description**: Deletes a trek.

### `POST /admin/treks/{id}/publish`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Description**: Toggles publication status of a trek.

### `GET /admin/bookings`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Description**: Retrieves all bookings across the platform.

### `PUT /admin/bookings/{id}/status`
- **Auth Required**: Yes
- **Roles**: `ADMIN`
- **Request DTO**: `{ status }`
- **Description**: Updates a booking's status.
