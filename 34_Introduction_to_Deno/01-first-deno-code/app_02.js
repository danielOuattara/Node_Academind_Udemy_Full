/* 

It seems like you are using this code in a Deno environment rather than Node.js. 

The "require" function is specific to "CommonJS modules" used in Node.js and 
is not available in Deno, which uses "ECMAScript modules (ESM)".

In Deno, you can use the "import" syntax for module loading. 

Here's how you can modify your code:

import { writeTextFile } from "https://deno.land/std/fs/mod.ts";

const data = "Hello, world!";

writeTextFile("example.txt", data)
  .then(() => {
    console.log("File written successfully!");
  })
  .catch((error) => {
    console.error("Error writing file:", error);
  });


In Deno, the standard library module for file operations is https://deno.land/std/fs/mod.ts. 

The "writeTextFile" function is used for writing data to a file asynchronously. 

Note that the syntax and APIs are different in Deno compared to Node.js.

Ensure you have the necessary permissions to write to the file by running your 
script with the "--allow-write" flag:

--> bash

deno run --allow-write app_02.js

*/

/* using callback in Node.js environment
-----------------------------------------*/

// const { writeFile } = require("fs");

// const text = "This should be store in a file again";
// writeFile("test-nodejs.txt", text, (err, data) => {
//   if (err) console.log(err);
//   console.log("Written to file");
// });

/* using promises in Node.js environment 
----------------------------------------*/

// const { writeFile } = require("fs").promises;

// const text = "This should be store in a file again";
// writeFile("test-nodejs.txt", text).then(() => {
//   console.log("Written to file");
// });

/* using async/await in Node.js environment 
--------------------------------------------*/

// const { writeFile } = require("fs").promises;

// async function writeToTestFile() {
//   const text = "This should be stored in a file again";

//   try {
//     await writeFile("test-nodejs.txt", text);
//     console.log("Written to file");
//   } catch (error) {
//     console.error("Error writing to file:", error);
//   }
// }

// writeToTestFile();

/* in Deno environment: using await
--------------------------------------------------*/

// import { writeFile } from "node:fs/promises";
// const text = "This should be store in a file again";
// console.log("before: Written to file");
// await writeFile("test-nodejs.txt", text).then(() => {
//   console.log("after: Written to file");
// });

// console.log("Awaited for previous code to run !");

/* in Deno environment: using .then()
--------------------------------------------------*/

import { writeFile } from "node:fs/promises";

const text = "This should be store in a file again";
console.log("before: Written to file");
writeFile("test-nodejs.txt", text).then(() => {
  console.log("after: Written to file");
});

console.log("Awaited for previous code to run ?");
