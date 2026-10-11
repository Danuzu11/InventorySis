import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:3001";
const OUT = ".impeccable/review";
mkdirSync(OUT, { recursive: true });

async function login(page) {
  await page.goto(`${BASE}/`);
  await page.fill("#license", "INV-TEST-0001");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

async function enableDemo(page) {
  await page.goto(`${BASE}/configuracion`);
  await page.getByRole("button", { name: /Explorar con datos de demostración/ }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForTimeout(3500);
}

const browser = await chromium.launch();

// Desktop
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    locale: "es-BO",
  });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/login-desktop.png`, fullPage: false });

  await login(page);
  await page.goto(`${BASE}/configuracion`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/config-desktop.png`, fullPage: true });

  await enableDemo(page);
  await page.screenshot({ path: `${OUT}/desktop.png`, fullPage: true });

  await page.goto(`${BASE}/upload`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/upload-desktop.png`, fullPage: true });

  // dark mode dashboard
  await page.evaluate(() => {
    localStorage.setItem("theme", "dark");
  });
  await page.goto(`${BASE}/dashboard`);
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/dashboard-dark.png`, fullPage: false });

  await ctx.close();
}

// Mobile (viewport captures: fullPage stitching drops SVG gradients on tall pages)
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    locale: "es-BO",
  });
  const page = await ctx.newPage();
  await login(page);
  await enableDemo(page);
  await page.screenshot({ path: `${OUT}/mobile.png`, fullPage: false });
  await page.evaluate(() => {
    document.querySelector(".dough-grow")?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/mobile-chart.png`, fullPage: false });
  await ctx.close();
}

await browser.close();
console.log("Capturas listas en", OUT);
