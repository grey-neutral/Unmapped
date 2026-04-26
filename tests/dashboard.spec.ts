import { expect, test } from "@playwright/test";

test("policy dashboard uses LMIC-only countries, shows a risk map, and stays compact on mobile", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Policy Dashboard" }).click();

  await expect(page.getByRole("heading", { name: "UNMAPPED Dashboard" })).toBeVisible();
  await expect(page.getByText("World risk map")).toBeVisible();
  await expect(page.getByText("What skills exist")).toBeVisible();
  await expect(page.getByText("Where signals are weak")).toBeVisible();
  await expect(page.getByText("AI exposure", { exact: true })).toBeVisible();
  await expect(page.getByText("Key insights", { exact: true })).toBeVisible();
  await expect(page.getByText("Live opportunity signals")).toHaveCount(0);
  await expect(page.getByText("Best training investments")).toHaveCount(0);

  await page.getByTestId("country-selector").click();
  await expect(page.getByTestId("country-option-GH")).toBeVisible();
  await expect(page.getByTestId("country-option-KE")).toBeVisible();
  await expect(page.getByTestId("country-option-BD")).toBeVisible();
  await expect(page.getByText("United States")).toHaveCount(0);

  const metricCards = page.getByTestId("policy-metric-card");
  const firstMetricBox = await metricCards.nth(0).boundingBox();
  const secondMetricBox = await metricCards.nth(1).boundingBox();
  expect(firstMetricBox).not.toBeNull();
  expect(secondMetricBox).not.toBeNull();
  expect(secondMetricBox!.y).toBeGreaterThan(firstMetricBox!.y + 12);
});

test("policy dashboard values change by country, context, and map selection", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByTestId("country-selector").click();
  await page.getByTestId("country-option-KE").click();
  await page.getByTestId("context-urban").click();

  const urbanMetric = await page.getByTestId("policy-metric-card").nth(0).textContent();
  await expect(page.getByText("Repair / Customer Service", { exact: true }).first()).toBeVisible();

  await page.getByTestId("context-rural").click();
  const ruralMetric = await page.getByTestId("policy-metric-card").nth(0).textContent();
  await expect(page.getByText("Solar Repair / Agri Services", { exact: true }).first()).toBeVisible();
  expect(ruralMetric).not.toBe(urbanMetric);

  await page.getByTestId("map-country-BD").scrollIntoViewIfNeeded();
  await page.getByTestId("map-country-BD").click({ force: true });
  await expect(page.getByText("Routine textile checks")).toBeVisible();
  await expect(page.getByText("Agricultural services")).toBeVisible();
});
