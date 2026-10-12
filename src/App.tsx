import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { genSessionID } from "./utils/gen-id";
import ChatProvider from "./store/chat";
import { lazy, Suspense, useEffect, useRef } from "react";
import ProductsProvider from "./store/products";
import { Layout } from "./layout";
import LayoutProvider from "./contexts/layoutContext";
import { getSession, setSession } from "./utils/session";
import { PATHS } from "./paths";
import { botEnd, botStart } from "./utils/gtm_events";
import { BUILD_REGISTRY_VERSION, DEFAULT_HEADER_HEIGHT } from "./config";
import AuthProvider from "./store/auth";
import AuthWrapper from "./components/auth-wrapper";
import { LayoutConfigProvider } from "./layouts/LayoutConfigProvider";
import { initUserContext } from "./utils/user-context";

const HomePage = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/LoginPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const PLPPage = lazy(() => import("./pages/PLP"));
const V2 = lazy(() => import("./pages/v2/index"));

const queryClient = new QueryClient();

export interface SunnyAppConfig {
  tab?: string;
  userContext?: {
    id?: string;
    email?: string;
  };
  layoutContext?: {
    headerHeight: number;
    footerHeight: number;
    locale?: string;
  };
  token: string;
}

interface AppProps {
  config?: SunnyAppConfig;
}

const App = ({ config }: AppProps) => {
  const botStartRef = useRef(false);

  useEffect(() => {
    const currentSessionID = getSession();

    if (!currentSessionID) {
      const sessionID = genSessionID();
      setSession(sessionID);
    }

    if (!botStartRef.current) {
      botStart();
      botStartRef.current = true;
    }

    window.addEventListener("beforeunload", function () {
      botEnd();
    });
  }, []);

  useEffect(() => {
    const [nav] = performance.getEntriesByType("navigation");

    if (nav.type === "reload") {
      console.log("Page was reloaded");
    } else if (nav.type === "navigate") {
      console.log(
        "Page was loaded normally (like typing URL or clicking link)",
      );
    } else if (nav.type === "back_forward") {
      console.log("Page came from back/forward cache");
    }
  }, []);

  useEffect(() => {
    initUserContext();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider token={config.token}>
        <AuthWrapper token={config.token}>
          {BUILD_REGISTRY_VERSION === "V2" ? (
            <Suspense fallback={null}>
              <div className="h-dvh w-full overflow-hidden">
                <V2 config={config} />
              </div>
            </Suspense>
          ) : (
            <LayoutConfigProvider>
              <LayoutProvider region={config.layoutContext.locale}>
                <CartProvider>
                  <ChatProvider>
                    <ProductsProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <HashRouter>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route
                              path={PATHS.root}
                              element={
                                <HomePage
                                  headerHeight={
                                    config?.layoutContext?.headerHeight ||
                                    DEFAULT_HEADER_HEIGHT
                                  }
                                />
                              }
                            />
                            <Route
                              path={PATHS.root}
                              element={<Layout {...config?.layoutContext} />}
                            >
                              <Route
                                path="products"
                                element={<PLPPage {...config?.layoutContext} />}
                              />
                              <Route
                                path="products/:productId"
                                element={
                                  <ProductPage {...config?.layoutContext} />
                                }
                              />
                            </Route>
                            <Route
                              path="*"
                              element={<Navigate to={PATHS.root} />}
                            />
                          </Routes>
                        </HashRouter>
                      </TooltipProvider>
                    </ProductsProvider>
                  </ChatProvider>
                </CartProvider>
              </LayoutProvider>
            </LayoutConfigProvider>
          )}
        </AuthWrapper>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
