const fs = require('fs');

const content = 'Hello! This file was created using Node.js.\nLearning the fs module is easy and fun!';

fs.writeFile('example.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
    return;
  }
  console.log('File has been written successfully!');
});
