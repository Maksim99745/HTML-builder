const path = require('path');
const fs = require('fs');
const { error } = require('console');


async function readFile () {
  try {
    const filePath = path.join(__dirname, 'text.txt');
    
    const readStream = fs.createReadStream(filePath, {encoding: 'utf-8'});

    readStream.on('data', (chunk) => {
      console.log(chunk);
    })

    readStream.on('error', (error) => {
      console.log(error);
    })

  } catch (err) {
    console.log(err);
  
  }
}
readFile();

