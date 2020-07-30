const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const download = (url, path, published, callback) => {
    let image = `${ path }/image-${ published }-${uuidv4()}.jpg`;
    const dest = fs.createWriteStream(image);
    fetch(url)
        .then(res => new Promise((resolve, reject) => {
            res.body.pipe(dest);
            dest.on('close', () => resolve());
            dest.on('error', reject);
            callback(image);
        }))
        .catch(e => new Promise((_, reject) => {
            dest.end(() => {
                fs.unlink(image, () => reject(e));
            });
        }));
};

module.exports = download;
