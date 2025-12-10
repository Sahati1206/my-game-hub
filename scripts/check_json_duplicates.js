const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../src/data/games.json');
const txt = fs.readFileSync(file, 'utf8');
// crude split of top-level objects
let idx = 0;
let inString = false;
let braceDepth = 0;
let objStarts = [];
for (let i=0;i<txt.length;i++){
  const ch = txt[i];
  if (ch === '"'){
    // handle escapes
    let esc = 0; let j=i-1; while (j>=0 && txt[j]==='\\'){ esc++; j--; }
    if (esc%2===0) inString = !inString;
  }
  if (!inString){
    if (ch==='{'){
      if (braceDepth===0) objStarts.push(i);
      braceDepth++;
    } else if (ch==='}'){
      braceDepth--;
    }
  }
}
const objs = [];
for (let s of objStarts){
  // find matching closing brace
  let depth=0; let end=-1; inString=false;
  for (let i=s;i<txt.length;i++){
    const ch = txt[i];
    if (ch === '"'){
      let esc = 0; let j=i-1; while (j>=0 && txt[j]==='\\'){ esc++; j--; }
      if (esc%2===0) inString = !inString;
    }
    if (!inString){
      if (txt[i]==='{') depth++;
      else if (txt[i]==='}'){ depth--; if (depth===0){ end=i; break; } }
    }
  }
  if (end>-1){ objs.push(txt.slice(s,end+1)); }
}
let problem=false;
objs.forEach((o,idx)=>{
  const keys = [];
  const re = /"([^"]+)"\s*:/g;
  let m;
  while ((m=re.exec(o))!==null){ keys.push(m[1]); }
  const dupes = keys.filter((k,i)=> keys.indexOf(k)!==i);
  const uniqueDupes = Array.from(new Set(dupes));
  if (uniqueDupes.length>0){
    problem=true;
    console.log(`Object #${idx+1} has duplicate keys: ${uniqueDupes.join(', ')}`);
  }
});
if (!problem) console.log('No duplicate keys detected in top-level objects.');
