# 202509301105: Backend

The backend is build on **Node.js** and hosted on **Google Cloud Run**.
It currently includes two Cloud Run functions:

## Product List Page (PLP)

- Accepts queries from frontend and forwards then to **Langflow**, which returns
  an array of `sku_ids`.
- For each `sku_id`:
	- Check if the product exists in **Redis** cache.
	- If found, retrieve from Redis.
	- If not found, fetch from **Postgres**, cache it in Redis, then return it.

## Product Display Page(PDP)

- Accepts a `group_id` from the frontend.
- Check if products with this `group_id` exists in **Redis**
	- If found, retrieve from Redis, then return.
	- If not found, fetch from **Postgres**, cache it in Redis, then return.


### Backlinks:
- [Index](./index.md)
- [Authentication](./202509301507-authentication.md)
- [Frontend Architecture](/projects/citybeach/202509301105-frontend-architecture.md)
