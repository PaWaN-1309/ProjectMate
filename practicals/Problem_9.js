const fs = require('fs');

const directoryPath = './';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  console.log('Files and folders in directory:');
  files.forEach((file) => {
    console.log(file);
  });
});
