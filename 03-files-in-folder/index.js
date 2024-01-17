const fs = require('fs/promises');
const path = require('path');


async function readDir(){
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, {withFileTypes: true});

    for (let item of files) {
      if (item.isFile()) {
        let output = [];

        const name = item.name.split('.')[0];
        output.push(name);

        const extension = path.extname(item.name).slice(1, item.name.length);
        output.push(extension);

        const filePath = path.join(item.path, item.name);
        console.log(filePath)
        const weight = (await fs.stat(filePath)).size + 'kb';
        output.push(weight);

        const information = output.join(' - ');
        console.log(information);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

readDir();