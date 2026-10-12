import { debug } from "debug";
import axios from "axios";
import generateBasicAuthToken from "@/utils/get-basic-auth-token";
import { useCallback, useState } from "react";
import { ADD_WISHLIST_URI, REMOVE_WISHLIST_URI } from "@/config";

const logWishlist = debug("app:WishList");

const useWishlist = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const addToWishlist = useCallback(async (id: string) => {
    try {
      const params = new URLSearchParams();
      params.append("pid", id);
      params.append("page", "plp");

      logWishlist("[INFO] preparing to call add to wishlist");
      console.log("[INFO] preparing to call add to wishlist");
      console.log("sku_id", id);
      const { data } = await axios.post(ADD_WISHLIST_URI, params, {
        withCredentials: true,
        headers: {
          Authorization: generateBasicAuthToken(),
        },
      });

      if (data.wishlistSize > 0) {
        const wishlistCount = document.querySelector(".wishlist-count");
        wishlistCount.classList.remove("wishlist-hide");
        wishlistCount.textContent = data.wishlistSize;
        setChecked(true);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const removeFromWishlist = useCallback(async (id: string) => {
    try {
      const params = new URLSearchParams();
      params.append("pid", id);

      logWishlist("[INFO] preparing to call remove from wishlist");
      const { data } = await axios.get(REMOVE_WISHLIST_URI, {
        params: {
          pid: id,
        },

        withCredentials: true,
        headers: {
          Authorization: generateBasicAuthToken(),
        },
      });

      if (data.wishlistSize > -1) {
        const wishlistCount = document.querySelector(".wishlist-count");
        if (data.wishlistSize === 0) {
          wishlistCount.classList.add("wishlist-hide");
        }
        wishlistCount.textContent = data.wishlistSize;
        setChecked(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return { checked, addToWishlist, removeFromWishlist };
};

export default useWishlist;
