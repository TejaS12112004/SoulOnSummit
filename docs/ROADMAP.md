# Roadmap

## Completed (Phase 1-6)
- **Core Platform Infrastructure**: Spring Boot API and React 18 SPA.
- **Design System Implementation**: Shadcn UI, responsive utilities, and visual polish.
- **Authentication**: JWT-based login, registration, and RBAC mapping.
- **Catalog Management**: Admin workflows for creating, editing, and publishing Treks and Departures.
- **Booking Flow**: Multi-step checkout experience capturing participant data.
- **Production QA**: Complete accessibility, performance, and responsive cross-device validation.

## In Progress
- **Documentation**: Finalizing technical architecture guides and API documentation.
- **Deployment Architecture**: Configuring CI/CD pipelines and infrastructure baselines.

## Future Enhancements
- **Payment Gateway Integration**: Hooking up Stripe or Razorpay for seamless live transactions.
- **Email Notifications**: Implementing Spring Mail triggers for welcome emails, booking confirmations, and trip reminders.
- **Image Upload Integration**: Connecting the frontend and backend directly to an AWS S3 / Supabase bucket to replace placeholder URLs.
- **User Reviews & Ratings**: Allowing verified customers to leave authenticated reviews on completed treks.

## Potential Enterprise Features
- **Dynamic Pricing Engine**: Algorithmic price scaling based on inventory scarcity or seasonal demand.
- **Advanced BI Dashboard**: Time-series analytics, booking conversion funnels, and revenue forecasting for administrators.
- **Multi-tenant Agency Support**: Upgrading the DB schema to support multiple independent trekking agencies under one SaaS platform.
- **Offline PWA Capabilities**: Allowing guides and users to access itineraries and participant manifests without cellular service on the mountain.
