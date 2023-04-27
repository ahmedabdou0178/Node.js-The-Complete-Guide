const fs = require('fs').promises;
const path = require('path');
const decompress = require('decompress');

const currentDirectory = process.cwd();

async function processDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
          await processDirectory(filePath);
      } else if (stats.isFile() && path.extname(file) === '.zip') {
        const newPath = path.join(path.dirname(filePath),path.basename(file,'.zip'))
        await decompress(filePath,newPath)
        console.log(`file ${file} has been decompressed successfully`);
        await fs.unlink(filePath);
        console.log(`file ${filePath} has been deleted`)
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directoryPath}: ${err}`);
  }
}

processDirectory(currentDirectory);
