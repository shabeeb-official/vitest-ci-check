import { ProductListItem } from "@/types/product";

export const botStart = () => {
  window.dataLayer.push({
    event: "bzai_bot_start",
    // sunny_platform: "TRUE",
  });
};

export const botEnd = () => {
  window.dataLayer.push({
    event: "bzai_bot_end",
    // sunny_platform: "TRUE",
  });
};

export const botTurn = (count: number = 0) => {
  window.dataLayer.push({
    event: "bzai_bot_turn",
    // sunny_platform: "TRUE",
    turn_count: count,
  });
};

export const botReengaged = () => {
  window.dataLayer.push({
    event: "bzai_bot_reengaged",
  });
};

export const viewItemList = (products: ProductListItem[]) => {
  window.dataLayer.push({
    event: "bzai_view_item_list",
    // sunny_platform: "TRUE",
    ecommerce: {
      items: products.map(({ sku, title }) => ({
        item_name: title,
        item_id: sku,
      })),
    },
  });
};

export const selectItem = (title: string, sku: string) => {
  window.dataLayer.push({
    event: "bzai_select_item",
    // sunny_platform: "TRUE",
    ecommerce: {
      items: [{ item_name: title, item_id: sku }],
    },
  });
};

export const addToCartEvent = (title: string, sku: string) => {
  window.dataLayer.push({
    event: "bzai_add_to_cart",
    // sunny_platform: "TRUE",
    ecommerce: {
      items: [{ item_name: title, item_id: sku }],
    },
  });
};
