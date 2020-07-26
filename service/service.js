const unirest = require("unirest");
const download = require('./service/save.images');
const pathImgNews = 'uploads/news';
const pathImgEntertainment = 'uploads/entertainment';

const getPost = async (url, host) => {
    try {
        const response = await unirest.get(url)
            .query({
                "sortBy": "createdAt",
                "category": "generalnews",
                "region": "US"
            })
            .headers({
                "x-rapidapi-host": host,
                "x-rapidapi-key": process.env.X_RAPID_API_KEY,
                "useQueryString": true
            });
        return await response.body.items.result;

    } catch (err) {
        console.log(err)
    }
}

const getFinancePost = async () => {
    try {
        const result = await getPost(process.env.URL_FINANCE_NEWS, process.env.X_RAPID_API_HOST_FINANCE);

        for await (let item of result) {
            let { main_image, published_at } = item;
            if (main_image) {
                await download(main_image.original_url, pathImgNews, published_at, (msg) => {
                    const post  = {
                        uuid: item.uuid,
                        title: item.title,
                        summary: item.summary,
                        type: item.type,
                        link: item.link,
                        content: item.content,
                        main_image: msg,
                        publisher: item.publisher,
                        published_at: item.published_at,
                    };
                    const query = connection.query('INSERT INTO finance SET ?', post, function (error, results, fields) {
                        if (error) throw error;

                    });
                    console.log('✅ Done!', msg);
                });
            }
        }

    } catch (e) {
        console.log(e);
    }
}

const getEntertainmentPost = async () => {
    try {
        const result = await getPost(process.env.URL_ENTERTAINMENT_NEWS, process.env.X_RAPID_API_HOST_ENTERTAINMENT);

        for await (let item of result) {
            let { main_image, published_at } = item;
            if (main_image) {
                await download(main_image.original_url, pathImgEntertainment, published_at, (msg) => {
                    console.log('✅ Done!', msg);
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = getPost;