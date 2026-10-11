import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:3001";
const OUT = ".impeccable/review";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "light",
  locale: "es-BO",
});
const page = await ctx.newPage();

await page.goto(`${BASE}/`);
await page.fill("#license", "INV-C402-0E0C");
await page.click('button[type="submit"]');
await page.waitForURL("**/dashboard", { timeout: 15000 });

await page.goto(`${BASE}/configuracion`);
await page.getByRole("button", { name: /Explorar con datos/ }).click();
await page.waitForURL("**/dashboard", { timeout: 15000 });
await page.waitForTimeout(2500);

await page.screenshot({ path: `${OUT}/demo-dashboard.png`, fullPage: true });

await page.goto(`${BASE}/ventas`);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/demo-ventas.png`, fullPage: true });

await page.goto(`${BASE}/compras`);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/demo-compras.png`, fullPage: true });

await page.goto(`${BASE}/inventario`);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/demo-inventario.png`, fullPage: true });

await page.goto(`${BASE}/analisis`);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/demo-analisis.png`, fullPage: true });

// Mobile
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: "light",
  locale: "es-BO",
});
const mp = await mctx.newPage();
await mp.goto(`${BASE}/`);
await mp.fill("#license", "INV-C402-0E0C");
await mp.click('button[type="submit"]');
await mp.waitForURL("**/dashboard", { timeout: 15000 });
await mp.goto(`${BASE}/configuracion`);
await mp.getByRole("button", { name: /Explorar con datos/ }).click();
await mp.waitForURL("**/dashboard", { timeout: 15000 });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: `${OUT}/demo-mobile-dashboard.png`, fullPage: false });

await browser.close();
console.log("Capturas listas");
