const cheerio = require("cheerio");
const nodeFetch = require('node-fetch');
const fs = require('fs');
const download = require('./save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';
const moment = require('moment');

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

const getPost = async (url) => {
    try {
        const response = await nodeFetch(url);
        const html = await response.text();
        let file = [];

        parser.parseString(html, function(error, result) {
            if(error === null) {
                result.rss.channel[0].item.forEach(el => {
                    file.push({
                        img: el['media:content'] && el['media:content'][0] && el['media:content'][0].ATTR.url,
                        title: el.title[0],
                        link: el.link[0],
                        source: el.source[0].ATTR.url,
                        sourceName: el.source[0]._,
                        description: el.description,
                        date: moment(el.pubDate[0]).format('DD-MMM-YYYY, HH:mm:ss')
                    })
                })
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
