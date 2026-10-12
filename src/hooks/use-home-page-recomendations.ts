import { useProducts, useProductsDispatch } from "@/store/products";
import emarys from "@/api/emarys";
import { useRef, useEffect } from "react";
import debug from "debug";
import { MOBILE_WIDTH } from "@/config";

const log = debug("app:Recomendation");

const useHomePageRecomendations = () => {
	const productsDispatch = useProductsDispatch();
	const { status, products } = useProducts();

	const isMounted = useRef(false);
	useEffect(() => {
		if (window.innerWidth < MOBILE_WIDTH) { return }
		if (status === "success" || products.length > 0) {
			log("products already loaded skipping calling recomendation");
			return;
		}

		isMounted.current = true;

		emarys.load(
			() =>
				emarys.homePageRecomendation((products) => {
					productsDispatch({ type: "REPLACE_PRODUCT", payload: products });
				}),
			() => {
				if (isMounted.current) {
					console.log("error");
					productsDispatch({ type: "CLEAR_PRODUCT" });
				}
			},
		);

		return () => {
			isMounted.current = false;
		};
	}, [status, products.length, productsDispatch]);
};

export default useHomePageRecomendations;
