
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/utils/**", "src/lib/**"],
      exclude: [
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
        "src/utils/api/**",
        "src/utils/**/render-ui.*",
        "src/utils/**/gtm_events.*",
      ],
      thresholds: {
        lines: 10,
      },
    },
  },
});
