import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
    exclude: ["node_modules", ".next"],
    reporters: "default",
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
