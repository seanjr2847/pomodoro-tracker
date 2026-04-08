interface PaddleCheckoutOpenOptions {
  items: Array<{ priceId: string; quantity: number }>;
  customData?: Record<string, string>;
  customer?: { email: string };
  settings?: { theme: "light" | "dark" };
}

interface PaddleInstance {
  Initialize: (options: {
    token: string;
    environment?: "sandbox" | "production";
  }) => void;
  Checkout: {
    open: (options: PaddleCheckoutOpenOptions) => void;
  };
}

declare global {
  interface Window {
    Paddle?: PaddleInstance;
  }
}

export {};
