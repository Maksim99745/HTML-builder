const path = require('path');
const fsPromises = require('fs/promises');


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

      const headerPath = path.join(componentsFolderPath, 'header.html');
      const header = await fsPromises.readFile(headerPath, {encoding: 'utf-8'});



      const articlePath = path.join(componentsFolderPath, 'articles.html');
      const article = await fsPromises.readFile(articlePath);

      const footerPath = path.join(componentsFolderPath, 'footer.html');
      const footer = await fsPromises.readFile(footerPath);

      const HTML = await fsPromises.readFile(HTMLPath, {encoding: 'utf-8'});
      const HTMLArray = HTML.split('\n');
      for (let i = 0; i < HTMLArray.length; i += 1) {
        if (HTMLArray[i].trim() === '{{header}}') {
          HTMLArray.splice(i, 1, header);
        }

        if (HTMLArray[i].trim() === '<main class="main">{{articles}}</main>') {
          const mainBlock = `<main class="main">
${article}</main>`
          HTMLArray.splice(i, 1, mainBlock);
        }
        if (HTMLArray[i].trim() === '{{footer}}') {
          HTMLArray.splice(i, 1, footer);
        }
      }
      const HTMLText = HTMLArray.join('\n');
      await fsPromises.writeFile(HTMLPath, HTMLText, {flag: 'w'});
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

