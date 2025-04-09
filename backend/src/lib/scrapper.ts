import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";

export function generateSearchURL(keyword: string) {
  const baseUrl = "https://www.linkedin.com/search/results/people/";
  const geoUrn = '["103644278"]'; // USA
  const industries = '["1594","1862","80"]'; // Industry codes (Marketing, Software, etc.)
  const origin = "GLOBAL_SEARCH_HEADER";
  const titleFreeText = "Founder";

  // Encode the keyword properly
  const encodedKeyword = encodeURIComponent(`"${keyword}"`);

  // Construct the URL
  const url = `${baseUrl}?geoUrn=${encodeURIComponent(
    geoUrn
  )}&industry=${encodeURIComponent(
    industries
  )}&keywords=${encodedKeyword}&origin=${origin}&titleFreeText=${encodeURIComponent(
    titleFreeText
  )}`;

  return url;
}

export async function scrapeLinkedInProfiles(url: string) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setBypassCSP(true);

    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    );

    // const url =
    //   "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder";

    await page.goto(url, { waitUntil: "networkidle2" });

    console.log("If needed, log in manually within the next 60 seconds...");
    await setTimeout(60000);

    let profilesData: any = [];

    while (profilesData.length < 8) {
      try {
        await page.waitForSelector("div[data-chameleon-result-urn]", {
          timeout: 15000,
        });
      } catch (error) {
        console.log("Profile containers not found, scrolling to load more...");
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await setTimeout(3000);
        continue;
      }

      profilesData = await page.$$eval(
        "div[data-chameleon-result-urn]",
        (cards) =>
          cards.map((card) => {
            // Extract name
            const nameEl = card.querySelector(
              'span[aria-hidden="true"]:not(.entity-result__badge-text)'
            );
            const name = nameEl?.textContent?.trim() || "N/A";

            // Extract connection degree
            const connectionEl = card.querySelector(
              '.entity-result__badge-text span[aria-hidden="true"]'
            );
            const connection = connectionEl?.textContent?.trim() || "N/A";

            // Extract headline
            const headlineEl = card.querySelector(
              ".t-14.t-black.t-normal:not(.entity-result__badge-text)"
            );
            const headline = headlineEl?.textContent?.trim() || "N/A";

            // Extract location
            const locationEl = card.querySelector(
              ".t-14.t-normal.t-black--light"
            );
            const location = locationEl?.textContent?.trim() || "N/A";

            // Extract current position summary
            const summaryEl = card.querySelector(
              ".entity-result__summary--2-lines"
            );
            const summary =
              summaryEl?.textContent?.trim().replace(/\s+/g, " ") || "N/A";

            return {
              name,
              connection,
              headline,
              location,
              summary,
              profileURL: (card.querySelector("a.app-aware-link") as HTMLAnchorElement)?.href || "N/A",
            };
          })
      );

      console.log(`Scraped ${profilesData.length} profiles so far..`);

      // Scroll to load more results
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await setTimeout(2000);
    }

    console.log("Final scraped data:");
    console.log(profilesData);

    await browser.close();
    return profilesData.slice(0, 8); // Limit to 8 profiles
  } catch (error) {
    console.error("Error during scraping:", error);
    return []; // Return an empty array in case of error
  }
}
