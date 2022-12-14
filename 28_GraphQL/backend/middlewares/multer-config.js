const multer = require("multer");
//------------------------------------------------------------------

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage: fileStorage, fileFilter }).single("image");

//------------------------------------------------------------

// const multer = require("multer");

// const multerConfig = (req, res, next) => {
//   const fileStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "images");
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "_" + file.originalname);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     if (
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
//   return multer({ storage: fileStorage, fileFilter }).single("image");
// };

// //------------------------------------------------------------------
// module.exports = multerConfig;
