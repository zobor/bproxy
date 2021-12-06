const fs = require('fs');

const html = fs.readFileSync('./dist/index.html', 'utf-8');

fs.writeFileSync('./dist/index.html', html.replace(/\.\/src\/web\/libs/g, '/dist/src/web/libs'));

fs.writeFileSync('./dist/src/web/libs/socket.io.min.js', fs.readFileSync('./src/web/libs/socket.io.min.js', 'utf-8'));
