const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname, 'text.txt');

const fileText = fs.readFile(filePath, {encoding: 'utf-8'}, (err, fileData) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log(fileData);
  }
})

