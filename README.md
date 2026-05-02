# Campus Notification Platform

A microservice-based campus notification system that delivers real-time updates for Placements, Events, and Results.

## Structure

- `logging_middleware/` — Reusable logging package that sends structured logs to the evaluation server
- `notification_system_design.md` — System design and algorithm documentation
- `notification_app_fe/` — React frontend application (runs on localhost:3000)
- `notification_app_be/` — Backend service

## Getting Started

### Frontend

```bash
cd notification_app_fe
npm install
npm run dev
```

App runs at `http://localhost:3000`
