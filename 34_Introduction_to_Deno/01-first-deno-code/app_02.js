/* using callback 
------------------*/

// const { writeFile } = require("fs");

// const text = "This should be store in a file again";
// writeFile("test-nodejs.txt", text, (err, data) => {
//   if (err) console.log(err);
//   console.log("Written to file");
// });

//-----------------------------------------------------------

/* using promises 
------------------*/

// const { writeFile } = require("fs").promises;

// const text = "This should be store in a file again";
// writeFile("test-nodejs.txt", text).then(() => {
//   console.log("Written to file");
// });

//-----------------------------------------------------------

/* using async/await 
------------------*/

const { writeFile } = require("fs").promises;
// import { writeFile } from "node:fs/promises";

const text = "This should be store in a file again";
writeFile("test-nodejs.txt", text);
console.log("Written to file");
