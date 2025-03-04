# Campus Connect

Campus Connect is a robust campus event platform designed to streamline event scheduling, club memberships, and real-time notifications—enhancing student engagement and campus life.

## Features

- **Centralized Event & Club Management:** View, register, and manage campus events and club activities in one place.
- **User Account Management:** Secure registration, login, and profile management with JWT-based authentication.
- **Real-Time Notifications:** Receive timely updates and announcements via an event-driven architecture.
- **Admin Tools:** Manage users, events, and clubs with dedicated administrative endpoints.
- **Responsive Interface:** Enjoy a dynamic user experience with a modern ReactJS frontend.

## Architecture Overview

- **Backend Microservices:**  
  - **User Service:** Manages user accounts and authentication.
  - **Event Service:** Handles event creation and registration.
  - **Club Service:** Manages clubs and memberships.
  - **Notification Service:** Delivers real-time notifications.
- **API Gateway:** Centralizes API routing.
- **NGINX Reverse Proxy:** Routes incoming requests to the appropriate service.
- **Databases & Infrastructure:** PostgreSQL, MongoDB, Redis, Apache Kafka.
- **CI/CD:** Automated build, test, and deployment using Docker and GitHub Actions.

## Technologies

Microservices, Node.js, TypeScript, Prisma, Docker, NGINX, Kafka, Redis, PostgreSQL, MongoDB, GitHub Actions, Multithreading, ReactJS.

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect
