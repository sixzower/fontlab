/* Generates FontLab's logo SVGs and PNG/ICO icons. Run: node scripts/build_fontlab_icons.cjs */
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const out=path.resolve(__dirname,'../fontlab');
const F=['11111','10000','11110','10000','10000','10000','10000'];
function svg({rounded=true,scale=1}={}){
 const c=6,w=5*c,h=7*c,x0=(64-w)/2-1,y0=(64-h)/2-1;let sh='',fg='';
 F.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1'){sh+=`<rect x="${x0+x*c+1.5}" y="${y0+y*c+1.5}" width="${c}" height="${c}"/>`;fg+=`<rect x="${x0+x*c}" y="${y0+y*c}" width="${c}" height="${c}"/>`;}}));
 const acc=`<rect x="${x0+4*c}" y="${y0+2*c}" width="${c}" height="${c}" fill="#ffd60a"/>`;
 const bg=rounded?'<rect width="64" height="64" rx="14.5" fill="url(#g)"/>':'<rect width="64" height="64" fill="url(#g)"/>';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d9bff"/><stop offset="1" stop-color="#5e4ce0"/></linearGradient></defs>${bg}<g transform="translate(32 32) scale(${scale}) translate(-32 -32)"><g fill="#1a1a6e" opacity=".32">${sh}</g><g fill="#fff">${fg}</g>${acc}</g></svg>\n`;}
fs.writeFileSync(path.join(out,'icon.svg'),svg());
fs.writeFileSync(path.join(out,'logo.svg'),svg());
(async()=>{const b=await chromium.launch(),p=await b.newPage();
 const png=async(file,size,s)=>{await p.setViewportSize({width:size,height:size});await p.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:'+size+'px;height:'+size+'px}</style>'+s);fs.writeFileSync(path.join(out,file),await p.screenshot({omitBackground:true,type:'png'}));};
 await png('icon-512.png',512,svg());await png('icon-192.png',192,svg());await png('favicon-32.png',32,svg());
 await png('apple-touch-icon.png',180,svg({rounded:false}));await png('icon-maskable-512.png',512,svg({rounded:false,scale:.78}));
 await b.close();
 const png32=fs.readFileSync(path.join(out,'favicon-32.png')),h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png32.length,14);h.writeUInt32LE(22,18);
 fs.writeFileSync(path.join(out,'favicon.ico'),Buffer.concat([h,png32]));
 fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({name:'FontLab',short_name:'FontLab',description:'สร้างฟอนต์บิตแมปสำหรับเกมบนเอมูเลเตอร์ทุกเครื่อง',lang:'th',start_url:'./index.html',scope:'./',display:'standalone',background_color:'#f2f2f7',theme_color:'#007aff',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'},{src:'icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,1)+'\n');
 console.log('icons ok');})();
