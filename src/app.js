/* FontLab app: iOS-style library, console starters, pixel studio and cloud sync. */
(()=>{
'use strict';
const Core=FontLabCore,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONS={
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',moon:'<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>',
 savedisk:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',newfont:'<rect x="3.5" y="3.5" width="13" height="13" rx="2.2"/><path d="M13 20.5h5.3a2.2 2.2 0 002.2-2.2V13M10 7v6M7 10h6"/>',
 tag:'<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="7.8" cy="8.8" r="1.1"/>',
 shadowico:'<rect x="4" y="4" width="11" height="11" rx="2.2"/><path d="M9 20h8a3 3 0 003-3V9"/>',spacingico:'<path d="M4 5v14M20 5v14M7 12h10M10 9l-3 3 3 3M14 9l3 3-3 3"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 ruler:'<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',warn:'<path d="M12 3.5l9.5 17h-19z"/><path d="M12 10v5M12 17.8v.2"/>',
 library:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
 consoles:'<rect x="2.5" y="7" width="19" height="10.5" rx="5"/><path d="M7 10.5v3.5M5.25 12.25h3.5"/><circle cx="15.5" cy="11.3" r=".6"/><circle cx="17.8" cy="13.3" r=".6"/>',
 studio:'<path d="M4 20l1-4.2L16.6 4.2a2 2 0 012.8 0l.4.4a2 2 0 010 2.8L8.2 19z"/><path d="M14.5 6.3l3.2 3.2"/>',
 cloud:'<path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 10.4a3.8 3.8 0 01-.2 7.6z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',kbd:'<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',more:'<circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/>',
 undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/>',
 share:'<path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>',gear:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',settings:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
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
const S={gameBox:(()=>{try{return localStorage.getItem('fontlab.gameBox')==='yes';}catch{return false;}})(),kx:0,ky:0,labels:(()=>{try{return localStorage.getItem('fontlab.zoneLabels')==='yes';}catch{return false;}})(),autoCloud:(()=>{try{return localStorage.getItem('fontlab.autoCloud')==='yes';}catch{return false;}})(),save:'done',guides:true,fonts:new Map(),tab:'library',filter:'all',query:'',cur:null,idx:0,tool:'pencil',color:1,grid:true,undo:[],redo:[],clip:null,previewText:'',cloud:{state:'idle',msg:'',last:null,count:0,warned:false,dirty:false}};
const isSeed=f=>f.id.startsWith('builtin-');
const isStarter=f=>isSeed(f)||!!f.starter; /* the 4 shipped fonts, or any font the user marked as a starter */
const seedCopy=b=>{const c=structuredClone(b);delete c.builtin;return c;};
const delSeedKey='fontlab.seedsDeleted.v1';let memDel=[];
const deletedSeeds=()=>{try{return JSON.parse(localStorage.getItem(delSeedKey)||'[]');}catch{return memDel;}};
const setDeletedSeeds=a=>{memDel=[...new Set(a)];try{localStorage.setItem(delSeedKey,JSON.stringify(memDel));}catch{}};
/* the user's fonts; untouched starter fonts stay out of the cloud until edited */
const userFonts=()=>[...S.fonts.values()].filter(f=>!(isSeed(f)&&!f.updatedAt));
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
function dragDismiss(handle,el,close){let y0=null,dy=0,t0=0;handle.style.touchAction='none';
 handle.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;y0=e.clientY;dy=0;t0=performance.now();handle.setPointerCapture(e.pointerId);el.style.animation='none';el.style.transition='none';});
 handle.addEventListener('pointermove',e=>{if(y0===null)return;dy=Math.max(0,e.clientY-y0);el.style.transform='translateY('+dy+'px)';});
 const end=()=>{if(y0===null)return;const v=dy/Math.max(1,performance.now()-t0);y0=null;el.style.transition='transform .2s ease';
  if(dy>100||v>.6){el.style.transform='translateY(110%)';setTimeout(close,170);}else el.style.transform='';dy=0;};
 handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);}
/* Form sheets get an iOS header bar (Cancel · title · primary action); action sheets keep the grouped list + Cancel. <!--bar--> / <!--bar:keep--> force the bar. */
function sheet(html,bind){closeSheet();lastFocus=document.activeElement;
 const forced=/<!--bar(:keep)?-->/.exec(html),keep=!!(forced&&forced[1]),isAction=/class="actions"/.test(html)&&!/class="(field|seg|switch|input)/.test(html),useBar=!!forced||!isAction;let title='';
 if(useBar&&!keep){const m=html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);if(m){title=m[1];html=html.replace(m[0],'');}}
 const b=document.createElement('div');b.className='backdrop';
 b.innerHTML='<div class="sheet'+(useBar?' has-bar':'')+'" role="dialog" aria-modal="true"><div class="sheet-head"><div class="grab"></div>'+(useBar?'<div class="bar"><button class="bar-btn" id="bar-cancel" data-close>ยกเลิก</button><h2 class="bar-title">'+title+'</h2><button class="bar-btn strong" id="bar-done" data-close>เสร็จ</button></div>':'')+'</div>'+html+'</div>';
 layer.append(b);const s=$('.sheet',b);b.addEventListener('mousedown',e=>{if(e.target===b)closeSheet();});
 closeSheetFn=()=>{b.remove();closeSheetFn=null;lastFocus?.focus?.();};s.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeSheet();});
 dragDismiss($('.sheet-head',s),s,closeSheet);
 if(useBar){const prim=s.querySelector('.btn.block:not(.gray):not(.tint):not(.danger)'),done=$('#bar-done',s),cancel=$('#bar-cancel',s);
  if(prim){done.textContent=prim.dataset.bar||prim.textContent.trim();done.removeAttribute('data-close');done.onclick=()=>prim.click();done.disabled=prim.disabled;new MutationObserver(()=>{done.disabled=prim.disabled;}).observe(prim,{attributes:true,attributeFilter:['disabled']});prim.style.display='none';}
  else cancel.style.visibility='hidden';
  s.querySelectorAll('.btn.gray.block[data-close]').forEach(x=>{x.style.display='none';});}
 enhanceSelects(s);bind?.(s);(s.querySelector('[autofocus]')||s.querySelector('input,select,textarea')||s.querySelector('.bar-btn.strong')||s.querySelector('button'))?.focus();return s;}
function closeSheet(){closeSheetFn?.();}
const action=(label,act,cls='')=>'<button class="row '+cls+'" data-act="'+act+'">'+label+'</button>';
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!document.querySelector('.sheet')&&GSEL.size){GSEL.clear();updateGSel();}closeSheet();}});

/* iOS-style pop-up menu that replaces native <select> (the real select stays in the DOM as the value holder) */
let openMenu=null;function closeMenu(){openMenu?.();openMenu=null;}
function enhanceSelects(root){for(const sel of $$('select.input',root)){if(sel._enh)continue;sel._enh=true;sel.classList.remove('input');sel.classList.add('native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');
  const btn=document.createElement('button');btn.type='button';btn.className='sel';btn.setAttribute('aria-haspopup','listbox');const lab=sel.labels?.[0];if(lab&&lab.id!==undefined){lab.removeAttribute('for');}
  const text=document.createElement('span');btn.append(text);btn.insertAdjacentHTML('beforeend',ic('chev'));sel.after(btn);
  if(lab){btn.setAttribute('aria-label',lab.textContent+': ');}
  const refresh=()=>{text.textContent=sel.selectedOptions[0]?.textContent||'';};refresh();sel.addEventListener('change',refresh);new MutationObserver(refresh).observe(sel,{childList:true});
  btn.onclick=e=>{e.stopPropagation();if(btn.getAttribute('aria-expanded')==='true')return closeMenu();closeMenu();btn.setAttribute('aria-expanded','true');
   const m=document.createElement('div');m.className='menu';m.setAttribute('role','listbox');
   for(const o of sel.options){const it=document.createElement('button');it.type='button';it.setAttribute('role','option');it.setAttribute('aria-checked',o.value===sel.value);it.innerHTML='<span></span>'+ic('check');it.firstChild.textContent=o.textContent;it.onclick=ev=>{ev.stopPropagation();sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));closeMenu();btn.focus();};m.append(it);}
   document.body.append(m);const r=btn.getBoundingClientRect(),mh=m.offsetHeight;let top=r.bottom+6;if(top+mh>innerHeight-12)top=Math.max(12,r.top-mh-6);m.style.width=Math.max(r.width,200)+'px';m.style.left=Math.min(r.left,innerWidth-m.offsetWidth-12)+'px';m.style.top=top+'px';
   (m.querySelector('[aria-checked=true]')||m.firstChild)?.scrollIntoView({block:'nearest'});m.querySelector('[aria-checked=true]')?.focus();
   m.addEventListener('keydown',ev=>{const b=[...m.children],i=b.indexOf(document.activeElement);if(ev.key==='ArrowDown'){ev.preventDefault();b[(i+1)%b.length].focus();}if(ev.key==='ArrowUp'){ev.preventDefault();b[(i-1+b.length)%b.length].focus();}});
   const off=ev=>{if(!m.contains(ev.target))closeMenu();};setTimeout(()=>document.addEventListener('pointerdown',off),0);
   openMenu=()=>{m.remove();btn.setAttribute('aria-expanded','false');document.removeEventListener('pointerdown',off);};};}}
addEventListener('resize',closeMenu);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();},true);

/* ---------- persistence ---------- */
const saveTimers=new Map();let syncTimer;
const savedText=()=>S.save==='saving'?'กำลังบันทึก…':'✓ บันทึกในเครื่องแล้ว'+({ok:' · และบนคลาวด์แล้ว',dirty:' · ยังไม่ขึ้นคลาวด์ (กดบันทึก)',busy:' · กำลังส่งขึ้นคลาวด์…',err:' · คลาวด์ยังไม่สำเร็จ (ดูที่ไอคอนคลาวด์)'}[S.cloud.state]||'');
function refreshSaved(){const el=$('#s-saved');if(el){el.textContent=savedText();el.className='saved '+(S.save==='saving'?'busy':S.cloud.state==='err'?'err':'ok');}}
function touch(f){f.updatedAt=Date.now();S.save='saving';refreshSaved();clearTimeout(saveTimers.get(f.id));saveTimers.set(f.id,setTimeout(()=>Store.put(f).then(()=>{S.save='done';refreshSaved();}).catch(()=>toast('บันทึกในเครื่องไม่สำเร็จ')),400));scheduleSync();}
function saveNewSheet(){const f=editable();if(!f)return guardEdit();
 sheet('<h2>เพิ่มเป็นฟอนต์ใหม่</h2><p class="sub">สร้างฟอนต์ใหม่จากสภาพปัจจุบัน โดยไม่บันทึกทับฟอนต์เดิม</p>'
  +'<div class="field"><label for="sn-name">ชื่อฟอนต์ใหม่</label><input id="sn-name" class="input" maxlength="100" value="'+esc((f.name+' (ใหม่)').slice(0,100))+'" autofocus></div>'
  +'<div class="group" style="margin:0 0 12px"><div class="row"><span class="grow">คืนฟอนต์เดิมเป็นก่อนแก้<small>เปิดไว้: ฟอนต์เดิมกลับเป็นตอนเปิดเข้ามาหรือบันทึกล่าสุด · ปิด: ฟอนต์เดิมเก็บการแก้ไขไว้ด้วย</small></span><button class="switch" role="switch" id="sn-restore" aria-checked="true" aria-label="คืนฟอนต์เดิมเป็นก่อนแก้"></button></div></div>'
  +'<button class="btn block" id="sn-go" data-bar="เพิ่ม">เพิ่มฟอนต์ใหม่</button>',s=>{
  let restore=true;$('#sn-restore',s).onclick=e=>{restore=!restore;e.currentTarget.setAttribute('aria-checked',restore);};
  $('#sn-go',s).onclick=async()=>{const name=$('#sn-name',s).value.trim().slice(0,100)||f.name+' (ใหม่)',copy={...structuredClone(f),id:Core.uid(),name,updatedAt:Date.now(),builtin:undefined};
   if(restore&&S.base){const old=structuredClone(S.base);old.updatedAt=old.updatedAt?Date.now():0;S.fonts.set(old.id,old);await Store.put(old).catch(()=>{});}
   closeSheet();await addFont(copy,{open:true});toast('เพิ่มฟอนต์ใหม่แล้ว'+(restore?' · ฟอนต์เดิมกลับเป็นก่อนแก้':''));syncNow(true,true);};});}
async function saveNow(){const f=editable();if(!f)return toast('ฟอนต์ในตัวไม่ต้องบันทึก · ทำสำเนาเพื่อแก้ไขก่อน');
 clearTimeout(saveTimers.get(f.id));S.save='saving';refreshSaved();
 try{await Store.put(f);S.base=structuredClone(f);S.save='done';refreshSaved();toast('บันทึกในเครื่องแล้ว · กำลังส่งขึ้นคลาวด์');await syncNow(true,true);toast(S.cloud.state==='ok'?'บันทึกแล้ว ✓ ในเครื่องและบนคลาวด์':S.cloud.state==='err'?'บันทึกในเครื่องแล้ว · คลาวด์ยังไม่สำเร็จ: '+S.cloud.msg:'บันทึกแล้ว');}catch{S.save='done';refreshSaved();toast('บันทึกในเครื่องไม่สำเร็จ ส่งออกไฟล์เก็บไว้ด้วย');}}
/* Cloud backup is automatic: every save schedules a sync to the vault named by this browser's backup code. */
const syncDelay=()=>Number.isFinite(window.FontLabSyncDelay)?window.FontLabSyncDelay:2500;
function setCloud(state,msg){S.cloud.state=state;S.cloud.msg=msg||'';$$('.cdot').forEach(d=>{d.className='cdot '+state;});const box=$('#cloud-status');if(box)box.textContent=cloudText();$$('[data-cloud-text]').forEach(e=>{e.textContent=cloudText();});refreshSaved();}
const cloudText=()=>({dirty:'มีการแก้ไขที่ยังไม่ขึ้นคลาวด์ · กดบันทึกเพื่อส่ง',busy:S.cloud.msg||'กำลังซิงก์…',ok:'บันทึกบนคลาวด์แล้ว'+(S.cloud.last?' · '+S.cloud.last.toLocaleTimeString('th-TH'):''),err:S.cloud.msg,idle:'พร้อมสำรองอัตโนมัติ'}[S.cloud.state]);
/* which version of each font the cloud already has (survives reloads), so "not on the cloud yet" is never forgotten */
const syncedKey='fontlab.syncedAt.v1';let memSynced={};
const getSynced=()=>{try{return JSON.parse(localStorage.getItem(syncedKey)||'{}');}catch{return memSynced;}};
const markSynced=fonts=>{const m=getSynced();for(const f of fonts)m[f.id]=f.updatedAt;memSynced=m;try{localStorage.setItem(syncedKey,JSON.stringify(m));}catch{}};
const isDirty=()=>{const m=getSynced();return userFonts().some(f=>m[f.id]!==f.updatedAt)||FontLabCloud.pendingDeletes()>0;};
function markDirty(){if(S.cloud.state!=='busy')setCloud('dirty');}
/* cloud upload happens when the user presses save (or turns on auto upload); edits only mark the font as not yet on the cloud */
function scheduleSync(){if(!S.autoCloud){markDirty();return;}clearTimeout(syncTimer);setCloud('busy','รอบันทึกขึ้นคลาวด์…');syncTimer=setTimeout(()=>syncNow(true),syncDelay());}
let syncing=false,syncAgain=false;
async function syncNow(quiet,silent,pull=false){if(syncing){syncAgain=true;return;}syncing=true;clearTimeout(syncTimer);setCloud('busy','กำลังซิงก์…');
 try{const r=await FontLabCloud.sync(userFonts(),{pull,onProgress:m=>setCloud('busy',m),onDownload:async raw=>{const f=Core.normalize(raw);S.fonts.set(f.id,f);await Store.put(f);markSynced([f]);}});
  if(!pull)markSynced(userFonts());S.cloud.last=new Date();S.cloud.count=r.total;setCloud(isDirty()?'dirty':'ok');if(r.downloaded){renderLibrary();toast('ดึงฟอนต์จากคลาวด์ '+r.downloaded+' ตัว');}else if(!quiet)toast('ซิงก์แล้ว');}
 catch(e){setCloud('err',e.message);if(!silent&&(!quiet||!S.cloud.warned)){S.cloud.warned=true;toast(e.message);}}
 finally{syncing=false;if(syncAgain){syncAgain=false;syncNow(true,true);}}}
async function addFont(f,{open=false}={}){S.fonts.set(f.id,f);await Store.put(f).catch(()=>{});scheduleSync();renderLibrary();if(open)openStudio(f.id);}

/* ---------- navigation ---------- */
const TABS=[['library','คลังฟอนต์'],['studio','สตูดิโอ'],['consoles','เครื่องเกม'],['settings','ตั้งค่า']];
/* recent fonts (sidebar shortcuts) */
const recentKey='fontlab.recent.v1';let memRecent=[];
const orderKey='fontlab.order.v1';let memOrder=[];
const readOrder=()=>{try{const a=JSON.parse(localStorage.getItem(orderKey)||'[]');return Array.isArray(a)?a:memOrder;}catch{return memOrder;}};
const saveOrder=a=>{memOrder=[...new Set(a)];try{localStorage.setItem(orderKey,JSON.stringify(memOrder));}catch{}};
/* fonts the user never placed come first (a new font lands on top); placed fonts keep their saved position */
const byOrder=tie=>{const o=readOrder(),ix=id=>o.indexOf(id);return(a,b)=>{const x=ix(a.id),y=ix(b.id);return x<0&&y<0?tie(a,b):x<0?-1:y<0?1:x-y;};};
const readRecent=()=>{try{return JSON.parse(localStorage.getItem(recentKey)||'[]');}catch{return memRecent;}};
function pushRecent(id){const r=[id,...readRecent().filter(x=>x!==id)].slice(0,6);memRecent=r;try{localStorage.setItem(recentKey,JSON.stringify(r));}catch{}}
const appVersion=()=>document.querySelector('meta[name=app-version]')?.content||'';
function renderTabs(){
 const recents=readRecent().map(id=>S.fonts.get(id)).filter(Boolean).slice(0,5),counts=new Map();for(const f of S.fonts.values())counts.set(f.console,(counts.get(f.console)||0)+1);
 const cons=Core.CONSOLES.filter(c=>counts.has(c.id)).sort((x,y)=>counts.get(y.id)-counts.get(x.id));
 $('#tabs').innerHTML='<div class="brand"><img src="icons/logo.svg" alt="" width="36" height="36">FontLab</div>'
  +'<div class="side-quick side-extra"><button class="sq" data-act="new">'+ic('plus')+'<span>ฟอนต์ใหม่</span></button><button class="sq" data-act="import">'+ic('download')+'<span>นำเข้า</span></button></div>'
  +TABS.map(([id,l])=>'<button class="tab" data-tab="'+id+'"'+(S.tab===id?' aria-current="page"':'')+'>'+ic(id)+'<span>'+l+'</span></button>').join('')
  +(cons.length?'<div class="side-sec side-extra"><h3>เครื่อง</h3>'+cons.map(c=>'<button class="side-item'+(S.tab==='library'&&S.filter===c.id?' on':'')+'" data-sidefilter="'+c.id+'"><span class="tag" style="background:'+c.tint+'">'+c.short+'</span><span class="nm">'+esc(c.name)+'</span><span class="ct">'+counts.get(c.id)+'</span></button>').join('')+'</div>':'')
  +(recents.length?'<div class="side-sec side-extra"><h3>ล่าสุด</h3>'+recents.map(f=>'<button class="side-item'+(S.tab==='studio'&&S.cur===f.id?' on':'')+'" data-recent="'+f.id+'" title="'+esc(f.name)+'"><span class="tag" style="background:'+consoleColor(f.console)+'">'+Core.consoleOf(f.console).short+'</span><span class="nm">'+esc(f.name)+'</span></button>').join('')+'</div>':'')
  +'<div class="side-foot side-extra"><button class="side-status" data-act="cloud" aria-label="สำรองบนคลาวด์"><i class="cdot '+S.cloud.state+'"></i><span data-cloud-text>'+esc(cloudText())+'</span></button></div>';}
function go(tab,{push=true}={}){S.tab=tab;$$('.page').forEach(p=>p.classList.toggle('on',p.id==='page-'+tab));renderTabs();if(push)try{history.replaceState(null,'','#'+tab);}catch{}scrollTo(0,0);
 const draw={library:renderLibrary,consoles:renderConsoles,studio:mountStudio,settings:renderSettings}[tab];
 try{draw();}catch(e){console.error(e);$('#page-'+tab).innerHTML='<div class="empty"><h2>เปิดหน้านี้ไม่สำเร็จ</h2>'+esc(e.message)+'</div>';}}
/* theme: light / dark, remembered; default follows the system */
const themeKey='fontlab.theme';
const isDark=()=>document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
function applyTheme(t,save){const r=document.documentElement;if(t)r.dataset.theme=t;else delete r.dataset.theme;if(save)try{t?localStorage.setItem(themeKey,t):localStorage.removeItem(themeKey);}catch{}
 const dark=isDark();for(const m of $$('meta[name=theme-color]'))m.content=dark?'#000000':'#ffffff';$$('[data-act=theme]').forEach(b=>{b.innerHTML=ic(dark?'sun':'moon');b.setAttribute('aria-label',dark?'เปลี่ยนเป็นโหมดกลางวัน':'เปลี่ยนเป็นโหมดกลางคืน');b.title=b.getAttribute('aria-label');});}
try{const t=localStorage.getItem(themeKey);if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch{}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>applyTheme(document.documentElement.dataset.theme,false));
const cloudBtn=()=>'<button class="icon-btn cbtn" data-act="cloud" aria-label="สำรองบนคลาวด์" title="สำรองบนคลาวด์">'+ic('cloud')+'<i class="cdot '+S.cloud.state+'"></i></button>';
const themeBtn=()=>'<button class="icon-btn" data-act="theme" aria-label="เปลี่ยนโหมดสี">'+ic(isDark()?'sun':'moon')+'</button>';
const nav=(title,actions='',lead='')=>'<div class="nav">'+lead+'<span class="nav-title">'+esc(title)+'</span><div class="nav-actions">'+actions+cloudBtn()+themeBtn()+'</div></div>';
addEventListener('scroll',()=>$$('.nav').forEach(n=>n.classList.toggle('scrolled',scrollY>48)),{passive:true});

/* ---------- library ---------- */
function cardHtml(f){const c=Core.consoleOf(f.console);
 return '<div class="card" role="button" tabindex="0" draggable="true" data-group="'+(isStarter(f)?'seed':'mine')+'" data-open="'+f.id+'" aria-label="เปิด '+esc(f.name)+'"><div class="prev" style="background:'+c.colors[0]+'"><canvas data-prev="'+f.id+'"></canvas></div><h3>'+esc(f.name)+'</h3>'
 +'<div class="meta"><span class="tag" style="background:'+c.tint+'">'+c.short+'</span><span>'+f.w+'×'+f.h+' · '+f.glyphs.length+' ตัว</span>'+(isStarter(f)?'<span>· ตั้งต้น</span>':'')+'</div>'
 +'<button class="more" data-more="'+f.id+'" aria-label="ตัวเลือก '+esc(f.name)+'">'+ic('more')+'</button></div>';}
/* ---------- reorder fonts: drag a card onto another card of the same group, or use the card menu ---------- */
function cardIds(){return $$('#page-library .card[data-open]').map(c=>c.dataset.open);}
function commitOrder(ids){saveOrder([...ids,...readOrder().filter(x=>!ids.includes(x)&&S.fonts.has(x))]);renderLibrary();}
function moveFont(id,targetId){if(id===targetId)return;const group=$('#page-library .card[data-open="'+id+'"]')?.dataset.group,tg=$('#page-library .card[data-open="'+targetId+'"]')?.dataset.group;if(!group||group!==tg)return;
 const ids=cardIds(),from=ids.indexOf(id),to=ids.indexOf(targetId);if(from<0||to<0)return;ids.splice(from,1);ids.splice(to,0,id);commitOrder(ids);}
function stepFont(id,dir){const card=$('#page-library .card[data-open="'+id+'"]');if(!card)return false;const sib=$$('#page-library .card[data-group="'+card.dataset.group+'"]').map(c=>c.dataset.open),i=sib.indexOf(id),j=i+dir;if(i<0||j<0||j>=sib.length)return false;moveFont(id,sib[j]);return true;}
let dragId=null;
document.addEventListener('dragstart',e=>{const c=e.target.closest?.('.card[data-open]');if(!c)return;dragId=c.dataset.open;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId);}catch{}c.classList.add('dragging');});
document.addEventListener('dragover',e=>{if(!dragId)return;const c=e.target.closest?.('.card[data-open]');$$('.card.drop').forEach(x=>{if(x!==c)x.classList.remove('drop');});if(!c||c.dataset.open===dragId||c.dataset.group!==$('.card[data-open="'+dragId+'"]')?.dataset.group)return;e.preventDefault();e.dataTransfer.dropEffect='move';c.classList.add('drop');});
document.addEventListener('drop',e=>{if(!dragId)return;const c=e.target.closest?.('.card[data-open]');if(!c)return;e.preventDefault();const id=dragId;dragId=null;moveFont(id,c.dataset.open);});
document.addEventListener('dragend',()=>{dragId=null;$$('.card.dragging,.card.drop').forEach(x=>x.classList.remove('dragging','drop'));});
function renderLibrary(){try{renderTabs();}catch{}
 const all=[...S.fonts.values()],counts=new Map();for(const f of all)counts.set(f.console,(counts.get(f.console)||0)+1);
 const q=S.query.trim().toLowerCase(),match=f=>(S.filter==='all'||f.console===S.filter)&&(!q||f.name.toLowerCase().includes(q)||Core.consoleOf(f.console).name.toLowerCase().includes(q));
 const mine=all.filter(f=>!isStarter(f)&&match(f)).sort(byOrder((a,b)=>b.updatedAt-a.updatedAt)),built=all.filter(f=>isStarter(f)&&match(f)).sort(byOrder(()=>0));
 const el=$('#page-library'),keep=$('#q'),hadFocus=document.activeElement===keep;
 el.innerHTML=nav('คลังฟอนต์','<button class="icon-btn dup-side" data-act="import" aria-label="นำเข้า">'+ic('download')+'</button><button class="icon-btn dup-side" data-act="new" aria-label="สร้างฟอนต์ใหม่">'+ic('plus')+'</button>')
  +'<div class="large"><h1>คลังฟอนต์</h1><p>ฟอนต์บิตแมปสำหรับเกมบนเอมูเลเตอร์ทุกเครื่อง</p></div>'
  +'<label class="search">'+ic('search')+'<input id="q" type="search" placeholder="ค้นหาฟอนต์หรือเครื่อง" value="'+esc(S.query)+'" aria-label="ค้นหา"></label>'
  +'<div class="chips" role="group" aria-label="กรองตามเครื่อง"><button class="chip" aria-pressed="'+(S.filter==='all')+'" data-filter="all">ทั้งหมด '+all.length+'</button>'
  +Core.CONSOLES.filter(c=>counts.has(c.id)).map(c=>'<button class="chip" aria-pressed="'+(S.filter===c.id)+'" data-filter="'+c.id+'">'+c.short+' '+counts.get(c.id)+'</button>').join('')+'</div>'
  +(mine.length?'<div class="group-title">ฟอนต์ของฉัน</div><div class="cards">'+mine.map(cardHtml).join('')+'</div>':(!q&&S.filter==='all'?'<div class="group-title">ฟอนต์ของฉัน</div><div class="group"><button class="row" data-act="new"><span class="grow">สร้างฟอนต์แรกของคุณ<small>เลือกเครื่องแล้วเริ่มจากฟอนต์เปล่าหรือฟอนต์ไทยพื้นฐาน</small></span>'+ic('plus')+'</button></div>':''))
  +(built.length?'<div class="group-title">ฟอนต์ตั้งต้น</div><div class="cards">'+built.map(cardHtml).join('')+'</div>':'')
  +(!mine.length&&!built.length?'<div class="empty">'+ic('search')+'<h2>ไม่พบฟอนต์</h2>ลองเปลี่ยนคำค้นหรือเครื่องที่เลือก</div>':'');
 if(hadFocus){const n=$('#q');n.focus();n.setSelectionRange(n.value.length,n.value.length);}
 for(const cv of $$('canvas[data-prev]',el)){const f=S.fonts.get(cv.dataset.prev),sc=Math.max(1,Math.min(3,Math.floor(72/f.h)));drawText(cv,f,sampleOf(f),sc,150);}
}

/* ---------- new font / console sheets ---------- */
const sizeLabel=([w,h])=>w+'×'+h;
async function loadFontFace(file){const fam='flf'+Math.random().toString(36).slice(2,8),ff=new FontFace(fam,await file.arrayBuffer());await ff.load();document.fonts.add(ff);return fam;}
/* draw each character with the browser's text engine, keep pixels whose alpha passes the threshold; marks = (letter + mark) minus the letter alone */
function rasterGlyphs(fam,chars,{w,h,size,thr}){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const ctx=cv.getContext('2d',{willReadFrequently:true}),by=Core.zonesFor(h)[1].rows[1]+1;
 const draw=t=>{ctx.clearRect(0,0,w,h);ctx.font=size+'px "'+fam+'"';ctx.textBaseline='alphabetic';ctx.fillStyle='#000';ctx.fillText(t,Math.round(w*.1),by);const d=ctx.getImageData(0,0,w,h).data,a=new Uint8Array(w*h);for(let i=0;i<w*h;i++)a[i]=d[i*4+3]>=thr*2.55?1:0;return{a,adv:Math.round(ctx.measureText(t).width)};};
 const base=draw('ก').a,out=[];
 for(const ch of chars){const k=Core.classOf(ch);let px,adv;
  if(k==='upper'||k==='tone'||k==='lower'){const r=draw('ก'+ch);px=r.a.map((v,i)=>v&&!base[i]?1:0);adv=w;}else{const r=draw(ch);px=r.a;adv=Math.max(1,Math.min(w,r.adv+1));}
  out.push({c:ch,p:Array.from(px).join(''),a:adv});}
 return out;}
const defaultConsole=()=>{try{const c=localStorage.getItem('fontlab.defaultConsole');return Core.CONSOLES.some(x=>x.id===c)?c:'gba';}catch{return 'gba';}};
function newFontSheet(cid=defaultConsole(),kind='thai-base'){
 sheet('<h2>ฟอนต์ใหม่</h2><p class="sub">เลือกเครื่องและขนาดช่องอักษร</p>'
  +'<div class="field"><label for="nf-name">ชื่อ</label><input id="nf-name" class="input" maxlength="100" value="" placeholder="เช่น ไทยพิกเซล 16px" autofocus></div>'
  +'<div class="field"><label for="nf-con">เครื่อง</label><select id="nf-con" class="input">'+Core.CONSOLES.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></div>'
  +'<div class="grid2"><div class="field"><label for="nf-size">ช่องอักษร (px)</label><select id="nf-size" class="input"></select></div><div class="field"><label for="nf-bpp">ความลึกสี</label><select id="nf-bpp" class="input"></select></div></div>'
  +'<div class="field"><span>เริ่มจาก</span><div class="seg grid2x" role="group"><button data-kind="thai-base" aria-pressed="true">ไทยพื้นฐาน</button><button data-kind="blank" aria-pressed="false">ฟอนต์เปล่า</button><button data-kind="file" aria-pressed="false">จากไฟล์ฟอนต์</button><button data-kind="starter" aria-pressed="false">จากฟอนต์ตั้งต้น</button></div></div>'
  +'<div id="nf-starter" class="field hide"><label for="nf-starter-sel">ฟอนต์ตั้งต้น</label><select id="nf-starter-sel" class="input">'+([...S.fonts.values()].filter(isStarter).map(f=>'<option value="'+f.id+'">'+esc(f.name)+' · '+f.w+'×'+f.h+'</option>').join('')||'<option value="">ยังไม่มีฟอนต์ตั้งต้น</option>')+'</select></div>'
  +'<div id="nf-file" class="hide"><div class="group inset" style="margin:0 0 10px"><div class="row"><span class="grow">ไฟล์ฟอนต์<small id="nf-fname">.ttf .otf .woff .woff2 · แปลงเป็นพิกเซลเป็นจุดเริ่มต้น</small></span><button class="btn tint small" id="nf-pick" type="button">เลือกไฟล์</button></div></div><input type="file" id="nf-file-in" accept=".ttf,.otf,.woff,.woff2" class="hide">'
  +'<div class="grid2"><div class="field"><label for="nf-fsize">ขนาดตัวอักษร (px)</label><input id="nf-fsize" class="input" type="number" min="6" max="64" value="11" inputmode="numeric"></div><div class="field"><label for="nf-thr">ความเข้มของขอบ</label><input id="nf-thr" type="range" min="20" max="90" value="50" style="accent-color:var(--accent)"></div></div>'
  +'<div class="preview-box" id="nf-pbox" style="margin-bottom:6px"><canvas id="nf-prev"></canvas></div><p class="foot" style="margin:0 4px 6px">ภาพที่ได้เป็นแค่จุดเริ่มต้น ควรแก้ด้วยมือต่อ และตรวจสิทธิ์การใช้ฟอนต์ก่อนนำไปใช้ในเกม</p></div>'
  +'<p class="foot" id="nf-note" style="margin:0 4px 6px"></p><button class="btn block" id="nf-go" data-bar="สร้าง" style="margin-top:8px">สร้างและเปิดสตูดิโอ</button>',s=>{
  const con=$('#nf-con',s),size=$('#nf-size',s),bpp=$('#nf-bpp',s);con.value=cid;
  const fill=()=>{const c=Core.consoleOf(con.value);size.innerHTML=c.cells.map(x=>'<option value="'+x+'"'+(x+''===c.cell+''?' selected':'')+'>'+sizeLabel(x)+'</option>').join('');bpp.innerHTML=Object.keys(c.formats).map(b=>'<option value="'+b+'"'+(+b===c.bpp?' selected':'')+'>'+b+' บิต</option>').join('');};
  const note=()=>{const [w,h]=size.value.split(',').map(Number),c=Core.consoleOf(con.value);$('#nf-note',s).textContent=Core.tooShort(h)?'⚠ ความสูง '+h+' px ไม่พอสำหรับสระบน/ล่างพร้อมวรรณยุกต์ แนะนำสูง 16 px ขึ้นไป':(c.kind==='tile'&&w%8===0&&h%8===0?'ช่อง '+w+'×'+h+' = '+(w/8)*(h/8)+' ไทล์ต่อตัวอักษร · ':'')+(c.kind==='tile'?'':'เครื่องนี้ใช้เท็กซ์เจอร์/บิตแมป ส่งออก PNG เป็นหลัก · ')+'ดูขอบเขตการวาดได้ในสตูดิโอ';};fill();note();con.onchange=()=>{fill();note();};size.onchange=note;const file={fam:null,name:''},fsize=$('#nf-fsize',s),thr=$('#nf-thr',s);
  const fprev=()=>{if(!file.fam)return;const [w,h]=size.value.split(',').map(Number),g=rasterGlyphs(file.fam,[...'กขคงจ ABC'],{w,h,size:+fsize.value||11,thr:+thr.value}),cv=$('#nf-prev',s),sc=2,cp=Core.consoleOf(con.value).colors,adv=g.reduce((n,x)=>n+x.a,0);
   cv.width=Math.max(8,adv*sc+8);cv.height=h*sc;const cx=cv.getContext('2d');cx.fillStyle=cp[0];cx.fillRect(0,0,cv.width,cv.height);let x=4;for(const q of g){drawGlyph(cx,{w,h},q,x*sc,0,sc,cp);x+=q.a;}$('#nf-pbox',s).style.background=cp[0];};
  const syncSize=()=>{const [,h]=size.value.split(',').map(Number);fsize.value=Math.max(6,Math.round(h*.7));fprev();};
  size.addEventListener('change',syncSize);con.addEventListener('change',()=>setTimeout(syncSize,0));fsize.oninput=fprev;thr.oninput=fprev;
  $('#nf-pick',s).onclick=()=>$('#nf-file-in',s).click();
  $('#nf-file-in',s).onchange=async e=>{const fl=e.target.files[0];if(!fl)return;try{file.fam=await loadFontFace(fl);file.name=fl.name.replace(/\.[^.]+$/,'');$('#nf-fname',s).textContent=fl.name;if(!$('#nf-name',s).value)$('#nf-name',s).value=file.name+' (พิกเซล)';syncSize();}catch(err){file.fam=null;toast('เปิดไฟล์ฟอนต์ไม่สำเร็จ: '+(err.message||'ไฟล์ไม่ถูกต้อง'));}};
  $$('[data-kind]',s).forEach(b=>{b.setAttribute('aria-pressed',b.dataset.kind===kind);b.onclick=()=>{kind=b.dataset.kind;$$('[data-kind]',s).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#nf-file',s).classList.toggle('hide',kind!=='file');$('#nf-starter',s).classList.toggle('hide',kind!=='starter');};});
  $('#nf-go',s).onclick=async()=>{const [w,h]=size.value.split(',').map(Number),base=FontLabBuiltins[0];
   if(kind==='starter'){const src=S.fonts.get($('#nf-starter-sel',s).value);if(!src)return toast('ยังไม่มีฟอนต์ตั้งต้นให้เลือก');
    const p=Core.convertProject(structuredClone(src),{console:con.value,w,h,bpp:+bpp.value});delete p.builtin;delete p.starter;p.id=Core.uid();p.name=($('#nf-name',s).value.trim()||src.name+' (ใหม่)').slice(0,100);p.updatedAt=Date.now();closeSheet();await addFont(p,{open:true});toast('สร้างจากฟอนต์ตั้งต้น “'+src.name+'” แล้ว');return;}
   if(kind==='file'){if(!file.fam)return toast('เลือกไฟล์ฟอนต์ก่อน');const p=Core.newProject({name:($('#nf-name',s).value.trim()||file.name||'ฟอนต์จากไฟล์').slice(0,100),console:con.value,w,h,bpp:+bpp.value});
    const g=rasterGlyphs(file.fam,p.glyphs.map(x=>x.c),{w,h,size:+fsize.value||11,thr:+thr.value});p.glyphs=g;p.note='แปลงจากไฟล์ฟอนต์ '+file.name;closeSheet();await addFont(p,{open:true});toast('สร้างฟอนต์จากไฟล์แล้ว · แก้ต่อด้วยมือได้');return;}
   const p=Core.convertProject(Core.starter(con.value,kind,base),{console:con.value,w,h,bpp:+bpp.value});p.name=($('#nf-name',s).value.trim()||p.name).slice(0,100);p.id=Core.uid();closeSheet();await addFont(p,{open:true});toast('สร้างฟอนต์แล้ว');};});}

/* ---------- consoles ---------- */
const CICON={
 'handheld-v':'<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><rect x="9" y="5" width="6" height="6" rx=".8"/><path d="M9.5 16h3M11 14.5v3"/><circle cx="15" cy="16" r=".9"/>',
 'handheld-w':'<rect x="2" y="6.5" width="20" height="11" rx="3.2"/><rect x="8.2" y="8.6" width="7.6" height="6.8" rx=".8"/><path d="M4 12h3M5.5 10.5v3"/><circle cx="18.6" cy="11.2" r=".9"/><circle cx="17.2" cy="14" r=".9"/>',
 dual:'<rect x="6" y="2.5" width="12" height="8" rx="1.6"/><rect x="6" y="13" width="12" height="8.5" rx="1.6"/><path d="M3.5 11.8h17"/>',
 pad:'<rect x="2" y="7.5" width="20" height="10" rx="4.5"/><path d="M6 12.5h4M8 10.5v4"/><circle cx="15.5" cy="11.6" r=".95"/><circle cx="18.2" cy="13.6" r=".95"/>',
 console:'<rect x="2.5" y="8" width="19" height="9" rx="2"/><path d="M6 12.5h8M17 11.5v2"/>',
 tower:'<rect x="8" y="2.5" width="8" height="19" rx="1.8"/><path d="M10.5 6h3M10.5 9h3"/><circle cx="12" cy="17.5" r=".9"/>',
 switch:'<rect x="6" y="3.5" width="12" height="17" rx="2.4"/><rect x="2.5" y="6" width="3" height="12" rx="1.5"/><rect x="18.5" y="6" width="3" height="12" rx="1.5"/>',
 disc:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/>',
 card:'<rect x="6" y="3" width="12" height="18" rx="1.6"/><rect x="8.5" y="5.5" width="7" height="6.5" rx=".8"/><path d="M9 16.5h6"/>',
 stick:'<rect x="3.5" y="15" width="17" height="5.5" rx="1.6"/><path d="M12 15V8.5"/><circle cx="12" cy="6.3" r="2.5"/>',
 arcade:'<rect x="5.5" y="2.5" width="13" height="19" rx="2"/><rect x="8" y="5" width="8" height="6" rx=".8"/><path d="M12 17v-3"/><circle cx="12" cy="13" r="1.2"/>'};
const kindLabel=c=>c.kind==='tile'?'ไทล์ '+Object.keys(c.formats).join('/')+' บิต':c.kind==='texture'?'เท็กซ์เจอร์ · PNG':'บิตแมปทั่วไป · PNG';
const consoleIcon=c=>'<span class="cico" style="--t:'+c.tint+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+CICON[c.icon]+'</svg><b>'+esc(c.short)+'</b></span>';
function zoneRules(w,h){const Z=Core.zonesFor(h),a=k=>{const q=Core.ALLOWED[k].map(x=>Math.round(x*(h-1)/15));return q[0]+'–'+Math.min(h-1,q[1]);};
 if(Core.tooShort(h))return '<p class="foot" style="margin:8px 4px">⚠ ความสูง '+h+' px ไม่พอสำหรับสระบน/ล่างพร้อมวรรณยุกต์ แนะนำช่องสูง 16 px ขึ้นไป (เช่น 8×16 = 2 ไทล์ซ้อนกัน)</p>';
 const R=[['วรรณยุกต์ / การันต์','วาดในแถว '+a('tone')+' และอย่าลงมาถึงหัวพยัญชนะ'],['สระบน (ั ิ ี ึ ื ็ ํ)','แถว '+a('upper')],['พยัญชนะ','ลำตัวแถว '+Z[1].rows[0]+'–'+Z[1].rows[1]+' · หัวสูง (ป ฝ ฟ) ขึ้นได้ถึงแถว '+a('cons').split('–')[0]+' · หางต่ำ (ฎ ฏ ฤ) ลงได้ถึงแถว '+a('cons').split('–')[1]],['สระล่าง (ุ ู ฺ)','แถว '+a('lower')],['สระหน้า / ตัวเลข','แถว '+a('lead')],['ด้านกว้าง','ภาพต้องไม่เกินระยะอักษร (เส้นประแนวตั้ง) ไม่งั้นตัวอักษรติดกัน'],['อักษรผสม','เช่น กิ ก่ ก้ วาดพยัญชนะ + สระ + วรรณยุกต์ครบในช่องเดียว สระอยู่เหนือหัวพยัญชนะ วรรณยุกต์อยู่เหนือสระ']].concat(w===8&&h===16?[['8×16 = 2 ไทล์','ไทล์บนคือแถว 0–7 ไทล์ล่างคือแถว 8–15']]:[]);
 return '<div class="group" style="margin:0 0 10px">'+Z.map(z=>'<div class="row"><span class="zdot" style="background:'+z.color+'"></span><span class="grow">'+esc(z.name)+'<small>แถว '+z.rows[0]+'–'+z.rows[1]+'</small></span></div>').join('')+'</div>'
  +'<div class="group" style="margin:0 0 8px">'+R.map(([t,d])=>'<div class="row"><span class="grow">'+t+'<small>'+d+'</small></span></div>').join('')+'</div>';}
function renderConsoles(){
 $('#page-consoles').innerHTML=nav('เครื่องเกม')+'<div class="large"><h1>เครื่องเกม</h1><p>เลือกเครื่องเพื่อดูรูปแบบไทล์ ขอบเขตการวาด และชุดสารตั้งต้น</p></div>'
  +Core.GROUPS.map(([g,label])=>{const list=Core.CONSOLES.filter(c=>c.group===g);return '<section class="cgroup" aria-label="'+esc(label)+'"><div class="cgroup-h"><h2>'+esc(label)+'</h2><span>'+list.length+' เครื่อง</span></div><div class="cgrid">'+list.map(c=>'<button class="ctile" data-console="'+c.id+'" aria-label="'+esc(c.name)+'">'+consoleIcon(c)+'<span class="cname">'+esc(c.name)+'</span><small>'+esc(kindLabel(c))+'</small></button>').join('')+'</div></section>';}).join('')
  +'<p class="foot">ทุกเครื่องส่งออกเป็น PNG sheet, ไฟล์ไบนารี และ .fontlab.json ได้ พิกเซลมี 4 ดัชนีสี: โปร่ง · หมึก · เงา · เสริม</p>';}
async function pngBytes(p,guide){const s=Core.renderSheet(p,{guide}),cv=document.createElement('canvas');cv.width=s.width;cv.height=s.height;cv.getContext('2d').putImageData(new ImageData(s.rgba,s.width,s.height),0,0);
 return new Uint8Array(await (await new Promise(r=>cv.toBlob(r,'image/png'))).arrayBuffer());}
async function starterZip(cid){const enc=new TextEncoder(),files=[],base=FontLabBuiltins[0];
 for(const kind of ['blank','thai-base']){const p=Core.starter(cid,kind,base);p.id='starter-'+cid+'-'+kind;p.updatedAt=0;const n=cid+'-'+kind;
  files.push({name:n+'.fontlab.json',data:enc.encode(JSON.stringify(p))},{name:n+'-sheet.png',data:await pngBytes(p,kind==='blank')},{name:n+'.bin',data:Core.exportBank(p)},{name:n+'-README.txt',data:enc.encode(Core.readme(p))});}
 return Core.zip(files);}
function consoleSheet(id){const c=Core.consoleOf(id),fmts=Object.entries(c.formats).map(([b,k])=>'<div class="row"><span class="grow">'+b+' บิต<small>'+esc(Core.FORMATS[k].name)+'</small></span></div>').join('');
 sheet('<!--bar:keep--><div style="display:flex;justify-content:center">'+consoleIcon(c)+'</div><h2 style="margin-top:8px">'+esc(c.name)+'</h2><p class="sub">'+esc(c.notes)+'</p>'
  +'<div class="group-title" style="margin-left:16px">รูปแบบไบนารี</div><div class="group" style="margin:0 0 12px">'+fmts+'<div class="row"><span class="grow">ช่องอักษรเริ่มต้น<small>'+c.cells.map(sizeLabel).join(' · ')+'</small></span></div></div>'
  +'<div class="group-title" style="margin-left:16px">ขอบเขตการวาดภาษาไทย (ช่อง '+c.cell.join('×')+')</div>'+zoneRules(c.cell[0],c.cell[1])+'<div class="group-title" style="margin-left:16px">สารตั้งต้น</div><div class="actions">'+action('สร้างฟอนต์ไทยพื้นฐานสำหรับ '+c.short,'start-thai')+action('สร้างฟอนต์เปล่าสำหรับ '+c.short,'start-blank')+action('ดาวน์โหลดชุดไฟล์ (.zip)','zip')+'</div>'
  +'<p class="foot" style="margin:0 8px 12px">ชุด .zip มี .fontlab.json, PNG sheet, ไฟล์ .bin ของเครื่องนี้ และ README ที่ระบุออฟเซ็ตของทุกตัวอักษร ทั้งแบบเปล่าและแบบไทยพื้นฐาน</p><button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   if(a==='zip'){try{download('fontlab-'+c.id+'-starter.zip',await starterZip(c.id),'application/zip');toast('ดาวน์โหลดชุดสารตั้งต้นแล้ว');}catch(err){toast('สร้างไฟล์ไม่สำเร็จ: '+err.message);}}
   else{closeSheet();const p=Core.starter(c.id,a==='start-thai'?'thai-base':'blank',FontLabBuiltins[0]);await addFont(p,{open:true});toast('สร้างจากสารตั้งต้น '+c.short+' แล้ว');}});});}

/* ---------- font actions ---------- */
function fontMenu(id){const f=S.fonts.get(id);if(!f)return;
 sheet('<h2>'+esc(f.name)+'</h2><p class="sub">'+Core.consoleOf(f.console).name+' · '+f.w+'×'+f.h+' · '+f.glyphs.length+' ตัว</p><div class="actions">'+action('เปิดในสตูดิโอ','open')+action('ย้ายขึ้น','move-up')+action('ย้ายลง','move-down')+action('ทำสำเนา','dup')+action('ดาวน์โหลด .fontlab.json','json')+(isSeed(f)?'':action(f.starter?'เลิกเป็นฟอนต์ตั้งต้น':'ตั้งเป็นฟอนต์ตั้งต้น','toggle-starter'))+(isSeed(f)?action('คืนเป็นฟอนต์ตั้งต้นเดิม','reset-seed','red'):'')+action('ลบฟอนต์','del','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   if(a==='open'){closeSheet();openStudio(id);}
   if(a==='move-up'||a==='move-down'){closeSheet();if(!stepFont(id,a==='move-up'?-1:1))toast(a==='move-up'?'อยู่บนสุดของกลุ่มแล้ว':'อยู่ล่างสุดของกลุ่มแล้ว');}if(a==='dup'){closeSheet();await addFont(duplicate(f));toast('ทำสำเนาแล้ว');}
   if(a==='json'){download(slug(f.name)+'.fontlab.json',JSON.stringify(f),'application/json');}
   if(a==='toggle-starter'){closeSheet();if(f.starter)delete f.starter;else f.starter=true;touch(f);renderLibrary();toast(f.starter?'ตั้งเป็นฟอนต์ตั้งต้นแล้ว · ใช้เป็นจุดเริ่มต้นของฟอนต์ใหม่ได้':'เลิกเป็นฟอนต์ตั้งต้นแล้ว');}if(a==='del')confirmDelete(f);if(a==='reset-seed')confirmReset(f);});});}
const duplicate=f=>({...structuredClone(f),id:Core.uid(),name:(f.name+' (สำเนา)').slice(0,100),builtin:undefined,note:undefined,updatedAt:Date.now()});
function confirmReset(f){const b=FontLabBuiltins.find(x=>x.id===f.id);if(!b)return;
 sheet('<h2>คืน “'+esc(f.name)+'” เป็นของเดิม?</h2><p class="sub">การแก้ไขทั้งหมดของฟอนต์นี้จะหายไป ย้อนกลับไม่ได้</p><div class="actions">'+action('คืนเป็นของเดิม','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  $('[data-act=yes]',s).onclick=async()=>{closeSheet();const c=seedCopy(b);S.fonts.set(c.id,c);await Store.del(c.id).catch(()=>{});FontLabCloud.markDeleted(c.id);if(S.cur===c.id){S.undo=[];S.redo=[];}renderLibrary();if(S.tab==='studio')mountStudio();toast('คืนเป็นฟอนต์ตั้งต้นแล้ว');};});}
function confirmDelete(f){sheet('<h2>ลบ “'+esc(f.name)+'” ?</h2><p class="sub">ฟอนต์จะถูกลบจากเครื่องนี้และจากคลาวด์สำรอง ย้อนกลับไม่ได้</p><div class="actions">'+action('ลบ','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
 $('[data-act=yes]',s).onclick=async()=>{closeSheet();S.fonts.delete(f.id);await Store.del(f.id).catch(()=>{});if(isSeed(f))setDeletedSeeds([...deletedSeeds(),f.id]);FontLabCloud.markDeleted(f.id);if(S.cur===f.id)S.cur=null;renderLibrary();if(S.tab==='studio')mountStudio();scheduleSync();toast('ลบแล้ว');};});}

/* ---------- import ---------- */
async function importFiles(files,opts={}){
 for(const file of files){const ext=file.name.split('.').pop().toLowerCase();
  try{
   if(ext==='json'){const raw=JSON.parse(await file.text());let f=Core.normalize(raw);if(S.fonts.has(f.id)||f.builtin)f={...f,id:Core.uid(),builtin:undefined,name:f.name+' (นำเข้า)'};f.updatedAt=Date.now();if(opts.starter)f.starter=true;await addFont(f,{open:files.length===1&&!opts.starter});toast(opts.starter?'เพิ่ม “'+f.name+'” เป็นฟอนต์ตั้งต้นแล้ว':'นำเข้า “'+f.name+'” แล้ว');}
   else if(ext==='png'||ext==='bin'){const f=editable();if(!f)throw Error('เปิดฟอนต์ที่แก้ไขได้ในสตูดิโอก่อน แล้วนำเข้า .'+ext);
    let px;if(ext==='bin')px=Core.importBank(f,new Uint8Array(await file.arrayBuffer()));
    else{const bmp=await createImageBitmap(file),cv=document.createElement('canvas');cv.width=bmp.width;cv.height=bmp.height;const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(bmp,0,0);px=Core.readSheet(f,cx.getImageData(0,0,bmp.width,bmp.height).data,bmp.width,bmp.height);}
    S.undo=[];S.redo=[];px.forEach((p,i)=>{f.glyphs[i].p=p;});touch(f);mountStudio();toast('นำเข้า '+px.length+' ตัวอักษรจาก '+file.name);}
   else throw Error('รองรับเฉพาะ .json .png .bin');
  }catch(e){toast(file.name+': '+e.message);}}}
function pickFiles(accept,opts={}){const i=$('#pick');i.accept=accept;i.value='';i.onchange=()=>importFiles([...i.files],opts);i.click();}

/* ---------- studio ---------- */
const editable=()=>{const f=S.fonts.get(S.cur);return f&&!f.builtin?f:null;};
function openStudio(id){GSEL.clear();pushRecent(id);S.cur=id;S.base=structuredClone(S.fonts.get(id));S.idx=0;S.undo=[];S.redo=[];S.previewText='';go('studio');}
let edit=null; // {cv,ctx,scale}
function mountStudio(){
 const el=$('#page-studio'),f=S.fonts.get(S.cur);
 if(!f){el.innerHTML=nav('สตูดิโอ')+'<div class="large"><h1>สตูดิโอ</h1></div><div class="empty">'+ic('studio')+'<h2>ยังไม่ได้เลือกฟอนต์</h2>เลือกฟอนต์จากคลัง หรือสร้างใหม่เพื่อเริ่มวาดพิกเซล<div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="new">สร้างฟอนต์ใหม่</button><button class="btn tint" data-tab="library">ไปที่คลัง</button></div></div>';edit=null;return;}
 const ro=!!f.builtin,c=Core.consoleOf(f.console),max=Core.maxIndex(f),labels=['โปร่ง','หมึก','เงา','เสริม'];if(S.color>max)S.color=1;
 el.innerHTML=nav(f.name,(ro?'':'<button class="icon-btn" id="u-save" data-act="save" aria-label="บันทึก" title="บันทึก (เซฟในเครื่องและส่งขึ้นคลาวด์)">'+ic('savedisk')+'</button><button class="icon-btn" id="u-savenew" data-act="save-new" aria-label="เพิ่มเป็นฟอนต์ใหม่" title="เพิ่มเป็นฟอนต์ใหม่ (ไม่บันทึกทับ)">'+ic('newfont')+'</button>')+'<button class="icon-btn" data-act="font-settings" aria-label="ตั้งค่าฟอนต์" title="ตั้งค่าฟอนต์ (เครื่อง ขนาดช่อง ความลึกสี)">'+ic('gear')+'</button><button class="icon-btn" data-act="font-export" aria-label="ส่งออก" title="ส่งออก">'+ic('share')+'</button><button class="icon-btn" data-act="shortcuts" aria-label="ปุ่มลัด" title="ปุ่มลัด (?)">'+ic('kbd')+'</button>','<button class="back" data-tab="library" aria-label="กลับไปคลังฟอนต์">'+ic('back')+'<span>คลังฟอนต์</span></button>')
  +'<div class="large"><input class="namefield" id="s-name" value="'+esc(f.name)+'" maxlength="100" aria-label="ชื่อฟอนต์"'+(ro?' readonly':'')+'><p>'+esc(c.name)+' · ช่อง '+f.w+'×'+f.h+' · '+f.bpp+' บิต · '+f.glyphs.length+' ตัวอักษร</p>'+(ro?'':'<p class="saved ok" id="s-saved">'+esc(savedText())+'</p>')+'</div>'
  +'<div class="studio"><div style="display:grid;gap:12px;min-width:0">'
  +(ro?'<div class="banner">'+ic('lock')+'<span>ฟอนต์ในตัว เปิดดูได้อย่างเดียว</span><button class="btn small" data-act="dup-edit">ทำสำเนาเพื่อแก้ไข</button></div>':'')
  +'<div class="panel"><h2>วาด · <span id="s-glyph"></span></h2><div class="stage"><canvas id="edit" aria-label="กริดวาดพิกเซล"></canvas><span class="sr" id="s-live" aria-live="polite"></span></div>'
  +'<div class="tools"><button class="icon-btn tgl" id="u-undo" aria-label="ย้อนกลับ">'+ic('undo')+'</button><button class="icon-btn tgl" id="u-redo" aria-label="ทำซ้ำ">'+ic('redo')+'</button><div class="seg" role="group" aria-label="เครื่องมือ">'+[['pencil','ดินสอ'],['eraser','ยางลบ'],['clear','ล้างอักษรทั้งตัว','clear'],['fill','เทสี'],['pick','ดูดสี']].map(([t,l,op])=>op?'<button data-op="'+op+'" aria-label="'+l+'" title="'+l+'">'+ic('trash')+'</button>':'<button data-tool="'+t+'" aria-pressed="'+(S.tool===t)+'" aria-label="'+l+'" title="'+l+'">'+ic(t)+'</button>').join('')+'</div><div class="seg" role="group" aria-label="ตัวช่วยแสดงผล"><button data-act="grid" aria-label="เส้นกริด" title="เส้นกริด" aria-pressed="'+S.grid+'">'+ic('grid')+'</button><button data-act="guides" aria-label="ไกด์ภาษาไทย" title="ไกด์ภาษาไทย" aria-pressed="'+S.guides+'">'+ic('ruler')+'</button><button data-act="labels" aria-label="ป้ายชื่อโซน" title="ป้ายชื่อโซน" aria-pressed="'+S.labels+'">'+ic('tag')+'</button></div>'
  +[[['left','shift-l','เลื่อนซ้าย'],['right','shift-r','เลื่อนขวา'],['up','shift-u','เลื่อนขึ้น'],['down','shift-d','เลื่อนลง']],[['fliph','flip-h','พลิกแนวนอน'],['flipv','flip-v','พลิกแนวตั้ง'],['copy','copy','คัดลอก'],['paste','paste','วาง']]].map((grp,gi)=>'<div class="seg" role="group" aria-label="'+(gi?'พลิก คัดลอก วาง':'เลื่อนภาพ')+'">'+grp.map(([i,a,l])=>'<button data-op="'+a+'" aria-label="'+l+'" title="'+l+'">'+ic(i)+'</button>').join('')+'</div>').join('')+'</div><div class="check" id="s-check" role="status"></div>'
  +'<div class="swatches" role="group" aria-label="สี">'+c.colors.slice(0,max+1).map((col,i)=>'<button class="swatch" data-color="'+i+'" aria-pressed="'+(S.color===i)+'" aria-label="สี '+i+' '+labels[i]+'" style="background:'+col+'"><span>'+labels[i]+'</span></button>').join('')+'</div>'
  +'<div class="legend" id="s-legend">'+(Core.tooShort(f.h)?'':Core.zonesFor(f.h).map(z=>'<span><i style="background:'+z.color+'"></i>'+esc(z.name)+' · แถว '+z.rows[0]+'–'+z.rows[1]+'</span>').join('')+'<span><i class="hatch"></i>แถวที่ห้ามใช้สำหรับตัวนี้</span>')+'</div><div class="advance"><label for="s-adv" style="font-size:15px;color:var(--label2)">ระยะอักษร</label><input id="s-adv" type="range" min="0" max="'+f.w+'" aria-label="ระยะอักษร"><b id="s-advv" style="min-width:48px;text-align:right"></b></div></div>'
  +'<div class="panel"><h2>ตัวอย่างข้อความ</h2><textarea class="preview-text" id="s-text" aria-label="ข้อความตัวอย่าง" placeholder="พิมพ์ข้อความเพื่อดูฟอนต์">'+esc(S.previewText||sampleOf(f))+'</textarea><div class="group inset" style="margin:0 0 10px"><div class="row"><span class="grow">จำลองกรอบข้อความเกม<small id="s-gamebox-note">กว้างตามจอของเครื่อง · ตัดบรรทัดอัตโนมัติ</small></span><button class="switch" role="switch" id="s-gamebox" aria-checked="'+S.gameBox+'" aria-label="จำลองกรอบข้อความเกม"></button></div></div><div class="preview-box" id="s-prev-box" style="background:'+c.colors[0]+'"><canvas id="s-prev"></canvas></div></div></div>'
  +'<div class="panel"><h2>อักษรทั้งหมด</h2><label class="search" style="margin:0 0 10px">'+ic('search')+'<input id="s-find" type="search" placeholder="ค้นหาอักษร" aria-label="ค้นหาอักษร"></label><div class="selbar" id="g-selbar" hidden role="status"><span class="grow" id="g-seln"></span><button class="btn small gray" data-act="gsel-clear">ยกเลิก</button><button class="btn small tint" data-act="gsel-copy">คัดลอก</button><button class="btn small danger" data-act="gsel-del">ลบที่เลือก</button></div><div class="glyphs" id="s-glyphs" role="group" aria-label="รายการอักษร"></div>'+'<div class="group inset" style="margin-top:12px" role="group" aria-label="เครื่องมือกับอักษร">'
  +[['shadowico','shadow','เพิ่ม / ลบเงา','สร้างหรือลบพิกเซลเงา'],['spacingico','spacing','จัดระยะอักษรอัตโนมัติ','ตั้งระยะตามขอบหมึก'],['ruler','check-all','ตรวจเกินเขตทั้งฟอนต์','หาตัวที่ล้ำโซนหรือระยะอักษร'],['more','manage','จัดการอักษรนี้','เปลี่ยนชื่อ · ย้ายลำดับ · ลบ'],['plus','add-glyph','เพิ่มอักษร','สร้างช่องอักษรใหม่'],['copy','xfont','คัดลอก / วางข้ามฟอนต์','คัดลอกอักษรไปฟอนต์อื่น · ถ้าซ้ำจะแจ้ง']].map(([i,a,t,d])=>'<button class="row" data-act="'+a+'">'+ic(i,'ico')+'<span class="grow">'+t+'<small>'+d+'</small></span>'+ic('chev','chev')+'</button>').join('')+'</div>'+'</div></div>';
 addKeyHints();
 const cv=$('#edit',el);edit={cv,ctx:cv.getContext('2d')};
 buildGlyphList();selectGlyph(Math.min(S.idx,f.glyphs.length-1),true);bindEditor(f);updateHistoryButtons();
}
const MARK=/^[ัิ-ฺ็-๎]/;
const glyphLabel=g=>(MARK.test(g.c)?'◌':'')+(g.c===' '?'␠':g.c);
const GL_CHUNK=240;
const GSEL=new Set(); /* characters picked in the studio list with Ctrl/Cmd+click, for a bulk delete */
function updateGSel(){const bar=$('#g-selbar');if(!bar)return;bar.hidden=!GSEL.size;$('#g-seln',bar).textContent='เลือก '+GSEL.size+' อักษร';
 $$('#s-glyphs .gl').forEach(b=>{const g=(S.fonts.get(S.cur)?.glyphs||[])[+b.dataset.i],on=!!g&&GSEL.has(g.c);b.classList.toggle('sel',on);b.setAttribute('aria-selected',on?'true':'false');});}
function toggleGSel(i){const f=S.fonts.get(S.cur);if(!f)return;const g=f.glyphs[i];if(!g)return;
 if(!GSEL.size&&i!==S.idx&&f.glyphs[S.idx])GSEL.add(f.glyphs[S.idx].c); /* the glyph being edited counts as the first pick */
 if(GSEL.has(g.c))GSEL.delete(g.c);else GSEL.add(g.c);updateGSel();}
/* copy several glyphs (picked with Ctrl+click, or the whole font) and paste them into another font; glyphs the target already has are skipped and reported */
function copyGlyphs(list){const f=S.fonts.get(S.cur);if(!f||!list.length)return false;S.gclip={name:f.name,w:f.w,h:f.h,bpp:f.bpp,glyphs:list.map(g=>({c:g.c,p:g.p,a:g.a}))};S.lastClip='set';return true;}
function copySelected(){const f=S.fonts.get(S.cur);if(!f)return;const list=f.glyphs.filter(g=>GSEL.has(g.c));if(!copyGlyphs(list))return toast('ยังไม่ได้เลือกอักษร · กด Ctrl+คลิกที่อักษรในรายการ');toast('คัดลอก '+list.length+' อักษรแล้ว · เปิดฟอนต์อื่นแล้วกดวาง (Ctrl+V)');}
function pasteGlyphs(){const f=editable();if(!f)return;const clip=S.gclip;if(!clip||!clip.glyphs.length)return toast('ยังไม่ได้คัดลอกอักษร');
 const added=[],skipped=[];
 if(!structChange(g=>{for(const src of clip.glyphs){if(g.glyphs.some(x=>x.c===src.c)){skipped.push(src.c);continue;}if(g.glyphs.length>=2048)break;
   g.glyphs.push({c:src.c,p:fitGlyph(src.p,clip.w,clip.h,g.w,g.h,g.bpp),a:Math.min(src.a,g.w)});added.push(src.c);}
   if(!added.length)return false;S.idx=g.glyphs.length-added.length;}))
  return skipped.length?dupSheet(0,skipped):toast('ไม่มีอะไรให้วาง');
 const resized=clip.w!==f.w||clip.h!==f.h;
 if(skipped.length||resized)dupSheet(added.length,skipped,resized?clip:null,f);else toast('วาง '+added.length+' อักษรแล้ว · ย้อนกลับได้');}
function dupSheet(n,skipped,clip,f){sheet('<h2>'+(n?'วาง '+n+' อักษรแล้ว':'ไม่ได้วางอะไร')+'</h2><p class="sub">'+(skipped.length?'<b>มีอักษรซ้ำ '+skipped.length+' ตัว</b> ข้ามไว้ไม่ทับของเดิม: '+skipped.slice(0,40).map(c=>esc(glyphLabelOf(c))).join(' ')+(skipped.length>40?' …':''):'')+(clip?'<br>ขนาดช่องต่างกัน ('+clip.w+'×'+clip.h+' → '+f.w+'×'+f.h+') ภาพถูกวางชิดมุมซ้ายบน ควรตรวจและจัดตำแหน่งอีกครั้ง':'')+'</p><button class="btn block" data-close>ตกลง</button>',()=>{});}
const glyphLabelOf=c=>glyphLabel({c});
function crossFontSheet(){const f=S.fonts.get(S.cur);if(!f)return;const clip=S.gclip;
 sheet('<h2>คัดลอก / วางอักษรข้ามฟอนต์</h2><p class="sub">เลือกอักษรด้วย Ctrl+คลิกในรายการ หรือคัดลอกทั้งฟอนต์ แล้วเปิดฟอนต์อื่นเพื่อวาง ถ้าอักษรซ้ำจะข้ามและแจ้งให้ทราบ</p><div class="actions">'
  +(GSEL.size?action('คัดลอกที่เลือกไว้ ('+GSEL.size+' อักษร)','x-copy-sel'):'')+action('คัดลอกทั้งฟอนต์ ('+f.glyphs.length+' อักษร)','x-copy-all')
  +(clip?action('วาง '+clip.glyphs.length+' อักษรจาก “'+esc(clip.name)+'”','x-paste'):'')+'</div><button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;closeSheet();
   if(a==='x-copy-sel')copySelected();else if(a==='x-copy-all'){copyGlyphs(f.glyphs);toast('คัดลอกทั้งฟอนต์ '+f.glyphs.length+' อักษรแล้ว · เปิดฟอนต์อื่นแล้วกดวาง');}else if(a==='x-paste')pasteGlyphs();});});}
function confirmDeleteGlyphs(){const f=editable();if(!f)return;const list=f.glyphs.filter(g=>GSEL.has(g.c));if(!list.length){GSEL.clear();return updateGSel();}
 if(list.length>=f.glyphs.length)return toast('ต้องเหลืออย่างน้อย 1 อักษร');
 sheet('<h2>ลบ '+list.length+' อักษร ?</h2><p class="sub">'+list.slice(0,16).map(g=>esc(glyphLabel(g))).join(' ')+(list.length>16?' และอีก '+(list.length-16)+' ตัว':'')+'<br>ย้อนกลับได้ด้วยปุ่มย้อนกลับ</p><div class="actions">'+action('ลบ '+list.length+' อักษร','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  $('[data-act=yes]',s).onclick=()=>{closeSheet();const n=list.length;if(structChange(f=>{f.glyphs=f.glyphs.filter(g=>!GSEL.has(g.c));S.idx=Math.max(0,Math.min(S.idx,f.glyphs.length-1));}))toast('ลบ '+n+' อักษรแล้ว · ย้อนกลับได้');GSEL.clear();updateGSel();};});}
function buildGlyphList(){const f=S.fonts.get(S.cur),box=$('#s-glyphs'),q=($('#s-find')?.value||'').trim();if(!f||!box)return;box.innerHTML='';
 const list=[];f.glyphs.forEach((g,i)=>{if(!q||g.c.includes(q))list.push(i);});S.glList=list;S.glRendered=0;renderGlyphChunk(Math.max(GL_CHUNK,list.indexOf(S.idx)+1));}
function renderGlyphChunk(upto){const f=S.fonts.get(S.cur),box=$('#s-glyphs');if(!f||!box)return;box.querySelector('.gl-more')?.remove();const colors=pal(f),sc=Math.max(1,Math.floor(32/f.h)),list=S.glList||[];
 for(;S.glRendered<Math.min(upto,list.length);S.glRendered++){const i=list[S.glRendered],g=f.glyphs[i];const b=document.createElement('button');b.className='gl'+(GSEL.has(g.c)?' sel':'');b.dataset.i=i;b.setAttribute('aria-pressed',i===S.idx);b.setAttribute('aria-label','อักษร '+g.c);
  const cv=document.createElement('canvas');cv.width=f.w*sc;cv.height=f.h*sc;const cx=cv.getContext('2d');cx.fillStyle=colors[0];cx.fillRect(0,0,cv.width,cv.height);drawGlyph(cx,f,g,0,0,sc,colors);
  const sp=document.createElement('span');sp.textContent=glyphLabel(g);b.append(cv,sp);box.append(b);}
 if(S.glRendered<list.length){const more=document.createElement('div');more.className='gl-more';more.textContent='กำลังโหลดอักษรเพิ่ม…';box.append(more);
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();renderGlyphChunk(S.glRendered+GL_CHUNK);}},{rootMargin:'400px'});io.observe(more);}}
function refreshThumb(i){const f=S.fonts.get(S.cur),b=$('#s-glyphs [data-i="'+i+'"]');if(!b)return;const cv=$('canvas',b),sc=cv.width/f.w,colors=pal(f),cx=cv.getContext('2d');cx.fillStyle=colors[0];cx.fillRect(0,0,cv.width,cv.height);drawGlyph(cx,f,f.glyphs[i],0,0,sc,colors);}
function selectGlyph(i,force){const f=S.fonts.get(S.cur);if(!f)return;S.idx=i;{const pos=(S.glList||[]).indexOf(i);if(pos>=S.glRendered)renderGlyphChunk(pos+1);}$$('#s-glyphs .gl').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i));
 const g=f.glyphs[i];$('#s-glyph').textContent='“'+glyphLabel(g)+'” · U+'+[...g.c].map(ch=>ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('+');
 const adv=$('#s-adv');adv.value=g.a;adv.disabled=!!f.builtin;$('#s-advv').textContent=g.a+' px';sizeEditor();drawEditor();}
function sizeEditor(){const f=S.fonts.get(S.cur),avail=Math.max(160,Math.min(520,($('.stage')?.clientWidth||320)-4)),sc=Math.max(3,Math.min(Math.floor(avail/f.w),Math.floor(440/f.h)));edit.scale=sc;edit.cv.width=f.w*sc;edit.cv.height=f.h*sc;}
function drawEditor(buf){const f=S.fonts.get(S.cur),g=f.glyphs[S.idx],{ctx,scale:sc}=edit,colors=pal(f),w=f.w,h=f.h,W=w*sc,H=h*sc;
 const px=buf?Array.from(buf).join(''):g.p,chk=Core.checkGlyph(f,{c:g.c,a:g.a,p:px}),cs=getComputedStyle(document.documentElement),accent=cs.getPropertyValue('--accent').trim()||'#1c1c1e',onAccent=cs.getPropertyValue('--on-accent').trim()||'#fff',guides=S.guides&&!Core.tooShort(h);
 const lum=(hex=>{const n=parseInt(hex.replace('#',''),16),c=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;});return .2126*c[0]+.7152*c[1]+.0722*c[2];})(colors[0]),lineCol=lum>.35?'#1c1c1e':'#f5f5f7';
 const stroke=(x1,y1,x2,y2,lw,alpha=1,dash=[])=>{ctx.setLineDash(dash);ctx.lineCap='butt';ctx.strokeStyle=lineCol;ctx.globalAlpha=alpha;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);};
 const hline=(x1,x2,y,lw,alpha,dash)=>stroke(x1,y,x2,y,lw,alpha,dash),vline=(x,y2,lw,alpha,dash)=>stroke(x,0,x,y2,lw,alpha,dash);
 ctx.fillStyle=colors[0];ctx.fillRect(0,0,W,H);
 if(guides){const zs=Core.zonesFor(h);zs.forEach((z,i)=>{if(i===1)return;ctx.globalAlpha=.12;ctx.fillStyle='#3c3c43';ctx.fillRect(0,z.rows[0]*sc,W,(z.rows[1]-z.rows[0]+1)*sc);});ctx.globalAlpha=1;} /* marks and lower zones are tinted; the body stays clean */
 for(let i=0;i<w*h;i++){const v=code(px,i),x=i%w,y=(i-x)/w;if(!v&&(x+y)%2){ctx.fillStyle='rgba(128,128,128,.07)';ctx.fillRect(x*sc,y*sc,sc,sc);}if(v){ctx.fillStyle=colors[Math.min(v,3)];ctx.fillRect(x*sc,y*sc,sc,sc);}}
 if(guides){ /* rows this kind of character must not use: a quiet hatch */
  const [lo,hi]=chk.allowed;ctx.save();ctx.beginPath();if(lo>0)ctx.rect(0,0,W,lo*sc);if(hi<h-1)ctx.rect(0,(hi+1)*sc,W,(h-1-hi)*sc);ctx.clip();
  ctx.fillStyle='rgba(60,60,67,.14)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(60,60,67,.28)';ctx.lineWidth=1;for(let d=-H;d<W;d+=8){ctx.beginPath();ctx.moveTo(d,H);ctx.lineTo(d+H,0);ctx.stroke();}ctx.restore();
  const zs=Core.zonesFor(h);hline(0,W,(zs[0].rows[1]+1)*sc,2.5,.9,[9,6]);hline(0,W,(zs[1].rows[1]+1)*sc,3,1);}
 if(guides&&S.labels){ /* faint zone names: what each band is for */
  const zs=Core.zonesFor(h),names=['วรรณยุกต์ · สระบน','พยัญชนะ','สระล่าง · หาง'],fs=Math.max(10,Math.min(15,Math.round(sc*.5)));
  ctx.font='500 '+fs+'px Prompt,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=lineCol;ctx.globalAlpha=.5;
  zs.forEach((z,i)=>{const rows=z.rows[1]-z.rows[0]+1;if(rows*sc<fs+4)return;ctx.fillText(names[i],W/2,(z.rows[0]+rows/2)*sc);});
  const [alo,ahi]=chk.allowed;ctx.globalAlpha=.6;const forb=[];if(alo>0)forb.push([0,alo-1]);if(ahi<h-1)forb.push([ahi+1,h-1]);
  for(const [r0,r1] of forb){const n=r1-r0+1;if(n*sc>=fs+4)ctx.fillText('ห้ามใช้',W/2,(r0+n/2)*sc);}
  ctx.globalAlpha=1;ctx.textAlign='start';ctx.textBaseline='alphabetic';}
 if(S.grid){ctx.lineWidth=1;for(let x=1;x<w;x++){ctx.strokeStyle=x%8?'rgba(128,128,128,.25)':'rgba(128,128,128,.6)';ctx.beginPath();ctx.moveTo(x*sc+.5,0);ctx.lineTo(x*sc+.5,H);ctx.stroke();}
  for(let y=1;y<h;y++){ctx.strokeStyle=y%8?'rgba(128,128,128,.25)':'rgba(128,128,128,.6)';ctx.beginPath();ctx.moveTo(0,y*sc+.5);ctx.lineTo(w*sc,y*sc+.5);ctx.stroke();}}
 ctx.strokeStyle='#ff3b30';ctx.lineWidth=2;for(const i of chk.bad)ctx.strokeRect((i%w)*sc+1,Math.floor(i/w)*sc+1,sc-2,sc-2);
 {const ax=Math.min(W-1.5,Math.max(1.5,g.a*sc));vline(ax,H,3,1,[9,6]);ctx.fillStyle=lineCol;ctx.beginPath();ctx.moveTo(ax-6,0);ctx.lineTo(ax+6,0);ctx.lineTo(ax,8);ctx.fill();} /* advance marker */
 if(document.activeElement===edit.cv){ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect((S.kx||0)*sc+1,(S.ky||0)*sc+1,sc-2,sc-2);ctx.strokeStyle=onAccent;ctx.lineWidth=1;ctx.strokeRect((S.kx||0)*sc+3,(S.ky||0)*sc+3,Math.max(1,sc-6),Math.max(1,sc-6));}
 showCheck(chk,f);}
function showCheck(chk,f){const el=$('#s-check');if(!el)return;
 if(!S.guides||Core.tooShort(f.h)){el.className='check';el.textContent=Core.tooShort(f.h)?'ช่องสูงไม่ถึง 12 px · ไม่มีไกด์สระ/วรรณยุกต์':'ไกด์ปิดอยู่';return;}
 const name=Core.CLASS_NAMES[chk.cls],rng=chk.allowed[0]+'–'+chk.allowed[1];
 if(chk.ok){el.className='check ok';el.textContent='✓ '+name+' · วาดได้แถว '+rng+(chk.used?' · ใช้อยู่แถว '+chk.used[0]+'–'+chk.used[1]:' · ยังไม่ได้วาด');}
 else{el.className='check bad';el.textContent='⚠ '+name+' · '+(chk.bad.length?'เกินเขตแถว '+rng+' ('+chk.bad.length+' พิกเซล, ใช้แถว '+chk.used[0]+'–'+chk.used[1]+')':'')+(chk.tooWide?(chk.bad.length?' · ':'')+'ภาพเกินระยะอักษร (เส้นประแนวตั้ง)':'');}}
function checkAllSheet(){const f=S.fonts.get(S.cur);if(!f)return;const bad=Core.checkFont(f);
 sheet('<h2>ตรวจเกินเขต</h2><p class="sub">'+(bad.length?'พบ '+bad.length+' อักษรที่เกินขอบเขตการวาดภาษาไทย แตะเพื่อไปแก้':'ไม่พบอักษรที่เกินเขต ✓')+'</p>'+(bad.length?'<div class="group" style="margin:0 0 12px;max-height:50dvh;overflow:auto">'+bad.slice(0,80).map(x=>'<button class="row" data-jump="'+x.i+'"><span class="grow">“'+esc(glyphLabel(x.g))+'” · '+Core.CLASS_NAMES[x.r.cls]+'<small>'+(x.r.bad.length?'เกินเขตแถว '+x.r.allowed.join('–')+' (ใช้ '+x.r.used.join('–')+')':'')+(x.r.tooWide?(x.r.bad.length?' · ':'')+'เกินระยะอักษร':'')+'</small></span>'+ic('chev','chev')+'</button>').join('')+'</div>':'')+'<button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',e=>{const j=e.target.closest('[data-jump]');if(!j)return;closeSheet();S.idx=+j.dataset.jump;$('#s-find').value='';buildGlyphList();selectGlyph(S.idx);$('#edit').scrollIntoView({block:'center',behavior:'smooth'});});});}
function drawPreview(){const f=S.fonts.get(S.cur),box=$('#s-prev-box');if(!f||!box)return;const avail=Math.max(120,box.clientWidth-16||300),note=$('#s-gamebox-note');
 if(!S.gameBox){drawText($('#s-prev'),f,$('#s-text').value,3,avail);if(note)note.textContent='กว้างตามจอของเครื่อง · ตัดบรรทัดอัตโนมัติ';return;}
 const c=Core.consoleOf(f.console),sw=c.screen[0],bw=Math.max(64,sw-16),pad=8,items=Core.layoutText(f,$('#s-text').value,bw-pad*2),lines=Math.max(3,items.reduce((m,i)=>Math.max(m,i.line+1),1)),lh=f.h,bh=lines*lh+pad*2,sc=Math.max(1,Math.min(4,Math.floor(avail/bw))),cv=$('#s-prev'),colors=pal(f);
 cv.width=bw*sc;cv.height=bh*sc;const ctx=cv.getContext('2d');ctx.fillStyle=colors[0];ctx.fillRect(0,0,cv.width,cv.height);
 ctx.fillStyle=colors[2]||colors[1];for(const r of [[0,0,cv.width,2*sc],[0,cv.height-2*sc,cv.width,2*sc],[0,0,2*sc,cv.height],[cv.width-2*sc,0,2*sc,cv.height]])ctx.fillRect(...r);
 for(const it of items)drawGlyph(ctx,f,it.g,(pad+it.x)*sc,(pad+it.line*lh)*sc,sc,colors);
 if(note)note.textContent='กรอบกว้าง '+bw+' px (จอ '+c.name+' '+sw+' px) · ขยาย '+sc+'× · '+lines+' บรรทัด';}
function updateHistoryButtons(){const u=$('#u-undo'),r=$('#u-redo');if(u)u.disabled=!S.undo.length;if(r)r.disabled=!S.redo.length;}
function guardEdit(){if(editable())return true;toast('ฟอนต์ในตัวแก้ไขไม่ได้ · กด “ทำสำเนาเพื่อแก้ไข”');return false;}
function applyGlyph(i,state,{record=true,from}={}){const f=editable();if(!f)return;const g=f.glyphs[i],before=from||{p:g.p,a:g.a};g.p=state.p;g.a=state.a;
 if(record&&(before.p!==g.p||before.a!==g.a)){S.undo.push({i,from:before,to:{p:g.p,a:g.a}});if(S.undo.length>300)S.undo.shift();S.redo=[];}
 touch(f);refreshThumb(i);if(i===S.idx){const adv=$('#s-adv');adv.value=g.a;$('#s-advv').textContent=g.a+' px';drawEditor();}drawPreview();updateHistoryButtons();}
/* structure changes (add, rename, delete, reorder) are undone by swapping the whole glyph list */
function structChange(fn){const f=editable();if(!f)return false;const before=structuredClone(f.glyphs),ib=S.idx;if(fn(f)===false)return false;
 S.undo.push({struct:{before,after:structuredClone(f.glyphs),ib,ia:S.idx}});if(S.undo.length>120)S.undo.shift();S.redo=[];
 touch(f);buildGlyphList();selectGlyph(Math.max(0,Math.min(S.idx,f.glyphs.length-1)));drawPreview();updateHistoryButtons();return true;}
function stepHistory(dir){const f=editable();if(!f)return;const from=dir<0?S.undo:S.redo,to=dir<0?S.redo:S.undo,e=from.pop();if(!e)return;to.push(e);
 if(e.struct){f.glyphs=structuredClone(dir<0?e.struct.before:e.struct.after);S.idx=dir<0?e.struct.ib:e.struct.ia;touch(f);buildGlyphList();selectGlyph(Math.max(0,Math.min(S.idx,f.glyphs.length-1)));drawPreview();updateHistoryButtons();return;}
 const list=e.multi||[e];for(const x of list){const st=dir<0?x.from:x.to,g=f.glyphs[x.i];g.p=st.p;g.a=st.a;refreshThumb(x.i);}
 touch(f);selectGlyph(list[0].i);drawPreview();updateHistoryButtons();}
/* apply several glyph changes as one undo step */
function applyMany(changes){const f=editable();if(!f||!changes.length)return;const multi=changes.map(c=>{const g=f.glyphs[c.i],from={p:g.p,a:g.a};g.p=c.p;g.a=c.a;refreshThumb(c.i);return{i:c.i,from,to:{p:c.p,a:c.a}};});
 S.undo.push({multi});if(S.undo.length>300)S.undo.shift();S.redo=[];touch(f);selectGlyph(S.idx);drawPreview();updateHistoryButtons();}
function shadowSheet(){const f=editable();if(!f)return guardEdit();
 if(Core.maxIndex(f)<2)return toast('ความลึกสี '+f.bpp+' บิตไม่มีสีเงา (ต้องอย่างน้อย 2 บิต) เปลี่ยนได้ที่ปุ่มตั้งค่า');
 const dirs=[['down-right','↘ ขวาล่าง'],['down','↓ ล่าง'],['right','→ ขวา'],['down-left','↙ ซ้ายล่าง']];let dir='down-right',scope='one',clear=true;
 sheet('<h2>เงาอัตโนมัติ</h2><p class="sub">สร้างพิกเซลเงา (สีดัชนี 2) ถัดจากหมึก (สี 1) ในทิศที่เลือก ไม่ทับพิกเซลเดิม และไม่ออกนอกช่อง</p>'
  +'<div class="field"><span>ทิศของเงา</span><div class="seg" role="group" id="sh-dir">'+dirs.map(([d,l])=>'<button data-d="'+d+'" aria-pressed="'+(d===dir)+'">'+l+'</button>').join('')+'</div></div>'
  +'<div class="field"><span>ใช้กับ</span><div class="seg" role="group" id="sh-scope"><button data-s="one" aria-pressed="true">อักษรนี้</button><button data-s="all" aria-pressed="false">ทั้งฟอนต์</button></div></div>'
  +'<div class="group" style="margin:0 0 12px"><div class="row"><span class="grow">ล้างเงาเดิมก่อน<small>ปิดไว้เพื่อเก็บเงาที่วาดเองและเพิ่มเงาใหม่ซ้อน</small></span><button class="switch" role="switch" id="sh-clear" aria-checked="true" aria-label="ล้างเงาเดิมก่อน"></button></div></div>'
  +'<div class="check" id="sh-info" role="status"></div><div style="display:flex;gap:16px;justify-content:center;margin:8px 0 14px"><div style="text-align:center;font-size:12px;color:var(--label2)">ก่อน<div class="preview-box" style="padding:6px;margin-top:4px;background:'+pal(f)[0]+'"><canvas id="sh-a"></canvas></div></div><div style="text-align:center;font-size:12px;color:var(--label2)">หลัง<div class="preview-box" style="padding:6px;margin-top:4px;background:'+pal(f)[0]+'"><canvas id="sh-b"></canvas></div></div></div>'
  +'<button class="btn block" id="sh-go" data-bar="เพิ่มเงา">เพิ่มเงา</button><button class="btn danger block" id="sh-rm" style="margin-top:8px">ลบเงาทั้งหมด</button>',s=>{
  const draw=(cv,g)=>{const sc=Math.max(2,Math.min(8,Math.floor(96/Math.max(f.w,f.h))));cv.width=f.w*sc;cv.height=f.h*sc;const cx=cv.getContext('2d');cx.fillStyle=pal(f)[0];cx.fillRect(0,0,cv.width,cv.height);drawGlyph(cx,f,g,0,0,sc,pal(f));};
  const targets=()=>scope==='all'?f.glyphs.map((g,i)=>i):[S.idx];
  const refresh=()=>{const g=f.glyphs[S.idx],r=Core.addShadow(f,g,dir,{clear});draw($('#sh-a',s),g);draw($('#sh-b',s),{...g,p:r.p});
   let n=0,clip=0;for(const i of targets()){const x=Core.addShadow(f,f.glyphs[i],dir,{clear});if(x.changed)n++;clip+=x.clipped;}
   $('#sh-info',s).textContent=(scope==='all'?'จะเปลี่ยน '+n+' จาก '+f.glyphs.length+' อักษร':n?'จะเปลี่ยนอักษร “'+glyphLabel(g)+'”':'อักษรนี้ไม่มีอะไรเปลี่ยน (ยังไม่มีหมึก หรือมีเงาอยู่แล้ว)')+(clip?' · '+clip+' พิกเซลหมึกอยู่ขอบช่อง เงาตกนอกช่องจึงไม่ถูกสร้าง':'');$('#sh-go',s).disabled=!n;
   let rm=0,rmGlyphs=0;for(const i of targets()){const x=Core.removeShadow(f.glyphs[i]);if(x.changed){rmGlyphs++;rm+=x.removed;}}
   $('#sh-rm',s).disabled=!rmGlyphs;$('#sh-rm',s).textContent=rmGlyphs?'ลบเงาทั้งหมด ('+rmGlyphs+' อักษร · '+rm+' พิกเซล)':'ลบเงาทั้งหมด (ไม่มีเงาให้ลบ)';};
  $('#sh-dir',s).onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;dir=b.dataset.d;$$('#sh-dir button',s).forEach(x=>x.setAttribute('aria-pressed',x===b));refresh();};
  $('#sh-scope',s).onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;scope=b.dataset.s;$$('#sh-scope button',s).forEach(x=>x.setAttribute('aria-pressed',x===b));refresh();};
  $('#sh-clear',s).onclick=e=>{clear=!clear;e.currentTarget.setAttribute('aria-checked',clear);refresh();};
  $('#sh-go',s).onclick=()=>{const ch=[];for(const i of targets()){const r=Core.addShadow(f,f.glyphs[i],dir,{clear});if(r.changed)ch.push({i,p:r.p,a:r.a});}applyMany(ch);closeSheet();toast('เพิ่มเงาให้ '+ch.length+' อักษรแล้ว · ย้อนกลับได้ด้วยปุ่มย้อนกลับ');};
  $('#sh-rm',s).onclick=()=>{const ch=[];for(const i of targets()){const r=Core.removeShadow(f.glyphs[i]);if(r.changed)ch.push({i,p:r.p,a:r.a});}applyMany(ch);closeSheet();toast('ลบเงาออกจาก '+ch.length+' อักษรแล้ว · ย้อนกลับได้');};
  refresh();});}
const cur=()=>{const f=S.fonts.get(S.cur);return{f,g:f.glyphs[S.idx],buf:Uint8Array.from(f.glyphs[S.idx].p,c=>+c)};};
function transform(op){if(!guardEdit())return;const {f,g,buf}=cur(),w=f.w,h=f.h;let out=new Uint8Array(w*h);
 if(op.startsWith('shift')){const dx={l:-1,r:1}[op[6]]||0,dy={u:-1,d:1}[op[6]]||0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const sx=x-dx,sy=y-dy;if(sx>=0&&sx<w&&sy>=0&&sy<h)out[y*w+x]=buf[sy*w+sx];}}
 else if(op==='flip-h'){for(let y=0;y<h;y++)for(let x=0;x<w;x++)out[y*w+x]=buf[y*w+(w-1-x)];}
 else if(op==='flip-v'){for(let y=0;y<h;y++)for(let x=0;x<w;x++)out[y*w+x]=buf[(h-1-y)*w+x];}
 else if(op==='clear'){}
 else if(op==='copy'){S.clip={p:g.p,w,h};S.lastClip='pixels';toast('คัดลอกอักษรแล้ว');return;}
 else if(op==='paste'){if(!S.clip)return toast('ยังไม่ได้คัดลอกอักษร');const p=S.clip.w===w&&S.clip.h===h?S.clip.p:Core.resizeGlyph(S.clip.p,S.clip.w,S.clip.h,w,h);out=Uint8Array.from(p,c=>+c);}
 applyGlyph(S.idx,{p:Array.from(out).join(''),a:g.a});}
function flood(buf,w,h,x,y,v){const t=buf[y*w+x];if(t===v)return;const st=[[x,y]];while(st.length){const [cx,cy]=st.pop();if(cx<0||cy<0||cx>=w||cy>=h||buf[cy*w+cx]!==t)continue;buf[cy*w+cx]=v;st.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);}}
function bindEditor(f){
 const cv=edit.cv;let drag=null;
 const at=e=>{const r=cv.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*f.w),y=Math.floor((e.clientY-r.top)/r.height*f.h);return[Math.max(0,Math.min(f.w-1,x)),Math.max(0,Math.min(f.h-1,y))];};
 const line=(a,b,fn)=>{let [x0,y0]=a;const [x1,y1]=b,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let er=dx+dy;for(;;){fn(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*er;if(e2>=dy){er+=dy;x0+=sx;}if(e2<=dx){er+=dx;y0+=sy;}}};
 cv.onpointerdown=e=>{if(!guardEdit())return;e.preventDefault();const [x,y]=at(e),{g,buf}=cur();S.kx=x;S.ky=y;
  if(S.tool==='pick'){S.color=buf[y*f.w+x];$$('[data-color]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.color===S.color));S.tool='pencil';$$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool==='pencil'));return;}
  if(S.tool==='fill'){flood(buf,f.w,f.h,x,y,S.color);applyGlyph(S.idx,{p:Array.from(buf).join(''),a:g.a});return;}
  cv.setPointerCapture(e.pointerId);drag={buf,from:{p:g.p,a:g.a},last:[x,y]};const v=S.tool==='eraser'?0:S.color;buf[y*f.w+x]=v;drawEditor(buf);};
 cv.onpointermove=e=>{if(!drag)return;const p=at(e),v=S.tool==='eraser'?0:S.color;line(drag.last,p,(x,y)=>{drag.buf[y*f.w+x]=v;});drag.last=p;drawEditor(drag.buf);};
 const end=()=>{if(!drag)return;const d=drag;drag=null;applyGlyph(S.idx,{p:Array.from(d.buf).join(''),a:f.glyphs[S.idx].a},{from:d.from});};
 cv.onpointerup=end;cv.onpointercancel=end;
 /* keyboard drawing: arrows move the cursor, Space / Enter paints, Backspace erases */
 cv.tabIndex=0;cv.setAttribute('role','application');cv.setAttribute('aria-label','ช่องวาดพิกเซล · ลูกศรเลื่อนเคอร์เซอร์ เว้นวรรคเพื่อวาด Backspace เพื่อลบ');
 S.kx=Math.min(S.kx||0,f.w-1);S.ky=Math.min(S.ky||0,f.h-1);
 const announce=()=>{const live=$('#s-live');if(live)live.textContent='แถว '+(S.ky+1)+' คอลัมน์ '+(S.kx+1);};
 cv.onkeydown=e=>{const k=e.key;let handled=true;
  if(!cv.matches(':focus-visible')&&(k.startsWith('Arrow')||k==='Backspace'||k==='Delete'))return; /* after a mouse click the arrows shift the glyph and Delete clears it (global shortcuts) */
  if(k==='ArrowLeft')S.kx=Math.max(0,S.kx-1);else if(k==='ArrowRight')S.kx=Math.min(f.w-1,S.kx+1);else if(k==='ArrowUp')S.ky=Math.max(0,S.ky-1);else if(k==='ArrowDown')S.ky=Math.min(f.h-1,S.ky+1);
  else if(k===' '||k==='Enter'||k==='Backspace'||k==='Delete'){if(!guardEdit()){e.preventDefault();return;}const {g,buf}=cur(),i=S.ky*f.w+S.kx;
   if(S.tool==='pick'&&k!=='Backspace'&&k!=='Delete'){S.color=buf[i];$$('[data-color]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.color===S.color));}
   else{if(k==='Backspace'||k==='Delete'||S.tool==='eraser')buf[i]=0;else if(S.tool==='fill')flood(buf,f.w,f.h,S.kx,S.ky,S.color);else buf[i]=S.color;applyGlyph(S.idx,{p:Array.from(buf).join(''),a:g.a});}}
  else handled=false;
  if(handled){e.preventDefault();drawEditor();announce();}};
 cv.onfocus=()=>drawEditor();cv.onblur=()=>drawEditor();
 let advFrom=null;
 $('#s-adv').oninput=e=>{if(!guardEdit())return;const g=f.glyphs[S.idx];advFrom=advFrom||{p:g.p,a:g.a};$('#s-advv').textContent=e.target.value+' px';g.a=+e.target.value;drawEditor();drawPreview();};
 $('#s-adv').onchange=()=>{const g=f.glyphs[S.idx],from=advFrom;advFrom=null;if(from)applyGlyph(S.idx,{p:g.p,a:g.a},{from});};
 $('#s-name').onchange=e=>{if(f.builtin)return;f.name=e.target.value.trim().slice(0,100)||f.name;touch(f);$('#page-studio .nav-title').textContent=f.name;};
 $('#s-text').oninput=e=>{S.previewText=e.target.value;drawPreview();};
 $('#s-gamebox').onclick=e=>{S.gameBox=!S.gameBox;e.currentTarget.setAttribute('aria-checked',S.gameBox);try{localStorage.setItem('fontlab.gameBox',S.gameBox?'yes':'no');}catch{}drawPreview();};
 $('#s-find').oninput=()=>buildGlyphList();
 requestAnimationFrame(drawPreview);
}

function settingsSheet(){const f=editable();if(!f)return guardEdit();
 sheet('<h2>ตั้งค่าฟอนต์</h2><p class="sub">เปลี่ยนเครื่องหรือขนาดช่องอักษร ภาพเดิมจะถูกตัดหรือเติมขอบโปร่ง</p><div class="field"><label for="st-con">เครื่อง</label><select id="st-con" class="input">'+Core.CONSOLES.map(c=>'<option value="'+c.id+'">'+esc(c.name)+'</option>').join('')+'</select></div>'
  +'<div class="grid2"><div class="field"><label for="st-w">กว้าง (px)</label><input id="st-w" class="input" type="number" min="1" max="64" inputmode="numeric"></div><div class="field"><label for="st-h">สูง (px)</label><input id="st-h" class="input" type="number" min="1" max="64" inputmode="numeric"></div></div>'
  +'<div class="field"><label for="st-bpp">ความลึกสีตอนส่งออก</label><select id="st-bpp" class="input"></select></div><div class="field"><span>ขนาดมาตรฐานของเครื่อง</span><div class="chips" id="st-cells" style="padding:0"></div></div>'
  +'<button class="btn block" id="st-ok" data-bar="ใช้">บันทึก</button>',s=>{
  const con=$('#st-con',s),w=$('#st-w',s),h=$('#st-h',s),bpp=$('#st-bpp',s);con.value=f.console;w.value=f.w;h.value=f.h;
  const fill=(keep)=>{const c=Core.consoleOf(con.value);bpp.innerHTML=Object.keys(c.formats).map(b=>'<option value="'+b+'">'+b+' บิต</option>').join('');bpp.value=c.formats[f.bpp]&&keep?f.bpp:c.bpp;$('#st-cells',s).innerHTML=c.cells.map(x=>'<button class="chip" data-cell="'+x+'">'+sizeLabel(x)+'</button>').join('');};
  fill(true);con.onchange=()=>{fill(false);const c=Core.consoleOf(con.value);w.value=c.cell[0];h.value=c.cell[1];};
  s.addEventListener('click',e=>{const b=e.target.closest('[data-cell]');if(b){[w.value,h.value]=b.dataset.cell.split(',');}});
  $('#st-ok',s).onclick=()=>{const nw=+w.value,nh=+h.value;if(!Number.isInteger(nw)||!Number.isInteger(nh)||nw<1||nh<1||nw>64||nh>64)return toast('ขนาดต้องเป็นจำนวนเต็ม 1–64');
   const next=Core.convertProject(f,{console:con.value,w:nw,h:nh,bpp:+bpp.value});S.fonts.set(f.id,next);Store.put(next).catch(()=>{});S.undo=[];S.redo=[];S.idx=Math.min(S.idx,next.glyphs.length-1);scheduleSync();closeSheet();mountStudio();toast('อัปเดตขนาดเป็น '+nw+'×'+nh+' แล้ว');};});}
function spacingSheet(){const f=editable();if(!f)return guardEdit();let gap=1,scope='one';
 sheet('<h2>จัดระยะอักษรอัตโนมัติ</h2><p class="sub">ตั้งระยะอักษร = ขอบขวาของหมึก + ช่องว่างที่เลือก ช่วยให้ตัวอักษรไม่ห่างเกินไปเมื่อเกมใช้ความกว้างตามตัวอักษร</p>'
  +'<div class="field"><span>ช่องว่างหลังตัวอักษร</span><div class="seg" id="sp-gap"><button data-g="0" aria-pressed="false">0 px</button><button data-g="1" aria-pressed="true">1 px</button><button data-g="2" aria-pressed="false">2 px</button></div></div>'
  +'<div class="field"><span>ใช้กับ</span><div class="seg" id="sp-scope"><button data-s="one" aria-pressed="true">อักษรนี้</button><button data-s="all" aria-pressed="false">ทั้งฟอนต์</button></div></div>'
  +'<div class="check" id="sp-info" role="status"></div><div class="preview-box" id="sp-box" style="background:'+pal(f)[0]+';margin:8px 0 12px"><canvas id="sp-cv"></canvas></div>'
  +'<p class="foot" style="margin:0 4px 12px">ระยะนี้ใช้ในช่องตัวอย่างและไฟล์ <b>-widths.bin</b> ที่ส่งออกได้ ส่วนไฟล์ไทล์ .bin ไม่มีระยะ เกมจะใช้ตารางความกว้างของตัวเอง ถ้าเกมเป็นแบบกว้างคงที่ ระยะจะเป็นไปตามเกม</p><button class="btn block" id="sp-go" data-bar="จัดระยะ">จัดระยะ</button>',s=>{
  const targets=()=>scope==='all'?f.glyphs.map((g,i)=>i):[S.idx];
  const sample=()=>S.previewText||sampleOf(f);
  const refresh=()=>{let n=0,sum=0,cnt=0;for(const i of targets()){const r=Core.autoSpacing(f,f.glyphs[i],gap);if(r.changed){n++;sum+=r.a-f.glyphs[i].a;}cnt++;}
   $('#sp-info',s).textContent=n?'จะเปลี่ยน '+n+' จาก '+cnt+' อักษร · เฉลี่ย '+(sum/n).toFixed(1)+' px ต่อตัว':'ไม่มีอะไรเปลี่ยน (ระยะพอดีอยู่แล้ว)';$('#sp-go',s).disabled=!n;
   const preview={...f,glyphs:f.glyphs.map((g,i)=>targets().includes(i)?{...g,a:Core.autoSpacing(f,g,gap).a}:g)};drawText($('#sp-cv',s),preview,sample(),3,Math.max(120,($('#sp-box',s).clientWidth||300)-16));};
  $('#sp-gap',s).onclick=e=>{const b=e.target.closest('[data-g]');if(!b)return;gap=+b.dataset.g;$$('#sp-gap button',s).forEach(x=>x.setAttribute('aria-pressed',x===b));refresh();};
  $('#sp-scope',s).onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;scope=b.dataset.s;$$('#sp-scope button',s).forEach(x=>x.setAttribute('aria-pressed',x===b));refresh();};
  $('#sp-go',s).onclick=()=>{const ch=[];for(const i of targets()){const g=f.glyphs[i],r=Core.autoSpacing(f,g,gap);if(r.changed)ch.push({i,p:g.p,a:r.a});}applyMany(ch);closeSheet();toast('จัดระยะให้ '+ch.length+' อักษรแล้ว · ย้อนกลับได้');};
  refresh();});}
function addGlyphSheet(){if(!guardEdit())return;
 sheet('<h2>เพิ่มอักษร</h2><p class="sub">พิมพ์หลายตัวติดกันได้ หรือคั่นด้วยเว้นวรรคเพื่อเพิ่มเป็นกลุ่ม เช่น <b>กิ ก่ ก้</b> (อักษรผสมใช้ภาพเดียวทั้งกลุ่ม)</p><div class="field"><input id="ag" class="input" aria-label="อักษรที่จะเพิ่ม" autofocus></div><div class="seg" role="group" aria-label="เพิ่มชุดอักษรสำเร็จรูป"><button data-set="ABCDEFGHIJKLMNOPQRSTUVWXYZ">A–Z</button><button data-set="abcdefghijklmnopqrstuvwxyz">a–z</button><button data-set="0123456789">0–9</button><button data-set=".,!?:;&#39;&quot;-()/+=%&amp;*#@">เครื่องหมาย</button></div><div class="group" style="margin-top:12px"><label class="row"><span class="grow">เติมภาพให้จากฟอนต์ไทย 8×16<small>ใช้ภาพพิกเซล A–Z a–z 0–9 และเครื่องหมายเป็นจุดเริ่ม แก้ต่อได้ ถ้าปิดจะได้ช่องว่าง</small></span><input type="checkbox" id="ag-fill" checked></label></div><button class="btn block" id="ag-ok" data-bar="เพิ่ม">เพิ่ม</button><button class="btn gray block" id="ag-auto" style="margin-top:10px">เติม A–Z a–z 0–9 ให้เข้ากับฟอนต์อัตโนมัติ</button><p class="sub" style="margin-top:6px">เติมเฉพาะอักษรที่ยังไม่มี ปรับตำแหน่งแนวตั้ง เงา และระยะให้เข้ากับอักษรไทยของฟอนต์นี้ แก้ต่อได้</p>',s=>{
  $('#ag-auto',s).onclick=()=>{let n=0;if(!structChange(f=>{n=autoFillLatin(f);if(!n)return false;S.idx=f.glyphs.length-n;}))return toast('A–Z a–z 0–9 ครบอยู่แล้ว');closeSheet();toast('เติม '+n+' อักษรให้เข้ากับฟอนต์ · ย้อนกลับได้');};
  [...s.querySelectorAll('[data-set]')].forEach(b=>b.onclick=()=>{const i=$('#ag',s),add=[...b.dataset.set].filter(c=>!i.value.includes(c)).join('');i.value=(i.value+add).replace(/\s+/g,'');i.focus();});
  $('#ag-ok',s).onclick=()=>{const fill=$('#ag-fill',s).checked,raw=$('#ag',s).value.trim(),tokens=/\s/.test(raw)?raw.split(/\s+/):[...raw];let n=0;
   if(!structChange(f=>{for(const t of tokens){if(!t||[...t].length>8||f.glyphs.some(g=>g.c===t)||f.glyphs.length>=2048)continue;const src=fill&&[...t].length===1&&seedGlyph(t);f.glyphs.push(src?{c:t,p:fitGlyph(src.p,8,16,f.w,f.h,f.bpp),a:Math.min(src.a,f.w)}:{c:t,p:Core.blank(f.w,f.h),a:f.w});n++;}if(!n)return false;S.idx=f.glyphs.length-1;}))return toast('ไม่มีอักษรใหม่ที่เพิ่มได้ (ซ้ำหรือว่าง)');
   closeSheet();toast('เพิ่ม '+n+' อักษร · ย้อนกลับได้');};});}
/* ready-made pixels for A–Z, digits and punctuation come from the bundled public-domain 8×16 font */
function seedGlyph(ch){const b=FontLabBuiltins.find(x=>x.id==='builtin-thai-8x16');return b&&b.glyphs.find(g=>g.c===ch&&!/[\u0E00-\u0E7F]/.test(ch));}
function fitGlyph(p,w,h,nw,nh,bpp){let o='';const cap=(1<<bpp)-1;for(let y=0;y<nh;y++)for(let x=0;x<nw;x++)o+=x<w&&y<h?String(Math.min(+p[y*w+x],cap)):'0';return o;}
/* fill the missing A–Z a–z 0–9 so they match the font: same baseline, same shadow, same spacing rule */
function autoFillLatin(f){
  const ref=f.glyphs.find(g=>g.c==='ก')||f.glyphs.find(g=>g.c==='อ'),cap=(1<<f.bpp)-1;
  const inkRows=(p,w)=>{let lo=99,hi=-1;for(let i=0;i<p.length;i++)if(p[i]==='1'){const y=Math.floor(i/w);lo=Math.min(lo,y);hi=Math.max(hi,y);}return[lo,hi];};
  let dy=0,dir=null;
  if(ref){const [,hi]=inkRows(ref.p,f.w);if(hi>=0)dy=hi-13; /* the bundled font's Thai body ends on row 13 */
    if(/2/.test(ref.p)){const bare={...ref,p:ref.p.replace(/2/g,'0')};dir=Object.keys(Core.SHADOW_DIRS).find(d=>Core.addShadow(f,bare,d).p===ref.p)||'down-right';}}
  const gap=dir?2:1;let n=0;
  for(const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'){
    if(f.glyphs.some(g=>g.c===ch)||f.glyphs.length>=2048)continue;const src=seedGlyph(ch);if(!src)continue;
    let p='';for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const sy=y-dy;p+=x<8&&sy>=0&&sy<16?String(Math.min(+src.p[sy*8+x],cap)):'0';}
    let g={c:ch,p,a:Math.min(src.a,f.w)};
    const right=(()=>{let r=-1;for(let i=0;i<g.p.length;i++)if(g.p[i]!=='0')r=Math.max(r,i%f.w);return r;})();
    if(dir&&f.bpp>=2){const sh=Core.addShadow(f,g,dir);g={...g,p:sh.p};}
    g.a=Math.max(2,Math.min(f.w,right+1+gap));
    f.glyphs.push(g);n++;}
  return n;}
/* manage the selected glyph: rename, reorder, delete */
function glyphMenu(){const f=editable();if(!f)return guardEdit();const g=f.glyphs[S.idx],last=S.idx>=f.glyphs.length-1;
 sheet('<h2>จัดการอักษร “'+esc(glyphLabel(g))+'”</h2><p class="sub">ตำแหน่งที่ '+(S.idx+1)+' จาก '+f.glyphs.length+' · ลำดับมีผลกับไฟล์ไบนารีที่ส่งออก</p><div class="actions">'+action('เปลี่ยนชื่ออักษร','g-ren')+action('ย้ายไปก่อนหน้า','g-up',S.idx===0?'off':'')+action('ย้ายไปถัดไป','g-dn',last?'off':'')+action('ลบอักษรนี้','g-del','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  s.addEventListener('click',e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;closeSheet();
   if(a==='g-ren')renameGlyphSheet();
   if(a==='g-up'||a==='g-dn')structChange(f=>{const i=S.idx,j=a==='g-up'?i-1:i+1;if(j<0||j>=f.glyphs.length)return false;[f.glyphs[i],f.glyphs[j]]=[f.glyphs[j],f.glyphs[i]];S.idx=j;});
   if(a==='g-del')confirmDeleteGlyph();});});}
function renameGlyphSheet(){const f=editable();if(!f)return;const g=f.glyphs[S.idx];
 sheet('<h2>เปลี่ยนชื่ออักษร</h2><p class="sub">ตัวอักษร 1–8 ตัวที่ใช้เรียกภาพนี้ (อักษรผสมใส่หลายตัว เช่น กิ) ห้ามซ้ำกับอักษรอื่น</p><div class="field"><input id="rn" class="input" maxlength="16" value="'+esc(g.c)+'" aria-label="ชื่ออักษร" autofocus></div><button class="btn block" id="rn-ok" data-bar="เสร็จ">บันทึกชื่อ</button>',s=>{
  $('#rn-ok',s).onclick=()=>{const v=$('#rn',s).value;if(!v||[...v].length>8)return toast('ใส่ตัวอักษร 1–8 ตัว');
   if(v!==g.c&&f.glyphs.some(x=>x.c===v))return toast('มีอักษร “'+v+'” อยู่แล้ว');if(v===g.c)return closeSheet();
   if(structChange(f=>{f.glyphs[S.idx].c=v;})){closeSheet();toast('เปลี่ยนชื่อแล้ว · ย้อนกลับได้');}};});}
function confirmDeleteGlyph(){const f=editable();if(!f)return;const g=f.glyphs[S.idx];
 if(f.glyphs.length<=1)return toast('ต้องเหลืออย่างน้อย 1 อักษร');
 sheet('<h2>ลบอักษร “'+esc(glyphLabel(g))+'” ?</h2><p class="sub">ภาพและระยะของอักษรนี้จะหายไป ย้อนกลับได้ด้วยปุ่มย้อนกลับ</p><div class="actions">'+action('ลบอักษร','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  $('[data-act=yes]',s).onclick=()=>{closeSheet();if(structChange(f=>{f.glyphs.splice(S.idx,1);S.idx=Math.min(S.idx,f.glyphs.length-1);}))toast('ลบอักษรแล้ว · ย้อนกลับได้');};});}
function exportSheet(){const f=S.fonts.get(S.cur);if(!f)return;const c=Core.consoleOf(f.console),n=slug(f.name);
 sheet('<h2>ส่งออก</h2><p class="sub">'+esc(f.name)+' · '+c.name+'</p><div class="actions">'+action('โปรเจกต์ FontLab (.fontlab.json)','json')+action('PNG sheet ('+Core.sheetSize(f).width+'×'+Core.sheetSize(f).height+')','png')+action('ไบนารีไทล์ '+f.bpp+' บิต (.bin)','bin')+action('ตารางระยะอักษร ('+f.glyphs.length+' ไบต์ -widths.bin)','widths')+action('สเปกและออฟเซ็ต (README.txt)','readme')+action('ทั้งหมดเป็น .zip','zip')+'</div><div class="actions">'+action('นำเข้า PNG sheet ทับฟอนต์นี้','imp-png',f.builtin?'off':'')+action('นำเข้า .bin ทับฟอนต์นี้','imp-bin',f.builtin?'off':'')+'</div><button class="btn gray block" data-close>ปิด</button>',s=>{
  s.addEventListener('click',async e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(!a)return;
   try{if(a==='json')download(n+'.fontlab.json',JSON.stringify(f),'application/json');
    else if(a==='png')download(n+'-sheet.png',new Blob([await pngBytes(f,false)],{type:'image/png'}));
    else if(a==='bin')download(n+'-'+f.console+'-'+f.bpp+'bpp.bin',new Blob([Core.exportBank(f)]));
    else if(a==='widths')download(n+'-widths.bin',new Blob([Core.widthsBank(f)]));
    else if(a==='readme')download(n+'-README.txt',Core.readme(f),'text/plain');
    else if(a==='zip'){const enc=new TextEncoder();download(n+'.zip',Core.zip([{name:n+'.fontlab.json',data:enc.encode(JSON.stringify(f))},{name:n+'-sheet.png',data:await pngBytes(f,false)},{name:n+'-'+f.console+'.bin',data:Core.exportBank(f)},{name:n+'-widths.bin',data:Core.widthsBank(f)},{name:n+'-README.txt',data:enc.encode(Core.readme(f))}]),'application/zip');}
    else if(a==='imp-png'){closeSheet();pickFiles('image/png');}else if(a==='imp-bin'){closeSheet();pickFiles('.bin,application/octet-stream');}
    if(!a.startsWith('imp'))toast('ส่งออกแล้ว');}catch(err){toast('ส่งออกไม่สำเร็จ: '+err.message);}});});}

/* ---------- settings ---------- */
async function storageText(){try{const e=await navigator.storage?.estimate?.();if(e&&e.usage!=null)return (e.usage/1024<1024?Math.round(e.usage/1024)+' KB':(e.usage/1048576).toFixed(1)+' MB');}catch{}return '—';}
function clearLocalSheet(){sheet('<h2>ลบข้อมูลฟอนต์ในเครื่องนี้?</h2><p class="sub">ฟอนต์ที่สร้างหรือแก้ไขไว้ในเบราว์เซอร์นี้จะถูกลบ ฟอนต์ที่เคยบันทึกขึ้นคลาวด์แล้วจะถูกดึงกลับมาเมื่อซิงก์ ส่วนที่ยังไม่ได้บันทึกขึ้นคลาวด์จะหายถาวร รหัสสำรองและค่าที่ตั้งไว้ไม่ถูกลบ</p><div class="actions">'+action('ลบข้อมูลฟอนต์ในเครื่อง','yes','red')+'</div><button class="btn gray block" data-close>ยกเลิก</button>',s=>{
  $('[data-act=yes]',s).onclick=async()=>{closeSheet();for(const f of [...S.fonts.values()])if(!isSeed(f)||f.updatedAt)await Store.del(f.id).catch(()=>{});
   try{for(const k of ['fontlab.syncedAt.v1','fontlab.seedsDeleted.v1','fontlab.deleted.v1',recentKey,orderKey])localStorage.removeItem(k);}catch{}toast('ลบข้อมูลในเครื่องแล้ว · กำลังโหลดใหม่…');setTimeout(()=>location.reload(),600);};});}
function renderSettings(){const el=$('#page-settings');if(!el)return;const theme=document.documentElement.dataset.theme||'system',mine=userFonts().length;
 const sw=(id,on,label)=>'<button class="switch" role="switch" id="'+id+'" aria-checked="'+on+'" aria-label="'+label+'"></button>';
 el.innerHTML=nav('ตั้งค่า')+'<div class="large"><h1>ตั้งค่า</h1><p>การแสดงผล คลาวด์ และข้อมูลในเครื่อง</p></div>'
  +'<div class="group-title">การแสดงผล</div><div class="group"><div class="row"><span class="grow">โหมดสี</span></div><div class="row" style="padding:6px 16px 12px"><div class="seg" id="set-theme" style="width:100%" role="group" aria-label="โหมดสี">'+[['system','ตามระบบ'],['light','สว่าง'],['dark','มืด']].map(([m,l])=>'<button data-m="'+m+'" aria-pressed="'+(theme===m)+'">'+l+'</button>').join('')+'</div></div></div>'
  +'<div class="group-title">คลาวด์</div><div class="group"><button class="row" data-act="cloud"><i class="cdot '+S.cloud.state+'" style="position:static;flex:none"></i><span class="grow"><span data-cloud-text>'+esc(cloudText())+'</span><small>แตะเพื่อดูรหัสสำรองและซิงก์</small></span>'+ic('chev','chev')+'</button>'
  +'<div class="row"><span class="grow">อัปโหลดอัตโนมัติหลังแก้ไข<small>ปิดไว้ (แนะนำ): ส่งขึ้นคลาวด์เฉพาะตอนกดบันทึก</small></span>'+sw('set-auto',S.autoCloud,'อัปโหลดอัตโนมัติหลังแก้ไข')+'</div>'
  +'<button class="row" id="set-sync"><span class="grow">ซิงก์ตอนนี้<small>ส่งการแก้ไขที่ค้างและดึงฟอนต์ที่ใหม่กว่า</small></span>'+ic('sync')+'</button></div>'
  +'<div class="group-title">ฟอนต์ใหม่</div><div class="group"><div class="row"><span class="grow">เครื่องเริ่มต้น<small>ใช้เป็นค่าเริ่มต้นในหน้าสร้างฟอนต์ใหม่</small></span><select id="set-con" class="input" aria-label="เครื่องเริ่มต้น">'+Core.CONSOLES.map(c=>'<option value="'+c.id+'"'+(c.id===defaultConsole()?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div></div>'
  +'<div class="group-title">ข้อมูลในเครื่อง</div><div class="group"><div class="row"><span class="grow">ฟอนต์ของฉัน</span><span class="val">'+mine+' ตัว</span></div><div class="row"><span class="grow">พื้นที่ที่ใช้ในเบราว์เซอร์</span><span class="val" id="set-usage">…</span></div><button class="row" id="set-clear"><span class="grow" style="color:var(--red)">ลบข้อมูลฟอนต์ในเครื่องนี้<small>ฟอนต์ที่อยู่บนคลาวด์จะถูกดึงกลับมาเมื่อซิงก์</small></span>'+ic('chev','chev')+'</button></div>'
  +'<div class="group-title">ปุ่มลัด</div><div class="group">'+[['ย้อนกลับ','Ctrl / ⌘ + Z'],['ทำซ้ำ','Ctrl / ⌘ + Shift + Z'],['เลื่อนเคอร์เซอร์ในช่องวาด','ลูกศร'],['วาดด้วยเครื่องมือที่เลือก','เว้นวรรค / Enter'],['ลบพิกเซล','Backspace / Delete'],['ปิดหน้าต่าง','Esc หรือปัดลง']].map(([a,b])=>'<div class="row"><span class="grow">'+a+'</span><span class="val">'+b+'</span></div>').join('')+'</div>'
  +'<div class="group-title">เกี่ยวกับ</div><div class="group"><div class="row"><span class="grow">FontLab</span><span class="val">เวอร์ชัน '+esc(appVersion())+'</span></div><div class="row"><span class="grow">ฟอนต์ Prompt<small>SIL Open Font License 1.1 · ใช้แสดงตัวอักษรไทยในหน้าเว็บ</small></span></div><div class="row"><span class="grow">ข้อมูลของคุณ<small>ฟอนต์เก็บในเบราว์เซอร์นี้ และขึ้นคลาวด์เมื่อกดบันทึกเท่านั้น</small></span></div></div><p class="foot"> </p>';
 enhanceSelects(el);
 $('#set-theme',el).onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;applyTheme(b.dataset.m==='system'?null:b.dataset.m,true);$$('#set-theme button',el).forEach(x=>x.setAttribute('aria-pressed',x===b));};
 $('#set-auto',el).onclick=e=>{S.autoCloud=!S.autoCloud;e.currentTarget.setAttribute('aria-checked',S.autoCloud);try{localStorage.setItem('fontlab.autoCloud',S.autoCloud?'yes':'no');}catch{}if(S.autoCloud&&isDirty())scheduleSync();};
 $('#set-sync',el).onclick=()=>syncNow(false);
 $('#set-con',el).onchange=e=>{try{localStorage.setItem('fontlab.defaultConsole',e.target.value);}catch{}toast('ตั้งเครื่องเริ่มต้นแล้ว');};
 $('#set-clear',el).onclick=clearLocalSheet;
 storageText().then(t=>{const u=$('#set-usage');if(u)u.textContent=t;});}

/* ---------- cloud sheet (backup code) ---------- */
const mask=c=>c.slice(0,6)+' •••• •••• •••• '+c.slice(-4);
function cloudSheet(){
 sheet('<h2>สำรองบนคลาวด์</h2><p class="sub">ไม่ต้องสมัครหรือเข้าสู่ระบบ ฟอนต์ถูกเก็บในเครื่องอัตโนมัติ และส่งขึ้นคลาวด์เมื่อกดปุ่มบันทึก</p>'
  +'<div class="group" style="margin:0 0 12px"><div class="row"><span class="cdot '+S.cloud.state+'"></span><span class="grow"><span id="cloud-status">'+esc(cloudText())+'</span><small>ฟอนต์ของฉัน '+userFonts().length+' ตัว</small></span></div></div>'
  +'<div class="group" style="margin:0 0 12px"><div class="row"><span class="grow">อัปโหลดอัตโนมัติหลังแก้ไข<small>ปิดไว้ (แนะนำ): ส่งขึ้นคลาวด์เฉพาะตอนกดปุ่มบันทึก ลดจำนวนครั้งและข้อมูลที่ส่ง</small></span><button class="switch" role="switch" id="cc-auto" aria-checked="'+S.autoCloud+'" aria-label="อัปโหลดอัตโนมัติหลังแก้ไข"></button></div></div>'
  +'<div class="group-title" style="margin:6px 4px">รหัสสำรองของคุณ</div><div class="group" style="margin:0 0 6px"><div class="row"><span class="grow" style="font-family:ui-monospace,Menlo,monospace;font-size:14px;overflow-wrap:anywhere" id="cc-code">'+mask(FontLabCloud.code())+'</span></div></div>'
  +'<div class="grid2" style="margin-bottom:6px"><button class="btn tint small" id="cc-show">แสดงรหัส</button><button class="btn tint small" id="cc-copy">คัดลอกรหัส</button></div>'
  +'<p class="foot" style="margin:0 4px 12px">ใช้รหัสนี้บนเครื่องอื่นเพื่อดึงฟอนต์ทั้งหมดมา เก็บไว้ให้ดีเหมือนรหัสผ่าน ใครมีรหัสก็เปิดฟอนต์ชุดนี้ได้'+(FontLabCloud.persistent()?'':' · เบราว์เซอร์นี้เก็บรหัสถาวรไม่ได้ จดรหัสไว้ด้วย')+'</p>'
  +'<div class="group-title" style="margin:6px 4px">ใช้รหัสจากเครื่องอื่น</div><div class="field" style="margin:0 0 8px"><input id="cc-in" class="input" placeholder="วางรหัส 64 ตัวอักษร" autocomplete="off" spellcheck="false" aria-label="รหัสสำรองจากเครื่องอื่น"></div>'
  +'<div class="actions"><button class="row" id="cc-use">เชื่อมต่อด้วยรหัสนี้และรวมฟอนต์</button><button class="row" id="cc-sync">ซิงก์ตอนนี้</button><button class="row" id="cc-sql">คัดลอก SQL ติดตั้ง (ทำครั้งเดียว)</button></div>'
  +'<button class="btn gray block" data-close>ปิด</button>',s=>{
  let shown=false;const code=$('#cc-code',s);
  $('#cc-show',s).onclick=e=>{shown=!shown;code.textContent=shown?FontLabCloud.code():mask(FontLabCloud.code());e.target.textContent=shown?'ซ่อนรหัส':'แสดงรหัส';};
  $('#cc-copy',s).onclick=async()=>{try{await navigator.clipboard.writeText(FontLabCloud.code());toast('คัดลอกรหัสแล้ว');}catch{shown=true;code.textContent=FontLabCloud.code();const r=document.createRange();r.selectNodeContents(code);getSelection().removeAllRanges();getSelection().addRange(r);toast('เลือกรหัสไว้แล้ว กดคัดลอกเอง');}};
  $('#cc-use',s).onclick=()=>{try{FontLabCloud.setCode($('#cc-in',s).value);}catch(e){return toast(e.message);}closeSheet();toast('เชื่อมต่อแล้ว กำลังรวมฟอนต์…');syncNow(false);};
  $('#cc-auto',s).onclick=e=>{S.autoCloud=!S.autoCloud;e.currentTarget.setAttribute('aria-checked',S.autoCloud);try{localStorage.setItem('fontlab.autoCloud',S.autoCloud?'yes':'no');}catch{}if(S.autoCloud&&isDirty())scheduleSync();};
  $('#cc-sync',s).onclick=()=>{syncNow(false);};
  $('#cc-sql',s).onclick=async()=>{try{await navigator.clipboard.writeText(FontLabSchema);toast('คัดลอก SQL แล้ว วางใน Supabase SQL Editor แล้วกด Run');}catch{closeSheet();schemaSheet();}};});}
function schemaSheet(){sheet('<h2>SQL ติดตั้ง</h2><p class="sub">คัดลอกแล้ววางใน Supabase → SQL Editor → Run (ทำครั้งเดียว รันซ้ำได้ปลอดภัย)</p><div class="pre" tabindex="0">'+esc(FontLabSchema)+'</div><button class="btn block" id="sc-copy" data-bar="คัดลอก">คัดลอก SQL</button>',s=>{
 $('#sc-copy',s).onclick=async()=>{try{await navigator.clipboard.writeText(FontLabSchema);toast('คัดลอก SQL แล้ว');}catch{const r=document.createRange();r.selectNodeContents($('.pre',s));getSelection().removeAllRanges();getSelection().addRange(r);toast('เลือกข้อความไว้แล้ว กดคัดลอกด้วยตัวเอง');}};});}

/* ---------- gestures: long-press (touch) or right-click on a card opens its menu ---------- */
(()=>{let timer=0,sx=0,sy=0,fired=false;
 document.addEventListener('pointerdown',e=>{const card=e.target.closest?.('.card[data-open]');if(!card||e.pointerType==='mouse'||e.target.closest('[data-more]'))return;fired=false;sx=e.clientX;sy=e.clientY;clearTimeout(timer);timer=setTimeout(()=>{fired=true;if(navigator.vibrate)try{navigator.vibrate(10);}catch{}fontMenu(card.dataset.open);},520);});
 const cancel=e=>{if(e&&e.type==='pointermove'&&Math.hypot(e.clientX-sx,e.clientY-sy)<8)return;clearTimeout(timer);};
 document.addEventListener('pointermove',cancel);document.addEventListener('pointerup',()=>clearTimeout(timer));document.addEventListener('pointercancel',()=>clearTimeout(timer));
 document.addEventListener('click',e=>{if(fired){fired=false;e.stopPropagation();e.preventDefault();}},true);
 document.addEventListener('contextmenu',e=>{const card=e.target.closest?.('.card[data-open]');if(card){e.preventDefault();fontMenu(card.dataset.open);}});
})();

/* ---------- events ---------- */
document.addEventListener('click',e=>{const t=e.target;
 const tab=t.closest('[data-tab]');if(tab)return go(tab.dataset.tab);
 const rec=t.closest('[data-recent]');if(rec&&S.fonts.has(rec.dataset.recent))return openStudio(rec.dataset.recent);
 const sf=t.closest('[data-sidefilter]');if(sf){S.filter=S.filter===sf.dataset.sidefilter&&S.tab==='library'?'all':sf.dataset.sidefilter;S.query='';return go('library');}
 const more=t.closest('[data-more]');if(more){e.stopPropagation();return fontMenu(more.dataset.more);}
 const open=t.closest('[data-open]');if(open)return openStudio(open.dataset.open);
 const fl=t.closest('[data-filter]');if(fl){S.filter=fl.dataset.filter;return renderLibrary();}
 const con=t.closest('[data-console]');if(con)return consoleSheet(con.dataset.console);
 const tool=t.closest('[data-tool]');if(tool){S.tool=tool.dataset.tool;return $$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b===tool));}
 const col=t.closest('[data-color]');if(col){S.color=+col.dataset.color;S.tool=S.tool==='eraser'?'pencil':S.tool;$$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===S.tool));return $$('[data-color]').forEach(b=>b.setAttribute('aria-pressed',b===col));}
 const op=t.closest('[data-op]');if(op)return transform(op.dataset.op);
 const gl=t.closest('.gl');if(gl){if(e.ctrlKey||e.metaKey||GSEL.size)return toggleGSel(+gl.dataset.i);return selectGlyph(+gl.dataset.i);}
 const a=t.closest('[data-act]')?.dataset.act;if(!a||t.closest('.sheet'))return;
 if(a==='theme'){applyTheme(isDark()?'light':'dark',true);return;}
 if(a==='new')newFontSheet();else if(a==='import')pickFiles('.json,application/json,.png,.bin');else if(a==='settings')settingsSheet();else if(a==='export')exportSheet();
 else if(a==='gsel-clear'){GSEL.clear();updateGSel();}else if(a==='gsel-del')confirmDeleteGlyphs();else if(a==='gsel-copy')copySelected();else if(a==='xfont')crossFontSheet();else if(a==='shortcuts')shortcutsSheet();else if(a==='add-glyph')addGlyphSheet();else if(a==='check-all')checkAllSheet();else if(a==='shadow')shadowSheet();else if(a==='spacing')spacingSheet();else if(a==='save')saveNow();else if(a==='save-new')saveNewSheet();else if(a==='font-settings')settingsSheet();else if(a==='font-export')exportSheet();else if(a==='manage')glyphMenu();else if(a==='guides'){S.guides=!S.guides;$$('[data-act=guides]').forEach(b=>b.setAttribute('aria-pressed',S.guides));drawEditor();}else if(a==='labels'){S.labels=!S.labels;if(S.labels)S.guides=true;try{localStorage.setItem('fontlab.zoneLabels',S.labels?'yes':'no');}catch{}$$('[data-act=labels]').forEach(b=>b.setAttribute('aria-pressed',S.labels));$$('[data-act=guides]').forEach(b=>b.setAttribute('aria-pressed',S.guides));drawEditor();}else if(a==='grid'){S.grid=!S.grid;$$('[data-act=grid]').forEach(b=>b.setAttribute('aria-pressed',S.grid));drawEditor();}
 else if(a==='dup-edit'){const f=S.fonts.get(S.cur),d=duplicate(f);addFont(d).then(()=>{openStudio(d.id);toast('ทำสำเนาแล้ว แก้ไขได้เลย');});}
 else if(a==='cloud')cloudSheet();});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.query=e.target.value;renderLibrary();}});
/* studio keyboard shortcuts (listed by “?”) */
const SHORTCUTS=[['Ctrl+Z / Ctrl+Y','ย้อนกลับ / ทำซ้ำ (Ctrl+Shift+Z ก็ได้)'],['Ctrl+C / Ctrl+X / Ctrl+V','คัดลอก / ตัด / วางภาพอักษร (ถ้าเลือกหลายอักษรไว้ จะคัดลอกทั้งชุดไปวางในฟอนต์อื่น)'],['Ctrl+S','บันทึก'],['← → ↑ ↓','เลื่อนภาพอักษรทีละ 1 พิกเซล (ถ้าโฟกัสกริดด้วยแป้นพิมพ์ ลูกศรจะเลื่อนเคอร์เซอร์แทน)'],['P / E / F / I','ดินสอ / ยางลบ / เทสี / ดูดสี'],['1 2 3 4','เลือกสี'],['H / V','พลิกแนวนอน / แนวตั้ง'],['Delete','ล้างอักษร'],['[  ]  หรือ PageUp / PageDown','อักษรก่อนหน้า / ถัดไป'],['G','เปิด/ปิดเส้นกริด'],['?','แสดงรายการนี้']];
const KEYHINT={'[data-tool=pencil]':'P','[data-tool=eraser]':'E','[data-tool=fill]':'F','[data-tool=pick]':'I','[data-op=clear]':'Delete','[data-op=shift-l]':'←','[data-op=shift-r]':'→','[data-op=shift-u]':'↑','[data-op=shift-d]':'↓','[data-op=flip-h]':'H','[data-op=flip-v]':'V','[data-op=copy]':'Ctrl+C','[data-op=paste]':'Ctrl+V','#u-undo':'Ctrl+Z','#u-redo':'Ctrl+Y','[data-act=grid]':'G','[data-act=save]':'Ctrl+S'};
function addKeyHints(){for(const [sel,k] of Object.entries(KEYHINT))for(const b of $$('#page-studio '+sel)){const t=(b.getAttribute('title')||b.getAttribute('aria-label')||'').replace(/\s*\([^)]*\)\s*$/,'');b.setAttribute('title',t+' ('+k+')');}
 $$('#page-studio [data-color]').forEach(b=>b.setAttribute('title','สี '+(+b.dataset.color+1)+' (กด '+(+b.dataset.color+1)+')'));}
function shortcutsSheet(){sheet('<h2>ปุ่มลัดในสตูดิโอ</h2><div class="group">'+SHORTCUTS.map(([k,d])=>'<div class="row"><span class="grow"><b>'+esc(k)+'</b><small>'+esc(d)+'</small></span></div>').join('')+'</div><button class="btn gray block" data-close>ปิด</button>',()=>{});}
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.matches?.('.card')){openStudio(e.target.dataset.open);return;}
 if(S.tab!=='studio'||e.defaultPrevented||document.querySelector('.sheet')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')||document.activeElement?.isContentEditable)return;
 const c=e.code||'',k=c==='BracketLeft'?'[':c==='BracketRight'?']':(c==='Slash'&&e.shiftKey)?'?':e.key,K=/^Key[A-Z]$/.test(c)?c[3].toLowerCase():/^Digit[1-4]$/.test(c)?c[5]:(k.length===1?k.toLowerCase():k),mod=e.ctrlKey||e.metaKey,f=S.fonts.get(S.cur);if(!f)return;
 if(mod&&!e.altKey){
  if(K==='z'){e.preventDefault();stepHistory(e.shiftKey?1:-1);}else if(K==='y'){e.preventDefault();stepHistory(1);}
  else if(K==='c'){e.preventDefault();if(GSEL.size)copySelected();else transform('copy');}
  else if(K==='v'){e.preventDefault();if(S.lastClip==='set'&&S.gclip)pasteGlyphs();else transform('paste');}
  else if(K==='x'){e.preventDefault();if(!guardEdit())return;transform('copy');transform('clear');}
  else if(K==='s'){e.preventDefault();saveNow();}
  return;}
 if(e.altKey)return;
 const kbCanvas=document.activeElement===$('#edit')&&document.activeElement.matches?.(':focus-visible'); /* keyboard-drawing mode keeps the arrows for its cursor */
 const arrows={ArrowLeft:'shift-l',ArrowRight:'shift-r',ArrowUp:'shift-u',ArrowDown:'shift-d'};
 if(arrows[k]&&!kbCanvas){e.preventDefault();transform(arrows[k]);return;}
 const tools={p:'pencil',e:'eraser',f:'fill',i:'pick'};
 if(tools[K]){$('[data-tool='+tools[K]+']')?.click();return;}
 if('1234'.includes(K)&&K.length===1){$('[data-color="'+(+K-1)+'"]')?.click();return;}
 if(K==='h'){transform('flip-h');return;}if(K==='v'){transform('flip-v');return;}
 if(K==='g'){$('[data-act=grid]')?.click();return;}
 if((k==='Delete'||k==='Backspace')&&!kbCanvas){e.preventDefault();transform('clear');return;}
 if(k==='['||k==='PageUp'||k===']'||k==='PageDown'){e.preventDefault();const d=(k==='['||k==='PageUp')?-1:1,n=Math.max(0,Math.min(f.glyphs.length-1,S.idx+d));if(n!==S.idx)selectGlyph(n);return;}
 if(k==='?'){e.preventDefault();shortcutsSheet();}
});
document.addEventListener('click',e=>{if(e.target.closest('#u-undo'))stepHistory(-1);if(e.target.closest("#u-redo"))stepHistory(1);});
addEventListener('resize',()=>{if(S.tab==='studio'&&edit&&S.fonts.get(S.cur)){sizeEditor();drawEditor();drawPreview();}});
addEventListener('beforeunload',()=>{for(const [id,t] of saveTimers){clearTimeout(t);const f=S.fonts.get(id);if(f)Store.put(f);}});
addEventListener('hashchange',()=>{const t=location.hash.slice(1);if(TABS.some(x=>x[0]===t)&&t!==S.tab)go(t,{push:false});});

/* ---------- boot ---------- */
(async()=>{
 await Store.init();
 try{for(const raw of await Store.all()){try{const f=Core.normalize(raw);S.fonts.set(f.id,f);}catch{}}}catch{}
 {const gone=deletedSeeds();for(const b of FontLabBuiltins)if(!S.fonts.has(b.id)&&!gone.includes(b.id))S.fonts.set(b.id,seedCopy(b));}
 applyTheme(document.documentElement.dataset.theme,false);
 const start=location.hash.slice(1);go(TABS.some(x=>x[0]===start)?start:'library',{push:false});
 if(!Store.persistent())toast('เบราว์เซอร์นี้ไม่อนุญาตให้เก็บฟอนต์ถาวร · ส่งออกไฟล์ไว้เสมอ');
 syncNow(true,true,true);
})();
/* ---------- iOS-style tooltips for icon-only buttons (mouse hover or keyboard focus) ---------- */
(()=>{const tip=document.createElement('div');tip.className='tip';tip.setAttribute('role','tooltip');document.body.append(tip);let timer=0,cur=null;
 const labelOf=el=>{if(el.title){el.dataset.tip=el.title;el.removeAttribute('title');}return(el.dataset.tip||el.getAttribute('aria-label')||'').replace(/\s*[(（][^)）]*[\u0E00-\u0E7F].*$/,'').trim();}; /* long Thai explanations after the label are dropped, a key hint like (Ctrl+Z) stays */
 const eligible=el=>!!el&&el.matches('button,[role=button]')&&!el.textContent.trim()&&!!(el.title||el.dataset.tip||el.getAttribute('aria-label'));
 function hide(){clearTimeout(timer);timer=0;cur=null;tip.classList.remove('on');}
 function show(el){const t=labelOf(el);if(!t||!el.isConnected)return;tip.textContent=t;tip.style.left='0px';tip.style.top='0px';
  const r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;let top=r.bottom+8;if(top+h>innerHeight-8)top=r.top-h-8;
  tip.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';tip.style.top=Math.max(8,top)+'px';tip.style.transformOrigin=top>r.top?'top center':'bottom center';tip.classList.add('on');}
 const canHover=matchMedia('(hover:hover)');
 document.addEventListener('mouseover',e=>{if(!canHover.matches)return;const el=e.target.closest?.('button,[role=button]');if(!eligible(el)){if(cur&&!(el&&el===cur))hide();return;}if(el===cur)return;hide();cur=el;timer=setTimeout(()=>show(el),320);});
 document.addEventListener('mouseout',e=>{if(cur&&!cur.contains(e.relatedTarget))hide();});
 document.addEventListener('focusin',e=>{const el=e.target;if(eligible(el)&&el.matches(':focus-visible')){hide();cur=el;show(el);}});
 document.addEventListener('focusout',hide);document.addEventListener('pointerdown',hide,true);document.addEventListener('keydown',hide,true);addEventListener('scroll',hide,true);addEventListener('resize',hide);
})();
/* ---------- freshness: drop leftovers of the old app, load a newer version by itself ---------- */
(async()=>{
 /* drop leftovers of the removed app (other service workers / caches), keep ours, then register the offline worker */
 try{for(const r of await navigator.serviceWorker?.getRegistrations?.()||[]){const u=(r.active||r.waiting||r.installing)?.scriptURL||'';if(!/\/sw\.js(\?|$)/.test(u))r.unregister();}if(window.caches)for(const k of await caches.keys())if(!k.startsWith('fontlab-offline-'))caches.delete(k);}catch{}
 try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});}catch{}
 try{const cur=document.querySelector('meta[name=app-version]')?.content;if(!cur||location.protocol==='file:')return;
  const res=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!res.ok)return;const v=(await res.json()).version;
  if(v&&v!==cur){const u=new URL(location.href);if(u.searchParams.get('v')!==v){u.searchParams.set('v',v);location.replace(u.href);}}}catch{}
})();
window.FontLabApp={S,Store,go,openStudio};
})();
