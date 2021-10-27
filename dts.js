const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require('path');

mkdirp("./dist/src/types");

const walk = function (dir, done) {
  const results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const findFiles = async (dir) => {
  return new Promise((resolve) => {
    walk(dir, (err, list) => {
      resolve(list);
    });
  });
};

(async() => {
  const files = await findFiles('./src/types');
  files.forEach(filepath => {
    const outputPath = process.cwd() + '\\dist' + filepath.replace(process.cwd(), '');
    console.log(outputPath);
    fs.writeFileSync(outputPath, fs.readFileSync(filepath, 'utf-8'));
  });
})();
