import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";
const b = await chromium.launch();

// Test 1: Login with valid license
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`);
  await p.fill("#license", "INV-C402-0E0C");
  await p.click('button[type="submit"]');
  await p.waitForURL("**/dashboard", { timeout: 15000 });
  console.log("1. LOGIN OK - redirected to dashboard");
  await ctx.close();
}

// Test 2: Login with invalid license
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`);
  await p.fill("#license", "INV-FAKE-9999");
  await p.click('button[type="submit"]');
  await p.waitForTimeout(2000);
    const error = await p.locator('p[role="alert"]').first().textContent();
  console.log("2. INVALID LICENSE:", error?.trim());
  await ctx.close();
}

// Test 3: Brute force protection (3 wrong attempts)
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`);
  for (let i = 1; i <= 4; i++) {
    await p.fill("#license", `INV-BRUTE-${String(i).padStart(4, "0")}`);
    await p.click('button[type="submit"]');
    await p.waitForTimeout(1500);
  const error = await p.locator('p[role="alert"]').first().textContent();
    console.log(`3.${i} BRUTE FORCE attempt ${i}:`, error?.trim().slice(0, 80));
  }
  await ctx.close();
}

// Test 4: Protected routes redirect to login
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const routes = ["/dashboard", "/upload", "/analisis", "/inventario", "/configuracion"];
  for (const route of routes) {
    await p.goto(`${BASE}${route}`);
    await p.waitForTimeout(1000);
    const url = p.url();
    const redirected = url.includes("/") && !url.includes(route);
    console.log(`4. ${route} → ${redirected ? "REDIRECTED TO LOGIN (secure)" : "BLOCKED (NO REDIRECT!)"}`);
  }
  await ctx.close();
}

// Test 5: API routes without session
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const apiRoutes = [
    { url: `${BASE}/api/upload/commit`, method: "POST" },
    { url: `${BASE}/api/analyze`, method: "POST" },
    { url: `${BASE}/api/config`, method: "POST" },
    { url: `${BASE}/api/sheets/demo`, method: "POST" },
  ];
  for (const r of apiRoutes) {
    const res = await p.request.fetch(r.url, { method: r.method, data: {} });
    console.log(`5. ${r.url.replace(BASE, "")} → ${res.status()} ${res.status() === 401 ? "(secure)" : "(NOT SECURE!)"}`);
  }
  await ctx.close();
}

// Test 6: Demo mode
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`);
  await p.fill("#license", "INV-C402-0E0C");
  await p.click('button[type="submit"]');
  await p.waitForURL("**/dashboard", { timeout: 15000 });
  await p.goto(`${BASE}/configuracion`);
  await p.waitForTimeout(500);
  const demoBtn = p.getByRole("button", { name: /Explorar con datos/ });
  if (await demoBtn.isVisible()) {
    await demoBtn.click();
    await p.waitForURL("**/dashboard", { timeout: 15000 });
    await p.waitForTimeout(2000);
    const h1 = await p.locator("h1").first().textContent();
    console.log("6. DEMO MODE OK - dashboard shows:", h1?.trim());
  } else {
    console.log("6. DEMO MODE: button not found");
  }
  await ctx.close();
}

await b.close();
console.log("\nALL TESTS DONE");
