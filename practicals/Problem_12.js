console.log("process.cwd():", process.cwd());
console.log("process.version:", process.version);
console.log("process.platform:", process.platform);

console.log("process.memoryUsage():");
console.table(process.memoryUsage());

console.log("Exiting process in 2 seconds...");
setTimeout(() => {
  console.log("Exiting now!");
  process.exit();
}, 2000);
