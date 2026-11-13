/* Builds data/schema.js (embedded SQL) and the per-console starter files in starters/. Run: node scripts/build-data.cjs */
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const root=path.resolve(__dirname,'..'),Core=require(path.join(root,'src/core.js'));
const write=(file,data)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};

/* built-in fonts: data/fonts.js is the source of truth (committed) */
const builtins=new Function(fs.readFileSync(path.join(root,'data/fonts.js'),'utf8')+';return FontLabBuiltins')();

/* embedded SQL for the "copy setup" button */
write(path.join(root,'data/schema.js'),'/* Generated from cloud/fontlab.sql */\nconst FontLabSchema='+JSON.stringify(fs.readFileSync(path.join(root,'sql/fontlab.sql'),'utf8'))+';\n');

/* PNG encoder for the starter sheets */
const crcT=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0;});
const crc=b=>{let c=~0;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return(~c)>>>0;};
const chunk=(t,d)=>{const b=Buffer.alloc(12+d.length);b.writeUInt32BE(d.length,0);b.write(t,4,'latin1');d.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,8+d.length)),8+d.length);return b;};
function png(w,h,rgba){const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;Buffer.from(rgba.buffer,y*w*4,w*4).copy(raw,y*(w*4+1)+1);}
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}

/* starter files per console: blank + Thai base (from the classic built-in) */
const base=builtins[0],index=[];
for(const c of Core.CONSOLES){
 const dir=path.join(root,'starters',c.id);
 const blank=Core.starter(c.id,'blank',base),seeded=Core.starter(c.id,'thai-base',base);
 for(const [tag,p] of [['blank',blank],['thai-base',seeded]]){p.id='starter-'+c.id+'-'+tag;p.updatedAt=0;}
 const files={};
 for(const [tag,p] of [['blank',blank],['thai-base',seeded]]){
  files[c.id+'-'+tag+'.fontlab.json']=JSON.stringify(p);
  const s=Core.renderSheet(p,{guide:tag==='blank'});files[c.id+'-'+tag+'-sheet.png']=png(s.width,s.height,s.rgba);
  files[c.id+'-'+tag+'.bin']=Buffer.from(Core.exportBank(p));
  files[c.id+'-'+tag+'-README.txt']=Core.readme(p);
 }
 for(const [n,d] of Object.entries(files))write(path.join(dir,n),d);
 index.push({console:c.id,files:Object.keys(files)});
}
write(path.join(root,'starters/index.json'),JSON.stringify(index,null,1)+'\n');
console.log('fonts:',builtins.map(b=>b.id+' '+b.glyphs.length+' '+b.w+'x'+b.h).join(', '),'\nstarters:',index.length,'consoles');
