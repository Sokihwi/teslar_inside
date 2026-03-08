import { launchBrowser } from './src/browser.js';
import process from 'process';

async function test() {
    const { page } = await launchBrowser(true); // Headless mode so it runs properly

    console.log("Checking login status...");
    await page.goto('https://www.tistory.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const isLoggedIn = await page.evaluate(() => {
        return !!document.querySelector('.link_profile, .thumb_profile, a[href*="logout"]');
    });
    console.log("Logged In?", isLoggedIn);

    const writeUrl = `https://teslar-pi-phone-inside.tistory.com/manage/newpost`;
    console.log("Navigating to: ", writeUrl);

    await page.goto(writeUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log("Body text:\n", bodyText.substring(0, 1000));

    process.exit(0);
}
test();
