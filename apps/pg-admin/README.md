# pgAdmin Service

This service provides a web-based PostgreSQL admin interface for managing the Astronera database.

## Local Development

To run locally using Docker Compose:

```bash
docker-compose -f docker-compose.website.yaml up website-pgadmin
```

Access the interface at: http://localhost:5050

Default credentials:

- Email: admin@astronera.com
- Password: admin_password

## Railway Deployment

This service is configured for deployment on Railway.app. The deployment is handled through the
`railway.json` configuration file.

### Environment Variables

The following environment variables should be set in Railway:

- `PGADMIN_DEFAULT_EMAIL`: Admin email for pgAdmin (default: admin@astronera.com)
- `PGADMIN_DEFAULT_PASSWORD`: Admin password for pgAdmin
- `PGADMIN_CONFIG_SERVER_MODE`: Set to False for single-user mode
- `PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED`: Set to False to disable master password requirement

### Connecting to PostgreSQL

To connect to the PostgreSQL database:

1. Log in to pgAdmin
2. Right-click on "Servers" and select "Create" -> "Server"
3. In the General tab, give your connection a name
4. In the Connection tab, enter:
   - Host: [PostgreSQL service hostname]
   - Port: 5432
   - Database: astronera
   - Username: postgres
   - Password: [PostgreSQL password]

## Security Notes

- In production, always use strong passwords
- Consider enabling SSL for database connections
- Regularly update the pgAdmin image for security patches
