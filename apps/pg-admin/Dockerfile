FROM dpage/pgadmin4:latest

# Set environment variables
ENV PGADMIN_DEFAULT_EMAIL=admin@astronera.com
ENV PGADMIN_DEFAULT_PASSWORD=admin_password
ENV PGADMIN_CONFIG_SERVER_MODE=False
ENV PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False

# Create required directories
USER root
RUN mkdir -p /var/lib/pgadmin/storage
RUN chown -R pgadmin:root /var/lib/pgadmin

# Switch back to pgadmin user
USER pgadmin

# Expose the web interface port
EXPOSE 80

# Start pgAdmin
CMD ["python", "/pgadmin4/web/pgAdmin4.py"] 