FROM postgres:16

# Copy custom PostgreSQL configuration
COPY ./apps/pg-service/config/postgresql.conf /etc/postgresql/postgresql.conf
COPY ./apps/pg-service/config/pg_hba.conf /etc/postgresql/pg_hba.conf

# Copy initialization scripts
COPY ./apps/pg-service/init/ /docker-entrypoint-initdb.d/

# Make sure the script is executable
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# Command to start PostgreSQL with custom config
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

# Create directory for backups
RUN mkdir -p /var/lib/postgresql/backups