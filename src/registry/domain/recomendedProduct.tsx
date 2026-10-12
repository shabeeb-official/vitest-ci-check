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
import emarys from "@/api/emarys";

import { useLayoutConfigs } from "@/layouts/v2/LayoutConfigContext";
import ProductCard from "@/components/ProductCard";
import { ImageWrapper } from "@/components/ImageWrapper";
import FavoriteButton from "@/components/favorites-button";
import { ProductListImage } from "@/components/ProductListImage";
import { ProductCardBody } from "@/components/ProductCardBody";
import { ProductBrand } from "@/components/ProductBrand";
import { ProductTitle } from "@/components/ProductTitle";
import { ProductPrice } from "@/components/product-price";

const RecomendedProducts = ({
    recommendedProductsLabel,
    currentProductId,
    recommendedProductsLabelStyle,
}) => {
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


    return (
        <>
            <div id="recommended-products-container" className="mt-16 mb-16 asldfkj">
                <h2 className={recommendedProductsLabelStyle}>
                    {recommendedProductsLabel}
                </h2>
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
                                            base: "bg-white overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md flex flex-col",
                                        }}
                                        key={product.id}
                                        navigateToProduct={() => {
                                            goToProduct(product.group_id.split("-")[0], {
                                                brand: product.brand,
                                                sku: product.id,
                                            });
                                        }}
                                    >
                                        <ImageWrapper styles={{ imageWrap: "relative" }}>
                                            <FavoriteButton sku={temp.sku} position="absolute" />
                                        </ImageWrapper>
                                        <ProductListImage
                                            product={temp}
                                            styles={{
                                                image: "w-full h-full transition-transform duration-300",
                                            }}
                                            alt="Recommended product image"
                                            src={temp.imageUrl}
                                        />
                                        <ProductCardBody styles={{ content: "pt-2 pb-2 flex flex-col justify-between" }}>
                                            <ProductBrand
                                                product={temp}
                                                styles={{
                                                    brand: "text-balance font-bold line-clamp-1 cursor-text px-4 w-fit",
                                                }}
                                            />
                                            <ProductTitle
                                                product={temp}
                                                styles={{
                                                    title: "font-light text-gray-500 line-clamp-2 cursor-text px-4 w-fit",
                                                }}
                                            />
                                            <ProductPrice
                                                styles={{
                                                    strike: "text-sm font-medium line-through cursor-text pl-4 w-fit",
                                                    sale: "text-sm font-bold sale-item-color cursor-text w-fit pr-4",
                                                    price: "font-bold text-nowrap cursor-text px-4 w-fit text-[14px]",
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
