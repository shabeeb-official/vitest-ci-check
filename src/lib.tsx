import { createRoot } from "react-dom/client";
import App, { SunnyAppConfig } from "./App.tsx";
import TagManager from "react-gtm-module";

import appStyles from "./index.css?inline";
import { MOBILE_WIDTH } from "./config.ts";

const tagManagerArgs = {
  gtmId: "",
};

// TagManager.initialize(tagManagerArgs);
window.dataLayer = window.dataLayer || [];

function injectFontsOnce() {
  if (document.getElementById("sunny-fonts")) return;

  const style = document.createElement("style");
  style.id = "sunny-fonts";
  style.textContent = `

		@font-face {
			font-family: "Copernicus";
			font-style: normal;
			font-weight: 200;
			font-display: swap;
			src: url("https://roddandgunn-product-loader.bayezon.com/fonts/Copernicus-Bold.ttf") format("ttf");
		}

		@font-face {
			font-family: "Copernicus";
			font-style: normal;
			font-weight: 200;
			font-display: swap;
			src: url("https://roddandgunn-product-loader.bayezon.com/fonts/Copernicus-Medium.eot") format("eot");
		}


		@font-face {
			font-family: "Copernicus";
			font-style: normal;
			font-weight: 200;
			font-display: swap;
			src: url("https://roddandgunn-product-loader.bayezon.com/fonts/Copernicus-Semibold.ttf") format("ttf");
		}



		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 200;
			        font-display: swap;
				  src: url("/fonts/visbythin.woff2") format("woff2");
		}
		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 300;
			        font-display: swap;
				  src: url("/fonts/visbylight.woff2") format("woff2");
		}
		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 400;
			        font-display: swap;
				  src: url("/fonts/visbyregular.woff2") format("woff2");
		}
		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 500;
			        font-display: swap;
				  src: url("/fonts/visbymedium.woff2") format("woff2");
		}
		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 600;
			        font-display: swap;
				  src: url(/fonts/visbysemibold.woff2") format("woff2");
		}
		@font-face {
			  font-family: "Visby";
			    font-style: normal;
			      font-weight: 700;
			        font-display: swap;
				  src: url("/fonts/visbybold.woff2") format("woff2");
		}
		  `;
  document.head.appendChild(style);
}

export function mountApp(container: HTMLElement, config: SunnyAppConfig): void {
  console.log("Lib: ", config);
  // injectFontsOnce();
  const shadowRoot = container.attachShadow({ mode: "open" });
  const styleEl = document.createElement("style");
  styleEl.textContent = appStyles;
  shadowRoot.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  if (window.innerWidth < MOBILE_WIDTH) {
    // mountPoint.style.position = "absolute";
    mountPoint.style.width = "100%";
  }
  shadowRoot.appendChild(mountPoint);
  const root = createRoot(mountPoint);
  root.render(<App config={config} />);
}
