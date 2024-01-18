const path = require('path');
const fsPromises = require('fs/promises');

async function copyCSSDir () {
  try {
    const cssFolderPath = path.join(__dirname, 'styles');
    const cssContent = await fsPromises.readdir(cssFolderPath, {withFileTypes: true});

    const cssContentArray = [];

    for (let item of cssContent) {
      if (item.isFile()) {
        if (path.extname(item.name) === '.css') {
        const cssItemPath = path.join(item.path, item.name);
        const cssForWrite = await fsPromises.readFile(cssItemPath, 'utf8');
        const data = cssForWrite.split('\n')
        cssContentArray.push(data);
        }
      }
    }
    const styles = cssContentArray.flat(Infinity);
    const test = styles.join('\n');

    const projectFolder = path.join(__dirname, 'project-dist');
    const newStylePath = path.join(projectFolder, 'bundle.css');

    fsPromises.writeFile(newStylePath, test, {flag: 'w'});


  } catch (err) {
    console.log(err);
  }
} 
copyCSSDir();