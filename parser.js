const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cron = require('node-cron');
const exphbs = require('express-handlebars');
const getAllPosts = require('./service/service');
const app = express();
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
        // const query = "SELECT publish_date FROM posts WHERE resource = 'news' ORDER BY publish_date ASC LIMIT 1;";
        // conn.query(query, function (error, data, fields) {
        //     if (error) throw error;
        //
        //     console.log('newPost2', data);
        //     res.send(`<h1>${data[0].publish_date}</h1>`)
        // });

    } catch (e) {
        console.log(e);
    }
});

app.get('/news', async (req, res) => {
    try {
        const query = 'SELECT * FROM posts WHERE resource = "news" ORDER BY publish_date ASC LIMIT 10;';
        conn.query(query, function (error, data, fields) {
            if (error) throw error;

            res.render('news', {
                title: 'News',
                articles: data,
            });
        });

    } catch (e) {
        console.log(e);
    }
});

app.get('/entertainment', async (req, res) => {
    try {
        const query = 'SELECT * FROM posts WHERE resource = "entertainment" ORDER BY publish_date DESC LIMIT 10;';
        conn.query(query, function (error, data, fields) {
            if (error) throw error;


            res.render('entertainment', {
                title: 'Entertainment',
                articles: data,
            });
        });
    } catch (e) {
        console.log(e);
    }
});

const task = cron.schedule('*/5 * * * *', async () =>  {
    try {
        console.log('Get new posts');
        await getAllPosts(conn, process.env.URL_FINANCE_NEWS, 'news');
        await getAllPosts(conn, process.env.URL_ENTERTAINMENT_NEWS, 'entertainment');
    } catch (err) {
        task.destroy();
        console.error(`Error get new posts: ${ err.stack }`);
    }
});

conn.connect(err => {
    if (err) {
        console.error(`Error connecting: ${ err.stack }`);
        task.stop();
        return;
    }

    console.log(`Connected DB as id ${ conn.threadId }`);
    app.listen(PORT, () => {
        console.log(`Server running to port ${ PORT }`);
        task.stop();
    });
});
