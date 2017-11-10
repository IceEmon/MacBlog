/**
 * Created by Emonice on 2017/11/10.
 */
const fs = require('fs');

let files = fs.readdirSync(__dirname);
files.forEach(file => {
    require(`./${file}`);
});