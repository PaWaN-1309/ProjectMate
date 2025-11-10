const os = require('os');

console.log("OS Type:", os.type());
console.log("OS Platform:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("Home Directory:", os.homedir());
console.log("Total System Memory:", os.totalmem() / (1024 * 1024), "MB");
