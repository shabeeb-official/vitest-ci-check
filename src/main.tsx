import App from "./App.tsx";
import "./index.css";
import TagManager from "react-gtm-module";
import authenticateSession from "./api/get-token.ts";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

const tagManagerArgs = {
  gtmId: "",
};

// TagManager.initialize(tagManagerArgs);
window.dataLayer = window.dataLayer || [];

const token = await authenticateSession();

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);

  root.render(
    <>
      <header style={{ height: "140.891px" }}></header>
      <App
        config={{
          layoutContext: {
            headerHeight: 140.891,
            footerHeight: 638.344,
            // locale: "en_AU",
          },
          token: token,
        }}
      />
    </>,
  );
}
