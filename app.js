const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();

app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

module.exports = app;