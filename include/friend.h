#ifndef FRIEND_H
#define FRIEND_H

#include "../cjson/cJSON.h"

#define DATA_FILE "./data/friends.json"

typedef struct {
    char *name;
    char *email;
    int age;
    char *description;
} Friend;

cJSON *load_friends_json(void);

int save_friends_json(cJSON *friends_arr);

int add_friend(const Friend *f);
int delete_friend(const char *email);
int update_friend(const Friend *f);
Friend *get_friend(const char *email);

Friend *friend_from_json(cJSON *item);
cJSON *json_from_friend(const Friend *f);

void free_friend_members(Friend *f);

void free_friend(Friend *f);

#endif