const path = require('path');
const mysql = require('mysql');
const express = require('express');
const dotenv = require('dotenv');
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
        const result = await getFinancePost();
        const query = 'SELECT title FROM finance;';
        conn.query(query, function (error, results, fields) {
            if (error) throw error;
        });

        for await (let item of result) {
            let { img, date } = item;
            await download(img, pathImgNews, date, (msg) => {
                const post  = {
                    title: item.title,
                    link: item.link,
                    category: item.category,
                    description: item.description,
                    image: msg,
                };
                const query = 'INSERT INTO finance SET ?';
                conn.query(query, post, function (error, results, fields) {
                    if (error) throw error;
                });
                console.log('✅ Done!', msg);
            });
        }
        res.send({result})
        //res.sendStatus(200);
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
        const result = await getEntertainmentPost();
        for await (let item of result) {
            let { img, date } = item;
            await download(img, pathImgEntertainment, date, (msg) => {
                const post  = {
                    title: item.title,
                    link: item.link,
                    category: item.category,
                    description: item.description,
                    image: msg,
                };
                const query = 'INSERT INTO entertainment SET ?';
                conn.query(query, post, function (error, results, fields) {
                    if (error) throw error;
                });
                console.log('✅ Done!', msg);
            });
        }
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

//module.exports = conn;

