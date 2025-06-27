import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    includeSource: ["src/**/*.ts"],
    include: ["src/**/*.{spec,test}.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.integration.{spec,test}.ts",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
