/* FontLab app: iOS-style library, console starters, pixel studio and cloud sync. */
(()=>{
'use strict';
const Core=FontLabCore,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONS={
 library:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
 consoles:'<rect x="2.5" y="7" width="19" height="10.5" rx="5"/><path d="M7 10.5v3.5M5.25 12.25h3.5"/><circle cx="15.5" cy="11.3" r=".6"/><circle cx="17.8" cy="13.3" r=".6"/>',
 studio:'<path d="M4 20l1-4.2L16.6 4.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.2 19z"/><path d="M14.5 6.3l3.2 3.2"/>',
 cloud:'<path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 10.4a3.8 3.8 0 01-.2 7.6z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',more:'<circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/>',
 share:'<path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>',gear:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
 paste:'<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3.5h6V5"/>',pencil:'<path d="M4 20l1-4.2L16.6 4.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.2 19z"/>',
 eraser:'<path d="M20 20H9L4 15a2 2 0 010-2.8l8-8a2 2 0 012.8 0l5.2 5.2a2 2 0 010 2.8L12 19"/>',fill:'<path d="M5 11l7-7 7 7-7 7z"/><path d="M20 15s2 2.2 2 3.5a2 2 0 01-4 0C18 17.2 20 15 20 15z"/>',pick:'<path d="M14 6l4 4M3 21l1-4 10-10 3 3L7 20z"/><path d="M15 5l1.5-1.5a2 2 0 013 3L18 8"/>',
 left:'<path d="M19 12H5M11 6l-6 6 6 6"/>',right:'<path d="M5 12h14M13 6l6 6-6 6"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
 fliph:'<path d="M12 3v18"/><path d="M8 7L3 17h5zM16 7l5 10h-5z"/>',flipv:'<path d="M3 12h18"/><path d="M7 8l10-5v5zM7 16l10 5v-5z"/>',clear:'<path d="M5 5l14 14M19 5L5 19"/>',grid:'<path d="M4 9h16M4 15h16M9 4v16M15 4v16"/><rect x="4" y="4" width="16" height="16" rx="2"/>',
 sync:'<path d="M20 11a8 8 0 00-14.5-3.5M4 4v4h4"/><path d="M4 13a8 8 0 0014.5 3.5M20 20v-4h-4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',download:'<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>'
};
const ic=(n,cls='')=>'<svg class="i '+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+ICONS[n]+'</svg>';

/* ---------- storage (IndexedDB, falls back to memory) ---------- */
const Store=(()=>{let db=null;const mem=new Map();
 const open=()=>new Promise(res=>{try{const r=indexedDB.open('fontlab',1);r.onupgradeneeded=()=>r.result.createObjectStore('fonts',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null);}catch{res(null);}});
 const tx=(mode,fn)=>new Promise((res,rej)=>{const t=db.transaction('fonts',mode),r=fn(t.objectStore('fonts'));t.oncomplete=()=>res(r?.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error);});
 return{async init(){db=await open();},all:async()=>db?await tx('readonly',s=>s.getAll())||[]:[...mem.values()],
  put:async f=>{mem.set(f.id,f);if(db)await tx('readwrite',s=>s.put(f));},del:async id=>{mem.delete(id);if(db)await tx('readwrite',s=>s.delete(id));},persistent:()=>!!db};})();

/* ---------- state ---------- */
const S={fonts:new Map(),tab:'library',filter:'all',query:'',cur:null,idx:0,tool:'pencil',color:1,grid:true,undo:[],redo:[],clip:null,previewText:'',cloudBusy:false,cloudMsg:'',lastSync:null,auto:localStorage.getItem('fontlab.auto')!=='no'};
const userFonts=()=>[...S.fonts.values()].filter(f=>!f.builtin);
const consoleColor=id=>Core.consoleOf(id).tint;
let toastTimer;function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('on'),2600);}
function download(name,data,type='application/octet-stream'){const a=document.createElement('a'),u=URL.createObjectURL(data instanceof Blob?data:new Blob([data],{type}));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);}
const slug=s=>s.replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,'').toLowerCase().slice(0,40)||'font';
const pal=f=>Core.consoleOf(f.console).colors;
const code=(p,i)=>p.charCodeAt(i)-48;

/* ---------- drawing ---------- */
function drawGlyph(ctx,f,g,ox,oy,scale,colors){const w=f.w;for(let i=0;i<g.p.length;i++){const v=code(g.p,i);if(!v)continue;ctx.fillStyle=colors[Math.min(v,3)];ctx.fillRect(ox+(i%w)*scale,oy+Math.floor(i/w)*scale,scale,scale);}}
function drawText(canvas,f,text,scale,maxW){const colors=pal(f),items=Core.layoutText(f,text,Math.floor(maxW/scale)),lines=items.reduce((n,i)=>Math.max(n,i.line+1),1);
 const width=Math.max(8,Math.min(maxW,Math.ceil(items.reduce((m,i)=>Math.max(m,i.x+f.w),0)*scale)+4)),height=lines*f.h*scale+4;
 canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.fillStyle=colors[0];ctx.fillRect(0,0,width,height);
 for(const it of items)drawGlyph(ctx,f,it.g,2+it.x*scale,2+it.line*f.h*scale,scale,colors);}
const hasInk=g=>/[1-3]/.test(g.p);
function sampleOf(f){const s=f.glyphs.filter(g=>[...g.c].length===1&&g.c.trim()&&hasInk(g)).slice(0,6).map(g=>g.c).join('');return s||'ก';}

/* ---------- sheets ---------- */
const layer=$('#layer');let closeSheetFn=null,lastFocus=null;
function sheet(html,bind){closeSheet();lastFocus=document.activeElement;const b=document.createElement('div');b.className='backdrop';b.innerHTML='<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'</div>';
 layer.append(b);const s=$('.sheet',b);b.addEventListener('mousedown',e=>{if(e.target===b)closeSheet();});
 closeSheetFn=()=>{b.remove();closeSheetFn=null;lastFocus?.focus?.();};s.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeSheet();});
 bind?.(s);(s.querySelector('[autofocus]')||s.querySelector('button,input,select'))?.focus();return s;}
function closeSheet(){closeSheetFn?.();}
const action=(label,act,cls='')=>'<button class="row '+cls+'" data-act="'+act+'">'+label+'</button>';
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();});

/* ---------- persistence ---------- */
const saveTimers=new Map();let syncTimer;
function touch(f){f.updatedAt=Date.now();clearTimeout(saveTimers.get(f.id));saveTimers.set(f.id,setTimeout(()=>Store.put(f).catch(()=>toast('บันทึกในเครื่องไม่สำเร็จ')),400));scheduleSync();}
function scheduleSync(){if(!S.auto||!FontLabCloud.user)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncNow(true),4000);}
async function syncNow(quiet){if(S.cloudBusy)return;if(!FontLabCloud.user){toast('เข้าสู่ระบบก่อนเพื่อซิงก์');return;}
 S.cloudBusy=true;S.cloudMsg='กำลังซิงก์…';renderCloud();
 try{const r=await FontLabCloud.sync(userFonts(),{onProgress:m=>{S.cloudMsg=m;renderCloud();},onDownload:async raw=>{const f=Core.normalize(raw);S.fonts.set(f.id,f);await Store.put(f);}});
  S.lastSync=new Date();S.cloudMsg='ซิงก์แล้ว · อัปโหลด '+r.uploaded+' · ดึงมา '+r.downloaded;if(!quiet||r.downloaded)toast(S.cloudMsg);renderLibrary();}
 catch(e){S.cloudMsg=e.message;toast(e.message);}
 finally{S.cloudBusy=false;renderCloud();}}
async function addFont(f,{open=false}={}){S.fonts.set(f.id,f);await Store.put(f).catch(()=>{});scheduleSync();renderLibrary();if(open)openStudio(f.id);}

/* ---------- navigation ---------- */
const TABS=[['library','คลังฟอนต์'],['consoles','เครื่องเกม'],['studio','สตูดิโอ'],['cloud','คลาวด์']];
function renderTabs(){$('#tabs').innerHTML='<div class="brand"><b>Fℓ</b>FontLab</div>'+TABS.map(([id,l])=>'<button class="tab" data-tab="'+id+'"'+(S.tab===id?' aria-current="page"':'')+'>'+ic(id)+'<span>'+l+'</span></button>').join('');}
function go(tab,{push=true}={}){S.tab=tab;$$('.page').forEach(p=>p.classList.toggle('on',p.id==='page-'+tab));renderTabs();if(push)history.replaceState(null,'','#'+tab);scrollTo(0,0);
 if(tab==='library')renderLibrary();if(tab==='consoles')renderConsoles();if(tab==='studio')mountStudio();if(tab==='cloud')renderCloud();}
const nav=(title,actions='')=>'<div class="nav"><span class="nav-title">'+esc(title)+'</span><div class="nav-actions">'+actions+'</div></div>';
addEventListener('scroll',()=>$$('.nav').forEach(n=>n.classList.toggle('scrolled',scrollY>48)),{passive:true});

/* ---------- library ---------- */
function cardHtml(f){const c=Core.consoleOf(f.console);
 return '<div class="card" role="button" tabindex="0" data-open="'+f.id+'" aria-label="เปิด '+esc(f.name)+'"><div class="prev" style="background:'+c.colors[0]+'"><canvas data-prev="'+f.id+'"></canvas></div><h3>'+esc(f.name)+'</h3>'
 +'<div class="meta"><span class="tag" style="background:'+c.tint+'">'+c.short+'</span><span>'+f.w+'×'+f.h+' · '+f.glyphs.length+' ตัว</span>'+(f.builtin?'<span>· ในตัว</span>':'')+'</div>'
 +'<button class="more" data-more="'+f.id+'" aria-label="ตัวเลือก '+esc(f.name)+'">'+ic('more')+'</button></div>';}
function renderLibrary(){
 const all=[...S.fonts.values()],counts=new Map();for(const f of all)counts.set(f.console,(counts.get(f.console)||0)+1);
 const q=S.query.trim().toLowerCase(),match=f=>(S.filter==='all'||f.console===S.filter)&&(!q||f.name.toLowerCase().includes(q)||Core.consoleOf(f.console).name.toLowerCase().includes(q));
 const mine=all.filter(f=>!f.builtin&&match(f)).sort((a,b)=>b.updatedAt-a.updatedAt),built=all.filter(f=>f.builtin&&match(f));
 const el=$('#page-library'),keep=$('#q'),hadFocus=document.activeElement===keep;
 el.innerHTML=nav('คลังฟอนต์','<button class="icon-btn" data-act="import" aria-label="นำเข้า">'+ic('download')+'</button><button class="icon-btn" data-act="new" aria-label="สร้างฟอนต์ใหม่">'+ic('plus')+'</button>')
  +'<div class="large"><h1>คลังฟอนต์</h1><p>ฟอนต์บิตแมปสำหรับเกมบนเอมูเลเตอร์ทุกเครื่อง</p></div>'
  +'<label class="search">'+ic('search')+'<input id="q" type="search" placeholder="ค้นหาฟอนต์หรือเครื่อง" value="'+esc(S.query)+'" aria-label="ค้นหา"></label>'
  +'<div class="chips" role="group" aria-label="กรองตามเครื่อง"><button class="chip" aria-pressed="'+(S.filter==='all')+'" data-filter="all">ทั้งหมด '+all.length+'</button>'
  +Core.CONSOLES.filter(c=>counts.has(c.id)).map(c=>'<button class="chip" aria-pressed="'+(S.filter===c.id)+'" data-filter="'+c.id+'">'+c.short+' '+counts.get(c.id)+'</button>').join('')+'</div>'
  +(mine.length?'<div class="group-title">ฟอนต์ของฉัน</div><div class="cards">'+mine.map(cardHtml).join('')+'</div>':(!q&&S.filter==='all'?'<div class="group-title">ฟอนต์ของฉัน</div><div class="group"><button class="row" data-act="new"><span class="grow">สร้างฟอนต์แรกของคุณ<small>เลือกเครื่องแล้วเริ่มจากฟอนต์เปล่าหรือฟอนต์ไทยพื้นฐาน</small></span>'+ic('plus')+'</button></div>':''))
  +(built.length?'<div class="group-title">ฟอนต์ในตัว</div><div class="cards">'+built.map(cardHtml).join('')+'</div><p class="foot">ฟอนต์ในตัวเปิดดูและทำสำเนาไปแก้ไขได้ จะไม่ถูกเขียนทับ</p>':'')
  +(!mine.length&&!built.length?'<div class="empty">'+ic('search')+'<h2>ไม่พบฟอนต์</h2>ลองเปลี่ยนคำค้นหรือเครื่องที่เลือก</div>':'');
 if(hadFocus){const n=$('#q');n.focus();n.setSelectionRange(n.value.length,n.value.length);}
 for(const cv of $$('canvas[data-prev]',el)){const f=S.fonts.get(cv.dataset.prev),sc=Math.max(1,Math.min(3,Math.floor(72/f.h)));drawText(cv,f,sampleOf(f),sc,150);}
}

/* ---------- new font / console sheets ---------- */
const sizeLabel=([w,h])=>w+'×'+h;
function newFontSheet(cid='gba',kind='thai-base'){
 sheet('<h2>ฟอนต์ใหม่</h2><p class="sub">เลือกเครื่องและขนาดช่องอักษร</p>'
  +'<div class="field"><label for="nf-name">ชื่อ</label><input id="nf-name" class="input" maxlength="100" value="" placeholder="เช่น ไทยพิกเซล 16px" autofocus></div>'
  +'<div class="field"><label for="nf-con">เครื่อง</label><select id="nf-con" class="input">'+Core.CONSOLES.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></div>'
  +'<div class="grid2"><div class="field"><label for="nf-size">ช่องอักษร (px)</label><select id="nf-size" class="input"></select></div><div class="field"><label for="nf-bpp">ความลึกสี</label><select id="nf-bpp" class="input"></select></div></div>'
  +'<div class="field"><span>เริ่มจาก</span><div class="seg" role="group"><button data-kind="thai-base" aria-pressed="true">ไทยพื้นฐาน</button><button data-kind="blank" aria-pressed="false">ฟอนต์เปล่า</button></div></div>'
  +'<button class="btn block" id="nf-go" style="margin-top:8px">สร้างและเปิดสตูดิโอ</button>',s=>{
  const con=$('#nf-con',s),size=$('#nf-size',s),bpp=$('#nf-bpp',s);con.value=cid;
  const fill=()=>{const c=Core.consoleOf(con.value);size.innerHTML=c.cells.map(x=>'<option value="'+x+'"'+(x+''===c.cell+''?' selected':'')+'>'+sizeLabel(x)+'</option>').join('');bpp.innerHTML=Object.keys(c.formats).map(b=>'<option value="'+b+'"'+(+b===c.bpp?' selected':'')+'>'+b+' บิต</option>').join('');};
  fill();con.onchange=fill;$$('[data-kind]',s).forEach(b=>{b.setAttribute('aria-pressed',b.dataset.kind===kind);b.onclick=()=>{kind=b.dataset.kind;$$('[data-kind]',s).forEach(x=>x.setAttribute('aria-pressed',x===b));};});
  $('#nf-go',s).onclick=async()=>{const [w,h]=size.value.split(',').map(Number),base=FontLabBuiltins[0];
   const p=Core.convertProject(Core.starter(con.value,kind,base),{console:con.value,w,h,bpp:+bpp.value});p.name=($('#nf-name',s).value.trim()||p.name).slice(0,100);p.id=Core.uid();closeSheet();await addFont(p,{open:true});toast('สร้างฟอนต์แล้ว');};});}

/* ---------- consoles ---------- */
function renderConsoles(){
 $('#page-consoles').innerHTML=nav('เครื่องเกม')+'<div class="large"><h1>เครื่องเกม</h1><p>แต่ละเครื่องมีรูปแบบไทล์และชุดสารตั้งต้นของตัวเอง</p></div>'
  +'<div class="group">'+Core.CONSOLES.map(c=>'<button class="row" data-console="'+c.id+'"><span class="badge" style="background:'+c.tint+'">'+c.short+'</span><span class="grow">'+esc(c.name)+'<small>'+esc(c.maker)+(c.year?' · '+c.year:'')+' · ช่อง '+c.cell.join('×')+' · '+Object.keys(c.formats).join('/')+' บิต</small></span>'+ic('chev','chev')+'</button>').join('')+'</div>'
  +'<p class="foot">ทุกเครื่องส่งออกเป็น PNG sheet, ไฟล์ไบนารีไทล์ และ .fontlab.json ได้ พิกเซลมี 4 ดัชนีสี: โปร่ง · หมึก · เงา · เสริม</p>';}
async function pngBytes(p,guide){const s=Core.renderSheet(p,{guide}),cv=document.createElement('canvas');cv.width=s.width;cv.height=s.height;cv.getContext('2d').putImageData(new ImageData(s.rgba,s.width,s.height),0,0);
 return new Uint8Array(await (await new Promise(r=>cv.toBlob(r,'image/png'))).arrayBuffer());}
async function starterZip(cid){const enc=new TextEncoder(),files=[],base=FontLabBuiltins[0];
 for(const kind of ['blank','thai-base']){const p=Core.starter(cid,kind,base);p.id='starter-'+cid+'-'+kind;p.updatedAt=0;const n=cid+'-'+kind;
  files.push({name:n+'.fontlab.json',data:enc.encode(JSON.stringify(p))},{name:n+'-sheet.png',data:await pngBytes(p,kind==='blank')},{name:n+'.bin',data:Core.exportBank(p)},{name:n+'-README.txt',data:enc.encode(Core.readme(p))});}
 return Core.zip(files);}
function consoleSheet(id){const c=Core.consoleOf(id),fmts=Object.entries(c.formats).map(([b,k])=>'<div class="row"><span class="grow">'+b+' บิต<small>'+esc(Core.FORMATS[k].name)+'</small></span></div>').join('');
 sheet('<div style="text-align:center"><span class="badge" style="background:'+c.tint+';height:34px;min-width:56px;font-size:14px">'+c.short+'</span></div><h2 style="margin-top:8px">'+esc(c.name)+'</h2><p class="sub">'+esc(c.notes)+'</p>'
  +'<div class="group-title" style="margin-left:16px">รูปแบบไบนารี</div><div class="group" style="margin:0 0 12px">'+fmts+'<div class="row"><span class="grow">ช่องอักษรเริ่มต้น<small>'+c.cells.map(sizeLabel).join(' · ')+'</small></span></div></div>'
  +'<div class="group-title" style="margin-left:16px">สารตั้งต้น</div><div class="actions">'+action('สร้างฟอนต์ไทยพื้นฐานสำหรับ '+c.short,'start-thai')+action('สร้างฟอนต์เปล่าสำหรับ '+c.short,'start-blank')+action('ดาวน์โหลดชุดไฟล์ (.zip)','zip')+'</div>'
  +'<p class="foot" style="margin:0 8px 12px">ชุด .zip มี .fontlab.json, PNG sheet, ไฟล์ .bin ของเครื่องนี้ และ README ที่ระบุออฟเซ็ตของทุกตัวอักษร ทั้งแบบเปล่าและแบบไทยพื้นฐาน</p><button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   if(a==='zip'){try{download('fontlab-'+c.id+'-starter.zip',await starterZip(c.id),'application/zip');toast('ดาวน์โหลดชุดสารตั้งต้นแล้ว');}catch(err){toast('สร้างไฟล์ไม่สำเร็จ: '+err.message);}}
   else{closeSheet();const p=Core.starter(c.id,a==='start-thai'?'thai-base':'blank',FontLabBuiltins[0]);await addFont(p,{open:true});toast('สร้างจากสารตั้งต้น '+c.short+' แล้ว');}});});}

/* ---------- font actions ---------- */
function fontMenu(id){const f=S.fonts.get(id);if(!f)return;
 sheet('<h2>'+esc(f.name)+'</h2><p class="sub">'+Core.consoleOf(f.console).name+' · '+f.w+'×'+f.h+' · '+f.glyphs.length+' ตัว</p><div class="actions">'+action('เปิดในสตูดิโอ','open')+action('ทำสำเนา','dup')+action('ดาวน์โหลด .fontlab.json','json')+(f.builtin?'':action('ลบฟอนต์','del','red'))+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   if(a==='open'){closeSheet();openStudio(id);}
   if(a==='dup'){closeSheet();await addFont(duplicate(f));toast('ทำสำเนาแล้ว');}
   if(a==='json'){download(slug(f.name)+'.fontlab.json',JSON.stringify(f),'application/json');}
   if(a==='del')confirmDelete(f);});});}
const duplicate=f=>({...structuredClone(f),id:Core.uid(),name:(f.name+' (สำเนา)').slice(0,100),builtin:undefined,note:undefined,updatedAt:Date.now()});
function confirmDelete(f){sheet('<h2>ลบ “'+esc(f.name)+'” ?</h2><p class="sub">ฟอนต์จะถูกลบจากเครื่องนี้'+(FontLabCloud.user?' และจากคลาวด์เมื่อซิงก์':'')+' ย้อนกลับไม่ได้</p><div class="actions">'+action('ลบ','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
 $('[data-act=yes]',s).onclick=async()=>{closeSheet();S.fonts.delete(f.id);await Store.del(f.id).catch(()=>{});FontLabCloud.markDeleted(f.id);if(S.cur===f.id)S.cur=null;renderLibrary();if(S.tab==='studio')mountStudio();scheduleSync();toast('ลบแล้ว');};});}

/* ---------- import ---------- */
async function importFiles(files){
 for(const file of files){const ext=file.name.split('.').pop().toLowerCase();
  try{
   if(ext==='json'){const raw=JSON.parse(await file.text());let f=Core.normalize(raw);if(S.fonts.has(f.id)||f.builtin)f={...f,id:Core.uid(),builtin:undefined,name:f.name+' (นำเข้า)'};f.updatedAt=Date.now();await addFont(f,{open:files.length===1});toast('นำเข้า “'+f.name+'” แล้ว');}
   else if(ext==='png'||ext==='bin'){const f=editable();if(!f)throw Error('เปิดฟอนต์ที่แก้ไขได้ในสตูดิโอก่อน แล้วนำเข้า .'+ext);
    let px;if(ext==='bin')px=Core.importBank(f,new Uint8Array(await file.arrayBuffer()));
    else{const bmp=await createImageBitmap(file),cv=document.createElement('canvas');cv.width=bmp.width;cv.height=bmp.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(bmp,0,0);px=Core.readSheet(f,cx.getImageData(0,0,bmp.width,bmp.height).data,bmp.width,bmp.height);}
    S.undo=[];S.redo=[];px.forEach((p,i)=>{f.glyphs[i].p=p;});touch(f);mountStudio();toast('นำเข้า '+px.length+' ตัวอักษรจาก '+file.name);}
   else throw Error('รองรับเฉพาะ .json .png .bin');
  }catch(e){toast(file.name+': '+e.message);}}}
function pickFiles(accept){const i=$('#pick');i.accept=accept;i.value='';i.onchange=()=>importFiles([...i.files]);i.click();}

/* ---------- studio ---------- */
const editable=()=>{const f=S.fonts.get(S.cur);return f&&!f.builtin?f:null;};
function openStudio(id){S.cur=id;S.idx=0;S.undo=[];S.redo=[];S.previewText='';go('studio');}
let edit=null; // {cv,ctx,scale}
function mountStudio(){
 const el=$('#page-studio'),f=S.fonts.get(S.cur);
 if(!f){el.innerHTML=nav('สตูดิโอ')+'<div class="large"><h1>สตูดิโอ</h1></div><div class="empty">'+ic('studio')+'<h2>ยังไม่ได้เลือกฟอนต์</h2>เลือกฟอนต์จากคลัง หรือสร้างใหม่เพื่อเริ่มวาดพิกเซล<div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="new">สร้างฟอนต์ใหม่</button><button class="btn tint" data-tab="library">ไปที่คลัง</button></div></div>';edit=null;return;}
 const ro=!!f.builtin,c=Core.consoleOf(f.console),max=Core.maxIndex(f),labels=['โปร่ง','หมึก','เงา','เสริม'];if(S.color>max)S.color=1;
 el.innerHTML=nav(f.name,'<button class="icon-btn" id="u-undo" aria-label="ย้อนกลับ">'+ic('undo')+'</button><button class="icon-btn" id="u-redo" aria-label="ทำซ้ำ">'+ic('redo')+'</button><button class="icon-btn" data-act="settings" aria-label="ตั้งค่าฟอนต์">'+ic('gear')+'</button><button class="icon-btn" data-act="export" aria-label="ส่งออก">'+ic('share')+'</button>')
  +'<div class="large"><input class="namefield" id="s-name" value="'+esc(f.name)+'" maxlength="100" aria-label="ชื่อฟอนต์"'+(ro?' readonly':'')+'><p>'+esc(c.name)+' · ช่อง '+f.w+'×'+f.h+' · '+f.bpp+' บิต · '+f.glyphs.length+' ตัวอักษร</p></div>'
  +'<div class="studio"><div style="display:grid;gap:12px;min-width:0">'
  +(ro?'<div class="banner">'+ic('lock')+'<span>ฟอนต์ในตัว เปิดดูได้อย่างเดียว</span><button class="btn small" data-act="dup-edit">ทำสำเนาเพื่อแก้ไข</button></div>':'')
  +'<div class="panel"><h2>วาด · <span id="s-glyph"></span></h2><div class="stage"><canvas id="edit" aria-label="กริดวาดพิกเซล"></canvas></div>'
  +'<div class="tools"><div class="seg" role="group" aria-label="เครื่องมือ">'+[['pencil','ดินสอ'],['eraser','ยางลบ'],['fill','เทสี'],['pick','ดูดสี']].map(([t,l])=>'<button data-tool="'+t+'" aria-pressed="'+(S.tool===t)+'" aria-label="'+l+'" title="'+l+'">'+ic(t)+'</button>').join('')+'</div><button class="icon-btn" data-act="grid" aria-label="เส้นกริด" style="background:var(--fill);color:var(--label);border-radius:10px;height:36px;min-width:40px">'+ic('grid')+'</button></div>'
  +'<div class="swatches" role="group" aria-label="สี">'+c.colors.slice(0,max+1).map((col,i)=>'<button class="swatch" data-color="'+i+'" aria-pressed="'+(S.color===i)+'" aria-label="สี '+i+' '+labels[i]+'" style="background:'+col+'"><span>'+labels[i]+'</span></button>').join('')+'</div>'
  +'<div class="opsrow">'+[['left','shift-l','เลื่อนซ้าย'],['right','shift-r','เลื่อนขวา'],['up','shift-u','เลื่อนขึ้น'],['down','shift-d','เลื่อนลง'],['fliph','flip-h','พลิกแนวนอน'],['flipv','flip-v','พลิกแนวตั้ง'],['copy','copy','คัดลอก'],['paste','paste','วาง'],['clear','clear','ล้างอักษร']].map(([i,a,l])=>'<button class="icon-btn" data-op="'+a+'" aria-label="'+l+'" title="'+l+'">'+ic(i)+'</button>').join('')+'</div>'
  +'<div class="advance"><label for="s-adv" style="font-size:15px;color:var(--label2)">ระยะอักษร</label><input id="s-adv" type="range" min="0" max="'+f.w+'" aria-label="ระยะอักษร"><b id="s-advv" style="min-width:48px;text-align:right"></b></div></div>'
  +'<div class="panel"><h2>ตัวอย่างข้อความ</h2><textarea class="preview-text" id="s-text" aria-label="ข้อความตัวอย่าง" placeholder="พิมพ์ข้อความเพื่อดูฟอนต์">'+esc(S.previewText||sampleOf(f))+'</textarea><div class="preview-box" id="s-prev-box" style="background:'+c.colors[0]+'"><canvas id="s-prev"></canvas></div></div></div>'
  +'<div class="panel"><h2>อักษรทั้งหมด</h2><label class="search" style="margin:0 0 10px">'+ic('search')+'<input id="s-find" type="search" placeholder="ค้นหาอักษร" aria-label="ค้นหาอักษร"></label><div class="glyphs" id="s-glyphs" role="group" aria-label="รายการอักษร"></div>'+(ro?'':'<button class="btn tint block" data-act="add-glyph" style="margin-top:10px">'+ic('plus')+' เพิ่มอักษร</button>')+'</div></div>';
 const cv=$('#edit',el);edit={cv,ctx:cv.getContext('2d')};
 buildGlyphList();selectGlyph(Math.min(S.idx,f.glyphs.length-1),true);bindEditor(f);updateHistoryButtons();
}
const MARK=/^[ัิ-ฺ็-๎]/;
const glyphLabel=g=>(MARK.test(g.c)?'◌':'')+(g.c===' '?'␠':g.c);
function buildGlyphList(){const f=S.fonts.get(S.cur),box=$('#s-glyphs'),q=($('#s-find')?.value||'').trim();box.innerHTML='';const colors=pal(f),sc=Math.max(1,Math.floor(32/f.h));
 f.glyphs.forEach((g,i)=>{if(q&&!g.c.includes(q))return;const b=document.createElement('button');b.className='gl';b.dataset.i=i;b.setAttribute('aria-pressed',i===S.idx);b.setAttribute('aria-label','อักษร '+g.c);
  const cv=document.createElement('canvas');cv.width=f.w*sc;cv.height=f.h*sc;const cx=cv.getContext('2d');cx.fillStyle=colors[0];cx.fillRect(0,0,cv.width,cv.height);drawGlyph(cx,f,g,0,0,sc,colors);
  const sp=document.createElement('span');sp.textContent=glyphLabel(g);b.append(cv,sp);box.append(b);});}
function refreshThumb(i){const f=S.fonts.get(S.cur),b=$('#s-glyphs [data-i="'+i+'"]');if(!b)return;const cv=$('canvas',b),sc=cv.width/f.w,colors=pal(f),cx=cv.getContext('2d');cx.fillStyle=colors[0];cx.fillRect(0,0,cv.width,cv.height);drawGlyph(cx,f,f.glyphs[i],0,0,sc,colors);}
function selectGlyph(i,force){const f=S.fonts.get(S.cur);if(!f)return;S.idx=i;$$('#s-glyphs .gl').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i));
 const g=f.glyphs[i];$('#s-glyph').textContent='“'+glyphLabel(g)+'” · U+'+[...g.c].map(ch=>ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('+');
 const adv=$('#s-adv');adv.value=g.a;adv.disabled=!!f.builtin;$('#s-advv').textContent=g.a+' px';sizeEditor();drawEditor();}
function sizeEditor(){const f=S.fonts.get(S.cur),avail=Math.max(160,Math.min(520,($('.stage')?.clientWidth||320)-4)),sc=Math.max(3,Math.min(Math.floor(avail/f.w),Math.floor(440/f.h)));edit.scale=sc;edit.cv.width=f.w*sc;edit.cv.height=f.h*sc;}
function drawEditor(buf){const f=S.fonts.get(S.cur),g=f.glyphs[S.idx],{ctx,scale:sc}=edit,colors=pal(f),w=f.w;
 ctx.fillStyle=colors[0];ctx.fillRect(0,0,edit.cv.width,edit.cv.height);
 for(let i=0;i<w*f.h;i++){const v=buf?buf[i]:code(g.p,i),x=i%w,y=(i-x)/w;if(!v&&(x+y)%2){ctx.fillStyle='rgba(128,128,128,.07)';ctx.fillRect(x*sc,y*sc,sc,sc);}if(v){ctx.fillStyle=colors[Math.min(v,3)];ctx.fillRect(x*sc,y*sc,sc,sc);}}
 if(S.grid){ctx.lineWidth=1;for(let x=1;x<w;x++){ctx.strokeStyle=x%8?'rgba(128,128,128,.25)':'rgba(128,128,128,.6)';ctx.beginPath();ctx.moveTo(x*sc+.5,0);ctx.lineTo(x*sc+.5,f.h*sc);ctx.stroke();}
  for(let y=1;y<f.h;y++){ctx.strokeStyle=y%8?'rgba(128,128,128,.25)':'rgba(128,128,128,.6)';ctx.beginPath();ctx.moveTo(0,y*sc+.5);ctx.lineTo(w*sc,y*sc+.5);ctx.stroke();}}
 ctx.strokeStyle='#0a84ff';ctx.setLineDash([4,3]);ctx.lineWidth=2;const ax=g.a*sc;ctx.beginPath();ctx.moveTo(ax,0);ctx.lineTo(ax,f.h*sc);ctx.stroke();ctx.setLineDash([]);}
function drawPreview(){const f=S.fonts.get(S.cur),box=$('#s-prev-box');if(!f||!box)return;drawText($('#s-prev'),f,$('#s-text').value,3,Math.max(120,box.clientWidth-16||300));}
function updateHistoryButtons(){const u=$('#u-undo'),r=$('#u-redo');if(u)u.disabled=!S.undo.length;if(r)r.disabled=!S.redo.length;}
function guardEdit(){if(editable())return true;toast('ฟอนต์ในตัวแก้ไขไม่ได้ · กด “ทำสำเนาเพื่อแก้ไข”');return false;}
function applyGlyph(i,state,{record=true,from}={}){const f=editable();if(!f)return;const g=f.glyphs[i],before=from||{p:g.p,a:g.a};g.p=state.p;g.a=state.a;
 if(record&&(before.p!==g.p||before.a!==g.a)){S.undo.push({i,from:before,to:{p:g.p,a:g.a}});if(S.undo.length>300)S.undo.shift();S.redo=[];}
 touch(f);refreshThumb(i);if(i===S.idx){const adv=$('#s-adv');adv.value=g.a;$('#s-advv').textContent=g.a+' px';drawEditor();}drawPreview();updateHistoryButtons();}
function stepHistory(dir){const f=editable();if(!f)return;const from=dir<0?S.undo:S.redo,to=dir<0?S.redo:S.undo,e=from.pop();if(!e)return;to.push(e);const st=dir<0?e.from:e.to;
 const g=f.glyphs[e.i];g.p=st.p;g.a=st.a;touch(f);refreshThumb(e.i);selectGlyph(e.i);drawPreview();updateHistoryButtons();}
const cur=()=>{const f=S.fonts.get(S.cur);return{f,g:f.glyphs[S.idx],buf:Uint8Array.from(f.glyphs[S.idx].p,c=>+c)};};
function transform(op){if(!guardEdit())return;const {f,g,buf}=cur(),w=f.w,h=f.h;let out=new Uint8Array(w*h);
 if(op.startsWith('shift')){const dx={l:-1,r:1}[op[6]]||0,dy={u:-1,d:1}[op[6]]||0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const sx=x-dx,sy=y-dy;if(sx>=0&&sx<w&&sy>=0&&sy<h)out[y*w+x]=buf[sy*w+sx];}}
 else if(op==='flip-h'){for(let y=0;y<h;y++)for(let x=0;x<w;x++)out[y*w+x]=buf[y*w+(w-1-x)];}
 else if(op==='flip-v'){for(let y=0;y<h;y++)for(let x=0;x<w;x++)out[y*w+x]=buf[(h-1-y)*w+x];}
 else if(op==='clear'){}
 else if(op==='copy'){S.clip={p:g.p,w,h};toast('คัดลอกอักษรแล้ว');return;}
 else if(op==='paste'){if(!S.clip)return toast('ยังไม่ได้คัดลอกอักษร');const p=S.clip.w===w&&S.clip.h===h?S.clip.p:Core.resizeGlyph(S.clip.p,S.clip.w,S.clip.h,w,h);out=Uint8Array.from(p,c=>+c);}
 applyGlyph(S.idx,{p:Array.from(out).join(''),a:g.a});}
function flood(buf,w,h,x,y,v){const t=buf[y*w+x];if(t===v)return;const st=[[x,y]];while(st.length){const [cx,cy]=st.pop();if(cx<0||cy<0||cx>=w||cy>=h||buf[cy*w+cx]!==t)continue;buf[cy*w+cx]=v;st.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);}}
function bindEditor(f){
 const cv=edit.cv;let drag=null;
 const at=e=>{const r=cv.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*f.w),y=Math.floor((e.clientY-r.top)/r.height*f.h);return[Math.max(0,Math.min(f.w-1,x)),Math.max(0,Math.min(f.h-1,y))];};
 const line=(a,b,fn)=>{let [x0,y0]=a;const [x1,y1]=b,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let er=dx+dy;for(;;){fn(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*er;if(e2>=dy){er+=dy;x0+=sx;}if(e2<=dx){er+=dx;y0+=sy;}}};
 cv.onpointerdown=e=>{if(!guardEdit())return;e.preventDefault();const [x,y]=at(e),{g,buf}=cur();
  if(S.tool==='pick'){S.color=buf[y*f.w+x];$$('[data-color]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.color===S.color));S.tool='pencil';$$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool==='pencil'));return;}
  if(S.tool==='fill'){flood(buf,f.w,f.h,x,y,S.color);applyGlyph(S.idx,{p:Array.from(buf).join(''),a:g.a});return;}
  cv.setPointerCapture(e.pointerId);drag={buf,from:{p:g.p,a:g.a},last:[x,y]};const v=S.tool==='eraser'?0:S.color;buf[y*f.w+x]=v;drawEditor(buf);};
 cv.onpointermove=e=>{if(!drag)return;const p=at(e),v=S.tool==='eraser'?0:S.color;line(drag.last,p,(x,y)=>{drag.buf[y*f.w+x]=v;});drag.last=p;drawEditor(drag.buf);};
 const end=()=>{if(!drag)return;const d=drag;drag=null;applyGlyph(S.idx,{p:Array.from(d.buf).join(''),a:f.glyphs[S.idx].a},{from:d.from});};
 cv.onpointerup=end;cv.onpointercancel=end;
 let advFrom=null;
 $('#s-adv').oninput=e=>{if(!guardEdit())return;const g=f.glyphs[S.idx];advFrom=advFrom||{p:g.p,a:g.a};$('#s-advv').textContent=e.target.value+' px';g.a=+e.target.value;drawEditor();drawPreview();};
 $('#s-adv').onchange=()=>{const g=f.glyphs[S.idx],from=advFrom;advFrom=null;if(from)applyGlyph(S.idx,{p:g.p,a:g.a},{from});};
 $('#s-name').onchange=e=>{if(f.builtin)return;f.name=e.target.value.trim().slice(0,100)||f.name;touch(f);$('#page-studio .nav-title').textContent=f.name;};
 $('#s-text').oninput=e=>{S.previewText=e.target.value;drawPreview();};
 $('#s-find').oninput=()=>buildGlyphList();
 requestAnimationFrame(drawPreview);
}

function settingsSheet(){const f=editable();if(!f)return guardEdit();
 sheet('<h2>ตั้งค่าฟอนต์</h2><p class="sub">เปลี่ยนเครื่องหรือขนาดช่องอักษร ภาพเดิมจะถูกตัดหรือเติมขอบโปร่ง</p><div class="field"><label for="st-con">เครื่อง</label><select id="st-con" class="input">'+Core.CONSOLES.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></div>'
  +'<div class="grid2"><div class="field"><label for="st-w">กว้าง (px)</label><input id="st-w" class="input" type="number" min="1" max="64" inputmode="numeric"></div><div class="field"><label for="st-h">สูง (px)</label><input id="st-h" class="input" type="number" min="1" max="64" inputmode="numeric"></div></div>'
  +'<div class="field"><label for="st-bpp">ความลึกสีตอนส่งออก</label><select id="st-bpp" class="input"></select></div><div class="field"><span>ขนาดมาตรฐานของเครื่อง</span><div class="chips" id="st-cells" style="padding:0"></div></div>'
  +'<button class="btn block" id="st-ok">บันทึก</button>',s=>{
  const con=$('#st-con',s),w=$('#st-w',s),h=$('#st-h',s),bpp=$('#st-bpp',s);con.value=f.console;w.value=f.w;h.value=f.h;
  const fill=(keep)=>{const c=Core.consoleOf(con.value);bpp.innerHTML=Object.keys(c.formats).map(b=>'<option value="'+b+'">'+b+' บิต</option>').join('');bpp.value=c.formats[f.bpp]&&keep?f.bpp:c.bpp;$('#st-cells',s).innerHTML=c.cells.map(x=>'<button class="chip" data-cell="'+x+'">'+sizeLabel(x)+'</button>').join('');};
  fill(true);con.onchange=()=>{fill(false);const c=Core.consoleOf(con.value);w.value=c.cell[0];h.value=c.cell[1];};
  s.addEventListener('click',e=>{const b=e.target.closest('[data-cell]');if(b){[w.value,h.value]=b.dataset.cell.split(',');}});
  $('#st-ok',s).onclick=()=>{const nw=+w.value,nh=+h.value;if(!Number.isInteger(nw)||!Number.isInteger(nh)||nw<1||nh<1||nw>64||nh>64)return toast('ขนาดต้องเป็นจำนวนเต็ม 1–64');
   const next=Core.convertProject(f,{console:con.value,w:nw,h:nh,bpp:+bpp.value});S.fonts.set(f.id,next);Store.put(next).catch(()=>{});S.undo=[];S.redo=[];S.idx=Math.min(S.idx,next.glyphs.length-1);scheduleSync();closeSheet();mountStudio();toast('อัปเดตขนาดเป็น '+nw+'×'+nh+' แล้ว');};});}
function addGlyphSheet(){if(!guardEdit())return;
 sheet('<h2>เพิ่มอักษร</h2><p class="sub">พิมพ์หลายตัวติดกันได้ หรือคั่นด้วยเว้นวรรคเพื่อเพิ่มเป็นกลุ่ม เช่น <b>กิ ก่ ก้</b> (อักษรผสมใช้ภาพเดียวทั้งกลุ่ม)</p><div class="field"><input id="ag" class="input" aria-label="อักษรที่จะเพิ่ม" autofocus></div><button class="btn block" id="ag-ok">เพิ่ม</button>',s=>{
  $('#ag-ok',s).onclick=()=>{const f=editable(),raw=$('#ag',s).value.trim(),tokens=/\s/.test(raw)?raw.split(/\s+/):[...raw];let n=0;
   for(const t of tokens){if(!t||[...t].length>8||f.glyphs.some(g=>g.c===t)||f.glyphs.length>=2048)continue;f.glyphs.push({c:t,p:Core.blank(f.w,f.h),a:f.w});n++;}
   if(!n)return toast('ไม่มีอักษรใหม่ที่เพิ่มได้ (ซ้ำหรือว่าง)');touch(f);closeSheet();S.idx=f.glyphs.length-1;mountStudio();toast('เพิ่ม '+n+' อักษร');};});}
function exportSheet(){const f=S.fonts.get(S.cur);if(!f)return;const c=Core.consoleOf(f.console),n=slug(f.name);
 sheet('<h2>ส่งออก</h2><p class="sub">'+esc(f.name)+' · '+c.name+'</p><div class="actions">'+action('โปรเจกต์ FontLab (.fontlab.json)','json')+action('PNG sheet ('+Core.sheetSize(f).width+'×'+Core.sheetSize(f).height+')','png')+action('ไบนารีไทล์ '+f.bpp+' บิต (.bin)','bin')+action('สเปกและออฟเซ็ต (README.txt)','readme')+action('ทั้งหมดเป็น .zip','zip')+'</div><div class="actions">'+action('นำเข้า PNG sheet ทับฟอนต์นี้','imp-png',f.builtin?'off':'')+action('นำเข้า .bin ทับฟอนต์นี้','imp-bin',f.builtin?'off':'')+'</div><button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   try{if(a==='json')download(n+'.fontlab.json',JSON.stringify(f),'application/json');
    else if(a==='png')download(n+'-sheet.png',new Blob([await pngBytes(f,false)],{type:'image/png'}));
    else if(a==='bin')download(n+'-'+f.console+'-'+f.bpp+'bpp.bin',new Blob([Core.exportBank(f)]));
    else if(a==='readme')download(n+'-README.txt',Core.readme(f),'text/plain');
    else if(a==='zip'){const enc=new TextEncoder();download(n+'.zip',Core.zip([{name:n+'.fontlab.json',data:enc.encode(JSON.stringify(f))},{name:n+'-sheet.png',data:await pngBytes(f,false)},{name:n+'-'+f.console+'.bin',data:Core.exportBank(f)},{name:n+'-README.txt',data:enc.encode(Core.readme(f))}]),'application/zip');}
    else if(a==='imp-png'){closeSheet();pickFiles('image/png');}else if(a==='imp-bin'){closeSheet();pickFiles('.bin,application/octet-stream');}
    if(!a.startsWith('imp'))toast('ส่งออกแล้ว');}catch(err){toast('ส่งออกไม่สำเร็จ: '+err.message);}});});}

/* ---------- cloud ---------- */
function renderCloud(){
 const el=$('#page-cloud'),u=FontLabCloud.user,mine=userFonts().length;if(!el)return;
 const keepEmail=$('#c-email')?.value||'';
 el.innerHTML=nav('คลาวด์')+'<div class="large"><h1>คลาวด์</h1><p>ซิงก์ฟอนต์ของคุณข้ามอุปกรณ์ เก็บเฉพาะข้อมูลฟอนต์</p></div>'
  +(u?'<div class="group"><div class="row"><span class="status-dot on"></span><span class="grow">'+esc(u.email)+'<small>'+(S.cloudBusy?'<span class="spin" style="display:inline-block">⟳</span> ':'')+esc(S.cloudMsg||(S.lastSync?'ซิงก์ล่าสุด '+S.lastSync.toLocaleTimeString('th-TH'):'เข้าสู่ระบบแล้ว'))+'</small></span></div>'
   +'<div class="row"><span class="grow">ซิงก์อัตโนมัติ<small>อัปโหลดหลังแก้ไข และดึงเมื่อเปิดแอป</small></span><button class="switch" role="switch" aria-checked="'+S.auto+'" aria-label="ซิงก์อัตโนมัติ" data-act="auto"></button></div>'
   +'<div class="row"><span class="grow">ฟอนต์ของฉันบนเครื่องนี้</span><span class="val">'+mine+'</span></div></div>'
   +'<div class="pad" style="margin-top:14px;display:grid;gap:10px"><button class="btn block" data-act="sync"'+(S.cloudBusy?' disabled':'')+'>'+ic('sync')+' ซิงก์ตอนนี้</button><button class="btn gray block" data-act="signout">ออกจากระบบ</button></div>'
  :'<div class="group-title">เข้าสู่ระบบ</div><form class="group" id="c-form" style="padding:4px 16px 16px"><div class="field"><label for="c-email">อีเมล</label><input id="c-email" class="input" type="email" autocomplete="email" required value="'+esc(keepEmail)+'"></div><div class="field"><label for="c-pass">รหัสผ่าน</label><input id="c-pass" class="input" type="password" autocomplete="current-password" minlength="6" required></div>'
   +'<div class="grid2"><button class="btn" type="submit" value="in"'+(S.cloudBusy?' disabled':'')+'>เข้าสู่ระบบ</button><button class="btn tint" type="submit" value="up"'+(S.cloudBusy?' disabled':'')+'>สมัครใหม่</button></div><p class="foot" style="margin:10px 0 0" id="c-msg" role="status">'+esc(S.cloudMsg)+'</p></form><p class="foot">ใช้งานโดยไม่เข้าสู่ระบบได้ ฟอนต์จะอยู่ในเบราว์เซอร์นี้ เข้าสู่ระบบเมื่ออยากสำรองหรือใช้หลายเครื่อง</p>')
  +'<div class="group-title">การตั้งค่า Supabase</div><div class="group"><div class="row"><span class="grow">ตารางเดียว: fontlab_fonts<small>เก็บชื่อ เครื่อง ขนาด และพิกเซลของฟอนต์ ไม่มีรอม ไม่มีโปรเจกต์แปล ไม่มีรหัสแอดมิน</small></span></div><button class="row" data-act="schema"><span class="grow">คัดลอก SQL ติดตั้ง<small>รันครั้งเดียวใน Supabase → SQL Editor</small></span>'+ic('chev','chev')+'</button></div>'
  +'<p class="foot">ทุกแถวผูกกับบัญชีเจ้าของด้วย Row Level Security ผู้อื่นอ่านหรือแก้ไม่ได้ ใช้เฉพาะ publishable key ในเบราว์เซอร์</p>';
 const form=$('#c-form');if(form)form.onsubmit=async e=>{e.preventDefault();const mode=e.submitter?.value||'in',email=$('#c-email').value.trim(),pw=$('#c-pass').value;S.cloudBusy=true;S.cloudMsg='กำลังเชื่อมต่อ…';renderCloud();
  try{if(mode==='up'){const r=await FontLabCloud.signUp(email,pw);S.cloudMsg=r==='confirm'?'สมัครแล้ว · ตรวจอีเมลเพื่อยืนยัน แล้วกลับมาเข้าสู่ระบบ':'';}else{await FontLabCloud.signIn(email,pw);S.cloudMsg='';}}
  catch(err){S.cloudMsg=err.message;}finally{S.cloudBusy=false;}renderCloud();if(FontLabCloud.user)syncNow(false);};
}
function schemaSheet(){sheet('<h2>SQL ติดตั้ง</h2><p class="sub">คัดลอกแล้ววางใน Supabase → SQL Editor → Run (รันซ้ำได้ปลอดภัย)</p><div class="pre" tabindex="0">'+esc(FontLabSchema)+'</div><button class="btn block" id="sc-copy">คัดลอก SQL</button>',s=>{
 $('#sc-copy',s).onclick=async()=>{try{await navigator.clipboard.writeText(FontLabSchema);toast('คัดลอก SQL แล้ว');}catch{const r=document.createRange();r.selectNodeContents($('.pre',s));getSelection().removeAllRanges();getSelection().addRange(r);toast('เลือกข้อความไว้แล้ว กดคัดลอกด้วยตัวเอง');}};});}
FontLabCloud.onChange(()=>{if(S.tab==='cloud')renderCloud();});

/* ---------- events ---------- */
document.addEventListener('click',e=>{const t=e.target;
 const tab=t.closest('[data-tab]');if(tab)return go(tab.dataset.tab);
 const more=t.closest('[data-more]');if(more){e.stopPropagation();return fontMenu(more.dataset.more);}
 const open=t.closest('[data-open]');if(open)return openStudio(open.dataset.open);
 const fl=t.closest('[data-filter]');if(fl){S.filter=fl.dataset.filter;return renderLibrary();}
 const con=t.closest('[data-console]');if(con)return consoleSheet(con.dataset.console);
 const tool=t.closest('[data-tool]');if(tool){S.tool=tool.dataset.tool;return $$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b===tool));}
 const col=t.closest('[data-color]');if(col){S.color=+col.dataset.color;S.tool=S.tool==='eraser'?'pencil':S.tool;$$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===S.tool));return $$('[data-color]').forEach(b=>b.setAttribute('aria-pressed',b===col));}
 const op=t.closest('[data-op]');if(op)return transform(op.dataset.op);
 const gl=t.closest('.gl');if(gl)return selectGlyph(+gl.dataset.i);
 const a=t.closest('[data-act]')?.dataset.act;if(!a||t.closest('.sheet'))return;
 if(a==='new')newFontSheet();else if(a==='import')pickFiles('.json,application/json,.png,.bin');else if(a==='settings')settingsSheet();else if(a==='export')exportSheet();
 else if(a==='add-glyph')addGlyphSheet();else if(a==='grid'){S.grid=!S.grid;drawEditor();}
 else if(a==='dup-edit'){const f=S.fonts.get(S.cur),d=duplicate(f);addFont(d).then(()=>{openStudio(d.id);toast('ทำสำเนาแล้ว แก้ไขได้เลย');});}
 else if(a==='sync')syncNow(false);else if(a==='signout'){FontLabCloud.signOut();S.cloudMsg='';toast('ออกจากระบบแล้ว');}
 else if(a==='auto'){S.auto=!S.auto;try{localStorage.setItem('fontlab.auto',S.auto?'yes':'no');}catch{}renderCloud();if(S.auto)scheduleSync();}
 else if(a==='schema')schemaSheet();});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.query=e.target.value;renderLibrary();}});
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.matches?.('.card')){openStudio(e.target.dataset.open);return;}
 if(S.tab!=='studio'||!(e.ctrlKey||e.metaKey)||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
 if(e.key.toLowerCase()==='z'){e.preventDefault();stepHistory(e.shiftKey?1:-1);}else if(e.key.toLowerCase()==="y"){e.preventDefault();stepHistory(1);}});
document.addEventListener('click',e=>{if(e.target.closest('#u-undo'))stepHistory(-1);if(e.target.closest("#u-redo"))stepHistory(1);});
addEventListener('resize',()=>{if(S.tab==='studio'&&edit&&S.fonts.get(S.cur)){sizeEditor();drawEditor();drawPreview();}});
addEventListener('beforeunload',()=>{for(const [id,t] of saveTimers){clearTimeout(t);const f=S.fonts.get(id);if(f)Store.put(f);}});
addEventListener('hashchange',()=>{const t=location.hash.slice(1);if(TABS.some(x=>x[0]===t)&&t!==S.tab)go(t,{push:false});});

/* ---------- boot ---------- */
(async()=>{
 for(const b of FontLabBuiltins)S.fonts.set(b.id,b);
 await Store.init();
 try{for(const raw of await Store.all()){try{const f=Core.normalize(raw);S.fonts.set(f.id,f);}catch{}}}catch{}
 const start=location.hash.slice(1);go(TABS.some(x=>x[0]===start)?start:'library',{push:false});
 if(!Store.persistent())toast('เบราว์เซอร์นี้ไม่อนุญาตให้เก็บฟอนต์ถาวร · ส่งออกไฟล์ไว้เสมอ');
 if(FontLabCloud.user&&S.auto)syncNow(true);
})();
window.FontLabApp={S,Store,go,openStudio};
})();
