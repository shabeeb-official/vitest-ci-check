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
    setupFiles: ["./tests/setup/vitest-setup.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      // Gate scope. Widen this as test density increases (e.g. add
      // src/hooks/**, src/store/**, then all of src/**).
      include: ["src/utils/**", "src/lib/**"],
      exclude: [
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
        //"src/utils/api/**", // 8.06% coverage pulling down the average
        //"src/utils/**/render-ui.*", // 0% coverage UI renderers
        //"src/utils/**/gtm_events.*", // 0% analytics
      ],
      // Line-coverage gate, versioned here. Stair-step plan:
      // 50% -> 60% -> 70% -> 80%. Bump `lines` one step at a time.
      thresholds: {
        lines: 40,
      },
    },
  },
});
