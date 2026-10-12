# 202509301507: Authentication

- The app needs to be authenticated in PROD to enforce security feature
- Idea is to create a cloud run function that will create a JWT and return it.
- the [loader](./202509301306-loader.md) will handle the authentication and pass
  it into the embedded app
- embedded app will  use send this token to for requests to [PLP & PDP](./202509301105-backend-architecture.md)
- [loader](./202509301306-loader.md) will handle the refreshing of token

### Backlinks:

- [Index](./index.md) 
