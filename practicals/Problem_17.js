const fs = require('fs');

const readStream = fs.createReadStream('example.txt', 'utf8');

// ! Lorem Text
// Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?

readStream.on('data', (chunk) => {
  console.log('--- New Chunk ---');
  console.log(chunk);
});

readStream.on('end', () => {
  console.log('✅ File reading completed.');
});

readStream.on('error', (err) => {
  console.error('❌ Error:', err);
});
