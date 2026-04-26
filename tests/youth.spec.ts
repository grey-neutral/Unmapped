import { expect, test } from "@playwright/test";

test("youth flow records experience, builds a passport, and keeps the selected location", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Youth" }).click();
  await expect(page.getByText("Step 1 of 5")).toBeVisible();

  await page.getByPlaceholder("Search").fill("Kenya");
  await page.getByRole("button", { name: /Kenya/ }).first().click();
  await page.getByRole("textbox").nth(1).fill("Nairobi");
  await page.getByTestId("flow-next").click();

  await expect(page.getByText("Step 2 of 5")).toBeVisible();
  await page.getByRole("button", { name: "Secondary" }).click();
  await page.getByRole("button", { name: /Upload \/ Take Photo/ }).click();
  await expect(page.getByText("Photo ready")).toBeVisible();
  await page.getByPlaceholder("Certificate name").fill("KCSE");
  await page.getByTestId("flow-next").click();

  await expect(page.getByText("Tell us what you can do")).toBeVisible();
  await expect(page.getByText("Record your work, skills, or experience.")).toBeVisible();
  await page.getByRole("button", { name: "Record experience" }).click();
  await expect(page.getByText("Recording...")).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue(/manage spare parts/i);
  await expect(page.getByRole("button", { name: "Phone repair" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Screen replacement" })).toBeVisible();
  const salesChip = page.getByRole("button", { name: "Sales" });
  await salesChip.click();
  await expect(salesChip).toHaveClass(/bg-slate-100/);
  await salesChip.click();
  await expect(salesChip).toHaveClass(/bg-teal/);
  await page.getByPlaceholder("Add another skill").fill("Inventory");
  await page.getByPlaceholder("Add another skill").press("Enter");
  await expect(page.getByRole("button", { name: "Inventory" })).toBeVisible();
  await page.getByTestId("flow-next").click();

  await expect(page.getByText("Phone repair experience")).toBeVisible();
  await expect(page.getByText("Customer interaction")).toBeVisible();
  await expect(page.getByText("Spare parts handling")).toBeVisible();
  await expect(page.getByText("Pricing / sales")).toBeVisible();
  await page.getByTestId("flow-next").click();

  await expect(page.getByText("Skills Passport")).toBeVisible();
  await expect(page.getByText("Kenya · Nairobi")).toBeVisible();
  await expect(page.getByTestId("flow-next")).toHaveCount(0);
  await expect(page.getByText("Phone Repair Assistant")).toBeVisible();
  await expect(page.getByText("Electronics Shop Assistant")).toBeVisible();
  await expect(page.getByText("Solar Repair Trainee")).toBeVisible();
  await expect(page.getByRole("button", { name: "Call" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Message" }).first()).toBeVisible();
  await page.getByRole("button", { name: "System View" }).click();
  await expect(page.getByText("How this was matched")).toBeVisible();
  await expect(page.getByText("Evidence → Skill → Taxonomy → Risk → Opportunity")).toBeVisible();
  await expect(page.getByText("ISCO sample")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Message" }).first().click();
  await expect(page.getByText("Message request sent")).toBeVisible();
});

test("step one still switches labels to Swahili only on the first youth screen", async ({ page }) => {
  await page.goto("/youth");

  await page.getByPlaceholder("Search").fill("Kenya");
  await page.getByRole("button", { name: /Kenya/ }).first().click();
  await page.getByRole("button", { name: "Swahili" }).click();

  await expect(page.getByText("Nchi")).toBeVisible();
  await expect(page.getByText("Lugha")).toBeVisible();
  await expect(page.getByText("Mji")).toBeVisible();
  await expect(page.getByRole("button", { name: "Rudi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ifuatayo" })).toBeVisible();

  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByText("Country")).toBeVisible();
  await expect(page.getByText("Language")).toBeVisible();
  await expect(page.getByText("City")).toBeVisible();
});
