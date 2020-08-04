const path = require('path');
const exphbs = require('express-handlebars');
//const mysql = require('mysql');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cron = require('node-cron');
const { getFinancePost, getEntertainmentPost } = require('./service/service');
dotenv.config();

const conn = require('./service/db');

const PORT = process.env.PORT || 7000;

//Instruments
app.engine('hbs', exphbs({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: require('./helpers/hbs-helpers')
    })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    try {
        res.redirect('/news')
    } catch (e) {
        console.log(e);
    }
});

app.get('/news', async (req, res) => {
    try {
        const query = 'SELECT * FROM finance;';
        conn.query(query, function (error, data, fields) {
            if (error) throw error;
            res.render('news', { articles: data });
        });
    } catch (e) {
        console.log(e);
    }
});

app.get('/entertainment', async (req, res) => {
    try {
        const query = 'SELECT * FROM entertainment;';
        conn.query(query, function (error, data, fields) {
            if (error) throw error;
            res.render('entertainment', { articles: data });
        });
    } catch (e) {
        console.log(e);
    }
});

const task = cron.schedule('*/2 * * * *', async () => {
    await getFinancePost(conn);
    //await getEntertainmentPost(conn);
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
    task.destroy();
});
