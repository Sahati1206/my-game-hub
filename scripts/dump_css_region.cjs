const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../src/index.css');
const txt = fs.readFileSync(file, 'utf8');
const lines = txt.split(/\r?\n/);
for (let i=1;i<=120;i++){
  const l = lines[i-1] || '';
  console.log(String(i).padStart(3,' ')+': '+l);
}
