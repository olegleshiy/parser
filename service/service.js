const cheerio = require("cheerio");
const nodeFetch = require('node-fetch');
const fs = require('fs');
const download = require('./save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';
const moment = require('moment');

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR", keepArray: true, trim: true });

const getPost = async (url) => {
    try {
        const response = await nodeFetch(url);
        const xml = await response.text();
        //const result = await (() => {
            //const $ = cheerio.load(html);
            //let arr = [];
            //$('item').each((i, el) => {
                // let img = $(el).find('img').attr('src');
                // let category = $(el).find('[data-test-locator="catlabel"]').text();
                // let title = $(el).find('[class="Mb(5px)"] a').text() ? $(el).find('[class="Mb(5px)"] a').text() : $(el).find('h2').text();
                // let link = $(el).find('h3 a').attr('href') ? $(el).find('h3 a').attr('href') : $(el).find('a').attr('href');
                // let description = $(el).find('p').text();
                //
                // arr.push({
                //     img: img,
                //     title: title,
                //     link: link,
                //     category: category,
                //     description: description,
                //     date: Date.now()
                // })
                //let img = $(el).find('img').attr('src');
                //let category = $(el).find('[data-test-locator="catlabel"]').text();
                // let title = $(el).find('title').text();
                // let link = $(el).find('link').text();
                // let description = $(el).find('description').text();
                // let date = $(el).find('pubDate').text();

                // arr.push({
                //     img: img,
                //     title: title,
                //     link: link,
                //     category: category,
                //     description: description,
                //     date: Date.now()
                // })
            //})

            //return arr;
        //})();
        //return await result;
        let file = [];

        parser.parseString(xml, function(error, result) {
            if(error === null) {
                result.rss.channel[0].item.forEach(el => {
                    file.push({
                        //img: xml.querySelector("media:content"),
                        title: el.title[0],
                        link: el.link[0],
                        //category: category,
                        source: el.source[0].ATTR.url,
                        sourceName: el.source[0]._,
                        description: el.description,
                        date: moment(el.pubDate[0]).format('DD-MMM-YYYY, HH:mm:ss')
                    })
                })
                //file = result.rss.channel[0].item;
                //console.log(result);
            }
            else {
                console.log(error);
            }
        });
        return file;
    } catch (err) {
        console.log(err)
    }
}

const getFinancePost = async (conn) => {
    try {
        const result = await getPost(process.env.URL_FINANCE_NEWS);

        // for await (let item of result) {
        //     let { img, date } = item;
        //     await download(img, pathImgNews, date, (msg) => {
        //         const post  = {
        //             title: item.title,
        //             link: item.link,
        //             category: item.category,
        //             description: item.description,
        //             image: msg,
        //         };
        //         const query = 'INSERT INTO finance SET ?';
        //         conn.query(query, post, function (error, results, fields) {
        //             if (error) throw error;
        //         });
        //         console.log('✅ Done!', msg);
        //     });
        // }
        return result;
    } catch (e) {
        console.log(e);
    }
}

const getEntertainmentPost = async (conn) => {
    try {
        const result = await getPost(process.env.URL_ENTERTAINMENT_NEWS);

        // for await (let item of result) {
        //     let { img, date } = item;
        //     await download(img, pathImgEntertainment, date, (msg) => {
        //         const post  = {
        //             title: item.title,
        //             link: item.link,
        //             category: item.category,
        //             description: item.description,
        //             image: msg,
        //         };
        //         const query = 'INSERT INTO entertainment SET ?';
        //         conn.query(query, post, function (error, results, fields) {
        //             if (error) throw error;
        //         });
        //         console.log('✅ Done!', msg);
        //     });
        // }
        return result;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getFinancePost, getEntertainmentPost };
