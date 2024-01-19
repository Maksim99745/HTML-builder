const fs = require('fs');
const readline = require('node:readline/promises');


const welcomingMessage = 'Write your text in console...'

const newFile = fs.createWriteStream(`${__dirname}/newText.txt`, { flags: 'a' });

const readlineInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(welcomingMessage);

readlineInput.on('line', (input) => {
  if (input === 'exit') {
    console.log('Writing is stopped');
    readlineInput.close();
    newFile.close();
    process.exit();
  } else {
    fs.appendFile(`${__dirname}/newText.txt`, input + '\n', (err) => {
    if (err) {
      console.log(err);
      return;
    }
  })
  }
});

readlineInput.on('SIGINT', () => {
  console.log('Writing is stopped');
  readlineInput.close();
  newFile.close();
  process.exit();
});