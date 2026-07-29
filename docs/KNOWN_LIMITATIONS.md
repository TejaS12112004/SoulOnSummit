# Known Limitations

SoulOnSummit is designed as a fully functional MVP but carries specific limitations inherent to its current scope. This document outlines genuine areas requiring expansion in enterprise contexts.

## 1. Payments & Checkout
Currently, the system models the checkout process and manages booking status (`PENDING`, `CONFIRMED`), but actual financial transactions (Stripe, Razorpay) are mocked/bypassed. 
- **Impact**: Bookings transition to "success" without real payment gateway handshakes.

## 2. Notification System
The architecture anticipates email triggers (e.g., Registration verification, Booking confirmation), but the live SMTP dispatching logic is not fully active.
- **Impact**: Users rely on UI feedback rather than out-of-band email notifications.

## 3. Invoice & Document Generation
The application tracks booking totals and participant details but does not currently generate or attach downloadable PDF invoices or waivers for customers.

## 4. Multi-Language / Localization
The frontend is exclusively written in English. The application currently lacks an `i18n` abstraction layer for localized content serving.

## 5. Caching & Edge Optimization
While React Query handles complex client-side caching seamlessly, the Spring Boot backend relies strictly on direct database reads. There is no intermediary Redis or Hazelcast layer for high-throughput public endpoints (like `/api/v1/treks`).
- **Impact**: Sufficient for thousands of users, but potentially unoptimized for massive, concurrent web-scale traffic spikes.

## 6. Advanced Analytics
The admin dashboard surfaces basic statistical counts (total treks, departures, bookings), but lacks complex time-series revenue graphs or deep cohort analysis tools.
