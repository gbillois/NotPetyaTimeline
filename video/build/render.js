// Render scene.html to frames via Playwright.
//   node render.js preview  → key frames only (preview/*.jpg)
//   node render.js          → full 24fps render (frames/f%05d.jpg)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TIMING = JSON.parse(fs.readFileSync(__dirname + '/timing.json', 'utf8'));
const FPS = TIMING.fps;
const TOTAL = TIMING.total;
const preview = process.argv[2] === 'preview';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + __dirname + '/scene.html');
  await page.waitForFunction('window.READY === true', { timeout: 30000 });

  if (preview) {
    fs.mkdirSync(__dirname + '/preview', { recursive: true });
    // mid-VO moments of each scene + transitions + end card
    const times = [1.5, 7, 11, 13.5, 18, 24, 28, 34, 44, 47.5, 52, 58, 64, 70, 76, 84, 89, 95, 101, 107, 110.5, 113.5, 115.8];
    for (const t of times) {
      await page.evaluate(tt => window.seek(tt), t);
      await page.screenshot({ path: `${__dirname}/preview/t${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 88 });
    }
    console.log('preview frames:', times.length);
  } else {
    const dir = __dirname + '/frames';
    fs.mkdirSync(dir, { recursive: true });
    const nFrames = Math.ceil(TOTAL * FPS);
    const t0 = Date.now();
    for (let i = 0; i < nFrames; i++) {
      await page.evaluate(tt => window.seek(tt), i / FPS);
      await page.screenshot({ path: path.join(dir, `f${String(i).padStart(5, '0')}.png`) });
      if (i % 240 === 0) console.log(`frame ${i}/${nFrames} (${((Date.now() - t0) / 1000).toFixed(0)}s elapsed)`);
    }
    console.log('done:', nFrames, 'frames in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  await browser.close();
})();
