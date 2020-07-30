const cheerio = require("cheerio");
const nodeFetch = require('node-fetch');

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

const getFinancePost = async () => {
    try {
        return await getPost(process.env.URL_FINANCE_NEWS);
    } catch (e) {
        console.log(e);
    }
}

const getEntertainmentPost = async () => {
    try {
        return  await getPost(process.env.URL_ENTERTAINMENT_NEWS);
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getFinancePost, getEntertainmentPost };
