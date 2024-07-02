import puppeteer from "puppeteer";
import { appendFile } from "fs";

const getQuotes = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto("https://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded",
    });

    const run = async () => {
        const allQuotes = await page.evaluate(() => {
            const quotes = document.querySelectorAll(".quote");
    
            return Array.from(quotes).map((quote) => {
                const text = quote.querySelector(".text").innerHTML;
                const author = quote.querySelector(".author").innerHTML;
                const tags = quote.querySelector('.tags')?.querySelector('.keywords')?.getAttribute('content');
    
                return { text, author, tags };
            });
        });
    
        appendFile('quotes.json', JSON.stringify(allQuotes, null, '\t'), err => {
            if (err || !allQuotes) {
                console.log('error');
            } else {
                console.log('all good');
            }
        });
    };

    while (await page.$('.pager > .next > a')) {
        await page.click('.pager > .next > a');
        run();
    }

    await browser.close();
};

getQuotes();
