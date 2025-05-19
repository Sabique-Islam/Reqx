#include "../include/friend.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static cJSON *ensure_array(cJSON *arr) {
    if (!arr) return cJSON_CreateArray();
    if (!cJSON_IsArray(arr)) {
        cJSON_Delete(arr);
        return cJSON_CreateArray();
    }
    return arr;
}

cJSON *load_friends_json(void) {
    FILE *fp = fopen(DATA_FILE, "r");
    if (!fp) return NULL;
    fseek(fp, 0, SEEK_END);
    long len = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *data = malloc(len + 1);
    fread(data, 1, len, fp);
    data[len] = '\0';
    fclose(fp);

    cJSON *root = cJSON_Parse(data);
    free(data);
    if (!root) return NULL;
    return ensure_array(root);
}

int save_friends_json(cJSON *friends_arr) {
    char *text = cJSON_Print(friends_arr);
    if (!text) return -1;
    FILE *fp = fopen(DATA_FILE, "w");
    if (!fp) { free(text); return -1; }
    fprintf(fp, "%s", text);
    fclose(fp);
    free(text);
    return 0;
}

Friend *friend_from_json(cJSON *item) {
    if (!cJSON_IsObject(item)) return NULL;

    Friend *f = malloc(sizeof(Friend));
    if (!f) return NULL;

    f->name = NULL;
    f->email = NULL;
    f->age = 0;
    f->description = NULL;

    cJSON *j;

    j = cJSON_GetObjectItem(item, "name");
    if (j && cJSON_IsString(j)) {
        const char *str = cJSON_GetStringValue(j);
        f->name = str ? strdup(str) : strdup("");
    } else {
        f->name = strdup("");
    }

    j = cJSON_GetObjectItem(item, "email");
    if (j && cJSON_IsString(j)) {
        const char *str = cJSON_GetStringValue(j);
        f->email = str ? strdup(str) : strdup("");
    } else {
        f->email = strdup("");
    }

    j = cJSON_GetObjectItem(item, "age");
    if (j && cJSON_IsNumber(j)) {
        f->age = j->valueint;
    }

    j = cJSON_GetObjectItem(item, "description");
    if (j && cJSON_IsString(j)) {
        const char *str = cJSON_GetStringValue(j);
        f->description = str ? strdup(str) : strdup("");
    } else {
        f->description = strdup("");
    }

    return f;
}

cJSON *json_from_friend(const Friend *f) {
    if (!f) return NULL;

    cJSON *obj = cJSON_CreateObject();
    if (!obj) return NULL;

    cJSON_AddStringToObject(obj, "name", f->name ? f->name : "");
    cJSON_AddStringToObject(obj, "email", f->email ? f->email : "");
    cJSON_AddNumberToObject(obj, "age", f->age);
    cJSON_AddStringToObject(obj, "description", f->description ? f->description : "");

    return obj;
}

void free_friend_members(Friend *f) {
    if (!f) return;
    if (f->name) free(f->name);
    if (f->email) free(f->email);
    if (f->description) free(f->description);
}

void free_friend(Friend *f) {
    if (!f) return;
    free_friend_members(f);
    free(f);
}

int add_friend(const Friend *f) {
    if (!f || !f->email) return -1;

    cJSON *arr = load_friends_json();
    arr = ensure_array(arr);

    cJSON *it;
    cJSON_ArrayForEach(it, arr) {
        cJSON *e = cJSON_GetObjectItem(it, "email");
        if (e && cJSON_IsString(e) && f->email &&
            strcmp(cJSON_GetStringValue(e), f->email) == 0) {
            cJSON_Delete(arr);
            return -1;
        }
    }

    cJSON *friend_json = json_from_friend(f);
    if (!friend_json) {
        cJSON_Delete(arr);
        return -1;
    }

    cJSON_AddItemToArray(arr, friend_json);
    int res = save_friends_json(arr);
    cJSON_Delete(arr);
    return res;
}

int delete_friend(const char *email) {
    if (!email) return -1;

    cJSON *arr = load_friends_json();
    if (!arr) return -1;

    int len = cJSON_GetArraySize(arr);
    for (int i = 0; i < len; ++i) {
        cJSON *item = cJSON_GetArrayItem(arr, i);
        if (!item) continue;

        cJSON *e = cJSON_GetObjectItem(item, "email");
        if (e && cJSON_IsString(e) &&
            strcmp(cJSON_GetStringValue(e), email) == 0) {
            cJSON_DetachItemFromArray(arr, i);
            int res = save_friends_json(arr);
            cJSON_Delete(arr);
            return res;
        }
    }

    cJSON_Delete(arr);
    return -1;
}

int update_friend(const Friend *f) {
    if (!f || !f->email) return -1;

    cJSON *arr = load_friends_json();
    if (!arr) return -1;

    cJSON *new_friend = cJSON_CreateObject();
    if (!new_friend) {
        cJSON_Delete(arr);
        return -1;
    }

    cJSON_AddStringToObject(new_friend, "name", f->name ? f->name : "");
    cJSON_AddStringToObject(new_friend, "email", f->email ? f->email : "");
    cJSON_AddNumberToObject(new_friend, "age", f->age);
    cJSON_AddStringToObject(new_friend, "description", f->description ? f->description : "");

    int found = 0;
    int len = cJSON_GetArraySize(arr);
    for (int i = 0; i < len; ++i) {
        cJSON *item = cJSON_GetArrayItem(arr, i);
        if (!item) continue;

        cJSON *e = cJSON_GetObjectItem(item, "email");
        if (e && cJSON_IsString(e) &&
            strcmp(cJSON_GetStringValue(e), f->email) == 0) {
            cJSON_DeleteItemFromArray(arr, i);
            cJSON_InsertItemInArray(arr, i, new_friend);
            found = 1;
            break;
        }
    }

    if (!found) {
        cJSON_AddItemToArray(arr, new_friend);
    }

    int res = save_friends_json(arr);
    cJSON_Delete(arr);
    return res;
}

Friend *get_friend(const char *email) {
    if (!email) return NULL;

    cJSON *arr = load_friends_json();
    if (!arr) return NULL;

    cJSON *it;
    cJSON_ArrayForEach(it, arr) {
        cJSON *e = cJSON_GetObjectItem(it, "email");
        if (e && cJSON_IsString(e) &&
            strcmp(cJSON_GetStringValue(e), email) == 0) {
            Friend *f = friend_from_json(it);
            cJSON_Delete(arr);
            return f;
        }
    }
    cJSON_Delete(arr);
    return NULL;
}