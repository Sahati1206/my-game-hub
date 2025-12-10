const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../src/index.css');
const txt = fs.readFileSync(file, 'utf8');
let line = 1;
let stack = [];
let inComment = false;
let inString = false;
for (let i=0;i<txt.length;i++){
  const ch = txt[i];
  if (ch==='\n') line++;
  // handle comments /* */
  if (!inString && txt.substr(i,2)==='/*'){ inComment=true; i++; continue; }
  if (inComment && txt.substr(i,2)==='*/'){ inComment=false; i++; continue; }
  if (inComment) continue;
  if (ch==='"' || ch==="'"){
    inString = !inString;
    continue;
  }
  if (inString) continue;
  if (ch==='{') stack.push({ch, pos:i, line});
  if (ch==='}') {
    if (stack.length===0){
      console.log('Extra closing brace at', line);
    } else stack.pop();
  }
}
if (stack.length>0) {
  console.log('Unclosed blocks start lines:', stack.map(s=>s.line).join(', '));
} else console.log('All braces matched.');
