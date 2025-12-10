const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../src/index.css');
const txt = fs.readFileSync(file, 'utf8');
const lines = txt.split(/\r?\n/);
for (let i=0;i<lines.length;i++){
  if (i+1>=60 && i+1<=90) console.log((i+1).toString().padStart(3,' ')+': '+lines[i]);
}
