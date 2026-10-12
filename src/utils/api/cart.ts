import axios from "axios";
import generateBasicAuthToken from "../get-basic-auth-token";
import { AddToCartPayload } from "@/types/cart";
import { addToCartEvent } from "../gtm_events";

const cartApi = {
  salesForceAddToCart: async (uri: string, args: AddToCartPayload) => {
    const { qty, sku, cartAction, options, preferredStoreId } = args;

    try {
      const params = new URLSearchParams();
      params.append("pid", sku);
      params.append("quantity", String(qty));

      if (preferredStoreId) {
        params.append("preferredStoreId", "");
      }

      if (options) {
        params.append("options", "[]");
      }

      if (cartAction) {
        params.append("cartAction", cartAction);
      }

      const { data } = await axios.post(uri, params, {
        withCredentials: true,
        headers: {
          Authorization: generateBasicAuthToken(),
        },
      });

      return data;
    } catch (err) {
      return null;
    }
  },

  shopifyAddToCart: async (uri: string, args: AddToCartPayload) => {
    const resCart = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: Number(args.sku),
        quantity: args.qty,
      }),
    });

    if (!resCart.ok) {
      console.error("Add to cart failed");
      return;
    }

    addToCartEvent(args.name, args.sku);

    // Fetch sections (Horizon-compatible)
    const sectionsRes = await fetch(
      "/?sections=cart-drawer,cart-icon-bubble,header",
    );

    const sections = await sectionsRes.json();

    // Update cart drawer
    const drawer = document.querySelector("[id^='CartDrawer'], cart-drawer");
    if (drawer && sections["cart-drawer"]) {
      drawer.innerHTML = sections["cart-drawer"];
      drawer.classList.add("active", "open");
      console.log("Cart drawer updated");
    }

    // Update cart icon bubble
    const icon = document.querySelector(".cart-count-bubble");
    if (icon && sections["cart-icon-bubble"]) {
      icon.innerHTML = sections["cart-icon-bubble"];
      console.log("Cart icon updated");
    }

    // Header refresh (Horizon requires this)
    const header = document.querySelector("header");
    if (header && sections["header"]) {
      header.innerHTML = sections["header"];
      console.log("Header refreshed");
    }

    // Grace & Stella is using elite cart extension, so update it based on elite cart function invoking
    await fetch("/cart.js"); // Ensure Shopify cart is updated
    if (window.EliteCart) {
      console.log("Refreshing Elite Cart");
      window.EliteCart.openDrawerWithDataRefresh(); // This refreshes cart data AND opens drawer
      // window.EliteCart.refreshCart(); // Refresh silently without opening
    }

    return;
  },
};

export default cartApi;
