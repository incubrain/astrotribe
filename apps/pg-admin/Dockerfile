FROM dpage/pgadmin4:latest

# Set environment variables
ENV PGADMIN_DEFAULT_EMAIL=admin@astronera.com
ENV PGADMIN_DEFAULT_PASSWORD=admin_password
ENV PGADMIN_CONFIG_SERVER_MODE=False
ENV PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False

# Create required directories
USER root
RUN mkdir -p /var/lib/pgadmin/storage
RUN mkdir -p /pgadmin4/servers

# Create a directory for scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Create the entrypoint script in a separate file for better reliability
RUN echo '#!/bin/bash' > /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo '# Create pgpass file with credentials from environment' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'echo "*:*:*:${PG_USER}:${PG_PASSWORD}" > /var/lib/pgadmin/pgpassfile' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'chmod 600 /var/lib/pgadmin/pgpassfile' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'chown pgadmin:root /var/lib/pgadmin/pgpassfile' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo '' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo '# Replace placeholders in servers.json' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'sed -i "s/\${PG_HOST}/$PG_HOST/g" /pgadmin4/servers/servers.json' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'sed -i "s/\${PG_USER}/$PG_USER/g" /pgadmin4/servers/servers.json' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo '' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo '# Start pgAdmin' >> /docker-entrypoint-initdb.d/entrypoint.sh && \
    echo 'exec python /pgadmin4/web/pgAdmin4.py' >> /docker-entrypoint-initdb.d/entrypoint.sh

# Make sure the script is executable by all users
RUN chmod +x /docker-entrypoint-initdb.d/entrypoint.sh

# Create a wrapper script that will be called by the CMD
RUN echo '#!/bin/bash' > /entrypoint-wrapper.sh && \
    echo 'bash /docker-entrypoint-initdb.d/entrypoint.sh' >> /entrypoint-wrapper.sh && \
    chmod +x /entrypoint-wrapper.sh

# Create placeholder servers.json file that will be modified at runtime
RUN echo '{"Servers": {"1": {"Name": "AstronEra Content DB", "Group": "Railway", "Host": "${PG_HOST}", "Port": 5432, "MaintenanceDB": "astronera", "Username": "${PG_USER}", "SSLMode": "prefer", "PassFile": "/var/lib/pgadmin/pgpassfile"}}}' > /pgadmin4/servers/servers.json

# Configure permissions
RUN chown -R pgadmin:root /var/lib/pgadmin
RUN chown -R pgadmin:root /pgadmin4/servers
RUN chown -R pgadmin:root /docker-entrypoint-initdb.d
RUN chown pgadmin:root /entrypoint-wrapper.sh

# Switch back to pgadmin user
USER pgadmin

# Expose the web interface port
EXPOSE 80

# Use the wrapper script
CMD ["/entrypoint-wrapper.sh"]