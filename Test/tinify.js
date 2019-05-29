const tinify = require("tinify");
tinify.key = "YOUR_API_KEY";

const fs = require("fs");
fs.readFile("unoptimized.jpg", function(err, sourceData) {
  if (err) throw err;
  tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
    if (err) throw err;
    // ...
  });
});