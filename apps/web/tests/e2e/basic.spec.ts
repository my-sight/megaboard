import { test, expect } from "@playwright/test";

test("landing navigation cards", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "mysight Deployment Hub" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Landing" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mandanten" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Setup Wizard" })).toBeVisible();
});
