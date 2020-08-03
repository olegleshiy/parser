const cheerio = require("cheerio");
const nodeFetch = require('node-fetch');
const download = require('./save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';

const getPost = async (url) => {
    try {
        const response = await nodeFetch(url);
        const html = await response.text();

        const result = await (() => {
            const $ = cheerio.load(html);
            let arr = [];
            $('.js-stream-content').each((i, el) => {
                let img = $(el).find('img').attr('src');
                let category = $(el).find('[data-test-locator="catlabel"]').text();
                let title = $(el).find('[class="Mb(5px)"] a').text() ? $(el).find('[class="Mb(5px)"] a').text() : $(el).find('h2').text();
                let link = $(el).find('h3 a').attr('href') ? $(el).find('h3 a').attr('href') : $(el).find('a').attr('href');
                let description = $(el).find('p').text();
                arr.push({
                    img: img,
                    title: title,
                    link: link,
                    category: category,
                    description: description,
                    date: Date.now()
                })
            })

            return arr;
        })();
        return await result;

    } catch (err) {
        console.log(err)
    }
}

const getFinancePost = async (conn) => {
    try {
        const result = await getPost(process.env.URL_FINANCE_NEWS);

        for await (let item of result) {
            let { img, date } = item;
            await download(img, pathImgNews, date, (msg) => {
                const post  = {
                    title: item.title,
                    link: item.link,
                    category: item.category,
                    description: item.description,
                    image: msg ? msg : null,
                };
                const query = 'INSERT INTO finance SET ?';
                conn.query(query, post, function (error, results, fields) {
                    if (error) throw error;
                });
                console.log('✅ Done!', msg);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

const getEntertainmentPost = async (conn) => {
    try {
        const result = await getPost(process.env.URL_ENTERTAINMENT_NEWS);

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
    } catch (e) {
        console.log(e);
    }
}
module.exports = { getFinancePost, getEntertainmentPost };
