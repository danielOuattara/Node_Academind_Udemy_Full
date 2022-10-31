console.log("Hello");

const { writeFile, writeFileSync } = require("fs");

writeFile("async_test.txt", "Hello Node", (err, data) => {
  if (err) {
    console.log(err);
  }
});

writeFileSync("sync_test.txt", "Hello Node Again ");
