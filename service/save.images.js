const fs = require('fs');
const fetch = require('node-fetch');

const download = (url, path, published, callback) => {
    const dest = fs.createWriteStream(`${ path }/image-${ published }.jpg`);
    fetch(url)
        .then(res => new Promise((resolve, reject) => {
        res.body.pipe(dest);
        dest.on('close', () => resolve());
        dest.on('error', reject);
        callback(`${ path }/image-${ published }.jpg`);
    }))
        .catch(e => new Promise((_, reject) => {
        dest.end(() => {
            fs.unlink('doodle.png', () => reject(e));
        });
    }));
};

module.exports = download;