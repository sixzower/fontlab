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
console.log('fontlab core ok',n+' roundtrips');
