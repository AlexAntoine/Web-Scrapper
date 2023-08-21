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
    // console.log(url);

    const data = await getResults(url)
    console.log(data);

    res.render('results',{data:data});
})

const scrapeData = async(url,page)=>{

    try {
        await page.goto(url, {waitUntil:'load', timeout:0});

        const html = await page.evaluate(()=>document.body.innerHTML);

        const $ = cheerio.load(html);

        const title = $('#original_header > div.header_poster_wrapper.true > section > div.title.ott_true > h2 > a').text();

        const releaseDate = $('#original_header > div.header_poster_wrapper.true > section > div.title.ott_true > h2 > span').text();

        const overview = $('#original_header > div.header_poster_wrapper.true > section > div.header_info > div > p').text();

        const score = $('#original_header > div.header_poster_wrapper.true > section > ul > li.chart > div.consensus.details > div > div').attr('data-percent');

        const imgUrl = $('#original_header > div.poster_wrapper.true > div.poster > div.image_content.backdrop > img').attr('src');

        const crewLength = $('div.header_info > ol > li').length;

        let crew = [];

        for(let i=1; i <= crewLength; i++){

            let crewName = $(`div.header_info > ol > li:nth-child(${i}) > p:nth-child(1)`).text();

            let crewRole = $(`div.header_info > ol > li:nth-child(${i}) > p.character`).text();

            crew.push({
                "name":crewName,
                "role":crewRole
            })
        }
       
        console.log('line 39: ', title);

        return {
            title,
            releaseDate,
            overview,
            score,
            imgUrl,
            crew
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

}




module.exports = app;