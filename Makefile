CC = gcc
CFLAGS = -Wall
LDFLAGS = -L/opt/homebrew/opt/libmicrohttpd/lib -lmicrohttpd

all: reqx

reqx: main.o src/friend.o cjson/cJSON.o
	$(CC) -o reqx main.o src/friend.o cjson/cJSON.o $(LDFLAGS)

main.o: main.c include/friend.h
	$(CC) $(CFLAGS) -c main.c

src/friend.o: src/friend.c include/friend.h cjson/cJSON.h
	$(CC) $(CFLAGS) -c src/friend.c -o src/friend.o

cjson/cJSON.o: cjson/cJSON.c cjson/cJSON.h
	$(CC) $(CFLAGS) -c cjson/cJSON.c -o cjson/cJSON.o

clean:
	rm -f *.o src/*.o cjson/*.o reqx

.PHONY: all clean
