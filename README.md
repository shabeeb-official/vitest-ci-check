# bzplatform

Chat-driven storefront UI for Bayezon tenants (Citybeach, Rodd & Gunn, Grace &
Stella). It is a Vite + React + TypeScript app that can run standalone or be
built as an embeddable library (`SunnyAppBundle`) and mounted into a host site.

Longer notes live in [docs](./docs/index.md).

---

## Current status

- **V1 (default / production):** JSON layout specs are loaded (remote in
  production, local skins in development) and rendered with the original page
  components under `src/pages/` and `src/components/`.
- **V2 (opt-in):** a JSON-spec renderer plus component registries
  (`src/registry/`). Home, PLP, PDP, and chat are mounted from `src/pages/v2/`.
  Leave `VITE_REGISTRY_VERSION` unset for V1. Set it to `V2` to mount the V2
  tree in `src/App.tsx`.

Hash routes are the same in both trees: `/`, `/products`, `/products/:productId`,
`/login`.

---

## Quick start

```sh
cp .env.example .env
npm install
npm run dev
```

Dev server: `http://localhost:3000` (`vite.config.ts`).

| Script            | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Local Vite server (Linux/macOS)              |
| `npm run dev:win` | Local Vite server (Windows)                  |
| `npm run build`   | Production build → `build/`                  |
| `npm run build:staging` | Staging build                          |
| `npm run build:dev`     | Development-mode build                 |
| `npm run lint`    | ESLint over `src/`                           |
| `npm run preview` | Preview a production build                   |

Set `VITE_BUILD_MODE=library` for a library bundle (`src/lib.tsx` exposes
`mountApp`). See [building as a library](./docs/202509301119-building-as-library.md).

---

## V1 vs V2

`BUILD_REGISTRY_VERSION` is `import.meta.env.VITE_REGISTRY_VERSION`.

| Value     | What mounts                                      | Layout source |
| --------- | ------------------------------------------------ | ------------- |
| unset / anything other than `V2` | V1 pages + `src/layouts/LayoutConfigProvider` | Production: `VITE_THEME_CONFIG_URI`. Local: tenant skins via `VITE_TENANT_NAME` in `src/utils/clients.ts` |
| `V2`      | `src/pages/v2` + `src/layouts/v2/LayoutConfigProvider` | Bundled JSON under `src/layouts/v2/`, rendered with `composeRegistry(genericRegistry, domainRegistry)` |

V2 pages call `renderNodeList` against the composed registry in
`src/registry/index.tsx` (generic layout nodes + domain widgets).

---

## Environment variables

Copy `.env.example` to `.env`. Do not commit `.env`.

### Used by the app (`src/config.ts` + Vite)

| Variable                    | Role |
| --------------------------- | ---- |
| `VITE_TEST_MODE`            | JSON boolean; test mode flag |
| `VITE_AUTH_SERVER`          | Auth API (`AUTHENTICATION_SERVER`) |
| `VITE_LANGFLOW_URI`         | Langflow / chat backend; also used for `TREND_URI` (`…/active-trends`) |
| `VITE_DETAILS_URI`          | Product details API |
| `VITE_ADD_TO_CART_URI`      | Add-to-cart endpoint |
| `VITE_ADD_TO_WISHLIST_URI`  | Add-to-wishlist endpoint |
| `VITE_REMOVE_TO_WISHLIST_URI` | Remove-from-wishlist endpoint |
| `VITE_CITYBEACH_USERNAME` / `VITE_CITYBEACH_PASSWORD` | Citybeach API credentials |
| `VITE_BEYZON_USERNAME` / `VITE_BEYZON_PASSWORD`     | Beyzon API credentials |
| `VITE_BUILD_MODE`           | `library` to emit the embeddable bundle |
| `VITE_BASE_URI`             | Vite `base` (asset URL prefix) |
| `VITE_BASE_PATH`            | App route prefix (`PATHS.root`) |
| `VITE_THEME_CONFIG_URI`     | Remote layout JSON (V1 production) |
| `VITE_TENANT_ID`            | Tenant id |
| `VITE_REGISTRY_VERSION`     | Empty = V1. `V2` = V2 renderer |

### Also read by `src/config.ts` (not all listed in `.env.example`)

| Variable                 | Role |
| ------------------------ | ---- |
| `VITE_OCAPI_CLIENT_ID` / `VITE_OCAPI_CLIENT_SECRET` | OCAPI credentials |
| `VITE_DEMO_MODE`         | `"true"` enables demo mode |
| `VITE_TENANT_PLATFORM`   | Tenant platform |
| `VITE_TENANT_NAME`       | Selects local skin: `citybeach`, `roddgunn`, `gracestella` |
| `VITE_DEFAULT_REGION`    | Fallback region / locale |

---

## Config module (`src/config.ts`)

Import from `@/config` (TypeScript), not `config.js`.

| Export                     | Source |
| -------------------------- | ------ |
| `USER_AUTH_TOKEN`          | Storage key for auth tokens |
| `TEST_MODE`                | `VITE_TEST_MODE` |
| `MOBILE_WIDTH`             | `1024` |
| `IS_DEV`                   | Vite `import.meta.env.DEV` |
| `AUTHENTICATION_SERVER`    | `VITE_AUTH_SERVER` |
| `LANGFLOW_URI` / `TREND_URI` | Langflow base and `/active-trends` |
| `DETAILS_URI`              | Product details |
| `ADD_TO_CART_URI`          | Cart |
| `ADD_WISHLIST_URI` / `REMOVE_WISHLIST_URI` | Wishlist |
| `DEMO_MODE`                | `VITE_DEMO_MODE` |
| `BASE_PATH`                | Routing prefix |
| `THEME_CONFIG_URI`         | Remote layouts |
| `TENANT_ID` / `TENANT_PLATFORM` / `TENANT_NAME` | Tenant |
| `DEFAULT_REGION`           | Locale fallback |
| `BUILD_REGISTRY_VERSION`   | V1/V2 switch |
| `BEYZON_*` / `CITYBEACH_*` | API credentials |
| `OCAPI_CLIENT_ID` / `OCAPI_CLIENT_SECRET` | OCAPI |

```ts
import { DETAILS_URI, BUILD_REGISTRY_VERSION } from "@/config";
```

---

## Layout of the repo

| Path                 | What it is |
| -------------------- | ---------- |
| `src/App.tsx`        | Auth + V1/V2 mount |
| `src/pages/`         | V1 routes |
| `src/pages/v2/`      | V2 Home / PLP / PDP / layout |
| `src/layouts/`       | V1 layout loader |
| `src/layouts/v2/`    | V2 bundled layout JSON |
| `src/registry/`      | V2 generic + domain component registry |
| `src/lib.tsx`        | `mountApp` for host-site embedding |
| `src/utils/clients.ts` | Tenant → local layout skins |
| `docs/`              | Architecture and investigation notes |
