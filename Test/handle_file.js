const fs = require("fs");
const path = require("path");
const folderPath = path.resolve("./Test/cates");
// fs.readdir(folderPath, function (err, files) {
//   if (err) throw err;
//   files.forEach(file => {
//     const oldPath = folderPath + '/' + file;
//     const newPath = folderPath + '/' + file.replace(/ /g, '_');
//     fs.rename(oldPath, newPath, (err) => {
//       if (err) throw err;
//       console.log('File renamed from ' + oldPath + ' to ' + newPath);
//     });
//   });
// })

fs.readdir(folderPath, function (err, files) {
  if (err) throw err;
  files.forEach(file => {
    console.log(file);
  });
})
