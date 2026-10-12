import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isLibrary = env.VITE_BUILD_MODE === "library";
  const isProduction = env.NODE_ENV === "production";
  const config = {
    base: env.VITE_BASE_URI,
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production",
      ),
    },
    server: {
      host: "::",
      port: 3000,
    },
    plugins: [
      react(),
      visualizer({ open: false }),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./tests/setup/index.ts"],
      globals: true,
    },
    build: {
      outDir: "build",
      minify: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules") &&
              (id.includes("react") ||
                id.includes("react-dom") ||
                id.includes("react-router-dom"))
            ) {
              return "vendor-react";
            }
            if (
              id.includes("node_modules") &&
              id.includes("@tanstack/react-query")
            ) {
              return "vendor-query";
            }
            if (
              id.includes("node_modules") &&
              (id.includes("@radix-ui") || id.includes("lucide-react"))
            ) {
              return "vendor-ui";
            }
          },
        },
      },
    },
  };
  if (isProduction) {
    if (isLibrary) {
      config.build.lib = {
        entry: path.resolve(__dirname, "src/lib.tsx"),
        name: "SunnyAppBundle",
        fileName: (format) => `sunny-app.bundle.${format}.js`,
        formats: ["es"],
      };
    }
  }

  return {
    ...config,

    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup/vitest-setup.ts"],
      clearMocks: true,
      restoreMocks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "./coverage",
        include: ["src/store/**/reducer.ts", "src/hooks/toast-reducer.ts"],
        thresholds: {
          lines: 95,
          branches: 95,
          functions: 95,
          statements: 95,
        },
      },
    },
  };
});
