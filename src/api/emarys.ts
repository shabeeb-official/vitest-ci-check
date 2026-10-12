import {
  EmarysArg,
  EmarysHomeProductResponse,
  ProductListItem,
} from "@/types/product";
import debug from "debug";

const log = debug("app:Recomendation");
const logError = debug("app:RecomendationError");

const emarys = {
  load: (onload: () => void, onError: () => void) => {
    const id = "scarab-js-api";
    if (document.getElementById(id)) {
      onload();
      return;
    }

    log("Loading Emarys script...");
    const js = document.createElement("script");
    js.id = id;
    js.src = "//cdn.scarabresearch.com/js/138842426E42B027/scarab-v2.js";
    document.body.appendChild(js);

    js.onload = () => {
      log("Loaded Emarys script...");
      onload();
    };
    js.onerror = (error) => {
      logError("Failed to load Emarsys script:", error);
      onError();
    };
  },

  detailPageRecomendation: ({ currentProductId, onSuccess, onError }) => {
    if (!currentProductId) {
      log("Aborting due to product id not present");
      return;
    }
    log("Initializing Emarys Command");
    window.ScarabQueue = window.ScarabQueue || [];

    log("Pushing view for current product id", currentProductId);
    window.ScarabQueue?.push(["view", currentProductId]);
    log("Pushed view for current product id", currentProductId);

    window.ScarabQueue?.push([
      "recommend",
      {
        logic: "RELATED",
        limit: 16,
        containerId: "recommended-products-container",
        success: function (SC: EmarysArg) {
          onSuccess(SC.page.products);
        },
        error: function (error: EmarysArg) {
          logError("Emarsys recommendation error:", error);
          onError();
        },
      },
    ]);

    log("Pushing go");
    window.ScarabQueue.push(["go"]);
    log("Pushed go");
  },
  homePageRecomendation: (
    onSuccess: (products: ProductListItem[]) => void,
    onError?: (err: Error) => void,
  ) => {
    log("Pushing recommend");
    window.ScarabQueue?.push([
      "recommend",
      {
        logic: "PERSONAL",
        containerId: "#root",
        limit: 16,
        success: function (sc: EmarysArg) {
          log("Recomended products received");
          const responseProducts = sc.page
            .products as unknown as EmarysHomeProductResponse[];

          const serializedProduct: ProductListItem[] = responseProducts.map(
            (product) => {
              return {
                id: product.group_id.split("-")[0],
                sku: product.id,
                imageUrl: product.image,
                title: product.title,
                brand: product.brand,
                price: parseFloat(product.price_au).toFixed(2),
                trend: "",
              };
            },
          );
          // console.log(sc.page.products);
          onSuccess(serializedProduct);
        },
        onerror: function (err: Error) {
          logError(err.message);
          if (onError) {
            onError(err);
          }
        },
      },
    ]);
    log("Pushed recommend");
    log("Pushing go");
    window.ScarabQueue?.push(["go"]);
    log("Pushed go");
  },
};

export default emarys;
