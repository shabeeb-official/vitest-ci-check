import { ProductResponse } from "@/types/product";
import { DETAILS_URI } from "@/config";
import axios from "axios";

type Opts = {
  token: string | null;
  country?: string;
};
const products = {
  getProductByGroupId: async (
    productID: string,
    opts: Opts,
  ): Promise<ProductResponse[]> => {
    try {
      const { data } = await axios.get(DETAILS_URI, {
        params: {
          item_group_id: productID,
          country: opts.country === "global" ? "" : opts.country,
        },
        headers: {
          Authorization: `Bearer ${opts.token}`,
        },
      });

      return data.data.results;
    } catch (err) {
      throw new Error("failed to get product by id");
    }
  },
};

export default products;
