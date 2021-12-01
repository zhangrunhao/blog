var fs = require("fs");

var PATH = "./icons"; // 目录

//  遍历目录得到文件信息
function walk(path, callback) {
  var files = fs.readdirSync(path);
  files.forEach(function (file) {
    if (fs.statSync(path + "/" + file).isFile()) {
      callback(path, file);
    }
  });
}

// 修改文件名称
function rename(oldPath, newPath) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      throw err;
    }
  });
}

function toUp(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}
// 运行
walk(PATH, function (path, fileName) {
  var oldPath = path + "/" + fileName; // 源文件路径
  var arr = fileName.split("-");
  var res = ""
  arr.forEach(i => {
    res += toUp(i)
  })
  var newPath = path + "/" + res;
   rename(oldPath, newPath);
});
