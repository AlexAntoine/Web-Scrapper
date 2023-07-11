const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// const {getResults} = require('./controller/scrape');
const app = express();

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/search', (req, res)=>{
    res.render('search')
});

app.get('/results',async(req, res)=>{
    const url = req.query.search;

    const data = await getResults(url)

    res.render('results',{data:data});
})

const scrapeData = async(url,page)=>{

    try {
        await page.goto(url, {waitUntil:'load', timeout:0});

        const html = await page.evaluate(()=>document.body.innerHTML);

        const $ = cheerio.load(html);

        const title = $('#original_header > div.header_poster_wrapper.false > section > div.title.ott_false > h2 > a').text();
        const releaseDate = $('#original_header > div.header_poster_wrapper.false > section > div.title.ott_false > h2 > span').text();
        const overview = $('<p>After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most.</p>').text();
        const score = $('.user_score_chart').attr('data-percent');
        const imgUrl = $('<img class="poster lazyload lazyloaded" src="/t/p/w300_and_h450_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" data-src="/t/p/w300_and_h450_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" data-srcset="/t/p/w300_and_h450_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg 1x, /t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg 2x" alt="Spider-Man: Across the Spider-Verse" srcset="/t/p/w300_and_h450_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg 1x, /t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg 2x" data-loaded="true">').attr('src');
        console.log('line 39: ', title);
        return {
            title,
            releaseDate,
            overview,
            score,
            imgUrl
        }

    } catch (error) {
        console.log(error);
    }
}

const getResults = async(url)=>{
   const browser = await puppeteer.launch({headless:false});

   const page = await browser.newPage();

   const data = await scrapeData(url,page);

   browser.close();
   return data;
//    console.log(data.title);
}




module.exports = app;