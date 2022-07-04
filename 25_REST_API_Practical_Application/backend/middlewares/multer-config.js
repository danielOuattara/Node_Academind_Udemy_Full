// const multer = require("multer");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };

// const fileFilter = (req, file, cb) => {
//   // STAND BY
//   if (
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// // const fileFilter2 = (req, file, cb) => {
// //   Object.keys(MIME_TYPES).forEach((key) => {
// //     if (file.mimetype !== key) {
// //       cb(null, true);
// //     } else {
// //       cb(null, false);
// //     }
// //   });
// // };

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });

// module.exports = multer({ storage: fileStorage, fileFilter }).single("image");

// const multer = require('multer');

// const MIME_TYPES = {
//     'image/jpg':  'jpg',
//     'image/jpeg': 'jpg',
//     'image/png':  'png',
// }

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => callback( null, 'images'),
//     filename:(req, file, callback) => {
//             const name = file.originalname.split(' ').join('_').split('.').slice(0, -1);
//             const extension = MIME_TYPES[file.mimetype];
//             callback( null, name + ('_') + Date.now() + '.' + extension);
//     }
// });

// module.exports = multer( {storage}).single('image');


//------------------------------------------------------------------
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

module.exports = multer({ storage }).single("image");
