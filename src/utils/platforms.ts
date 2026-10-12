import { isEqualTo } from "./predicates/equals";

const platforms = {
  salesforce: {
    isActive: isEqualTo("salesforce"),
  },
  shopify: {
    isActive: isEqualTo("shopify"),
  },
};

export default platforms;
