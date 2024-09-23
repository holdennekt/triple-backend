## Description

Simple user/post application divided into 3 microservices:
- proxy
- read
- write

### Technologies/technics used:
- **Nest.js** as a framework for each microservice
- **RabbitMq** for massages and events delivery 
- **Redis** for request/responce caching
- **Typeorm** backed with **Postgres**
- **ws** for websocket communication
- **JWT**-based auth
- **Rate Limiting**
- **docker** and **docker-compose** for containerization
- **Swagger** for documenting api endpoints

## Run the project
```bash
docker compose up
```
