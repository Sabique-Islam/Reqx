FROM gcc:latest

RUN apt-get update && apt-get install -y \
    libmicrohttpd-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN sed -i 's|#include </opt/homebrew/opt/libmicrohttpd/include/microhttpd.h>|#include <microhttpd.h>|' main.c

RUN sed -i 's|-L/opt/homebrew/opt/libmicrohttpd/lib||' Makefile

RUN sed -i '/#include <stdlib.h>/a #include <unistd.h>' main.c && \
    sed -i 's/getchar(); \/\/ wait for Enter/while(1) { sleep(1); } \/\/ run indefinitely in Docker/' main.c && \
    sed -i 's/MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, port,/MHD_start_daemon(MHD_USE_SELECT_INTERNALLY | MHD_USE_IPv6, port,/' main.c

RUN mkdir -p data && \
    make clean && \
    make

EXPOSE 8081

ENV PORT=8081
CMD ./reqx $PORT

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8081/health || exit 1
