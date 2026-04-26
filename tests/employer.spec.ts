import { expect, test } from "@playwright/test";

test("employer flow extracts skills and adds a job", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Employer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Community Navigator" })).toHaveCount(0);
  await page.getByRole("button", { name: "Employer" }).click();

  await expect(page.getByText("Step 1 of 2")).toBeVisible();
  await expect(page.getByText("Add a job")).toBeVisible();
  await page.getByRole("button", { name: "Use example" }).click();
  await page.getByRole("button", { name: "Extract skills" }).click();
  await expect(page.getByRole("button", { name: "Phone repair" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Customer service" })).toBeVisible();
  await page.getByTestId("flow-next").click();

  await expect(page.getByText("Suggested matching profile")).toBeVisible();
  await expect(page.getByText("Best matched to youth with repair + customer service skills")).toBeVisible();
  await page.getByRole("button", { name: "Add job" }).click();

  await expect(page.getByText("Job added")).toBeVisible();
  await expect(page.getByText("Matching candidates can now contact you")).toBeVisible();
});
