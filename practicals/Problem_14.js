const path = require('path');

const filePath = '/user/local/bin/test.txt';

console.log("dirname:", path.dirname(filePath));
console.log("basename:", path.basename(filePath));
console.log("extname:", path.extname(filePath));
console.log("join:", path.join('/user', 'local', 'bin'));
console.log("resolve:", path.resolve('test.txt'));
