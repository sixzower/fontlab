/* FontLab cloud: Supabase email sign-in + one table (fontlab_fonts) that stores font data only. */
const FontLabCloud=(()=>{
 const cfg=()=>window.FontLabConfig,KEY='fontlab.session.v1',DEL='fontlab.deleted.v1';
 let session=null;try{session=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
 const save=()=>{try{session?localStorage.setItem(KEY,JSON.stringify(session)):localStorage.removeItem(KEY);}catch{}};
 const listeners=new Set(),emit=()=>listeners.forEach(f=>f());
 function explain(res,body){const m=body?.msg||body?.message||body?.error_description||body?.error||'';
  if(/Invalid login/i.test(m))return'อีเมลหรือรหัสผ่านไม่ถูกต้อง';if(/already registered|already been registered/i.test(m))return'อีเมลนี้สมัครแล้ว ให้เข้าสู่ระบบแทน';
  if(/Password should be/i.test(m))return'รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัวอักษร)';if(/Email not confirmed/i.test(m))return'ยังไม่ได้ยืนยันอีเมล ตรวจกล่องจดหมายก่อน';
  if(/relation .* does not exist|fontlab_fonts/i.test(m)||res.status===404)return'ยังไม่ได้ติดตั้งตาราง fontlab_fonts — คัดลอก SQL ด้านล่างไปรันใน Supabase SQL Editor ก่อน';
  return m||'เกิดข้อผิดพลาด ('+res.status+')';}
 async function call(path,{method='GET',body,headers={},auth=true}={}){
  const h={apikey:cfg().key,'Content-Type':'application/json',...headers};if(auth&&session)h.Authorization='Bearer '+session.access_token;
  let res;try{res=await fetch(cfg().url+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});}catch{throw Error('ติดต่อ Supabase ไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่');}
  const text=await res.text();let json=null;try{json=text?JSON.parse(text):null;}catch{}
  if(res.status===401&&auth&&session?.refresh_token&&!call.retry){call.retry=true;try{await refresh();return await call(path,{method,body,headers,auth});}finally{call.retry=false;}}
  if(!res.ok)throw Error(explain(res,json));return json;}
 function adopt(r){session={access_token:r.access_token,refresh_token:r.refresh_token,expires_at:Date.now()+(r.expires_in||3600)*1000,user:{id:r.user.id,email:r.user.email}};save();emit();}
 async function refresh(){const r=await call('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token},auth:false}).catch(e=>{session=null;save();emit();throw e;});adopt(r);}
 async function signIn(email,password){adopt(await call('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},auth:false}));}
 async function signUp(email,password){const r=await call('/auth/v1/signup',{method:'POST',body:{email,password},auth:false});if(r?.access_token){adopt(r);return'signed-in';}return'confirm';}
 function signOut(){session=null;save();emit();}
 const rest=(q,opt)=>call('/rest/v1/fontlab_fonts'+q,opt);
 const row=f=>({user_id:session.user.id,font_id:f.id,name:f.name,console:f.console,width:f.w,height:f.h,bpp:f.bpp,glyph_count:f.glyphs.length,data:f,updated_at:new Date(f.updatedAt||Date.now()).toISOString()});
 async function listMeta(){return await rest('?select=font_id,name,console,glyph_count,updated_at&order=updated_at.desc&limit=1000')||[];}
 async function get(id){const r=await rest('?select=data&font_id=eq.'+encodeURIComponent(id));return r?.[0]?.data;}
 async function put(fonts){for(let i=0;i<fonts.length;i+=5)await rest('?on_conflict=user_id,font_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:fonts.slice(i,i+5).map(row)});}
 async function remove(id){await rest('?font_id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});}
 const tombs=()=>{try{return JSON.parse(localStorage.getItem(DEL)||'[]');}catch{return[];}};
 const setTombs=a=>{try{localStorage.setItem(DEL,JSON.stringify([...new Set(a)]));}catch{}};
 /* newest wins; deletions made while signed out are replayed once. local = non-builtin fonts */
 async function sync(local,{onDownload,onProgress=()=>{}}){
  if(!session)throw Error('ยังไม่ได้เข้าสู่ระบบ');
  onProgress('กำลังตรวจรายการบนคลาวด์…');const meta=await listMeta(),cloud=new Map(meta.map(m=>[m.font_id,m])),dead=tombs();
  for(const id of dead)if(cloud.has(id)){await remove(id);cloud.delete(id);}setTombs([]);
  const up=[],down=[];
  for(const f of local){const c=cloud.get(f.id);if(!c||(f.updatedAt||0)>Date.parse(c.updated_at)+1000)up.push(f);}
  const have=new Map(local.map(f=>[f.id,f]));
  for(const [id,c] of cloud){const f=have.get(id);if(!f||Date.parse(c.updated_at)>(f.updatedAt||0)+1000)down.push(id);}
  if(up.length){onProgress('กำลังอัปโหลด '+up.length+' ฟอนต์…');await put(up);}
  let n=0;for(const id of down){onProgress('กำลังดึงฟอนต์ '+(++n)+'/'+down.length+'…');const d=await get(id);if(d)await onDownload(d);}
  return{uploaded:up.length,downloaded:down.length,total:cloud.size+up.filter(f=>!cloud.has(f.id)).length};}
 return{signIn,signUp,signOut,sync,put,remove,listMeta,markDeleted:id=>setTombs([...tombs(),id]),
  get user(){return session?.user||null;},onChange:f=>listeners.add(f)};
})();
