import { HashRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PATHS } from "@/paths";
import LayoutProvider from "@/contexts/layoutContext";
import { LayoutConfigProvider } from "@/layouts/v2/LayoutConfigProvider";
import ChatProvider from "@/store/chat";
import ProductsProvider from "@/store/products";
import { SunnyAppConfig } from "@/App";
import { CartProvider } from "@/contexts/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProductProvider from "@/store/product-detail";

import V2PLP from "./plp";
import V2Home from "./home";
import V2PDP from "./pdp";
import V2Layout from "./layout";

const Login = lazy(() => import("@/pages/LoginPage"));

type AppProps = {
  config?: SunnyAppConfig;
};

function V2(props: AppProps) {
  const { config } = props;

  return (
    <LayoutConfigProvider>
      <LayoutProvider region={config.layoutContext.locale}>
        <CartProvider>
          <ChatProvider>
            <ProductsProvider>
              <ProductProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <HashRouter>
                    <Suspense fallback={null}>
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                          path="/"
                          element={
                            <V2Home
                              headerHeight={config.layoutContext.headerHeight}
                            />
                          }
                        />
                        <Route
                          path={PATHS.root}
                          element={
                            <V2Layout
                              headerHeight={config.layoutContext.headerHeight}
                            />
                          }
                        >
                          <Route path="products" element={<V2PLP />} />
                          <Route
                            path="products/:productId"
                            element={<V2PDP />}
                          />
                        </Route>
                      </Routes>
                    </Suspense>
                  </HashRouter>
                </TooltipProvider>
              </ProductProvider>
            </ProductsProvider>
          </ChatProvider>
        </CartProvider>
      </LayoutProvider>
    </LayoutConfigProvider>
  );
}

export default V2;
