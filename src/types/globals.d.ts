declare global {
  interface Window {
    handlePostCartAdd(data: unknown, sku: string, type: boolean);
    refreshCart(name: string);
    dataLayer: object[];
    userContext: object[];
    ScarabQueue: unknown[];

    EliteCart?: {
      refreshCart?: () => void;
      openDrawerWithDataRefresh?: () => void;
    };
  }
}

export {};
