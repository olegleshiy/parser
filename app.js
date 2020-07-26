const path = require('path');
const exphbs = require('express-handlebars');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const connection = require('./service/db');
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

app.get('/', (req, res) => {
    res.render('index', { title: 'HOME' });
});

app.get('/news', async (req, res) => {
    try {
        const query = connection.query('SELECT * FROM finance ORDER BY published_at DESC', function (error, results, fields) {
            if (error) throw error;
            res.render('news', { articles: results });
        });

    } catch (e) {
        console.log(e);
    }
});

app.get('/entertainment', async (req, res) => {
    try {
        const query = connection.query('SELECT * FROM finance ORDER BY published_at DESC', function (error, results, fields) {
            if (error) throw error;
            res.render('entertainment', { articles: results });
        });

    } catch (e) {
        console.log(e);
    }
});

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting: ${ err.stack }`);
        return;
    }

    console.log(`Connected DB as id ${ connection.threadId }`);
    app.listen(PORT, () => {
        console.log(`Server running to port ${ PORT }`);
    });
});

