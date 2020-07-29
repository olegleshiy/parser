//const unirest = require("unirest");

//const connection = require('./db');
const cheerio = require("cheerio");
const nodeFetch = require('node-fetch');
const download = require('./save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';

const getPost = async (url) => {
    try {
        const response = await nodeFetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        let arr = [];
        await (() => {
            $('.js-stream-content').each((i, el) => {
                let img = $(el).find('img').attr('src');
                let category = $(el).find('[data-test-locator="catlabel"]').text();
                let title = $(el).find('[class="Mb(5px)"] a').text();
                let link = $(el).find('h3 a').attr('href');
                let description = $(el).find('p').text();

                arr.push({
                    img: img,
                    title: title,
                    link: link,
                    category: category,
                    description: description,
                    date: Date.now(),
                })
            })
        })();

        return arr;
        // const response = await unirest.get(url)
        //     .query({
        //         "sortBy": "createdAt",
        //         "category": "generalnews",
        //         "region": "US"
        //     })
        //     .headers({
        //         "x-rapidapi-host": host,
        //         "x-rapidapi-key": process.env.X_RAPID_API_KEY,
        //         "useQueryString": true
        //     });
        // return await response.body.items.result;

    } catch (err) {
        console.log(err)
    }
}

const getFinancePost = async () => {
    try {
        const result = await getPost(process.env.URL_FINANCE_NEWS);
        console.log("result", result);
        //const data = connection.query('SELECT title FROM finance;');
        //console.log("query", data);

        for (let item of result) {
            let { img, date } = item;
                await download(img, pathImgNews, date, (msg) => {
                    const post  = {
                        title: item.title,
                        link: item.link,
                        category: item.category,
                        content: item.content,
                        image: item.img,
                    };
                    const data = connection.query('INSERT INTO finance SET ?', post, function (error, results,
                    fields) {
                        if (error) throw error;

                    });
                    console.log('✅ Done!', msg);
                });
        }

    } catch (e) {
        console.log(e);
    }
}

const getEntertainmentPost = async () => {
    try {
        const result = await getPost(process.env.URL_ENTERTAINMENT_NEWS);

        for await (let item of result) {
            let { image, date } = item;
            if (image) {
                await download(image, pathImgEntertainment, date, (msg) => {
                    console.log('✅ Done!', msg);
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = getFinancePost;