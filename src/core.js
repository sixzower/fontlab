/* FontLab core: console tile formats, project model, sheet/bank import-export. Runs in the browser and in Node. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FontLabCore=api;})(typeof self!=='undefined'?self:this,function(){
'use strict';
const code=(p,i)=>p.charCodeAt(i)-48;

/* ---------- tile formats: pack(8x8 indices) -> bytes, unpack(bytes,offset) -> 64 indices ---------- */
function planar(name,bpp,seq){return{name,bpp,bytes:seq.length,
 pack(t){return seq.map(([p,y])=>{let v=0;for(let x=0;x<8;x++)v|=((t[y*8+x]>>p)&1)<<(7-x);return v;});},
 unpack(b,o=0){const t=new Array(64).fill(0);seq.forEach(([p,y],i)=>{for(let x=0;x<8;x++)t[y*8+x]|=((b[o+i]>>(7-x))&1)<<p;});return t;}};}
const rowsOf=planes=>{const s=[];for(let y=0;y<8;y++)for(const p of planes)s.push([p,y]);return s;};
const planeMajor=planes=>{const s=[];for(const p of planes)for(let y=0;y<8;y++)s.push([p,y]);return s;};
function nibble(name,highFirst){return{name,bpp:4,bytes:32,
 pack(t){const o=[];for(let i=0;i<64;i+=2){const a=t[i]&15,b=t[i+1]&15;o.push(highFirst?(a<<4)|b:(b<<4)|a);}return o;},
 unpack(b,o=0){const t=new Array(64);for(let i=0;i<32;i++){const v=b[o+i];t[i*2]=highFirst?v>>4:v&15;t[i*2+1]=highFirst?v&15:v>>4;}return t;}};}
const FORMATS={
 p1:planar('1bpp planar',1,rowsOf([0])),
 gb2:planar('2bpp interleaved (Game Boy, SNES)',2,rowsOf([0,1])),
 nes2:planar('2bpp planar (NES CHR)',2,planeMajor([0,1])),
 snes4:planar('4bpp planar (SNES)',4,[...rowsOf([0,1]),...rowsOf([2,3])]),
 sms4:planar('4bpp planar (Master System / Game Gear)',4,rowsOf([0,1,2,3])),
 md4:nibble('4bpp packed, left pixel in high nibble (Mega Drive)',true),
 gba4:nibble('4bpp packed, left pixel in low nibble (GBA / DS)',false),
 lin4:{name:'4bpp linear bitmap rows, low nibble first',bpp:4,linear:true,
  pack(f){const o=[];for(let i=0;i<f.length;i+=2)o.push(((f[i+1]||0)&15)<<4|(f[i]&15));return o;},
  unpack(b,o,n){const f=[];for(let i=0;i<n;i++){const v=b[o+(i>>1)]||0;f.push(i&1?v>>4:v&15);}return f;},size:n=>Math.ceil(n/2)},
 lin8:{name:'8bpp linear bitmap rows',bpp:8,linear:true,
  pack:f=>f.map(v=>v&255),unpack:(b,o,n)=>Array.from({length:n},(_,i)=>b[o+i]||0),size:n=>n}
};

/* ---------- consoles ---------- */
const CONSOLES=[
 {id:'gb',name:'Game Boy',short:'GB',maker:'Nintendo',year:1989,formats:{2:'gb2'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#c4cfa1', '#1a2314', '#6b7b4a', '#8b956d'],tint:'#7fa21f',icon:'handheld-v',group:'handheld',kind:'tile',notes:'ไทล์ 8×8 สี 2 บิตแบบ interleaved ฟอนต์ไทยมักใช้ 2 ไทล์ซ้อนกัน (8×16) เพื่อให้มีที่สำหรับสระและวรรณยุกต์'},
 {id:'gbc',name:'Game Boy Color',short:'GBC',maker:'Nintendo',year:1998,formats:{2:'gb2'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#f4f1e8', '#2b2d42', '#8d99ae', '#ef476f'],tint:'#8e5bd6',icon:'handheld-v',group:'handheld',kind:'tile',notes:'รูปแบบไทล์เหมือน Game Boy แต่แต่ละพาเลตมีสีของตัวเอง ดัชนี 0 ใช้เป็นพื้นโปร่ง'},
 {id:'gba',name:'Game Boy Advance',short:'GBA',maker:'Nintendo',year:2001,formats:{4:'gba4'},bpp:4,cell:[16, 16],cells:[[8, 16], [16, 16], [16, 12], [12, 12]],colors:['#e9e4f5', '#2d2a4a', '#8a82c4', '#ff6b6b'],tint:'#6d4fd6',icon:'handheld-w',group:'handheld',kind:'tile',notes:'4 บิตแบบ packed พิกเซลซ้ายอยู่ nibble ล่าง ฟอนต์ Pokémon ไทยในคลังเป็นกริด 16×16 พร้อมเงา'},
 {id:'nds',name:'Nintendo DS',short:'DS',maker:'Nintendo',year:2004,formats:{4:'gba4'},bpp:4,cell:[16, 16],cells:[[8, 16], [16, 16], [12, 12]],colors:['#f2f2f7', '#1c1c1e', '#8e8e93', '#34c759'],tint:'#9ea3ad',icon:'dual',group:'handheld',kind:'tile',notes:'ไทล์ 4 บิตแบบเดียวกับ GBA ใช้กับ NCGR/NFTR หลังแปลงผ่านเครื่องมือภายนอก'},
 {id:'psp',name:'PlayStation Portable',short:'PSP',maker:'Sony',year:2004,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#101418', '#f4f6f8', '#7f8a96', '#3ddc97'],tint:'#2b2f3a',icon:'handheld-w',group:'handheld',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น เกมจำนวนมากบนเครื่องนี้ใช้ฟอนต์เวกเตอร์หรือภาพลบรอยหยักที่ไม่ใช่พิกเซลล้วน ซึ่งต้องตรวจก่อนว่าเกมใช้แบบไหน'},
 {id:'gg',name:'Game Gear',short:'GG',maker:'Sega',year:1990,formats:{4:'sms4'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16]],colors:['#101820', '#f8f8f8', '#6f8fbf', '#e0584a'],tint:'#4f6fe0',icon:'handheld-w',group:'handheld',kind:'tile',notes:'4 บิต planar แบบเดียวกับ Master System (4 ไบต์ต่อ 1 แถวพิกเซล)'},
 {id:'ngp',name:'Neo Geo Pocket',short:'NGP',maker:'SNK',year:1998,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#121814', '#f2f5ef', '#7d8f80', '#ff6f4d'],tint:'#e8684a',icon:'handheld-w',group:'handheld',kind:'generic',notes:'เครื่องใช้ไทล์ 8×8 แบบ 2 บิตของตัวเอง ที่นี่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ใช้ PNG sheet เป็นหลัก'},
 {id:'ws',name:'WonderSwan',short:'WS',maker:'Bandai',year:1999,formats:{2:'gb2'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16]],colors:['#dfe7e2', '#14201a', '#6f8478', '#2fa58b'],tint:'#2fa58b',icon:'handheld-v',group:'handheld',kind:'tile',notes:'โหมดขาวดำใช้ไทล์ 2 บิตแบบ planar ใกล้เคียง Game Boy ตรวจกับตัวเกมก่อนนำไปแทนที่'},
 {id:'nes',name:'Famicom / NES',short:'NES',maker:'Nintendo',year:1983,formats:{2:'nes2'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16]],colors:['#0f0f0f', '#fcfcfc', '#7c7c7c', '#bcbcbc'],tint:'#e0453f',icon:'pad',group:'home',kind:'tile',notes:'CHR 2 บิตแบบ planar: 8 ไบต์ของ plane 0 ตามด้วย 8 ไบต์ของ plane 1 ต่อไทล์'},
 {id:'snes',name:'Super Famicom / SNES',short:'SNES',maker:'Nintendo',year:1990,formats:{2:'gb2',4:'snes4'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#1d1b2e', '#f5f0ff', '#7a6fb0', '#e8b84a'],tint:'#8f7be8',icon:'pad',group:'home',kind:'tile',notes:'รองรับ 2 บิต (ฉากข้อความ) และ 4 บิต planar แบบ SNES'},
 {id:'n64',name:'Nintendo 64',short:'N64',maker:'Nintendo',year:1996,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#0f1a14', '#f1f7f3', '#6f8f7c', '#e5483b'],tint:'#2ba66a',icon:'pad',group:'home',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'ps1',name:'PlayStation 1',short:'PS1',maker:'Sony',year:1994,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[12, 12], [16, 16], [24, 24]],colors:['#14141c', '#f2f2f7', '#8e8ea0', '#ff9f0a'],tint:'#7a7f8c',icon:'pad',group:'home',kind:'texture',notes:'บิตแมปเส้นตรง (ไม่แบ่งไทล์) แบบ 4 หรือ 8 บิตแบบ CLUT เหมาะกับ TIM/ฟอนต์ที่ตัดเป็นช่อง'},
 {id:'md',name:'Mega Drive / Genesis',short:'MD',maker:'Sega',year:1988,formats:{4:'md4'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#0b132b', '#f1f5f9', '#5bc0be', '#f2b134'],tint:'#222733',icon:'pad',group:'home',kind:'tile',notes:'4 บิตแบบ packed พิกเซลซ้ายอยู่ nibble บน ไทล์ละ 32 ไบต์'},
 {id:'sms',name:'Master System',short:'SMS',maker:'Sega',year:1985,formats:{4:'sms4'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16]],colors:['#101820', '#f8f8f8', '#6f8fbf', '#e0584a'],tint:'#d9453f',icon:'console',group:'home',kind:'tile',notes:'4 บิต planar แบบแถวต่อแถว (4 ไบต์ต่อ 1 แถวพิกเซล)'},
 {id:'mcd',name:'Mega CD',short:'MCD',maker:'Sega',year:1991,formats:{4:'md4'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#0b132b', '#f1f5f9', '#5bc0be', '#f2b134'],tint:'#3a6fd6',icon:'disc',group:'home',kind:'tile',notes:'ใช้ VDP เดียวกับ Mega Drive จึงเป็นไทล์ 4 บิตแบบเดียวกัน'},
 {id:'sat',name:'Sega Saturn',short:'SAT',maker:'Sega',year:1994,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#14161f', '#f2f4fa', '#8a92b0', '#e8593c'],tint:'#5f6b8a',icon:'console',group:'home',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'pce',name:'PC Engine',short:'PCE',maker:'NEC / Hudson',year:1987,formats:{4:'snes4'},bpp:4,cell:[8, 16],cells:[[8, 8], [8, 16], [16, 16]],colors:['#1a1308', '#fff4d6', '#b08a3e', '#e0653a'],tint:'#d49a2c',icon:'card',group:'home',kind:'tile',notes:'ไทล์ 4 บิต planar แบบเดียวกับ SNES 4bpp (plane 0/1 แล้ว plane 2/3) ตรวจกับตัวเกมก่อนแทนที่'},
 {id:'a2600',name:'Atari 2600',short:'2600',maker:'Atari',year:1977,formats:{1:'p1'},bpp:1,cell:[8, 16],cells:[[8, 8], [8, 16]],colors:['#1a0f08', '#f7e6c8', '#a1713a', '#d4551f'],tint:'#9a6b34',icon:'stick',group:'home',kind:'tile',notes:'สไปรต์ 1 บิต กว้าง 8 พิกเซล แถวละ 1 ไบต์ (บิตซ้ายสุด = พิกเซลซ้าย) ไม่มีเงา'},
 {id:'arc',name:'อาร์เคด (Neo Geo / CPS)',short:'ARC',maker:'หลายค่าย',year:0,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[8, 8], [16, 16], [32, 32]],colors:['#1c0a16', '#fff0f8', '#b06a96', '#ffcf3d'],tint:'#c43c86',icon:'arcade',group:'home',kind:'generic',notes:'บอร์ดอาร์เคดแต่ละรุ่นจัดรูปแบบกราฟิกต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ใช้ PNG sheet เป็นหลัก'},
 {id:'n3ds',name:'Nintendo 3DS',short:'3DS',maker:'Nintendo',year:2011,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#f2f2f7', '#1c1c1e', '#8e8e93', '#ff6a3d'],tint:'#e0583c',icon:'dual',group:'modern',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'ps2',name:'PlayStation 2',short:'PS2',maker:'Sony',year:2000,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#0e1118', '#f2f4f8', '#7a8497', '#4f8cff'],tint:'#3a56c4',icon:'tower',group:'modern',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'gcwii',name:'GameCube / Wii',short:'GC',maker:'Nintendo',year:2001,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#18142a', '#f4f1ff', '#8b80bd', '#ffb02e'],tint:'#8b6ad8',icon:'console',group:'modern',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'switch',name:'Nintendo Switch',short:'NSW',maker:'Nintendo',year:2017,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#1b1014', '#fdf1f3', '#b58a93', '#ff4d5e'],tint:'#e0586c',icon:'switch',group:'modern',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'dc',name:'Dreamcast',short:'DC',maker:'Sega',year:1998,formats:{4:'lin4',8:'lin8'},bpp:4,cell:[16, 16],cells:[[16, 16], [24, 24], [32, 32]],colors:['#1c1208', '#fff3e0', '#b89462', '#ff7a1a'],tint:'#e8963a',icon:'disc',group:'modern',kind:'texture',notes:'ฟอนต์ของเครื่องนี้มักเป็นเท็กซ์เจอร์ที่แต่ละเกมจัดรูปแบบต่างกัน ไบนารีที่ส่งออกเป็นบิตแมปเส้นตรงทั่วไป ไม่ใช่รูปแบบเฉพาะเครื่อง ใช้ PNG sheet เป็นหลักแล้วแปลงด้วยเครื่องมือของเกมนั้น'},
 {id:'custom',name:'เครื่องอื่น ๆ / กำหนดเอง',short:'ANY',maker:'ทั่วไป',year:0,formats:{1:'p1',2:'gb2',4:'gba4',8:'lin8'},bpp:2,cell:[8, 16],cells:[[8, 8], [8, 16], [12, 12], [16, 16], [16, 24], [24, 24], [32, 32]],colors:['#f2f2f7', '#1c1c1e', '#8e8e93', '#ff3b30'],tint:'#8e8e93',icon:'console',group:'other',kind:'tile',notes:'ใช้กับเอมูเลเตอร์หรือเครื่องที่ไม่อยู่ในรายการ ส่งออก PNG sheet ได้เสมอ และเลือกรูปแบบไบนารีเองได้'}
];
const GROUPS=[['handheld','เครื่องเล่นพกพา'],['home','เครื่องเล่นบ้านและอาร์เคด'],['modern','เครื่องยุค 3D (ฟอนต์เป็นเท็กซ์เจอร์)'],['other','อื่น ๆ']];
const SCREENS={gb:[160,144],gbc:[160,144],nes:[256,240],snes:[256,224],sms:[256,192],gg:[160,144],md:[320,224],mcd:[320,224],gba:[240,160],nds:[256,192],ps1:[320,240],psp:[480,272],sat:[320,224],n64:[320,240],pce:[256,224],a2600:[160,192],arc:[320,224],ngp:[160,152],ws:[224,144],n3ds:[400,240],ps2:[640,448],gcwii:[640,480],switch:[1280,720],dc:[640,480],custom:[256,192]};
CONSOLES.forEach(c=>{c.screen=SCREENS[c.id]||[256,192];});
const consoleOf=id=>CONSOLES.find(c=>c.id===id)||CONSOLES[CONSOLES.length-1];
const formatFor=p=>{const c=consoleOf(p.console);const key=c.formats[p.bpp]||c.formats[c.bpp]||Object.values(c.formats)[0];return {key,...FORMATS[key]};};
const maxIndex=p=>Math.min(3,(1<<p.bpp)-1);

/* ---------- Thai drawing zones ----------
   Measured from the fonts bundled with the site (16 px tall cell, row 0 = top):
   tone marks/upper vowels sit on rows 0–6, the consonant body on rows 6–12 (baseline under row 12),
   lower vowels and descenders on rows 12–15. Other heights scale proportionally. */
const ZONES=[{id:'top',name:'วรรณยุกต์และสระบน',rows:[0,5],color:'#aeaeb2'},{id:'body',name:'ลำตัวพยัญชนะ (เส้นฐานใต้แถว 12)',rows:[6,12],color:'#8e8e93'},{id:'low',name:'สระล่างและหางพยัญชนะ',rows:[13,15],color:'#636366'}];
const ALLOWED={cons:[2,15],upper:[0,6],tone:[0,6],lower:[12,15],lead:[2,12],digit:[2,12],cluster:[0,15],other:[0,15]};
const CLASS_NAMES={cons:'พยัญชนะ',upper:'สระบน',tone:'วรรณยุกต์/การันต์',lower:'สระล่าง',lead:'สระหน้า',digit:'ตัวเลข',cluster:'อักษรผสม',other:'อักษรอื่น'};
const classOf=c=>[...c].length>1?'cluster':/[ก-ฮฤฦฯๆ฿]/.test(c)?'cons':/[ัิีึื็ํ]/.test(c)?'upper':/[่้๊๋์]/.test(c)?'tone':/[ฺุู]/.test(c)?'lower':/[เแโใไ]/.test(c)?'lead':/[0-9๐-๙]/.test(c)?'digit':'other';
const scaleRow=(r,h)=>Math.round(r*(h-1)/15);
const zoneRows=(h,range)=>[scaleRow(range[0],h),Math.min(h-1,scaleRow(range[1],h))];
function zonesFor(h){const t=scaleRow(5,h),b=Math.max(t+1,scaleRow(12,h));return[{...ZONES[0],rows:[0,t]},{...ZONES[1],rows:[t+1,b]},{...ZONES[2],rows:[Math.min(b+1,h-1),h-1]}];}
const tooShort=h=>h<12;
/* ink outside the allowed rows for this kind of character, or (for ordinary letters) ink past its advance width */
function checkGlyph(pr,g){const cls=classOf(g.c),allowed=zoneRows(pr.h,ALLOWED[cls]),bad=[],marks=['upper','tone','lower','cluster'].includes(cls);let lo=99,hi=-1,over=false;
 for(let i=0;i<g.p.length;i++){if(g.p[i]==='0')continue;const y=Math.floor(i/pr.w),x=i%pr.w;lo=Math.min(lo,y);hi=Math.max(hi,y);if(y<allowed[0]||y>allowed[1])bad.push(i);if(!marks&&g.a<pr.w&&x>=g.a)over=true;}
 return{cls,allowed,used:hi<0?null:[lo,hi],bad,tooWide:over,ok:!bad.length&&!over};}
function checkFont(pr){return pr.glyphs.map((g,i)=>({i,g,r:checkGlyph(pr,g)})).filter(x=>!x.r.ok);}

/* ---------- automatic shadow ----------
   Ink is colour index 1, shadow is index 2. A shadow pixel is placed one step from every ink pixel in the chosen
   direction, only on empty cells inside the glyph box. Letters that would end up wider than their advance get a
   wider advance (up to the cell width); vowel/tone marks keep theirs. */
const SHADOW_DIRS={'down-right':[1,1],'down':[0,1],'right':[1,0],'down-left':[-1,1]};
function addShadow(pr,g,dir,{clear=true}={}){
 const [dx,dy]=SHADOW_DIRS[dir]||SHADOW_DIRS['down-right'],w=pr.w,h=pr.h,src=Array.from(g.p,Number);
 if(clear)for(let i=0;i<src.length;i++)if(src[i]===2)src[i]=0;
 const out=src.slice();let clipped=0,maxCol=-1,added=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(src[y*w+x]!==1)continue;const nx=x+dx,ny=y+dy;
  if(nx<0||ny<0||nx>=w||ny>=h){clipped++;continue;}
  if(src[ny*w+nx]===0&&out[ny*w+nx]!==2){out[ny*w+nx]=2;added++;maxCol=Math.max(maxCol,nx);}}
 const p=out.join(''),marks=['upper','tone','lower','cluster'].includes(classOf(g.c));
 let a=g.a;if(!marks&&maxCol>=a)a=Math.min(w,maxCol+1);
 return{p,a,added,clipped,changed:p!==g.p||a!==g.a};}

/* advance = right edge of the ink + gap (letters only; vowel/tone marks keep theirs) */
function autoSpacing(pr,g,gap=1){if(['upper','tone','lower','cluster'].includes(classOf(g.c)))return{a:g.a,changed:false};
 let right=-1;for(let i=0;i<g.p.length;i++)if(g.p[i]!=='0')right=Math.max(right,i%pr.w);
 if(right<0)return{a:g.a,changed:false};const a=Math.min(pr.w,right+1+gap);return{a,changed:a!==g.a};}
/* one byte per glyph, same order as the bank: for games that keep a separate width table */
const widthsBank=pr=>Uint8Array.from(pr.glyphs,g=>Math.min(255,g.a));

/* remove every shadow pixel (index 2); the advance is left as it is */
function removeShadow(g){const p=g.p.replace(/2/g,'0');return{p,a:g.a,removed:(g.p.match(/2/g)||[]).length,changed:p!==g.p};}

/* ---------- charset ---------- */
const THAI=' กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู฿เแโใไๅๆ็่้๊๋์ํ๎0123456789';
const LATIN='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const PUNCT='.,!?:;\'"-()/…';
const defaultCharset=()=>[...new Set([...THAI,...LATIN,...PUNCT])];

/* ---------- project model ---------- */
const uid=()=>'font-'+Array.from(globalThis.crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,'0')).join('');
const blank=(w,h)=>'0'.repeat(w*h);
function newProject({name='ฟอนต์ใหม่',console:cid='gba',w,h,bpp,charset}={}){
 const c=consoleOf(cid);w=w||c.cell[0];h=h||c.cell[1];bpp=bpp||c.bpp;
 return{format:'fontlab/1',id:uid(),name,console:c.id,w,h,bpp,updatedAt:Date.now(),
  glyphs:(charset||defaultCharset()).map(ch=>({c:ch,p:blank(w,h),a:w}))};
}
function resizeGlyph(p,w,h,nw,nh){let o='';for(let y=0;y<nh;y++)for(let x=0;x<nw;x++)o+=x<w&&y<h?p[y*w+x]:'0';return o;}
function convertProject(src,{console:cid,w,h,bpp}={}){
 const c=consoleOf(cid||src.console);w=w||c.cell[0];h=h||c.cell[1];bpp=bpp||c.bpp;const cap=(1<<bpp)-1;
 return{...src,console:c.id,w,h,bpp,updatedAt:Date.now(),
  glyphs:src.glyphs.map(g=>({c:g.c,a:Math.min(g.a??w,w),p:resizeGlyph(g.p,src.w,src.h,w,h).replace(/[0-3]/g,d=>Math.min(+d,cap,3))}))};
}
function normalize(input){
 if(!input||typeof input!=='object')throw Error('ไฟล์ฟอนต์ไม่ถูกต้อง');
 if(input.glyphWidth)input=fromLegacy(input);
 const w=input.w,h=input.h;
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>64||h>64)throw Error('ขนาดช่องอักษรต้องอยู่ระหว่าง 1–64 พิกเซล');
 if(!Array.isArray(input.glyphs)||input.glyphs.length>2048)throw Error('จำนวนอักษรต้องไม่เกิน 2048');
 const seen=new Set(),glyphs=input.glyphs.map(g=>{
  if(!g||typeof g.c!=='string'||!g.c||g.c.length>8||seen.has(g.c))throw Error('พบอักษรว่างหรือซ้ำ');seen.add(g.c);
  if(typeof g.p!=='string'||g.p.length!==w*h||/[^0-3]/.test(g.p))throw Error('พิกเซลของ “'+g.c+'” ไม่ตรงกับขนาด '+w+'×'+h);
  const a=g.a===undefined?w:g.a;if(!Number.isInteger(a)||a<0||a>w)throw Error('ระยะอักษร “'+g.c+'” ต้องเป็น 0–'+w);
  return{c:g.c,p:g.p,a};});
 const c=consoleOf(input.console),bpp=[1,2,4,8].includes(input.bpp)?input.bpp:c.bpp;
 const name=String(input.name||'ฟอนต์ไม่มีชื่อ').trim().slice(0,100)||'ฟอนต์ไม่มีชื่อ';
 return{format:'fontlab/1',id:/^[A-Za-z0-9_-]{6,64}$/.test(input.id||'')?input.id:uid(),name,console:c.id,w,h,bpp,
  updatedAt:Number.isFinite(input.updatedAt)?input.updatedAt:Date.now(),...(input.note?{note:String(input.note).slice(0,300)}:{}),...(input.builtin?{builtin:true}:{}),...(input.starter?{starter:true}:{}),glyphs};
}
/* Old RomTranslate fonts: 8x16 rows, optional 16x16 nativePixels (0 clear, 1 ink, 2 shadow) and nativeComposites. */
function fromLegacy(f){
 const native=f.glyphs.some(g=>g.nativePixels),w=native?16:8,h=16,glyphs=[];
 for(const g of f.glyphs){if(g.unavailable)continue;glyphs.push({c:g.char,p:(native&&g.nativePixels?g.nativePixels:g.rows).join(''),a:g.advance||w});}
 for(const [cluster,v] of Object.entries(f.nativeComposites||{}))glyphs.push({c:cluster,p:v.pixels.join(''),a:v.advance});
 return{name:f.name,console:'gba',w,h,bpp:4,glyphs,note:f.sourceNote};
}

/* ---------- bank (raw console tile data) ---------- */
function glyphTiles(p,w,h){const tw=Math.ceil(w/8),th=Math.ceil(h/8),tiles=[];
 for(let ty=0;ty<th;ty++)for(let tx=0;tx<tw;tx++){const t=new Array(64).fill(0);
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){const sx=tx*8+x,sy=ty*8+y;if(sx<w&&sy<h)t[y*8+x]=code(p,sy*w+sx);}tiles.push(t);}
 return tiles;}
function bytesPerGlyph(pr){const f=formatFor(pr);return f.linear?f.size(pr.w*pr.h):Math.ceil(pr.w/8)*Math.ceil(pr.h/8)*f.bytes;}
function exportBank(pr){const f=formatFor(pr),cap=maxIndex(pr),per=bytesPerGlyph(pr),out=new Uint8Array(per*pr.glyphs.length);
 pr.glyphs.forEach((g,i)=>{let bytes;
  if(f.linear)bytes=f.pack(Array.from({length:pr.w*pr.h},(_,k)=>code(g.p,k)));
  else bytes=glyphTiles(g.p,pr.w,pr.h).flatMap(t=>f.pack(t.map(v=>Math.min(v,cap))));
  out.set(bytes,i*per);});
 return out;}
function importBank(pr,bytes){const f=formatFor(pr),per=bytesPerGlyph(pr),tw=Math.ceil(pr.w/8),th=Math.ceil(pr.h/8),n=Math.min(pr.glyphs.length,Math.floor(bytes.length/per));
 if(!n)throw Error('ไฟล์ไบนารีสั้นกว่า 1 ตัวอักษร ('+per+' ไบต์)');
 const out=[];for(let i=0;i<n;i++){const o=i*per;let px;
  if(f.linear)px=f.unpack(bytes,o,pr.w*pr.h);
  else{px=new Array(pr.w*pr.h).fill(0);for(let t=0;t<tw*th;t++){const tile=f.unpack(bytes,o+t*f.bytes),tx=t%tw,ty=Math.floor(t/tw);
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){const sx=tx*8+x,sy=ty*8+y;if(sx<pr.w&&sy<pr.h)px[sy*pr.w+sx]=tile[y*8+x];}}}
  out.push(px.map(v=>Math.min(v,3)).join(''));}
 return out;}

/* ---------- PNG sheet pixels (RGBA) ---------- */
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const COLS=16;
function sheetSize(pr){const rows=Math.max(1,Math.ceil(pr.glyphs.length/COLS));return{cols:COLS,rows,width:COLS*pr.w,height:rows*pr.h};}
function renderSheet(pr,{guide=false}={}){
 const c=consoleOf(pr.console),pal=c.colors.map(hex),alt=pal[0].map(v=>v>128?v-10:v+10),s=sheetSize(pr),rgba=new Uint8ClampedArray(s.width*s.height*4);
 for(let gi=0;gi<s.cols*s.rows;gi++){const g=pr.glyphs[gi],ox=(gi%COLS)*pr.w,oy=Math.floor(gi/COLS)*pr.h,checker=guide&&((gi%COLS)+Math.floor(gi/COLS))%2;
  for(let y=0;y<pr.h;y++)for(let x=0;x<pr.w;x++){const v=g?code(g.p,y*pr.w+x):0,col=v===0&&checker?alt:pal[Math.min(v,3)],o=((oy+y)*s.width+ox+x)*4;rgba[o]=col[0];rgba[o+1]=col[1];rgba[o+2]=col[2];rgba[o+3]=255;}}
 return{...s,rgba};}
function readSheet(pr,rgba,W,H){
 const s=sheetSize(pr);if(W<pr.w||H<pr.h)throw Error('รูปเล็กกว่าช่องอักษร '+pr.w+'×'+pr.h);
 const c=consoleOf(pr.console),pal=c.colors.map(hex),alt=pal[0].map(v=>v>128?v-10:v+10),cands=[...pal.map((p,i)=>[p,i]),[alt,0]],cache=new Map(),cap=maxIndex(pr);
 const idx=(r,g,b,a)=>{if(a<128)return 0;const k=r<<16|g<<8|b;let v=cache.get(k);if(v===undefined){let best=1e9;for(const [p,i] of cands){const d=(p[0]-r)**2+(p[1]-g)**2+(p[2]-b)**2;if(d<best){best=d;v=i;}}v=Math.min(v,cap);cache.set(k,v);}return v;};
 const cols=Math.min(COLS,Math.floor(W/pr.w)),out=[];
 for(let gi=0;gi<pr.glyphs.length;gi++){const ox=(gi%COLS)*pr.w,oy=Math.floor(gi/COLS)*pr.h;if(gi%COLS>=cols||oy+pr.h>H)break;let p='';
  for(let y=0;y<pr.h;y++)for(let x=0;x<pr.w;x++){const o=((oy+y)*W+ox+x)*4;p+=idx(rgba[o],rgba[o+1],rgba[o+2],rgba[o+3]);}out.push(p);}
 return out;}

/* ---------- text layout (longest cluster first, so Thai vowel+tone combinations use their own glyph) ---------- */
const MARK_ONLY=/^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]+$/; /* ั ิ ี ึ ื ุ ู ฺ ็ ่ ้ ๊ ๋ ์ ํ ๎ (not ำ) */
function layoutText(pr,text,maxWidth=Infinity){
 const map=new Map(pr.glyphs.map(g=>[g.c,g])),items=[];let x=0,line=0,base=null;
 for(let i=0;i<text.length;){
  if(text[i]==='\n'){line++;x=0;i++;base=null;continue;}
  let g=null,len=0,key='';for(let n=Math.min(8,text.length-i);n>=1&&!g;n--){const k=text.slice(i,i+n);if(map.has(k)){g=map.get(k);len=n;key=k;}}
  if(!g){i++;continue;}
  if(base&&MARK_ONLY.test(key)){items.push({g,x:base.x,line:base.line,mark:true});i+=len;continue;} /* marks sit on the previous letter and add no width */
  if(x+(g.a||pr.w)>maxWidth&&x>0){line++;x=0;}
  items.push({g,x,line});base={x,line};x+=g.a||pr.w;i+=len;}
 return items;}

/* ---------- starter files ---------- */
function glyphOrderText(pr){const per=bytesPerGlyph(pr);return pr.glyphs.map((g,i)=>String(i).padStart(4,'0')+'  0x'+(i*per).toString(16).padStart(6,'0').toUpperCase()+'  '+String(g.a).padStart(2)+'  '+g.c+'  U+'+[...g.c].map(ch=>ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('+')).join('\n');}
function readme(pr){const c=consoleOf(pr.console),f=formatFor(pr),per=bytesPerGlyph(pr),s=sheetSize(pr);
 return ['FontLab starter — '+pr.name,'เครื่อง: '+c.name,'ขนาดช่องอักษร: '+pr.w+'×'+pr.h+' px','รูปแบบไบนารี: '+f.name+' ('+pr.bpp+' bpp)',
  f.linear?'ลำดับพิกเซล: บิตแมปเส้นตรงทีละแถว ซ้าย→ขวา บน→ล่าง ต่อ 1 ตัวอักษร':'ลำดับไทล์ต่อ 1 ตัวอักษร: ซ้าย→ขวา แล้วบน→ล่าง (ไทล์ 8×8 ละ '+f.bytes+' ไบต์)',
  'ขนาดต่อ 1 ตัวอักษร: '+per+' ไบต์ · รวม '+pr.glyphs.length+' ตัวอักษร = '+per*pr.glyphs.length+' ไบต์','PNG sheet: '+s.cols+' คอลัมน์ × '+s.rows+' แถว ('+s.width+'×'+s.height+' px) ลำดับเดียวกับตารางด้านล่าง',
  'สีดัชนี 0 = พื้นโปร่ง · 1 = หมึก · 2 = เงา · 3 = เสริม ('+c.colors.join(', ')+')','','หมายเหตุ: '+c.notes,'ออฟเซ็ตด้านล่างนับจากต้นไฟล์ .bin ถ้านำไปแทนที่ในรอมให้บวก offset ของฟอนต์ในรอมนั้น','','INDEX OFFSET ADV CHAR UNICODE (ADV = ระยะอักษรเป็นพิกเซล ไม่อยู่ในไฟล์ .bin ใช้กับตารางความกว้างของเกม หรือไฟล์ *-widths.bin)',glyphOrderText(pr),''].join('\n');}

/* starter project for a console: kind 'blank' or 'thai-base' (seeded from a built-in font) */
function starter(cid,kind,base){const c=consoleOf(cid);
 if(kind==='blank'){const charset=base?base.glyphs.map(g=>g.c).concat(defaultCharset().filter(ch=>!base.glyphs.some(g=>g.c===ch))):undefined;return newProject({name:c.short+' · ฟอนต์เปล่า',console:c.id,charset});}
 const charset=base.glyphs.map(g=>g.c).concat(defaultCharset().filter(ch=>!base.glyphs.some(g=>g.c===ch)));
 const p=convertProject({...base,builtin:undefined,note:undefined,glyphs:charset.map(ch=>base.glyphs.find(g=>g.c===ch)||{c:ch,p:blank(base.w,base.h),a:base.w})},{console:c.id});
 return{...p,id:uid(),name:c.short+' · ไทยพื้นฐาน'};}

/* ---------- store-only ZIP ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function zip(files){const enc=new TextEncoder(),parts=[],central=[];let off=0;
 for(const f of files){const name=enc.encode(f.name),crc=crc32(f.data),h=new DataView(new ArrayBuffer(30));
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(10,0,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,f.data.length,true);h.setUint32(22,f.data.length,true);h.setUint16(26,name.length,true);
  parts.push(new Uint8Array(h.buffer),name,f.data);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,f.data.length,true);c.setUint32(24,f.data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,off,true);
  central.push(new Uint8Array(c.buffer),name);off+=30+name.length+f.data.length;}
 const csize=central.reduce((n,p)=>n+p.length,0),end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,csize,true);end.setUint32(16,off,true);
 const all=[...parts,...central,new Uint8Array(end.buffer)],out=new Uint8Array(all.reduce((n,p)=>n+p.length,0));let o=0;for(const p of all){out.set(p,o);o+=p.length;}return out;}

return{autoSpacing,widthsBank,SHADOW_DIRS,addShadow,removeShadow,CONSOLES,GROUPS,ZONES,ALLOWED,CLASS_NAMES,classOf,zonesFor,tooShort,checkGlyph,checkFont,FORMATS,consoleOf,formatFor,maxIndex,THAI,defaultCharset,newProject,convertProject,starter,normalize,fromLegacy,resizeGlyph,blank,
 bytesPerGlyph,exportBank,importBank,sheetSize,renderSheet,readSheet,layoutText,readme,zip,crc32,uid};
});
