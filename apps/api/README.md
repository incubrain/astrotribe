# Astronera API

A NestJS-based API service with role-based permissions, authentication, and content management capabilities.

## Quick Links

- API Base URL: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000/docs
- Database Admin: http://localhost:54321 (Supabase)

## Prerequisites

- Node.js (v20.x recommended)
- PostgreSQL (via Supabase)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

## Environment Setup

The application uses various environment variables for configuration. Key configurations include:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=your_user
DB_PASSWORD=your_password

# API Configuration
PORT=3000
API_PREFIX=/api
SWAGGER_PATH=/api

# Supabase Configuration
SUPABASE_URL="http://localhost:54321"
SUPABASE_SERVICE_KEY="your_service_key"
SUPABASE_ANON_KEY="your_anon_key"

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Project Structure

```
src/
├── core/                   # Core functionality and shared modules
│   ├── config/            # Application configuration
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Authentication and permission guards
│   ├── middleware/        # HTTP middleware
│   ├── modules/           # Core feature modules
│   ├── services/          # Shared services
│   └── types/             # TypeScript type definitions
├── content/               # Content management module
└── main.ts               # Application entry point
```

## Core Modules

### Permission Module
- Handles role-based access control (RBAC)
- Manages user permissions and authorization
- Files:
  - `permission.module.ts`: Module configuration
  - `permission.service.ts`: Permission logic
  - `permission.guard.ts`: Route protection
  - `permission.decorator.ts`: Custom decorators for routes

### Domain Module
- Manages domain-specific configuration
- Handles middleware and guard setup
- Provides logging capabilities
- Files:
  - `domain-config.ts`: Domain configuration
  - `auth.middleware.ts`: Authentication middleware

### Content Module
- Manages various content types (news, articles, research)
- Handles content categorization and tagging
- Provides content search and filtering

## Key Features

- Role-based access control
- JWT Authentication via Supabase
- Content management system
- API documentation with Swagger
- Database integration with Prisma
- Custom logging system
- CORS configuration
- Environment-based configuration
- Docker containerization

## File Types

- `.ts`: TypeScript source files
- `.env`: Environment configuration
- `.json`: Configuration files (package.json, tsconfig.json)
- `.md`: Documentation files
- `.prisma`: Database schema definition
- `Dockerfile`: Container configuration
- `docker-compose.yml`: Multi-container Docker configuration

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

2. Stop the containers:
   ```bash
   docker-compose down
   ```

3. View logs:
   ```bash
   docker-compose logs -f api
   ```

4. Access the services:
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/docs
   - Supabase: http://localhost:54321
   - PostgreSQL: localhost:5432

### Docker Commands

```bash
# Build the API image
docker build -t astronera-api .

# Manually update prisma from api dir
dotenv -e ../../.env -- npx prisma db pull
dotenv -e ../../.env -- npx prisma generate

# View container logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Remove all containers and volumes
docker-compose down -v
```

## API Documentation

The API documentation is available through Swagger UI at http://localhost:3000/docs. This provides:
- Detailed endpoint documentation
- Request/response schemas
- Testing interface
- Authentication information

## Development Tools

- **NestJS**: Main framework
- **Prisma**: Database ORM
- **Supabase**: Authentication and database
- **Swagger**: API documentation
- **TypeScript**: Programming language
- **ESLint/Prettier**: Code formatting and linting
- **Docker**: Containerization
- **Docker Compose**: Container orchestration

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[MIT License](LICENSE) 