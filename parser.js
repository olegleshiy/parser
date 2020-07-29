//const jsdom = require("jsdom");
//const nodeFetch = require('node-fetch');
const path = require('path');
//const { JSDOM } = jsdom;
//const moment = require('moment');
//const download = require('./service/save.images');
//const pathImgNews = 'uploads/news';
const express = require('express');
const getFinancePost = require('./service/service');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

//const cheerio = require("cheerio");
const connection = require('./service/db');
const PORT = process.env.PORT || 7000;

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    try {
        const result = await getFinancePost();
        console.log("RESULT", result);
        res.send({result});
    } catch (e) {
        console.log(e);
    }
});

app.get('/news', async (req, res) => {
    try {


    } catch (e) {
        console.log(e);
    }
});

app.get('/entertainment', async (req, res) => {
    try {


    } catch (e) {
        console.log(e);
    }
});

connection.connect(err => {
    if (err) {
        console.error(`Error connecting: ${ err.stack }`);
        return;
    }

    console.log(`Connected DB as id ${ connection.threadId }`);
    app.listen(PORT, () => {
        console.log(`Server running to port ${ PORT }`);
    });
});

