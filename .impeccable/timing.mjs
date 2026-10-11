import { chromium } from "playwright";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const times = {};

await p.goto("http://127.0.0.1:3001/");
await p.fill("#license", "INV-C402-0E0C");
const t0 = Date.now();
await p.click('button[type="submit"]');
await p.waitForURL("**/dashboard", { timeout: 30000 });
times.loginToDashboard = Date.now() - t0;

await p.waitForTimeout(600);
let t1 = Date.now();
await p.click('nav a[href="/upload"]');
await p.waitForURL("**/upload", { timeout: 15000 });
times.navToUpload = Date.now() - t1;

t1 = Date.now();
await p.click('nav a[href="/analisis"]');
await p.waitForURL("**/analisis", { timeout: 15000 });
times.navToAnalisis = Date.now() - t1;

t1 = Date.now();
await p.click('nav a[href="/dashboard"]');
await p.waitForURL("**/dashboard", { timeout: 15000 });
times.navBackDashboard = Date.now() - t1;

console.log(JSON.stringify(times));
await b.close();
