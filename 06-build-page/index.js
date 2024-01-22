const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');


async function buildPage () {
  try {

    const projectFolderPath = path.join(__dirname, 'project-dist');
    await fsPromises.mkdir(projectFolderPath, { recursive: true })

    async function bildHTML () {
      const initHTMLPath = path.join(__dirname, 'template.html')
      const initHTML = await fsPromises.readFile(initHTMLPath);

      const HTMLPath = path.join(projectFolderPath, 'index.html');
      await fsPromises.writeFile(HTMLPath, initHTML);

      const componentsFolderPath = path.join(__dirname, 'components');
      const compamponentsFolder = await fsPromises.readdir(componentsFolderPath);

      const HTML = await fsPromises.readFile(HTMLPath, {encoding: 'utf-8'});
      const HTMLArray = HTML.split('{{');

      for (let file of compamponentsFolder) {
        const filePath = path.join(componentsFolderPath, file);
        const fileData = await fsPromises.readFile(filePath, {encoding: 'utf-8'});
        const fileName = file.split('.')[0];

        for (let i = 0; i < HTMLArray.length; i += 1) {
            const HTMLChunk = HTMLArray[i].slice(0, fileName.length);

            if (HTMLChunk === fileName) {
              HTMLArray[i] = HTMLArray[i].replace(`${fileName}}}`, `${fileData.trim()}`);
              console.log(fileName);
              console.log(HTMLArray[i])
            } else {
            }
        }
        const HTMLText = HTMLArray.join('');
        await fsPromises.writeFile(HTMLPath, HTMLText, {flag: 'w'});
      }
    }
    bildHTML ()

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
        const newStylePath = path.join(projectFolder, 'style.css');
    
        fsPromises.writeFile(newStylePath, test, {flag: 'w'});
    
    
      } catch (err) {
        console.log(err);
      }
    } 
    copyCSSDir();

  async function copyDir () {
  try {
    const projectFolder = path.join(__dirname, 'project-dist');
    const newAssets = path.join(projectFolder, 'assets');
    await fsPromises.mkdir(newAssets, { recursive: true })
  
    const initFolder = path.join(__dirname, 'assets');
    const initFolderContent = await fsPromises.readdir(initFolder);

    for (let item of initFolderContent) {
      const initFilePath = path.join(initFolder, item);
      const newItemPath = path.join(newAssets, item);

      const fileForWrite = await fsPromises.readdir(initFilePath);

      await fsPromises.mkdir(newItemPath, { recursive: true })
      for (let innerItem of fileForWrite) {
        const innerItemPath = path.join(initFilePath, innerItem);
        const innerFileForRead = await fsPromises.readFile(innerItemPath);
        const newPath = path.join(newItemPath, innerItem);
        await fsPromises.writeFile(newPath, innerFileForRead,  {flag: 'w'});
      }
    }
  } catch (err) {
    console.log(err);
  }
} 
copyDir();

async function compareFolders () {
  const newProjectPath = path.join(__dirname, 'project-dist');
  const newProject = await fsPromises.readdir(newProjectPath);

  const newAssetsPath = path.join(newProjectPath, 'assets');
  const newAssets = await fsPromises.readdir(newAssetsPath);


  const initFolderPath = path.join(__dirname, 'assets');
  const initFolder = await fsPromises.readdir(initFolderPath);

  for (let newFolder of newAssets) {
    const newFolderPath = path.join(newAssetsPath, newFolder);
    const newFolderContent = await fsPromises.readdir(newFolderPath)


    if (!initFolder.includes(newFolder)){
      await fsPromises.rmdir(newFolderPath);
      await copyDir();
    }

    const oldFolderPath = path.join(initFolderPath, newFolder);
    const oldFolder = await fsPromises.readdir(oldFolderPath);

    for (let content of newFolderContent) {
      if (!oldFolder.includes(content)) {
        const contentPath = path.join(newFolderPath, content);
        await fsPromises.unlink(contentPath);
        copyDir();
      }
    }
  }
}
compareFolders();

  } catch (err) {
    console.log(err);
  }
} 

buildPage();

