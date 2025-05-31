# Push Reminder System

A microservices-based system for user management and scheduled push notifications.

![Microservices Architecture](https://via.placeholder.com/800x400?text=Microservices+Architecture)

## 🚀 Features

- **User Management Service**: Create and manage user accounts
- **Notification Service**: Automatically send notifications 24 hours after user creation
- **Scalable Architecture**: Independent microservices communicating via message queue

## 🏗️ Architecture

This project follows a microservices architecture with:

- **User Service**: Handles user CRUD operations
- **Notification Service**: Manages push notification delivery
- **PostgreSQL**: Stores user data
- **Redis**: Handles message queuing between services and realise delay

## 🛠️ Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: Redis with BullMQ
- **Containerization**: Docker & Docker Compose

## 🔧 Installation & Setup

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/push-reminder-system.git
   cd push-reminder-system
   ```

2. Configure environment variables
   ```bash
   cp .env.example .env.prod .env
   # Edit .env and .env.prod with your configuration
   ```

3. Start the services
   ```bash
   docker-compose up -d
   ```

4. The services will be available at:
   - User Service: http://localhost:3000
   - Notification Service: http://localhost:3001

## 📝 API Documentation

### User Service

#### Create a new user
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe"
}
```

#### Get user by ID
```http
GET /users/:id
```

#### Delete user
```http
DELETE /users/:id
```

### Notification Service

#### Send push notification manually
```http
POST /notifications/push
Content-Type: application/json

{
  "userId": "user-id",
  "name": "John Doe"
}
```

## 🧪 Development

For local development:

```bash
# Install dependencies
npm install

# Run migrations and create prisma client
npx prisma migrate dev

# Start user service
npm run start:dev user

# Start notification service
npm run start:dev notification
```

## 📊 Project Structure

```
push-reminder-system/
├── apps/
│   ├── notification/          # Notification microservice
│   └── user/                  # User management microservice
├── prisma/                    # Database schema and migrations
├── docker-compose.yml         # Docker services configuration
└── README.md                  # Project documentation
```

## 🔒 Environment Variables

Key environment variables needed:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `PUSH_URL`: Webhook URL for push notification simulation