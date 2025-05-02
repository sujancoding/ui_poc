var jsonConcat = require('json-concat');
const fs = require('fs');

// an array of filenames to concat
const files = [];

const theDirectory = "mocks/data"; // or whatever directory you want to read
fs.readdirSync(theDirectory).forEach((file) => {
    // you may want to filter these by extension, etc. to make sure they are JSON files
    files.push(file);
})
console.log(files);

jsonConcat({
    src: files,
    dest: "mocks/data.json",
}, function (json) {
    console.log(json);
});

