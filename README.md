# Reqx

A REST API built in `C` using `libmicrohttpd` and `cJSON`.


## API Reference →

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/friends` | GET | Retrieve all persons |
| `/friend` | POST | Create a new person |
| `/friend?id=email` | GET | Retrieve a specific person |
| `/friend` | PUT | Update an existing person |
| `/friend?id=email` | DELETE | Delete a person |

## Usage →

### Get All Friends
```bash
curl http://localhost:8081/friends
```

### Add a Friend
```bash
curl -X POST http://localhost:8081/friend \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gandalf",
    "email": "gandalfthegrey@gmail.com",
    "age": 2000,
    "description": "A wise wizard"
  }'
```

### Get a Specific Friend
```bash
curl "http://localhost:8081/friend?id=gandalfthegrey@gmail.com"
```

### Update a Friend
```bash
curl -X PUT http://localhost:8081/friend \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gandalf",
    "email": "gandalfthegrey@gmail.com",
    "age": 2019,
    "description": "The White Wizard"
  }'
```

### Delete a Friend
```bash
curl -X DELETE "http://localhost:8081/friend?id=gandalfthegrey@gmail.com"
```

### Health Check
```bash
curl http://localhost:8081/health
```

## Data Structure →

| Field | Type | Description |
|-------|------|-------------|
| name | string | Name of Person |
| email | string | Email of Person (`used as unique identifier`) |
| age | integer | Age of Person |
| description | string | Additional Information about the Person |

## References →
- [libmicrohttpd](https://www.gnu.org/software/libmicrohttpd/manual/libmicrohttpd.html#microhttpd_002dintro)
- [cJSON](https://github.com/DaveGamble/cJSON)
