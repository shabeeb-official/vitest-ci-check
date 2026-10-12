# 202510101232: Product

- Luvalot Women's Pixie Maxi Dress is Black

Summary Table query: select sku_id, product_id, product_name, image_url_1 from dev_platform_catalog_summary where sku_id='2038210701118-01';

### Result:

sku_id        : 2038210701118-01        
product_id    : 20382107                       
product_name  :  Luvalot Women's Pixie Maxi Dress in Black                
image_url_1   : https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/dw20250911/images/20382107/20382107-01-FT-XL.jpg 


Catalog Table query: select sku_id, product_id, title, image_url_1, image_urls from dev_platform_catalog where sku_id='2038210701118-01';

sku_id        : 2038210701118-01
product_id    : 20382107
title         : Luvalot Women's Pixie Maxi Dress in Black 
image_url_1   : https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/dw20250911/images/20382107/20382107-01-FT-XL.jpg 
image_urls    :
https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/images/20382107/20382107-01-LT-XL.jpg,
https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/images/20382107/20382107-01-RT-XL.jpg,
https://www.citybeach.com/on/demandware.static/-/Sites-fewstoneMaster/default/images/20382107/20382107-01-FT-XL.jpg 



### Finding

- checked the database and found that some of the links are not valid. 
- The image URI for the PLP(summary table) is pointing to not found, that is why the image is not showing up in PLP.
- For the PDP(catalog table) some of the URI is not found.


### BackLinks:
- [Index](./index.md)
