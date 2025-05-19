FROM gcc:latest

RUN apt-get update && apt-get install -y \
    libmicrohttpd-dev \
    curl \
    net-tools \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN sed -i 's|#include </opt/homebrew/opt/libmicrohttpd/include/microhttpd.h>|#include <microhttpd.h>|' main.c

RUN sed -i 's|-L/opt/homebrew/opt/libmicrohttpd/lib||' Makefile

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

RUN mkdir -p data && \
    make clean && \
    make

EXPOSE 8081

ENV PORT=8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://0.0.0.0:$PORT/health || exit 1

CMD ["/app/start.sh"]
