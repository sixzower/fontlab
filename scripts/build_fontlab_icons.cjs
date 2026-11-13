/* Generates FontLab's logo SVGs and PNG/ICO icons. Run: node scripts/build_fontlab_icons.cjs */
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const out=path.resolve(__dirname,'../fontlab');
/* Official logo = option 9 of the candidates (pencil + pixel trail), kept in logo-options/option-9.svg */
const src=fs.readFileSync(path.join(out,'logo-options/option-9.svg'),'utf8');
const m=src.match(/^(<svg[^>]*>)(<defs>.*?<\/defs>)<rect width="64" height="64" rx="14.5" fill="url\(#g\)"\/>(.*)<\/svg>\s*$/s);
if(!m)throw Error('option-9.svg has an unexpected shape');
function svg({rounded=true,scale=1}={}){return m[1]+m[2]+`<rect width="64" height="64"${rounded?' rx="14.5"':''} fill="url(#g)"/>`+(scale===1?m[3]:`<g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${m[3]}</g>`)+'</svg>\n';}
fs.writeFileSync(path.join(out,'icon.svg'),svg());
fs.writeFileSync(path.join(out,'logo.svg'),svg());
(async()=>{const b=await chromium.launch(),p=await b.newPage();
 const png=async(file,size,s)=>{await p.setViewportSize({width:size,height:size});await p.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:'+size+'px;height:'+size+'px}</style>'+s);fs.writeFileSync(path.join(out,file),await p.screenshot({omitBackground:true,type:'png'}));};
 await png('icon-512.png',512,svg());await png('icon-192.png',192,svg());await png('favicon-32.png',32,svg());
 await png('apple-touch-icon.png',180,svg({rounded:false}));await png('icon-maskable-512.png',512,svg({rounded:false,scale:.78}));
 await b.close();
 const png32=fs.readFileSync(path.join(out,'favicon-32.png')),h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png32.length,14);h.writeUInt32LE(22,18);
 fs.writeFileSync(path.join(out,'favicon.ico'),Buffer.concat([h,png32]));
 fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({name:'FontLab',short_name:'FontLab',description:'สร้างฟอนต์บิตแมปสำหรับเกมบนเอมูเลเตอร์ทุกเครื่อง',lang:'th',start_url:'./index.html',scope:'./',display:'standalone',background_color:'#ffffff',theme_color:'#ffffff',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'},{src:'icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,1)+'\n');
 console.log('icons ok');})();
