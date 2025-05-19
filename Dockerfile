FROM gcc:latest

# Install libmicrohttpd and debugging tools
RUN apt-get update && apt-get install -y \
    libmicrohttpd-dev \
    curl \
    net-tools \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Fix include paths for Linux environment
RUN sed -i 's|#include </opt/homebrew/opt/libmicrohttpd/include/microhttpd.h>|#include <microhttpd.h>|' main.c

# Remove macOS-specific library path
RUN sed -i 's|-L/opt/homebrew/opt/libmicrohttpd/lib||' Makefile

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting server..."\n\
echo "Current directory: $(pwd)"\n\
echo "Files in current directory:"\n\
ls -la\n\
echo "Network interfaces:"\n\
ip addr\n\
echo "Running server on port $PORT"\n\
./reqx\n' > /app/start.sh && \
    chmod +x /app/start.sh

# Create data directory and build the application
RUN mkdir -p data && \
    make clean && \
    make

# Expose the port the app runs on
EXPOSE 8081

# Set environment variable
ENV PORT=8081

# Add healthcheck with longer initial wait time
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://0.0.0.0:$PORT/health || exit 1

# Run the application using the startup script
CMD ["/app/start.sh"]
