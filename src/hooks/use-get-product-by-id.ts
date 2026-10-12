import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import useGetProductID from "./use-get-product-id";
import products from "@/utils/api/get-product";
import { Product } from "@/types/product";
import { useAuth } from "@/store/auth/use-auth";
import useGetCountry from "./use-country";

const useGetProductById = () => {
  const productId = useGetProductID();
  const auth = useAuth();

  const country = useGetCountry();

  const query = useQuery({
    queryKey: ["product-details", productId],
    queryFn: async () => {
      const productList = await products.getProductByGroupId(productId, {
        token: auth.token,
        country,
      });
      const serialzedProduct: Product[] = productList.map((product) => {
        return {
          id: product.item_group_id,
          sku: product.product_id,
          title: product.name,
          brand: product.Brand,
          description: product.description,
          imageUrl: product.imageUrl,
          mainImageUrl: product.image_url_1,
          price: product.price,
          trend: product.sale_price,
          colors: product.colors,
          sizes: product.sizes,
          pattern: product.pattern,
          sale_price: product.sale_price,
          swatch: product.sw_image,
          swatchName: product.facet_color,
          designerNotes: product.designDetails,
          attributes: product.attributes,
          extra_details: product.extra_details,
          pdp_context_attributes: product.pdp_context_attributes || null
        };
      });
      return serialzedProduct;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const { status } = query;

  useEffect(() => {
    if (status === "error") {
      toast.error("failed to get product details");
    }
  }, [status]);

  return query;
};

export default useGetProductById;
