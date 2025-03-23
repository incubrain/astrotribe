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

# Copy the server configuration
COPY apps/pg-admin/config/servers.json /pgadmin4/servers/

# Create startup script to set up password file and inject environment variables
RUN echo '#!/bin/bash\n\
# Create pgpass file with credentials from environment\n\
echo "*:*:*:${PG_USER}:${PG_PASSWORD}" > /var/lib/pgadmin/pgpassfile\n\
chmod 600 /var/lib/pgadmin/pgpassfile\n\
chown pgadmin:root /var/lib/pgadmin/pgpassfile\n\
\n\
# Replace placeholders in servers.json\n\
sed -i "s/\${PG_HOST}/$PG_HOST/g" /pgadmin4/servers/servers.json\n\
sed -i "s/\${PG_USER}/$PG_USER/g" /pgadmin4/servers/servers.json\n\
\n\
# Start pgAdmin\n\
exec python /pgadmin4/web/pgAdmin4.py\n\
' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Configure permissions
RUN chown -R pgadmin:root /var/lib/pgadmin
RUN chown -R pgadmin:root /pgadmin4/servers

# Switch back to pgadmin user
USER pgadmin

# Expose the web interface port
EXPOSE 80

# Use the custom entrypoint script
CMD ["/entrypoint.sh"]