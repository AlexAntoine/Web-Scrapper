const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const {getResults} = require('./controller/scrape');
const app = express();

app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


getResults();


module.exports = app;