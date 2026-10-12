const HOSTED_URI =
  "https://graceandstella-dev-loader.bayezon.com/sunny-app.bundle.es.js";
const AUTH_URI =
  "https://graceandstella-dev-auth-507482727131.us-central1.run.app";

window.bayezonapp = {
  init: function (selector, config = {}) {
    const tenantID = document.querySelector("script[data-tenant]").dataset
      .tenant;
    fetch(AUTH_URI, {
      method: "POST",
      body: JSON.stringify({ tenant_id: tenantID }),
    })
      .then((data) => {
        data.json().then((parsedData) => {
          const token = parsedData.token;
          import(HOSTED_URI)
            .then((module) => {
              if (module.mountApp) {
                config.token = token;
                module.mountApp(document.querySelector(selector), config);
              } else {
                console.error(
                  "bayezon app bundle is missing the mountApp function.",
                );
              }
            })
            .catch((err) => console.error("bayezon app failed to load:", err));
        });
      })
      .catch((err) => console.error("bayezon app authentication failed", err));
  },
};
