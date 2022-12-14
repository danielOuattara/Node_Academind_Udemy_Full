const fs = require("fs");

module.exports = clearFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) throw new Error(error.message);
  });
};
