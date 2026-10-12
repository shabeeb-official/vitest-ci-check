# 202510140955: Production


For Adding to cart use the following URI:
	- Method: POST
	- URI: https://www.citybeach.com/on/demandware.store/Sites-CityBeachAustralia-Site/en_AU/Cart-AddProduct
	- Payload:
		1. pid: sku_id of the selected product
		2. quantity: number of items to add to cart
		3. options: []


For Adding to wishlist use the following URI:
	- Method: POST
	- URI: https://www.citybeach.com/on/demandware.store/Sites-CityBeachAustralia-Site/en_AU/Wishlist-AddProduct
	- Payload:
		1. pid: sku_id of the selected product
		2. page: can be either
			* pdp
			* plp

For Removing from wishlist use the following URI:
	- Method: GET
	- URI: https://www.citybeach.com/on/demandware.store/Sites-CityBeachAustralia-Site/en_AU/Wishlist-RemoveProduct?pid=<sku_id>&page=<page-name>
	- Query Parameters:
		1. pid: sku_id of the selected product
		2. page: can be either 
			* pdp
			* plp
	
### Backlinks:
- [Index](./index.md)
