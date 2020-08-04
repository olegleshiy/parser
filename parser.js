const path = require('path');
const mysql = require('mysql');
const express = require('express');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const download = require('./service/save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';
const { getFinancePost, getEntertainmentPost } = require('./service/service');
const app = express();
dotenv.config();

const conn = require('./service/db');

const PORT = process.env.PORT || 7000;

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    try {
        const result = await getFinancePost(conn);
        res.sendStatus(200)
    } catch (e) {
        console.log(e);
    }
});

app.get('/news', async (req, res) => {
    try {
        const result = await getFinancePost(conn);

        // const query = 'SELECT title FROM finance;';
        // conn.query(query, function (error, data, fields) {
        //     if (error) throw error;
        //
        //     console.log('RESULTS', data);
        // });
        const sss = result.sort((a, b) => a.date > b.date ? -1 : 1);

        res.send(sss)
        //res.sendStatus(200);

    } catch (e) {
        console.log(e);
    }
});

app.get('/entertainment', async (req, res) => {
    try {
        const result = await getEntertainmentPost(conn);

        res.send({result})
    } catch (e) {
        console.log(e);
    }
});

conn.connect(err => {
    if (err) {
        console.error(`Error connecting: ${ err.stack }`);
        return;
    }

    console.log(`Connected DB as id ${ conn.threadId }`);
    app.listen(PORT, () => {
        console.log(`Server running to port ${ PORT }`);
    });
});
