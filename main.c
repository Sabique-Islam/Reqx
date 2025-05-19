#include </opt/homebrew/opt/libmicrohttpd/include/microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "include/friend.h"

#define PORT 8080
#define POSTBUFFERSIZE 512
#define MAX_RESPONSE 4096

static int DUMMY_POINTER;

struct PostRequestData {
    char *data;
    size_t size;
    int processed;
};

static enum MHD_Result send_json(struct MHD_Connection *conn, const char *json, int code) {
    struct MHD_Response *response = MHD_create_response_from_buffer(strlen(json), (void*)json, MHD_RESPMEM_MUST_COPY);
    MHD_add_response_header(response, "Content-Type", "application/json");
    enum MHD_Result ret = MHD_queue_response(conn, code, response);
    MHD_destroy_response(response);
    return ret;
}

static void free_post_data(void *cls, struct MHD_Connection *connection,
                          void **con_cls, enum MHD_RequestTerminationCode toe) {
    if (!con_cls || !*con_cls) return;

    if (*con_cls != &DUMMY_POINTER) {
        struct PostRequestData *post_data = *con_cls;
        if (post_data) {
            if (post_data->data) free(post_data->data);
            free(post_data);
            *con_cls = NULL;
        }
    }
}

static enum MHD_Result answer(void *cls, struct MHD_Connection *conn,
                  const char *url, const char *method,
                  const char *version, const char *upload_data,
                  size_t *upload_data_size, void **con_cls) {

    if (0 != strcmp(method, "GET") && 0 != strcmp(method, "POST")
        && 0 != strcmp(method, "PUT") && 0 != strcmp(method, "DELETE"))
        return MHD_NO;

    if (*con_cls == NULL) {
        if (0 == strcmp(method, "POST") || 0 == strcmp(method, "PUT")) {
            struct PostRequestData *post_data = malloc(sizeof(struct PostRequestData));
            if (!post_data) return MHD_NO;
            post_data->data = NULL;
            post_data->size = 0;
            post_data->processed = 0;
            *con_cls = post_data;
            return MHD_YES;
        } else {
            *con_cls = &DUMMY_POINTER;
            return MHD_YES;
        }
    }

    if (0 == strcmp(method, "GET") && 0 == strcmp(url, "/friends")) {
        cJSON *arr = load_friends_json();
        char *resp = arr ? cJSON_Print(arr) : strdup("[]");
        int ret = send_json(conn, resp, MHD_HTTP_OK);
        free(resp);
        cJSON_Delete(arr);
        return ret;
    }
    if (0 == strcmp(method, "GET") && 0 == strcmp(url, "/friend")) {
        const char *id = MHD_lookup_connection_value(conn, MHD_GET_ARGUMENT_KIND, "id");
        if (!id) return send_json(conn, "{\"error\": \"Missing id\"}", MHD_HTTP_BAD_REQUEST);

        cJSON *arr = load_friends_json();
        if (!arr) return send_json(conn, "{\"error\": \"Internal error\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);

        cJSON *found = NULL;
        cJSON *item;
        cJSON_ArrayForEach(item, arr) {
            cJSON *email = cJSON_GetObjectItem(item, "email");
            if (email && cJSON_IsString(email) && strcmp(cJSON_GetStringValue(email), id) == 0) {
                found = item;
                break;
            }
        }

        if (!found) {
            cJSON_Delete(arr);
            return send_json(conn, "{\"error\": \"Not found\"}", MHD_HTTP_NOT_FOUND);
        }

        char *resp = cJSON_Print(found);
        int ret = send_json(conn, resp, MHD_HTTP_OK);
        free(resp);
        cJSON_Delete(arr);
        return ret;
    }

    if ((0 == strcmp(method, "POST") || 0 == strcmp(method, "PUT"))
        && 0 == strcmp(url, "/friend")) {
        struct PostRequestData *post_data = *con_cls;

        if (*upload_data_size != 0) {
         
            char *new_data = realloc(post_data->data, post_data->size + *upload_data_size + 1);
            if (!new_data) return MHD_NO;

            post_data->data = new_data;
            memcpy(post_data->data + post_data->size, upload_data, *upload_data_size);
            post_data->size += *upload_data_size;
            post_data->data[post_data->size] = '\0';

            *upload_data_size = 0;
            return MHD_YES;
        }

        if (post_data->processed) {
            return MHD_YES;
        }
        post_data->processed = 1;

        if (post_data->data && post_data->size > 0) {
            cJSON *req = cJSON_Parse(post_data->data);
            if (!req) {
                return send_json(conn, "{\"error\": \"Invalid JSON\"}", MHD_HTTP_BAD_REQUEST);
            }

            if (!cJSON_GetObjectItem(req, "name") || !cJSON_IsString(cJSON_GetObjectItem(req, "name")) ||
                !cJSON_GetObjectItem(req, "email") || !cJSON_IsString(cJSON_GetObjectItem(req, "email")) ||
                !cJSON_GetObjectItem(req, "age") || !cJSON_IsNumber(cJSON_GetObjectItem(req, "age")) ||
                !cJSON_GetObjectItem(req, "description") || !cJSON_IsString(cJSON_GetObjectItem(req, "description"))) {
                cJSON_Delete(req);
                return send_json(conn, "{\"error\": \"Missing or invalid fields\"}", MHD_HTTP_BAD_REQUEST);
            }

            const char *name = cJSON_GetStringValue(cJSON_GetObjectItem(req, "name"));
            const char *email = cJSON_GetStringValue(cJSON_GetObjectItem(req, "email"));
            int age = cJSON_GetObjectItem(req, "age")->valueint;
            const char *description = cJSON_GetStringValue(cJSON_GetObjectItem(req, "description"));

            cJSON *arr = load_friends_json();
            if (!arr) {
                arr = cJSON_CreateArray();
                if (!arr) {
                    cJSON_Delete(req);
                    return send_json(conn, "{\"error\": \"Internal error\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);
                }
            }

            if (0 == strcmp(method, "POST")) {
                cJSON *it;
                int duplicate = 0;
                cJSON_ArrayForEach(it, arr) {
                    cJSON *e = cJSON_GetObjectItem(it, "email");
                    if (e && cJSON_IsString(e) &&
                        strcmp(cJSON_GetStringValue(e), email) == 0) {
                        duplicate = 1;
                        break;
                    }
                }

                if (duplicate) {
                    cJSON_Delete(req);
                    cJSON_Delete(arr);
                    return send_json(conn, "{\"error\": \"Email already exists\"}", MHD_HTTP_CONFLICT);
                }
            }

            cJSON *new_friend = cJSON_CreateObject();
            if (!new_friend) {
                cJSON_Delete(req);
                cJSON_Delete(arr);
                return send_json(conn, "{\"error\": \"Internal error\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);
            }

            cJSON_AddStringToObject(new_friend, "name", name ? name : "");
            cJSON_AddStringToObject(new_friend, "email", email ? email : "");
            cJSON_AddNumberToObject(new_friend, "age", age);
            cJSON_AddStringToObject(new_friend, "description", description ? description : "");

            if (0 == strcmp(method, "PUT")) {
                int found = 0;
                int len = cJSON_GetArraySize(arr);
                for (int i = 0; i < len; ++i) {
                    cJSON *item = cJSON_GetArrayItem(arr, i);
                    if (!item) continue;

                    cJSON *e = cJSON_GetObjectItem(item, "email");
                    if (e && cJSON_IsString(e) &&
                        strcmp(cJSON_GetStringValue(e), email) == 0) {
                        cJSON_DeleteItemFromArray(arr, i);
                        cJSON_InsertItemInArray(arr, i, new_friend);
                        found = 1;
                        break;
                    }
                }

                if (!found) {
                    cJSON_AddItemToArray(arr, new_friend);
                }
            } else {
                cJSON_AddItemToArray(arr, new_friend);
            }

            int res = save_friends_json(arr);

            cJSON_Delete(req);
            cJSON_Delete(arr);

            if (res == 0) {
                return send_json(conn, "{\"status\": \"success\"}", MHD_HTTP_OK);
            } else {
                return send_json(conn, "{\"error\": \"Operation failed\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        return send_json(conn, "{\"error\": \"No data received\"}", MHD_HTTP_BAD_REQUEST);
    }
    if (0 == strcmp(method, "DELETE") && 0 == strcmp(url, "/friend")) {
        const char *id = MHD_lookup_connection_value(conn, MHD_GET_ARGUMENT_KIND, "id");
        if (!id) return send_json(conn, "{\"error\": \"Missing id\"}", MHD_HTTP_BAD_REQUEST);

        cJSON *arr = load_friends_json();
        if (!arr) return send_json(conn, "{\"error\": \"Internal error\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);

        int found = 0;
        int len = cJSON_GetArraySize(arr);
        for (int i = 0; i < len; ++i) {
            cJSON *item = cJSON_GetArrayItem(arr, i);
            if (!item) continue;

            cJSON *e = cJSON_GetObjectItem(item, "email");
            if (e && cJSON_IsString(e) &&
                strcmp(cJSON_GetStringValue(e), id) == 0) {
                cJSON_DeleteItemFromArray(arr, i);
                found = 1;
                break;
            }
        }

        if (!found) {
            cJSON_Delete(arr);
            return send_json(conn, "{\"error\": \"Not found\"}", MHD_HTTP_NOT_FOUND);
        }

        int res = save_friends_json(arr);
        cJSON_Delete(arr);

        if (res == 0) {
            return send_json(conn, "{\"status\": \"success\"}", MHD_HTTP_OK);
        } else {
            return send_json(conn, "{\"error\": \"Failed to save changes\"}", MHD_HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    return send_json(conn, "{\"error\": \"Not supported\"}", MHD_HTTP_BAD_REQUEST);
}

int main(int argc, char *argv[]) {
    int port = PORT;

    char *env_port = getenv("PORT");
    if (env_port) {
        port = atoi(env_port);
    }

    struct MHD_Daemon *daemon;

    FILE *fp = fopen(DATA_FILE, "a+");
    if (fp) {
        fclose(fp);
    } else {
        #ifdef _WIN32
        system("mkdir data");
        #else
        system("mkdir -p data");
        #endif

        fp = fopen(DATA_FILE, "a+");
        if (fp) {
            fprintf(fp, "[]");
            fclose(fp);
        } else {
            fprintf(stderr, "Error: Could not create data file %s\n", DATA_FILE);
            return 1;
        }
    }

    daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, port, NULL, NULL,
                              &answer, NULL,
                              MHD_OPTION_NOTIFY_COMPLETED, &free_post_data, NULL,
                              MHD_OPTION_END);
    if (!daemon) {
        fprintf(stderr, "Error: Could not start server on port %d\n", port);
        return 1;
    }

    printf("Listening on port %d...\n", port);
    
    while (1) {
        sleep(1);
    }

    MHD_stop_daemon(daemon);
    return 0;
}