// const fs = require("fs");

// const handler = (req, res, next) => {
//   fs.readFile("my-page.html", "utf8", (err, data) => {
//     res.send(data);
//   });
// };

// module.exports = handler;

//-------------------------------------------------------------

// import { readFile } from "fs/promises";

// OK !
// const handler = (req, res, next) => {
//   readFile("my-page.html", "utf8")
//     .then((data) => res.send(data))
//     .catch((err) => console.log(err));
// };

//-------------------------------------------------------------

// OK ! async/await
// import { readFile } from "fs/promises";
// const handler = async (req, res, next) => {
//   try {
//     const data = await readFile("my-page.html", "utf8");
//     await res.send(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default handler;
//-------------------------------------------------------------

// OK ! .then/.catch()
import { readFile } from "fs/promises";
const handler = async (req, res, next) => {
  readFile("my-page.html", "utf8")
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};

export default handler;
