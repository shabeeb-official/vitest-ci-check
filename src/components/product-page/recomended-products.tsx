import { useEffect, useState, useRef, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductListItem } from "@/types/product";
import useGoToDetails from "@/hooks/use-goto-details";
import ProductCard from "../ProductCard";
import emarys from "@/api/emarys";
import { ImageWrapper } from "../ImageWrapper";
import FavoriteButton from "../favorites-button";
import { ProductListImage } from "../ProductListImage";
import { ProductCardBody } from "../ProductCardBody";
import { ProductBrand } from "../ProductBrand";
import { ProductTitle } from "../ProductTitle";
import { ProductPrice } from "../product-price";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";

const RecomendedProducts = ({recommendedProductsLabel, currentProductId, recommendedProductsLabelStyle }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const isMounted = useRef(false);
  const layoutConfigs = useLayoutConfigs();

  const goToProduct = useGoToDetails();

  const [emblaApi, setEmblaApi] = useState(null);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi],
  );

  useEffect(() => {
    isMounted.current = true;

    emarys.load(
      () =>
        emarys.detailPageRecomendation({
          currentProductId: currentProductId,
          onSuccess: (products: unknown[]) => {
            if (isMounted.current) {
              setRecommendedProducts(products);
            }
          },
          onError: () => {
            if (isMounted.current) {
              setRecommendedProducts([]);
            }
          },
        }),
      () => {
        if (isMounted.current) {
          setRecommendedProducts([]);
        }
      },
    );

    return () => {
      isMounted.current = false;
    };
  }, [currentProductId]);
  const styles = layoutConfigs.plp.styles.productCard;

  return (
    <>
      <div id="recommended-products-container" className="mt-16 mb-16 asldfkj">
        <h2 className={recommendedProductsLabelStyle}>{recommendedProductsLabel}</h2>
        <Carousel
          className="h-full"
          setApi={setEmblaApi as any}
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {recommendedProducts.map((product) => {
              const temp: ProductListItem = {
                sku: product.id,
                imageUrl: product.image,
                title: product.title,
                brand: product.brand,
                price: product.price_au,
              };
              return (
                <CarouselItem
                  key={product.id}
                  className="basis-1/2  sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  onClick={() => {
                    goToProduct(product.group_id.split("-")[0], {
                      brand: product.brand,
                      sku: product.id,
                    });
                  }}
                >
                  <ProductCard
                    styles={{
                      base: styles.base,
                    }}
                    key={product.id}
                    navigateToProduct={() => {
                      goToProduct(product.group_id.split("-")[0], {
                        brand: product.brand,
                        sku: product.id,
                      });
                    }}
                  >
                    <ImageWrapper styles={{ imageWrap: styles.imageWrap }}>
                      <FavoriteButton sku={temp.sku} position="absolute" />
                    </ImageWrapper>
                    <ProductListImage
                      product={temp}
                      styles={{
                        image: styles.image,
                      }}
                      alt="Recommended product image"
                      src={temp.imageUrl}
                    />
                    <ProductCardBody styles={{ content: styles.content }}>
                      <ProductBrand
                        product={temp}
                        styles={{
                          brand: styles.brand,
                        }}
                      />
                      <ProductTitle
                        product={temp}
                        styles={{
                          title: styles.title,
                        }}
                      />
                      <ProductPrice
                        styles={{
                          strike: styles.strike,
                          sale: styles.sale,
                          price: styles.price,
                        }}
                        product={temp}
                      />
                    </ProductCardBody>
                  </ProductCard>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious
            className="absolute left-4 top-1/2"
            onClick={scrollPrev}
          />
          <CarouselNext
            className="absolute right-4 top-1/2"
            onClick={scrollNext}
          />
        </Carousel>
      </div>
    </>
  );
};

export default RecomendedProducts;
