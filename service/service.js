const nodeFetch = require('node-fetch');
const moment = require('moment');
const xml2js = require('xml2js');
const download = require('./save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';
const parser = new xml2js.Parser({ attrkey: "ATTR" });

const getPost = async (url, resource) => {
    try {
        const response = await nodeFetch(url);
        const html = await response.text();
        let file = [];

        parser.parseString(html, function(error, result) {
            if(error === null) {
                result.rss.channel[0].item.forEach(el => {
                    file.push({
                        image: el['media:content'] && el['media:content'][0] && el['media:content'][0].ATTR.url,
                        title: el.title[0],
                        link: el.link[0],
                        source_link: el.source[0].ATTR.url,
                        source_name: el.source[0]._,
                        description: el.description && el.description[0],
                        resource: resource,
                        publish_date: el.pubDate[0],
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

const getAllPosts = async (conn, resourceLink, resource) => {
    try {
        const result = await getPost(resourceLink, resource);
        const query = `SELECT publish_date FROM posts WHERE resource = ${resource} ORDER BY publish_date;`;

        let newPost = [];
        conn.query(query, function (error, data, fields) {
            if (error) throw error;

            if(data && result) {
                newPost = data.filter(post => data < post.publish_date );
            }
            console.log('newPost', newPost);
        });

        for await (let item of newPost.length ? newPost : result) {
            let { image, publish_date } = item;
            let pathImg = resource === 'news' ? pathImgNews : pathImgEntertainment;
            let dateForImage = moment(publish_date).format('YYYY-MM-DD');

            if(image) {
                await download(image, pathImg, dateForImage, (msg) => {
                    const post  = {
                        title: item.title,
                        link: item.link,
                        source_link: item.source_link,
                        source_name: item.source_name,
                        description: item.description,
                        resource: resource,
                        image: msg,
                        publish_date: moment(publish_date).format('YYYY-MM-DD, HH:mm:ss'),
                    };
                    const query = 'INSERT INTO posts SET ?';
                    conn.query(query, post, function (error, results, fields) {
                        if (error) throw error;
                    });
                    console.log('✅ Done!', msg);
                });
            } else {
                const post  = {
                    title: item.title,
                    link: item.link,
                    source_link: item.source_link,
                    source_name: item.source_name,
                    description: item.description,
                    resource: resource,
                    publish_date: moment(publish_date).format('YYYY-MM-DD, HH:mm:ss'),
                };
                const query = 'INSERT INTO posts SET ?';
                conn.query(query, post, function (error, results, fields) {
                    if (error) throw error;
                });
            }
        }
        return result;
    } catch (e) {
        console.log(e);
    }
}

module.exports = getAllPosts;
