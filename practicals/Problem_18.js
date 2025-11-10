const fs = require('fs');

const writeStream = fs.createWriteStream('example.txt', 'utf8');

writeStream.write('Hello, this is line 1.\n');
writeStream.write('This is line 2 written using Node.js streams.\n');
writeStream.write('Streams are efficient for handling large data.\n');

writeStream.end('Final line written successfully.\n');

writeStream.on('finish', () => {
  console.log('✅ Writing completed successfully!');
});

writeStream.on('error', (err) => {
  console.error('❌ Error:', err);
});
