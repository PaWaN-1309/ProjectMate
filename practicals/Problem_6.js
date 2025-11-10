function greetUser(name, callback) {
  console.log("Hello, " + name + "!");
  callback();
}

function showMessage() {
  console.log("Welcome to Node.js callbacks!");
}

greetUser("Alice", showMessage);