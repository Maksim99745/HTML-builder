const fsPromises = require('fs/promises');
const path = require('path');



async function copyDir () {
  try {
    const newFolderPath = path.join(__dirname, 'files-copy');
    await fsPromises.mkdir(newFolderPath, { recursive: true })
  
    const initFolder = path.join(__dirname, 'files');
    const initFolderContent = await fsPromises.readdir(initFolder);

    for (let item of initFolderContent) {
      const initFilePath = path.join(initFolder, item);
      const newItemPath = path.join(newFolderPath, item);

      const fileForWrite = await fsPromises.readFile(initFilePath);


      await fsPromises.writeFile(newItemPath, fileForWrite,  {flag: 'w'});
    }

  } catch (err) {
    console.log(err);
  }
} 
copyDir();

async function compareFolders () {
  const newFolderPath = path.join(__dirname, 'files-copy');
  const newFolderContent = await fsPromises.readdir(newFolderPath);

  const initFolder = path.join(__dirname, 'files');
  const initFolderContent = await fsPromises.readdir(initFolder);

  for (let item of newFolderContent) {
    if (!initFolderContent.includes(item)){
      const itemPath = path.join(newFolderPath, item);
      await fsPromises.unlink(itemPath);
      await copyDir();
    }
  }
}

compareFolders();