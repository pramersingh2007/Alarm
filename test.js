const fs = require('fs');
let html = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.html', 'utf8');
console.log(html.includes('.right-panel-content {'));
