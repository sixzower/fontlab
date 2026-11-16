/* FontLab cloud backup: no login. A random backup code (kept in this browser) names a vault in Supabase;
   four SQL functions (cloud/fontlab.sql) store font data only. Public project key only. */
const FontLabCloud=(()=>{
 const cfg=()=>window.FontLabConfig,KEY='fontlab.code.v2',DEL='fontlab.deleted.v1',WS_ID='__workspace',valid=c=>/^[a-f0-9]{64}$/.test(c||'');
 let mem=null,memTombs=[];
 const hex=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
 function code(){try{const c=localStorage.getItem(KEY);if(valid(c)){mem=c;return c;}}catch{}if(!valid(mem)){mem=hex(32);try{localStorage.setItem(KEY,mem);}catch{}}return mem;}
 function setCode(c){c=String(c||'').trim().toLowerCase();if(!valid(c))throw Error('รหัสต้องเป็นตัวอักษร 0-9 a-f จำนวน 64 ตัว');mem=c;try{localStorage.setItem(KEY,c);}catch{}return c;}
 const newCode=()=>setCode(hex(32));
 const persistent=()=>{try{return localStorage.getItem(KEY)===mem&&valid(mem);}catch{return false;}};
 function explain(res,body){const m=body?.message||body?.hint||body?.error||'';
  if(res.status===404||/Could not find the function|PGRST202|does not exist/i.test(m))return'ยังไม่ได้ติดตั้ง SQL บนคลาวด์';
  if(/Backup limit/i.test(m))return'เกิน 500 ฟอนต์ต่อรหัส';if(/Invalid/i.test(m))return'คำขอไม่ถูกต้อง';return m||'เกิดข้อผิดพลาด ('+res.status+')';}
 async function rpc(name,args){let res;try{res=await fetch(cfg().url+'/rest/v1/rpc/'+name,{method:'POST',credentials:'omit',cache:'no-store',headers:{apikey:cfg().key,'Content-Type':'application/json'},body:JSON.stringify(args)});}catch{throw Error('ติดต่อคลาวด์ไม่ได้');}
  const text=await res.text();let json=null;try{json=text?JSON.parse(text):null;}catch{}if(!res.ok)throw Error(explain(res,json));return json;}
 const row=f=>({font_id:f.id,name:f.name,console:f.console,width:f.w,height:f.h,bpp:f.bpp,glyph_count:f.glyphs.length,data:f,updated_at:new Date(f.updatedAt||Date.now()).toISOString()});
 const listMeta=async()=>await rpc('fontlab_list',{p_code:code()})||[];
 const get=async ids=>await rpc('fontlab_get',{p_code:code(),p_ids:ids})||[];
 /* the workspace record (font order, deleted starter fonts, deleted fonts) lives in the same vault as one extra row, so every device sees the same list */
 const wsRow=(d,at)=>({font_id:WS_ID,name:'workspace',console:'gba',width:1,height:1,bpp:1,glyph_count:0,data:d,updated_at:new Date(at).toISOString()});
 async function putWs(ws){await rpc('fontlab_put',{p_code:code(),p_fonts:[wsRow(ws.get(),ws.at())]});}
 async function put(fonts){for(let i=0;i<fonts.length;i+=5)await rpc('fontlab_put',{p_code:code(),p_fonts:fonts.slice(i,i+5).map(row)});}
 async function remove(ids){for(let i=0;i<ids.length;i+=50)await rpc('fontlab_delete',{p_code:code(),p_ids:ids.slice(i,i+50)});}
 const tombs=()=>{try{return JSON.parse(localStorage.getItem(DEL)||'[]');}catch{return memTombs;}};
 const setTombs=a=>{memTombs=[...new Set(a)];try{localStorage.setItem(DEL,JSON.stringify(memTombs));}catch{}};
 /* newest wins. local = the user's (non built-in) fonts */
 async function sync(local,{onDownload,onProgress=()=>{},pull=false,ws=null}){
  onProgress('กำลังตรวจรายการบนคลาวด์…');const all=await listMeta(),wsMeta=all.find(m=>m.font_id===WS_ID),meta=all.filter(m=>m.font_id!==WS_ID),cloud=new Map(meta.map(m=>[m.font_id,m])),pending=new Set(tombs()),dead=[...pending].filter(id=>cloud.has(id));
  let wsApplied=false;
  if(ws&&wsMeta&&Date.parse(wsMeta.updated_at)>ws.at()+1000){const r=(await get([WS_ID]))[0];if(r&&r.data){await ws.apply(r.data,Date.parse(wsMeta.updated_at));wsApplied=true;local=local.filter(f=>ws.alive(f.id));}}
  if(!pull){if(dead.length){await remove(dead);dead.forEach(id=>cloud.delete(id));}setTombs([]);} /* pull-only keeps deletions for the next real sync */
  const have=new Map(local.map(f=>[f.id,f])),up=[],down=[];
  if(!pull)for(const f of local){const c=cloud.get(f.id);if(!c||(f.updatedAt||0)>Date.parse(c.updated_at)+1000)up.push(f);}
  for(const [id,c] of cloud){if(pull&&pending.has(id))continue;if(ws&&ws.isDeleted(id,Date.parse(c.updated_at)))continue;const f=have.get(id);if(!f||Date.parse(c.updated_at)>(f.updatedAt||0)+1000)down.push(id);}
  if(up.length){onProgress('กำลังอัปโหลด '+up.length+' ฟอนต์…');await put(up);}
  let n=0;for(let i=0;i<down.length;i+=5){const ids=down.slice(i,i+5);onProgress('กำลังดึงฟอนต์ '+Math.min(i+5,down.length)+'/'+down.length+'…');for(const r of await get(ids)){n++;await onDownload(r.data);}}
  if(ws&&!pull&&!wsApplied&&ws.at()>0&&(!wsMeta||ws.at()>Date.parse(wsMeta.updated_at)+1000)){onProgress('กำลังอัปโหลดลำดับและรายการฟอนต์…');await putWs(ws);}
  return{uploaded:up.length,downloaded:n,wsApplied,total:cloud.size+up.filter(f=>!meta.some(m=>m.font_id===f.id)).length};}
 /* make the cloud (and so every device) match this device: upload everything, remove cloud fonts this device does not have */
 async function mirror(local,{ws,onProgress=()=>{}}){
  onProgress('กำลังตรวจรายการบนคลาวด์…');const all=await listMeta(),have=new Set(local.map(f=>f.id)),extra=all.map(m=>m.font_id).filter(id=>id!==WS_ID&&!have.has(id));
  if(extra.length){onProgress('กำลังลบ '+extra.length+' ฟอนต์ที่เครื่องนี้ไม่มี…');await remove(extra);ws.markDeleted(extra);}
  if(local.length){onProgress('กำลังอัปโหลด '+local.length+' ฟอนต์…');await put(local);}
  ws.touch();await putWs(ws);setTombs([]);return{uploaded:local.length,removed:extra.length};}
 return{code,setCode,newCode,persistent,sync,mirror,pendingDeletes:()=>tombs().length,markDeleted:id=>setTombs([...tombs(),id])};
})();
