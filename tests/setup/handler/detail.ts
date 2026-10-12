import { http, HttpResponse } from "msw";

import { getDefaultTestEnv } from "../env";

const detailsUri = getDefaultTestEnv().VITE_DETAILS_URI;

export const detailsHandlers = [
  http.get(detailsUri, ({ request }) => {
    const url = new URL(request.url);

    const itemGroupId = url.searchParams.get("item_group_id");
    const country = url.searchParams.get("country");

    if (!itemGroupId) {
      return HttpResponse.json(
        {
          error: "missing query params",
          missing: ["item_group_id"],
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      data: {
        results: [
          {
            item_group_id: itemGroupId,
            product_id: "SKU-001",
            name: "Test Product",
            Brand: "Test Brand",
            description: "Test product description",

            imageUrl: "https://example.com/product.jpg",
            image_url_1: "https://example.com/product-1.jpg",

            price: 100,
            sale_price: 80,

            colors: ["Black", "White"],
            sizes: ["S", "M", "L"],
            pattern: "Solid",

            sw_image: "https://example.com/swatch.jpg",
            facet_color: "Black",

            designDetails: "Test designer notes",

            attributes: {
              color: "Black",
              size: "M",
            },

            extra_details: {},
            pdp_context_attributes: {},
          },
        ],
      },
    });
  }),
];
