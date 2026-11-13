/* Logo candidates for FontLab -> icons/options/option-N.svg and a contact sheet PNG. Run: node scripts/build-logo-options.cjs */
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const out=path.resolve(__dirname,'../icons/options');fs.mkdirSync(out,{recursive:true});
const builtins=new Function(fs.readFileSync(path.resolve(__dirname,'../data/fonts.js'),'utf8')+';return FontLabBuiltins')();
const sword=builtins.find(b=>b.id==='builtin-sword-shield-th');
const glyphRows=ch=>{const g=sword.glyphs.find(x=>x.c===ch),rows=[];for(let y=0;y<16;y++)rows.push(g.p.slice(y*16,y*16+16));return rows;};
const rows2=(r,x0,y0,c,fills)=>{let s='';r.forEach((row,y)=>{let x=0;while(x<row.length){const v=row[x];if(v==='0'||v==='.'||v===' '){x++;continue;}let e=x;while(e<row.length&&row[e]===v)e++;s+=`<rect x="${x0+x*c}" y="${y0+y*c}" width="${(e-x)*c}" height="${c}" fill="${fills[v]}"${fills.op?.[v]?` opacity="${fills.op[v]}"`:''}/>`;x=e;}});return s;};
const bbox=rows=>{let x0=99,y0=99,x1=-1,y1=-1;rows.forEach((r,y)=>[...r].forEach((v,x)=>{if(v!=='0'){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}));return{x0,y0,w:x1-x0+1,h:y1-y0+1};};
const crop=rows=>{const b=bbox(rows);return rows.slice(b.y0,b.y0+b.h).map(r=>r.slice(b.x0,b.x0+b.w));};
const centered=(rows,c,fills,dx=0,dy=0)=>{const w=rows[0].length*c,h=rows.length*c;return rows2(rows,32-w/2+dx,32-h/2+dy,c,fills);};
const tile=(bg,inner,{rx=14.5,defs=''}={})=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><defs>${defs}</defs><rect width="64" height="64" rx="${rx}" fill="${bg}"/>${inner}</svg>\n`;
const grad=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const F=['11111','10000','11110','10000','10000','10000','10000'],L=['10000','10000','10000','10000','10000','10000','11111'];
const dark='url(#g)',gd=grad('g','#3a3a3c','#0a0a0b');
const classic=builtins[0];const classicRows=ch=>{const g=classic.glyphs.find(x=>x.c===ch),r=[];for(let y=0;y<16;y++)r.push(g.p.slice(y*8,y*8+8));return r;};
const thai=(ch,mainFill,shFill,bg,defs,src)=>{const rows=crop((src?classicRows(ch):glyphRows(ch))),c=Math.floor(40/Math.max(rows[0].length,rows.length));return tile(bg,centered(rows,c,{1:mainFill,2:shFill}),{defs});};
const opts=[
 ['F พิกเซล + เคอร์เซอร์',tile(dark,centered(F.map(r=>r.replace(/1/g,'2')),6,{2:'#000',op:{2:.45}},1.5,1.5)+centered(F,6,{1:'#fff'})+'<rect x="35" y="22" width="6" height="6" fill="#ffd60a"/>',{defs:gd})],
 ['ฟ ฟอนต์ไทยจากเกม',thai('ฟ','#fff','#8e8e93',dark,gd,true)],
 ['ก บนพื้นขาว',thai('ก','#1c1c1e','#aeaeb2','#f2f2f7','')],
 ['ขวดทดลอง (Lab)',tile(dark,centered(['00011111000','00001001000','00001001000','00010000100','00100000010','01000000001','01022222201','01022222201','01122222211','01111111111'],4.6,{1:'#fff',2:'#ffd60a'},0,2)+'<rect x="26" y="9" width="3" height="3" fill="#fff" opacity=".7"/><rect x="33" y="5" width="3" height="3" fill="#fff" opacity=".5"/>',{defs:gd})],
 ['ตลับเกม + F',(()=>{const base=['001111111100','011111111110','111111111111','112222222211','112222222211','112222222211','112222222211','112222222211','112222222211','112222222211','111111111111','111111111111','110101010111'];const c=3.8,w=12*c,h=13*c,x0=32-w/2,y0=32-h/2;return tile(dark,rows2(base,x0,y0,c,{1:'#d1d1d6',2:'#f5f5f7'})+rows2(F,x0+3.5*c,y0+3.5*c,c*0.96,{1:'#1c1c1e'}),{defs:gd});})()],
 ['FL โมโนแกรม',tile('#f5f5f7',rows2(F,6,17,5.4,{1:'#1c1c1e'})+rows2(L,34,17,5.4,{1:'#ff9f0a'}))],
 ['D-pad เครื่องเกม',tile(dark,centered(['000111000','000111000','000111000','111111111','111121111','111111111','000111000','000111000','000111000'],4.8,{1:'#f5f5f7',2:'#8e8e93'})+'<rect x="46" y="13" width="5" height="5" fill="#ffd60a"/>',{defs:gd})],
 ['ช่องกริดไทล์ 8×8',(()=>{let g='';for(let i=1;i<8;i++)g+=`<path d="M${8+i*6} 8v48M8 ${8+i*6}h48" stroke="#fff" stroke-opacity=".14"/>`;return tile(dark,g+'<rect x="38" y="14" width="6" height="6" fill="#ff9f0a"/>'+rows2(F,14,8,6,{1:'#fff'}).replace(/<rect /g,'<rect '),{defs:gd}).replace('<rect x="38" y="14" width="6" height="6" fill="#ff9f0a"/>','')+'';})()],
 ['ดินสอ + เส้นพิกเซล',tile(dark,'<g transform="rotate(45 32 28)"><rect x="28" y="6" width="8" height="30" fill="#fff"/><rect x="28" y="6" width="8" height="5" fill="#ff9f0a"/><path d="M28 36h8l-4 9z" fill="#d1d1d6"/><path d="M30.5 41.5h3l-1.5 3.5z" fill="#1c1c1e"/></g><rect x="14" y="50" width="6" height="6" fill="#fff"/><rect x="20" y="50" width="6" height="6" fill="#fff"/><rect x="26" y="50" width="6" height="6" fill="#fff" opacity=".5"/>',{defs:gd})]
];
const files=[];opts.forEach(([name,svg],i)=>{const f=`option-${i+1}.svg`;fs.writeFileSync(path.join(out,f),svg);files.push([name,svg]);});
const html='<style>body{margin:0;padding:28px;background:#fff;font:16px/1.3 -apple-system,"Noto Sans Thai",Prompt,sans-serif;color:#1c1c1e;width:1080px}h1{margin:0 0 20px;font-size:26px}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}.c{text-align:center}.c svg{width:200px;height:200px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.2))}.row{display:flex;justify-content:center;gap:10px;align-items:center;margin:8px 0}.row svg{filter:none;width:32px;height:32px}.row svg:nth-child(2){width:18px;height:18px}.n{font-weight:700;margin-top:6px}</style><h1>FontLab · ตัวเลือกโลโก้</h1><div class="g">'+files.map(([n,s],i)=>`<div class="c">${s}<div class="row">${s}${s}</div><div class="n">${i+1}. ${n}</div></div>`).join('')+'</div>';
fs.writeFileSync(path.join(out,'index.html'),html.replace('<style>','<!doctype html><meta charset="utf-8"><title>FontLab logo options</title><style>'));
(async()=>{const b=await chromium.launch(),p=await b.newPage({deviceScaleFactor:2,viewport:{width:1140,height:900}});await p.setContent(html);await p.screenshot({path:path.join(out,'options.png'),fullPage:true});await b.close();console.log('options',opts.length);})();
