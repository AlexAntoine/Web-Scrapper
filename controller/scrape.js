const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const scrapeData = async(url,page)=>{

    try {
        await page.goto(url, {waitUntil:'load', timeout:0});

        const html = await page.evaluate(()=>document.body.innerHTML);

        const $ = cheerio.load(html);

        const title = $('.mw-page-title-main').text();

        return {
            title
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getResults = async()=>{
    const browser = await puppeteer.launch({headless:false});

    const page = await browser.newPage();

   const data = await scrapeData('https://en.wikipedia.org/wiki/Computer_programming',page);

   console.log(data.title);
}
