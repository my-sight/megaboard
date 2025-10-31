import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "apps/web/tests/e2e",
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
