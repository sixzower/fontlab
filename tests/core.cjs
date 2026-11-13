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
assert.strictEqual(B.length,4);for(const b of B)Core.normalize(b);
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
console.log('fontlab core ok',n+' roundtrips');
