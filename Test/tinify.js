const tinify = require("tinify");
tinify.key = "xkV7PYgXyydQPXsLS5YRGEOEM6w2ZwZt";
const path = require('path')
const fs = require("fs");
const publicPath = './images'

handleDir(path.resolve(__dirname, publicPath))

function handleDir(dirPath) {
  console.log('开始读取目录: ', dirPath)
  fs.readdir(dirPath, function (err, dir) {
    if (err) throw err
    if (dir instanceof Array) dir.forEach(i => {
      const nowPath = path.resolve(dirPath, i)
      const stats = fs.statSync(nowPath)
      if (stats.isFile()) {
        handleFile(nowPath, (err, resData) => {
          if (err) throw err
          wiriteFile(nowPath, resData, (err) => {
            if (err) throw err
            console.log(nowPath, '写入成功')
          })
        })
      } else if (stats.isDirectory()) {
        handleDir(nowPath)
      }
    })
  })
}


function handleFile (fsPath, cb) {
  fs.readFile(fsPath, function(err, sourceData) {
    if (err) throw err;
    tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
      try {
        if (err) throw err;
      } catch (error) {
        console.log(fsPath, '压缩失败, 失败原因: ')
        console.log(error.message)
      }
      console.log(fsPath, '压缩成功')
      cb(null, resultData)
    });
  });
}

function wiriteFile(fsPath, resData, cb) {
  fs.writeFile(fsPath, resData, {
  }, (err) => {
    if (err) throw err
    cb()
  })
}