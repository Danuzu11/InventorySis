import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/`);
await page.fill("#license", "INV-TEST-0001");
await page.click('button[type="submit"]');
await page.waitForURL("**/dashboard");
await page.goto(`${BASE}/configuracion`);
await page.getByRole("button", { name: /Explorar con datos de demostración/ }).click();
await page.waitForURL("**/dashboard");
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const paths = [...document.querySelectorAll(".recharts-area-curve, .recharts-area-area")];
  const container = document.querySelector(".recharts-responsive-container");
  const clip = document.querySelector("[clip-path]");
  const clipRect = clip?.getAttribute("clip-path");
  const wrapper = document.querySelector(".dough-grow");
  return {
    pathCount: paths.length,
    paths: paths.map((p) => {
      const r = p.getBoundingClientRect();
      return {
        cls: p.getAttribute("class"),
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        dLen: (p.getAttribute("d") ?? "").length,
      };
    }),
    clipAttr: clipRect,
    wrapperStyle: wrapper
      ? {
          animation: getComputedStyle(wrapper).animation,
          transform: getComputedStyle(wrapper).transform,
          opacity: getComputedStyle(wrapper).opacity,
        }
      : null,
    container: container
      ? { w: container.clientWidth, h: container.clientHeight }
      : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.evaluate(() => {
  document.querySelector(".dough-grow")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(400);
await page.screenshot({ path: ".impeccable/review/debug-mobile-chart.png", fullPage: false });
await browser.close();
