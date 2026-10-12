# 202510011518: Product

### Overview 

The PDP page is used to display the details of a single page, the `group_id` is
taken from the URL parameter and passed into the **Cloud Run Function** and this
function returns a list of products instead of single product, Each of the
product in the returned list have a unique `sku_id` this is how each unique
product is identified. It is the responsibility of the frontend to manipulate
this data and only show a single product from the list, this can be done by
utilizing the `sku_id` from the query parameter. 

There are two issues that will arise from this approach they are:
	1. Color: See [Color](./202510011528-colors-pdp.md) for more details.
	2. Size: See [Size](/projects/citybeach/202510011536-size-pdp.md) for more details 

### Backlinks:
- [Index](./index.md)







