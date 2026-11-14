const assert=require('assert'),Core=require('../src/core.js');
let n=0;
for(const c of Core.CONSOLES)for(const bpp of Object.keys(c.formats).map(Number)){
 const p=Core.newProject({console:c.id,bpp,name:'t',charset:['ก','ข','เก']});const cap=Core.maxIndex(p);
 p.glyphs.forEach((g,gi)=>{g.p=[...g.p].map((_,i)=>(i*7+gi*3)%(cap+1)).join('');});
 const bank=Core.exportBank(p);assert.strictEqual(bank.length,Core.bytesPerGlyph(p)*3);
 assert.deepStrictEqual(Core.importBank(p,bank),p.glyphs.map(g=>g.p),c.id+' '+bpp+' bank roundtrip');
 const s=Core.renderSheet(p);assert.deepStrictEqual(Core.readSheet(p,s.rgba,s.width,s.height),p.glyphs.map(g=>g.p),c.id+' sheet roundtrip');n+=2;
}
// known byte layouts
const t=new Array(64).fill(0);t[0]=3;t[1]=1;
assert.deepStrictEqual(Core.FORMATS.gb2.pack(t).slice(0,2),[0xC0,0x80]);
assert.deepStrictEqual(Core.FORMATS.nes2.pack(t).filter((_,i)=>i===0||i===8),[0xC0,0x80]);
assert.deepStrictEqual(Core.FORMATS.gba4.pack(t).slice(0,1),[0x13]);
assert.deepStrictEqual(Core.FORMATS.md4.pack(t).slice(0,1),[0x31]);
// legacy conversion + built-ins validate
const B=new Function(require('fs').readFileSync(__dirname+'/../data/fonts.js','utf8')+';return FontLabBuiltins')();
assert.strictEqual(B.length,5);for(const b of B)Core.normalize(b);
// composite lookup uses longest cluster
const f=B[1],cl=f.glyphs.find(g=>g.c.length>1);assert.ok(cl);assert.strictEqual(Core.layoutText(f,cl.c).length,1);
// zip header sane
const z=Core.zip([{name:'a.txt',data:new TextEncoder().encode('hi')}]);assert.strictEqual(z[0],0x50);
// bad data is rejected
assert.throws(()=>Core.normalize({w:8,h:16,glyphs:[{c:'a',p:'0'}]}),/ไม่ตรงกับขนาด/);
// automatic shadow
{const pr=Core.newProject({console:'gba',w:8,h:16,bpp:4,charset:['ก','ั']});const px=Array(128).fill(0);px[5*8+6]=1;px[15*8+3]=1;px[5*8+2]=2;
 const g={c:'ก',a:7,p:px.join('')},r=Core.addShadow(pr,g,'down-right');
 assert.strictEqual(r.p[6*8+7],'2','shadow one step down-right');assert.strictEqual(r.p[5*8+2],'0','old shadow cleared');assert.strictEqual(r.clipped,1,'ink on the bottom row cannot cast inside the box');assert.strictEqual(r.a,8,'advance grows to hold the shadow');
 assert.strictEqual(Core.addShadow(pr,g,'down-right',{clear:false}).p[5*8+2],'2','keep old shadow when asked');
 assert.strictEqual(Core.addShadow(pr,{...g,c:'ั'},'down-right').a,7,'marks keep their advance');
 const keep=Array(128).fill(0);keep[0]=1;keep[9]=3;assert.strictEqual(Core.addShadow(pr,{c:'ก',a:8,p:keep.join('')},'down-right').p[9],'3','never overwrites existing pixels');
 assert.strictEqual(Core.addShadow(pr,g,'down').p[6*8+6],'2');assert.strictEqual(Core.addShadow(pr,g,'down-left').p[6*8+5],'2');}
{const r=Core.removeShadow({c:'ก',a:8,p:'0120'});assert.strictEqual(r.p,'0100');assert.strictEqual(r.removed,1);assert.strictEqual(r.changed,true);assert.strictEqual(Core.removeShadow({c:'ก',a:8,p:'0100'}).changed,false);}
{const pr=Core.newProject({console:'gba',w:8,h:16,bpp:4,charset:['ก','ั']});const px=Array(128).fill(0);px[7*8+3]=1;
 assert.strictEqual(Core.autoSpacing(pr,{c:'ก',a:8,p:px.join('')},1).a,5,'right edge col 3 + 1 + gap 1');assert.strictEqual(Core.autoSpacing(pr,{c:'ก',a:8,p:px.join('')},0).a,4);
 assert.strictEqual(Core.autoSpacing(pr,{c:'ั',a:0,p:px.join('')},1).changed,false,'marks keep their advance');assert.strictEqual(Core.autoSpacing(pr,{c:' ',a:4,p:'0'.repeat(128)},1).changed,false,'empty glyphs keep theirs');
 assert.deepStrictEqual([...Core.widthsBank({glyphs:[{a:7},{a:0},{a:300}]})],[7,0,255]);}
{const pr=Core.newProject({console:'gba',w:8,h:16,bpp:4,charset:['ก','ิ','้','า']});pr.glyphs.forEach(g=>{g.a=8;});
 const it=Core.layoutText(pr,'กิ้า');assert.deepStrictEqual(it.map(i=>i.x),[0,0,0,8],'vowel and tone mark overlay the consonant, next letter follows at +8');}
/* AI pack: tbl, charset, spec */
{const pr=Core.newProject({console:'gb',w:8,h:16,bpp:2,charset:['ก','ข','ั','=']});
 assert.strictEqual(Core.tblText(pr),'00=ก\n01=ข\n02=ั\n03==\n','tbl: one HEX=char line per glyph');
 assert.strictEqual(Core.tblText(pr,{base:0xFE}).split('\n')[0],'00FE=ก','tbl switches to 2-byte codes when codes pass 0xFF');
 const cs=Core.charsetText(pr);assert.ok(cs.includes('ก ข')&&/NOT in this font/.test(cs),'charset lists present and missing Thai letters');
 const spec=Core.aiSpec(pr,{base:0x20});assert.ok(spec.includes('8 x 16')&&spec.includes('0x20')&&spec.includes('0x21')&&spec.includes('| 0x22 |'),'spec has the cell size, base code and the glyph table');
 assert.ok(/Most significant bit/.test(spec)&&/Mark-only glyphs/.test(spec),'spec explains bit order and mark overlay');
 for(const cid of ['nes','snes','md','gba','sms','a2600','psp']){const q=Core.newProject({console:cid,charset:['ก']});assert.ok(Core.aiSpec(q).length>1500&&Core.formatKey(q),'spec for '+cid);}}
/* smart convert */
{const src=Core.newProject({console:'gba',w:16,h:16,bpp:4,charset:['ก']});const g=src.glyphs[0];let p=Array(256).fill('0');for(let y=4;y<12;y++)for(let x=2;x<14;x++){p[y*16+x]='1';}p[12*16+3]='2';g.p=p.join('');g.a=14;
 const sm=Core.smartConvert(src,{console:'gb',w:8,h:16,bpp:2,mode:'scale'});assert.strictEqual(sm.glyphs[0].p.length,128,'scaled to 8x16');assert.ok(/1/.test(sm.glyphs[0].p),'ink survives a 2x downscale');assert.ok(sm.glyphs[0].a<=8&&sm.glyphs[0].a>=6,'advance scaled with the width: '+sm.glyphs[0].a);
 const one=Core.smartConvert(src,{console:'a2600',w:16,h:16,bpp:1,mode:'pad'});assert.ok(!/[23]/.test(one.glyphs[0].p)&&!/2/.test(one.glyphs[0].p),'1 bpp drops the shadow instead of fattening the ink');
 const pad=Core.smartConvert(src,{console:'gb',w:8,h:16,bpp:2,mode:'pad'});assert.strictEqual(pad.glyphs[0].a,8,'pad mode clamps the advance');}
/* auto clusters */
{const pr=Core.newProject({console:'gb',w:8,h:16,bpp:2,charset:['ก','ข','ิ','่']});const px=(rows)=>{const a=Array(128).fill('0');for(const [x,y] of rows)a[y*8+x]='1';return a.join('');};
 pr.glyphs[0].p=px([[1,8],[2,8],[1,9]]);pr.glyphs[1].p=px([[1,4],[1,9]]);pr.glyphs[2].p=px([[2,3],[3,3]]);pr.glyphs[3].p=px([[2,0],[2,1]]);
 const r=Core.makeClusters(pr,{tone:true,vowel:true,both:true});const toks=r.glyphs.map(g=>g.c);
 assert.ok(toks.includes('กิ')&&toks.includes('ก่')&&toks.includes('กิ่'),'clusters made for consonant + vowel/tone');
 assert.ok(r.glyphs.find(g=>g.c==='กิ').p.split('').filter(c=>c==='1').length===5,'cluster = consonant pixels + mark pixels');
 const clash=Core.newProject({console:'gb',w:8,h:16,bpp:2,charset:['ก','ิ']});clash.glyphs[0].p=px([[2,3]]);clash.glyphs[1].p=px([[2,3]]);
 const rc=Core.makeClusters(clash,{tone:false,vowel:true,both:false});assert.strictEqual(rc.glyphs.length,0,'overlapping mark and consonant are skipped');assert.ok(rc.skipped.includes('กิ'),'and reported as skipped');
 const again=Core.makeClusters({...pr,glyphs:pr.glyphs.concat(r.glyphs)},{tone:true,vowel:true,both:true});assert.strictEqual(again.glyphs.length,0,'existing clusters are not made twice');assert.ok(again.dupes.length>0,'and are reported');}
console.log('fontlab core ok',n+' roundtrips');
