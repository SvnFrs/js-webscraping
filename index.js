import puppeteer from "puppeteer";
import { writeFile } from "fs";

const getQuotes = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto("https://quotes.toscrape.com/", {
        waitUntil: "domcontentloaded",
    });

    const allQuotes = await page.evaluate(() => {
        const quotes = document.querySelectorAll(".quote");

        return Array.from(quotes).map((quote) => {
            const text = quote.querySelector(".text").innerHTML;
            const author = quote.querySelector(".author").innerHTML;

            return { text, author };
        });
    });

    writeFile('data.json', JSON.stringify(allQuotes), err => {
        if (err || !allQuotes) {
            console.log('error');
        } else {
            console.log('all good');
        }
    });

    await browser.close();
};

getQuotes();
