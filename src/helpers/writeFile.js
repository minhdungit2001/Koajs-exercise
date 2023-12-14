const fs = require("fs");
const path = require("path");

/**
 * Write file json
 * @param {String} filePath of file result
 * @param {JSON} data result data want to write
 */
const writeToFileJson = function (filePath, data) {
  const filePathStatic = path.join(__dirname, filePath);
  const jsonData = JSON.stringify(data);

  fs.writeFile(filePathStatic, jsonData, (err) => {
    if (err) {
      console.error(`Write file ${filePathStatic} error:`, err);
    } else {
      console.log(`Write file ${filePathStatic} success.`);
    }
  });
};

module.exports = {
  writeToFileJson,
};
