import { expect, test } from "@playwright/test"

const routes = [
  "/",
  "/projects",
  "/diagnosis",
  "/answer-monitor",
  "/sentiment",
  "/competitors",
  "/opportunities",
  "/content-studio",
  "/tasks",
  "/reports",
  "/settings",
]

for (const route of routes) {
  test(`renders ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.getByText("AlphaRank")).toBeVisible()
    await expect(page.locator("main")).toBeVisible()
  })
}
