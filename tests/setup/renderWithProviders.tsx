import { render, type RenderOptions } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MemoryRouter } from "react-router-dom";

import type { ReactElement, ReactNode } from "react";

import AuthProvider from "@/store/auth";

import { CartProvider } from "@/contexts/CartContext";

import { LayoutConfigContext } from "@/layouts/LayoutConfigContext";

import ProductsProvider from "@/store/products";

import ChatProvider from "@/store/chat";

import ProductListFilterProvider from "@/store/filter";

const layoutConfig = {
  chat: {
    content: {
      chatList: {
        initialMessage: "Hello from test harness",

        inititalChips: [],
      },
    },
  },
};

export type RenderWithProvidersOptions = RenderOptions & {
  initialEntries?: string[];
};

export const renderWithProviders = (
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) => {
  const { initialEntries = ["/"], ...renderOptions } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },

      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider token="test-token">
            <LayoutConfigContext.Provider value={layoutConfig}>
              <CartProvider>
                <ProductsProvider>
                  <ChatProvider>
                    <ProductListFilterProvider>
                      {children}
                    </ProductListFilterProvider>
                  </ChatProvider>
                </ProductsProvider>
              </CartProvider>
            </LayoutConfigContext.Provider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};
