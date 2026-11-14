/* Browser test (Supabase mocked). Usage: node tests/browser.cjs */
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
const server=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404).end();return;}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{
 await new Promise(r=>server.listen(0,r));const base='http://127.0.0.1:'+server.address().port+'/index.html';
 const browser=await chromium.launch(),errors=[];
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,acceptDownloads:true,serviceWorkers:'block'}),page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 /* mock Supabase: backup vaults (RPC) in memory, keyed by backup code */
 const vaults=new Map();let calls=[];
 await ctx.addInitScript(()=>{window.FontLabSyncDelay=50;});
 const handler=async route=>{const req=route.request(),u=new URL(req.url()),cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};
  if(req.method()==='OPTIONS')return route.fulfill({status:204,headers:cors});
  const json=(b,s=200)=>route.fulfill({status:s,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(b)});
  const m=u.pathname.match(/^\/rest\/v1\/rpc\/(fontlab_\w+)$/);if(!m)return json({message:'nope'},404);
  const body=JSON.parse(req.postData()||'{}'),v=vaults.get(body.p_code)||new Map();calls.push(m[1]);
  if(m[1]==='fontlab_list')return json([...v.values()].map(({font_id,name,console,glyph_count,updated_at})=>({font_id,name,console,glyph_count,updated_at})));
  if(m[1]==='fontlab_get')return json([...v.values()].filter(r=>body.p_ids.includes(r.font_id)).map(r=>({font_id:r.font_id,data:r.data})));
  if(m[1]==='fontlab_put'){for(const r of body.p_fonts)v.set(r.font_id,r);vaults.set(body.p_code,v);return route.fulfill({status:204,headers:cors,body:''});}
  if(m[1]==='fontlab_delete'){for(const id of body.p_ids)v.delete(id);return route.fulfill({status:204,headers:cors,body:''});}
  json({},404);};await ctx.route('https://*.supabase.co/**',handler);
 await page.goto(base);
 await page.waitForSelector('.card');
 assert.strictEqual(await page.locator('.card').count(),5,'5 built-in fonts');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/library.png':undefined,...(process.env.SHOTS?{}:{type:'png'})});
 /* a stale page loads the newer version by itself (no hard refresh), and does not loop */
 const stale=await ctx.newPage();await stale.route('**/version.json*',r=>r.fulfill({status:200,contentType:'application/json',body:'{"version":"99.0.0"}'}));
 await stale.goto(base);await stale.waitForURL(/[?&]v=99\.0\.0/,{timeout:8000});await stale.waitForSelector('.card');await stale.waitForTimeout(500);assert.ok(/[?&]v=99\.0\.0/.test(stale.url()),'moved to the new version');await stale.close();
 const wide=await ctx.newPage();await wide.setViewportSize({width:1900,height:900});await wide.goto(base);await wide.waitForSelector('.card');
 assert.ok(await wide.evaluate(()=>document.querySelector('.page.on').getBoundingClientRect().width)>1900-260,'page fills the screen next to the sidebar');await wide.close();
 /* tooltips for icon-only buttons */
 await page.hover('#page-library [data-act=new]');await page.waitForFunction(()=>/สร้างฟอนต์ใหม่/.test(document.querySelector('.tip.on')?.textContent||''),null,{timeout:3000});
 await page.mouse.move(5,5);await page.waitForFunction(()=>!document.querySelector('.tip.on'),null,{timeout:3000});
 /* theme toggle + iOS menu */
 const bg=()=>page.evaluate(()=>getComputedStyle(document.body).backgroundColor);
 assert.strictEqual(await bg(),'rgb(255, 255, 255)','light mode is white');
 await page.click('#page-library [data-act=theme]');assert.strictEqual(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');assert.strictEqual(await bg(),'rgb(0, 0, 0)');
 await page.reload();await page.waitForSelector('.card');assert.strictEqual(await bg(),'rgb(0, 0, 0)','theme remembered');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/dark.png':undefined});
 await page.click('#page-library [data-act=theme]');assert.strictEqual(await bg(),'rgb(255, 255, 255)');
 await page.click('#page-library [data-act=new]');await page.click('.sheet .sel >> nth=0');assert.ok(await page.locator('.menu [role=option]').count()>=10,'menu lists consoles');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/menu.png':undefined});
 await page.click('.menu [role=option]:has-text("Super Famicom")');assert.strictEqual(await page.locator('#nf-con').inputValue(),'snes');assert.ok(/Super Famicom/.test(await page.locator('.sheet .sel >> nth=0').innerText()));
 assert.deepStrictEqual(await page.locator('#nf-bpp option').allInnerTexts(),['2 บิต','4 บิต'],'dependent select refreshed');
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');assert.strictEqual(await page.locator('.sheet').count(),0);
 /* console starters */
 await page.click('.tab[data-tab=consoles]');assert.strictEqual(await page.locator('[data-console]').count(),25);assert.strictEqual(await page.locator('.cgroup').count(),4);
 await page.click('[data-console=gb]');
 const [dl]=await Promise.all([page.waitForEvent('download'),page.click('[data-act=zip]')]);assert.ok(/gb-starter\.zip$/.test(dl.suggestedFilename()));
 const zbuf=fs.readFileSync(await dl.path());assert.strictEqual(zbuf.readUInt32LE(0),0x04034b50);
 assert.ok(/แถว 0–5/.test(await page.locator('.sheet').innerText()),'zone rules shown in console sheet');
 await page.click('[data-act=start-blank]');await page.waitForSelector('#edit');
 /* draw + undo */
 const box=await page.locator('#edit').boundingBox();
 await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();await page.mouse.move(box.x+box.width-10,box.y+box.height-10);await page.mouse.up();
 const ink=()=>page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs[FontLabApp.S.idx].p.replace(/0/g,'').length);
 const drawn=await ink();assert.ok(drawn>3,'stroke drew pixels '+drawn);
 await page.click('#u-undo');assert.strictEqual(await ink(),0,'undo clears stroke');await page.click('#u-redo');assert.strictEqual(await ink(),drawn);
 await page.click('[data-tool=fill]');await page.click('[data-color="2"]');{await page.waitForTimeout(600);const bx=await page.locator('#edit').boundingBox();await page.mouse.click(bx.x+bx.width-5,bx.y+bx.height*0.8);};assert.ok(await ink()>drawn,'fill works');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/studio.png':undefined});
 /* drawing guide: ink outside the allowed rows is flagged */
 await page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);S.idx=f.glyphs.findIndex(g=>g.c==='ก');});await page.click('#s-glyphs .gl >> nth=1');
 await page.click('[data-tool=pencil]');await page.click('[data-color="1"]');
 await page.locator('#edit').evaluate(e=>e.scrollIntoView({block:'center'}));const b2=await page.locator('#edit').boundingBox();await page.mouse.click(b2.x+10,b2.y+8);assert.ok(/เกินเขต/.test(await page.locator('#s-check').innerText()),'row 0 flagged for a consonant');
 await page.click('[data-act=check-all]');assert.ok(await page.locator('.sheet [data-jump]').count()>=1,'check-all lists the glyph');await page.keyboard.press('Escape');
 /* automatic shadow: one undo step for the whole font */
 await page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);f.glyphs[2].p=f.glyphs[2].p.replace(/^0{20}/,'0'.repeat(9)+'1'+'0'.repeat(10));});
 await page.locator('[data-act=shadow]').scrollIntoViewIfNeeded();await page.click('[data-act=shadow]');await page.click('#sh-scope [data-s=all]');
 assert.ok(/จะเปลี่ยน \d+ จาก/.test(await page.locator('#sh-info').innerText()),'preview counts shown');
 const shadows=()=>page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);return f.glyphs.filter(g=>g.p.includes('2')).length;});
 const before=await shadows();await page.click('#bar-done');const after=await shadows();assert.ok(after>before,'shadow pixels were added ('+before+' -> '+after+')');
 await page.click('#u-undo');assert.strictEqual(await shadows(),before,'one undo removes every shadow');await page.click('#u-redo');assert.strictEqual(await shadows(),after,'redo restores them');
 await page.click('[data-act=shadow]');await page.click('#sh-scope [data-s=all]');assert.ok(/ลบเงาทั้งหมด \(\d+ อักษร/.test(await page.locator('#sh-rm').innerText()),'remove button counts shadows');
 await page.click('#sh-rm');assert.strictEqual(await shadows(),0,'all shadows removed in one step');await page.click('#u-undo');assert.strictEqual(await shadows(),after,'undo brings them back');
 assert.ok(await page.evaluate(()=>!!document.querySelector('.tools #u-undo')&&!document.querySelector('.nav #u-undo')),'undo/redo live in the tools row, not the top bar');
 /* iOS sheet chrome: header bar, swipe-down to dismiss, back button, more menu */
 await page.click('.tab[data-tab=library]');await page.click('#page-library [data-act=new]');
 assert.strictEqual((await page.locator('.sheet .bar-title').innerText()).trim(),'ฟอนต์ใหม่');assert.strictEqual((await page.locator('#bar-done').innerText()).trim(),'สร้าง');assert.ok(await page.locator('#bar-cancel').isVisible(),'cancel is shown when there is a primary action');
 await page.waitForTimeout(500);const hb=await page.locator('.sheet-head').boundingBox();await page.mouse.move(hb.x+hb.width/2,hb.y+8);await page.mouse.down();await page.mouse.move(hb.x+hb.width/2,hb.y+260,{steps:6});await page.mouse.up();
 await page.waitForFunction(()=>!document.querySelector('.sheet'),null,{timeout:3000});
 await page.locator('.card:not(:has-text("ตั้งต้น"))').first().click();await page.waitForSelector('#edit');
 assert.ok(await page.locator('#page-studio .nav .back').isVisible(),'studio has a back button');assert.strictEqual(await page.locator('#page-studio [data-act=more]').count(),0,'the ⋯ menu is gone');await page.click('#page-studio [data-act=font-export]');assert.ok(/ส่งออก/.test(await page.locator('.sheet').innerText()),'export button opens the export sheet');await page.keyboard.press('Escape');await page.click('#page-studio [data-act=font-settings]');assert.ok(await page.locator('.sheet').count(),'settings button opens the font settings');await page.keyboard.press('Escape');
 /* zone labels toggle */
 await page.locator('[data-act=labels]').scrollIntoViewIfNeeded();await page.click('[data-act=labels]');assert.strictEqual(await page.locator('[data-act=labels]').getAttribute('aria-pressed'),'true');assert.strictEqual(await page.locator('[data-act=guides]').getAttribute('aria-pressed'),'true','labels switch the guides on');
 assert.ok(await page.evaluate(()=>{const t=['grid','guides','labels'].map(a=>document.querySelector('[data-act='+a+']').getBoundingClientRect().top);return t.every(v=>Math.abs(v-t[0])<4);}),'grid / guides / labels stay together as one group');
 await page.click('[data-act=labels]');assert.strictEqual(await page.locator('[data-act=labels]').getAttribute('aria-pressed'),'false');
 /* explicit save + auto spacing */
 await page.locator('#u-save').scrollIntoViewIfNeeded();await page.click('#u-save');await page.waitForFunction(()=>/บันทึกแล้ว ✓/.test(document.querySelector('.toast')?.textContent||''),null,{timeout:8000});
 await page.waitForFunction(()=>/✓ บันทึกในเครื่องแล้ว/.test(document.querySelector('#s-saved')?.textContent||''),null,{timeout:8000});
 await page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur),g=f.glyphs.find(x=>x.c==='ก');g.p='0'.repeat(f.w*6)+'0111'+'0'.repeat(f.w-4)+'0'.repeat(f.w*(f.h-7));g.a=f.w;});
 const adv=()=>page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);return f.glyphs.find(x=>x.c==='ก').a;});
 await page.click('[data-act=spacing]');await page.click('#sp-scope [data-s=all]');await page.click('#bar-done');assert.ok(await adv()<8,'auto spacing tightened the advance');await page.click('#u-undo');assert.strictEqual(await adv(),8,'one undo restores spacing');
 /* starter fonts are ordinary: editable, deletable, restorable; a copy is made through the card menu */
 await page.click('.tab[data-tab=library]');await page.click('[data-open=builtin-sword-shield-th]');await page.waitForSelector('#edit');
 assert.strictEqual(await page.locator('[data-act=dup-edit]').count(),0,'no read-only banner');assert.ok(await page.locator('#u-save').count(),'save button on a starter font');
 await page.click('.tab[data-tab=library]');await page.locator('[data-more=builtin-seaglass-th]').click();await page.click('[data-act=del]');await page.click('[data-act=yes]');
 await page.waitForFunction(()=>document.querySelectorAll('.card').length===5,null,{timeout:5000});assert.strictEqual(await page.locator('[data-act=restore-seeds]').count(),0,'no restore-starters button');
 await page.locator('[data-more=builtin-sword-shield-th]').click();await page.click('[data-act=dup]');await page.waitForFunction(()=>FontLabApp.S.fonts.size===6);
 /* persistence */
 await page.waitForTimeout(700);await page.reload();await page.click('.tab[data-tab=library]');await page.waitForSelector('.card');assert.strictEqual(await page.locator('.card').count(),6,'user fonts persisted');
 /* cloud: uploads only when saving (auto upload is an opt-in switch); no login, no cloud tab */
 assert.strictEqual(await page.locator('.tab').count(),4,'library, studio, consoles, settings');assert.strictEqual(await page.locator('.tab[data-tab=cloud]').count(),0,'no cloud tab');assert.strictEqual(await page.locator('[data-act=sync],#c-form').count(),0,'no login form');
 await page.waitForFunction(()=>document.querySelector('.cdot.dirty'),null,{timeout:8000});
 const code=await page.evaluate(()=>localStorage.getItem('fontlab.code.v2'));assert.ok(/^[a-f0-9]{64}$/.test(code),'backup code created automatically');
 const vault=()=>vaults.get(code),puts=()=>calls.filter(c=>c==='fontlab_put').length;
 await page.click('.tab[data-tab=library]');await page.locator('.card:not(:has-text("ตั้งต้น"))').first().click();await page.waitForSelector('#edit');
 const b3=await page.locator('#edit').boundingBox(),p0=puts();await page.mouse.click(b3.x+b3.width/2,b3.y+b3.height/2);await page.waitForTimeout(700);
 assert.strictEqual(puts(),p0,'an edit alone does not upload');assert.ok(await page.locator('.cdot.dirty').count(),'dot says: not on the cloud yet');
 await page.click('#u-save');await page.waitForFunction(()=>document.querySelector('.cdot.ok'),null,{timeout:8000});
 assert.strictEqual(vault().size,2,'pressing save uploads the 2 user fonts: '+calls.join(','));
 assert.ok(![...vault().values()].some(r=>r.font_id.startsWith('builtin')),'untouched starter fonts are not uploaded');
 const row=[...vault().values()][0];assert.ok(row.data.glyphs&&row.width&&row.glyph_count);
 /* status sheet shows the code, a second device can use it */
 await page.click('#page-studio [data-act=cloud]');assert.ok(/••••/.test(await page.locator('#cc-code').innerText()),'code masked');assert.strictEqual(await page.locator('#cc-auto').getAttribute('aria-checked'),'false','auto upload is off by default');
 await page.click('#cc-show');assert.strictEqual(await page.locator('#cc-code').innerText(),code);await page.keyboard.press('Escape');
 const ctx2=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await ctx2.route('https://*.supabase.co/**',handler);const page2=await ctx2.newPage();page2.on('pageerror',e=>errors.push(e.message));await page2.goto(base);await page2.waitForSelector('.card');
 assert.notStrictEqual(await page2.evaluate(()=>localStorage.getItem('fontlab.code.v2')),code);
 await page2.click('#page-library [data-act=cloud]');await page2.fill('#cc-in',code);await page2.click('#cc-use');
 await page2.waitForFunction(()=>[...document.querySelectorAll('.card')].filter(c=>!/ตั้งต้น/.test(c.innerText)).length===2,null,{timeout:8000});
 assert.strictEqual(await page2.locator('.card').count(),7,'fonts arrived on the other device');await ctx2.close();
 /* delete -> the dot turns pending, the cloud copy goes on the next sync */
 await page.click('.tab[data-tab=library]');await page.locator('.card:not(:has-text("ตั้งต้น")) .more').first().click();await page.click('[data-act=del]');await page.click('[data-act=yes]');
 await page.waitForFunction(()=>document.querySelector('.cdot.dirty'),null,{timeout:5000});assert.strictEqual(vault().size,2,'not removed before syncing');
 await page.click('#page-library [data-act=cloud]');await page.click('#cc-sync');await page.waitForFunction(()=>document.querySelector('.cdot.ok'),null,{timeout:8000});await page.waitForTimeout(300);
 assert.strictEqual(vault().size,1,'deleted font removed from cloud on sync');
 /* opt-in auto upload */
 await page.click('#cc-auto');assert.strictEqual(await page.locator('#cc-auto').getAttribute('aria-checked'),'true');await page.keyboard.press('Escape');
 await page.locator('.card:not(:has-text("ตั้งต้น"))').first().click();await page.waitForSelector('#edit');
 const t1=Math.max(...[...vault().values()].map(r=>Date.parse(r.updated_at)));await page.waitForTimeout(1100);
 const b4=await page.locator('#edit').boundingBox();await page.mouse.click(b4.x+b4.width/2,b4.y+b4.height/3);
 await page.waitForFunction(()=>document.querySelector('.cdot.ok'),null,{timeout:8000});await page.waitForTimeout(300);
 assert.ok(Math.max(...[...vault().values()].map(r=>Date.parse(r.updated_at)))>t1,'with auto upload on, an edit reaches the cloud by itself');
 await page.click('#page-studio [data-act=cloud]');await page.click('#cc-auto');await page.keyboard.press('Escape');
 await page.click('.tab[data-tab=library]');await page.click('#page-library [data-act=cloud]');await page.fill('#cc-in','xyz');await page.click('#cc-use');assert.ok(await page.locator('.toast.on').count(),'bad code rejected');await page.keyboard.press('Escape');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/cloud.png':undefined});
 await page.click('.tab[data-tab=library]');await page.locator('.card:not(:has-text("ตั้งต้น"))').first().click();await page.waitForSelector('#edit');
 /* glyph management: rename, move, delete, all undoable */
 await page.locator('#s-glyphs .gl >> nth=1').click();const names=()=>page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);return f.glyphs.map(g=>g.c);});const n0=(await names()).length,c1=(await names())[1];
 await page.locator('[data-act=manage]').scrollIntoViewIfNeeded();await page.click('[data-act=manage]');await page.click('[data-act=g-ren]');await page.fill('#rn','Ω');await page.click('#bar-done');
 assert.strictEqual((await names())[1],'Ω','glyph renamed');await page.click('#u-undo');assert.strictEqual((await names())[1],c1,'undo restores the name');
 await page.click('[data-act=manage]');await page.click('[data-act=g-up]');assert.strictEqual((await names())[0],c1,'moved earlier');await page.click('#u-undo');assert.strictEqual((await names())[1],c1,'undo restores the order');
 await page.click('[data-act=manage]');await page.click('[data-act=g-del]');await page.click('[data-act=yes]');assert.strictEqual((await names()).length,n0-1,'glyph deleted');await page.click('#u-undo');assert.strictEqual((await names()).length,n0,'undo restores the glyph');
 /* keyboard drawing */
 await page.locator('#edit').scrollIntoViewIfNeeded();await page.focus('#edit');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowDown');await page.keyboard.press('Space');
 const px=await page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur),g=f.glyphs[S.idx];return g.p[S.ky*f.w+S.kx];});assert.notStrictEqual(px,'0','keyboard drawing painted the cursor cell');
 /* game text box preview */
 await page.locator('#s-gamebox').scrollIntoViewIfNeeded();await page.click('#s-gamebox');assert.ok(/กรอบกว้าง \d+ px/.test(await page.locator('#s-gamebox-note').innerText()),'game box preview shows its size');await page.click('#s-gamebox');
 /* font file import (Prompt, OFL, from the repo) */
 await page.click('.tab[data-tab=library]');await page.click('#page-library [data-act=new]');await page.click('[data-kind=file]');
 await page.setInputFiles('#nf-file-in',require('path').join(root,'fonts/Prompt-Regular.ttf'));await page.waitForFunction(()=>/Prompt/.test(document.querySelector('#nf-fname')?.textContent||''),null,{timeout:8000});
 await page.click('#bar-done');await page.waitForSelector('#edit');
 const rast=await page.evaluate(()=>{const S=FontLabApp.S,f=S.fonts.get(S.cur);const g=f.glyphs.find(x=>x.c==='ก'),h=f.glyphs.find(x=>x.c==='ิ');return [g&&g.p.replace(/0/g,'').length,h&&h.p.replace(/0/g,'').length];});assert.ok(rast[0]>5,'consonant rasterised from the font file');assert.ok(rast[1]>0,'vowel mark rasterised separately');
 /* big font: the glyph list renders in chunks */
 await page.locator('[data-act=add-glyph]').scrollIntoViewIfNeeded();await page.click('[data-act=add-glyph]');await page.fill('#ag',Array.from({length:300},(_,i)=>String.fromCharCode(0x4E00+i)).join(''));await page.click('#bar-done');
 /* quick A–Z / digits / punctuation with ready-made pixels */
 await page.evaluate(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur);f.glyphs=f.glyphs.filter(g=>g.c!=='A'&&g.c!=='z');});
 await page.locator('[data-act=add-glyph]').scrollIntoViewIfNeeded();await page.click('[data-act=add-glyph]');await page.click('[data-set^=ABC]');await page.click('[data-set^=abc]');
 assert.ok((await page.inputValue('#ag')).includes('Za'),'chips fill the input');await page.click('#bar-done');
 assert.ok(await page.evaluate(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur),a=f.glyphs.find(g=>g.c==='A'),z=f.glyphs.find(g=>g.c==='z');return a&&z&&/[1-3]/.test(a.p)&&/[1-3]/.test(z.p)&&a.p.length===f.w*f.h;}),'A and z added with pixels');
 /* auto-fill Latin to match the font: a shadow font (Seaglass) gets shadows */
 await page.evaluate(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur);f.glyphs=f.glyphs.filter(g=>g.c!=='B'&&g.c!=='7');});
 await page.locator('[data-act=add-glyph]').scrollIntoViewIfNeeded();await page.click('[data-act=add-glyph]');await page.click('#ag-auto');
 assert.ok(await page.evaluate(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur),b=f.glyphs.find(g=>g.c==='B'),d=f.glyphs.find(g=>g.c==='7');return b&&d&&/1/.test(b.p)&&/1/.test(d.p);}),'auto-fill adds the missing letters and digits');
 await page.click('.tab[data-tab=library]');await page.click('[data-open=builtin-seaglass-th-complete]');await page.waitForSelector('#edit');
 await page.locator('[data-act=add-glyph]').scrollIntoViewIfNeeded();await page.click('[data-act=add-glyph]');await page.click('#ag-auto');
 assert.ok(await page.evaluate(()=>{const f=FontLabApp.S.fonts.get('builtin-seaglass-th-complete'),b=f.glyphs.find(g=>g.c==='B');return b&&/1/.test(b.p)&&/2/.test(b.p)&&b.a<=f.w;}),'auto-fill gives shadowed letters on a shadow font');
 /* studio toolbar: every edit button lives in the one toolbar above the canvas, the clear button sits right after the eraser */
 {assert.strictEqual(await page.locator('.opsrow').count(),0,'no second toolbar below the colours');
  const order=await page.evaluate(()=>[...document.querySelectorAll('.tools button[data-tool],.tools button[data-op]')].map(b=>b.dataset.tool||b.dataset.op).join(','));
  assert.ok(/eraser,clear,fill/.test(order),'clear button next to the eraser: '+order);assert.ok(/shift-l,shift-r,shift-u,shift-d,flip-h,flip-v,copy,paste/.test(order),'move / flip / copy / paste are in the same toolbar');
  assert.strictEqual(await page.evaluate(()=>document.querySelector('.tools [data-op=clear] svg')?.outerHTML.includes('M5 5l14')),false,'clear icon is no longer the plain X');}
 /* studio keyboard shortcuts */
 {const G=()=>page.evaluate(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur);return{i:FontLabApp.S.idx,p:f.glyphs[FontLabApp.S.idx].p,tool:FontLabApp.S.tool,color:FontLabApp.S.color,w:f.w};});
  await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  await page.locator('#s-glyphs .gl[aria-label="อักษร ก"]').click();await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  const g0=await G();assert.ok(/[1-3]/.test(g0.p),'ก has ink');
  await page.keyboard.press('ArrowRight');const g1=await G();assert.notStrictEqual(g1.p,g0.p,'arrow key shifts the glyph');
  await page.keyboard.press('Control+z');assert.strictEqual((await G()).p,g0.p,'Ctrl+Z undoes the shift');
  await page.keyboard.press('Control+c');await page.keyboard.press('Control+x');assert.ok(!/[1-3]/.test((await G()).p),'Ctrl+X cuts');
  await page.keyboard.press('Control+v');assert.strictEqual((await G()).p,g0.p,'Ctrl+V pastes it back');
  await page.keyboard.press('e');assert.strictEqual((await G()).tool,'eraser','E = eraser');await page.keyboard.press('p');assert.strictEqual((await G()).tool,'pencil','P = pencil');
  await page.keyboard.press('2');assert.strictEqual((await G()).color,1,'2 = second colour');
  await page.keyboard.press('h');assert.notStrictEqual((await G()).p,g0.p,'H flips');await page.keyboard.press('h');assert.strictEqual((await G()).p,g0.p,'H twice restores');
  await page.keyboard.press('ArrowRight');assert.notStrictEqual((await G()).p,g0.p);await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'ผ',code:'KeyZ',ctrlKey:true,bubbles:true,cancelable:true})));assert.strictEqual((await G()).p,g0.p,'Ctrl+Z works on a Thai keyboard layout (key = ผ, code = KeyZ)');
  await page.evaluate(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'ะ',code:'KeyE',bubbles:true,cancelable:true})));assert.strictEqual((await G()).tool,'eraser','E works on a Thai layout');await page.keyboard.press('p');
  
  await page.keyboard.press('PageDown');assert.strictEqual((await G()).i,g0.i+1,'PageDown = next glyph');await page.keyboard.press('PageUp');assert.strictEqual((await G()).i,g0.i,'PageUp = previous glyph');
  assert.ok(/\(P\)/.test(await page.locator('[data-tool=pencil]').evaluate(b=>b.title||b.dataset.tip)),'tooltips show the key');assert.ok(/Ctrl\+Z/.test(await page.locator('#u-undo').evaluate(b=>b.title||b.dataset.tip)),'undo tooltip shows Ctrl+Z');
  await page.click('[data-act=shortcuts]');assert.ok(/ปุ่มลัดในสตูดิโอ/.test(await page.locator('.sheet').innerText()),'keyboard button opens the shortcuts');await page.keyboard.press('Escape');
  await page.keyboard.press('Shift+?');assert.ok(/ปุ่มลัดในสตูดิโอ/.test(await page.locator('.sheet').innerText()),'? lists the shortcuts');await page.keyboard.press('Escape');}
 /* studio: Ctrl+click several glyphs, delete them with one confirmation */
 {const n0=await page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.length);
  await page.locator('#s-glyphs .gl[aria-label="อักษร A"]').click();
  await page.locator('#s-glyphs .gl[aria-label="อักษร B"]').click({modifiers:['Control']});await page.locator('#s-glyphs .gl[aria-label="อักษร C"]').click({modifiers:['Control']});
  assert.strictEqual(await page.locator('#s-glyphs .gl.sel').count(),3,'three glyphs ticked');assert.ok(/3/.test(await page.locator('#g-seln').innerText()),'selection bar counts them');
  await page.keyboard.press('Escape');assert.strictEqual(await page.locator('#s-glyphs .gl.sel').count(),0,'Escape clears');
  await page.locator('#s-glyphs .gl[aria-label="อักษร A"]').click();await page.locator('#s-glyphs .gl[aria-label="อักษร B"]').click({modifiers:['Control']});await page.locator('#s-glyphs .gl[aria-label="อักษร C"]').click({modifiers:['Control']});
  await page.click('[data-act=gsel-del]');await page.click('[data-act=yes]');
  await page.waitForFunction(n=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.length===n-3,n0,{timeout:5000});
  assert.ok(await page.evaluate(()=>!FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.some(g=>'ABC'.includes(g.c))),'A B C deleted');}
 /* copy several glyphs and paste them into another font; duplicates are reported */
 {const cnt=id=>page.evaluate(i=>FontLabApp.S.fonts.get(i).glyphs.length,id);
  await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  await page.locator('#s-glyphs .gl[aria-label="อักษร D"]').click();await page.locator('#s-glyphs .gl[aria-label="อักษร E"]').click({modifiers:['Control']});
  await page.click('[data-act=gsel-copy]');assert.ok(await page.evaluate(()=>FontLabApp.S.gclip&&FontLabApp.S.gclip.glyphs.map(g=>g.c).join('')==='DE'),'D and E copied');
  await page.click('.tab[data-tab=library]');await page.click('[data-open=builtin-quetzal-classic]');await page.waitForSelector('#edit');await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  const n0=await cnt('builtin-quetzal-classic');
  await page.keyboard.press('Control+v');assert.strictEqual(await cnt('builtin-quetzal-classic'),n0+2,'pasted D and E into the other font');
  assert.ok(/ขนาดช่องต่างกัน/.test(await page.locator('.sheet').innerText()),'size difference is reported');await page.click('.sheet [data-close]');
  await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  await page.keyboard.press('Control+v');assert.strictEqual(await cnt('builtin-quetzal-classic'),n0+2,'nothing added the second time');
  assert.ok(/มีอักษรซ้ำ 2 ตัว/.test(await page.locator('.sheet').innerText()),'duplicate message shown');await page.click('.sheet [data-close]');}
 /* sidebar: consoles above recents */
 {const h=await page.evaluate(()=>[...document.querySelectorAll('#tabs .side-sec h3')].map(x=>x.textContent));assert.ok(h.indexOf('เครื่อง')>=0&&h.indexOf('เครื่อง')<h.indexOf('ล่าสุด'),'เครื่อง comes before ล่าสุด in the sidebar: '+h.join(','));}
 /* studio: drag a glyph thumbnail onto another to move it; Shift+click sends the selected glyph there */
 {const order=()=>page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.map(g=>g.c).join(''));
  await page.evaluate(()=>{document.activeElement&&document.activeElement.blur();});
  const tail=(await order()).slice(-2);assert.strictEqual(tail,'DE','glyphs D and E are the last two (pasted above)');
  await page.evaluate(()=>{const A=document.querySelector('#s-glyphs .gl[aria-label="อักษร E"]'),B=document.querySelector('#s-glyphs .gl[aria-label="อักษร D"]'),dt=new DataTransfer(),ev=(t,el)=>el.dispatchEvent(new DragEvent(t,{bubbles:true,cancelable:true,dataTransfer:dt}));ev('dragstart',A);ev('dragover',B);ev('drop',B);ev('dragend',A);});
  assert.strictEqual((await order()).slice(-2),'ED','dragging E onto D moves E before D');
  await page.click('#u-undo');assert.strictEqual((await order()).slice(-2),'DE','the move is undoable');
  await page.locator('#s-glyphs .gl[aria-label="อักษร E"]').click();await page.locator('#s-glyphs .gl[aria-label="อักษร D"]').click({modifiers:['Shift']});
  assert.strictEqual((await order()).slice(-2),'ED','Shift+click sends the selected glyph to the clicked position');
  await page.click('#u-undo');assert.strictEqual((await order()).slice(-2),'DE');}
 /* export for AI, .tbl, clusters, convert to another console (current studio font: Quetzal, 8x16) */
 {const fs2=require('fs');
  await page.click('#page-studio [data-act=font-export]');await page.fill('#ex-base','20');
  {const [dl]=await Promise.all([page.waitForEvent('download'),page.click('[data-act=tbl]')]);assert.ok(/\.tbl$/.test(dl.suggestedFilename()),'tbl file name');const txt=fs2.readFileSync(await dl.path(),'utf8');assert.ok(/^20=/.test(txt),'tbl starts at the chosen base code 0x20: '+txt.slice(0,12));}
  {const [dl]=await Promise.all([page.waitForEvent('download'),page.click('[data-act=ai]')]);assert.ok(/-ai-pack\.zip$/.test(dl.suggestedFilename()),'AI pack is a zip');const buf=fs2.readFileSync(await dl.path()).toString('latin1');for(const need of ['SPEC.md','.tbl','charset.txt','-sheet.png','.bin','-widths.bin','.fontlab.json','-README.txt'])assert.ok(buf.includes(need),'AI pack contains '+need);}
  await page.keyboard.press('Escape');
  const gc=()=>page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.length);const g0=await gc();
  await page.locator('[data-act=auto-cluster]').scrollIntoViewIfNeeded();await page.click('[data-act=auto-cluster]');assert.ok(/จะสร้าง \d+ อักษร/.test(await page.locator('#cl-info').innerText()),'cluster sheet counts what it will make');
  await page.click('#bar-done');assert.ok(await gc()>g0,'clusters added');assert.ok(await page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.some(g=>[...g.c].length>1)),'a multi-character glyph exists');
  await page.click('#u-undo');assert.strictEqual(await gc(),g0,'undo removes the generated clusters');
  await page.locator('[data-act=conv-font]').scrollIntoViewIfNeeded();await page.click('[data-act=conv-font]');await page.selectOption('#cv-con','nes');await page.click('#bar-done');
  await page.waitForFunction(()=>{const f=FontLabApp.S.fonts.get(FontLabApp.S.cur);return f&&f.console==='nes'&&f.w===8&&f.h===16&&/→ NES/.test(f.name);},null,{timeout:5000});
  await page.click('.tab[data-tab=library]');await page.locator('.card:has-text("→ NES")').locator('.more').click();await page.click('[data-act=del]');await page.click('[data-act=yes]');
  await page.waitForFunction(()=>![...document.querySelectorAll('.card h3')].some(h=>/→ NES/.test(h.innerText)),null,{timeout:5000});}
 /* library: drag a card onto another one to reorder (starters included); the card menu moves it up / down; the order is saved */
 {await page.click('.tab[data-tab=library]');await page.waitForSelector('#page-library .card');
  const seedIds=()=>page.evaluate(()=>[...document.querySelectorAll('#page-library .card[data-group=seed]')].map(c=>c.dataset.open));
  const s0=await seedIds();assert.ok(s0.length>=3,'at least 3 starter cards');
  await page.evaluate(([a,b])=>{const A=document.querySelector('#page-library .card[data-open="'+a+'"]'),B=document.querySelector('#page-library .card[data-open="'+b+'"]'),dt=new DataTransfer(),ev=(t,el)=>el.dispatchEvent(new DragEvent(t,{bubbles:true,cancelable:true,dataTransfer:dt}));ev('dragstart',A);ev('dragover',B);ev('drop',B);ev('dragend',A);},[s0[0],s0[2]]);
  const s1=await seedIds();assert.strictEqual(s1[2],s0[0],'dragged starter card lands at the target position');
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('fontlab.order.v1')||'[]').length>0),'custom order saved');
  await page.locator('[data-more="'+s1[0]+'"]').click();await page.click('[data-act=move-down]');const s2=await seedIds();assert.strictEqual(s2[1],s1[0],'move down from the card menu');
  }
 await page.waitForTimeout(700);await page.reload();await page.click('.tab[data-tab=library]');await page.waitForSelector('.card');await page.locator('.card:has-text("พิกเซล")').first().click();await page.waitForSelector('#edit');
 const chunk=await page.locator('#s-glyphs .gl').count();assert.ok(chunk<=240&&chunk>=200,'first chunk only: '+chunk);await page.locator('.gl-more').scrollIntoViewIfNeeded();await page.waitForFunction(n=>document.querySelectorAll('#s-glyphs .gl').length>n,chunk,{timeout:5000});
 /* starter fonts: mark any font as a starter in its menu, start a new font from it */
 await page.click('.tab[data-tab=library]');assert.ok(!/แก้ไข เพิ่มอักษร และลบได้เหมือนฟอนต์ทั่วไป/.test(await page.locator('#page-library').innerText()),'starter footnote is gone');
 const mine=page.locator('.card:not(:has-text("ตั้งต้น"))').first();const mineName=await mine.locator('h3').innerText();
 await mine.locator('.more').click();await page.click('[data-act=toggle-starter]');await page.waitForFunction(n=>[...document.querySelectorAll('.card')].some(c=>c.querySelector('h3').innerText===n&&/ตั้งต้น/.test(c.innerText)),mineName,{timeout:5000});
 assert.ok(await page.evaluate(n=>[...FontLabApp.S.fonts.values()].some(f=>f.name===n&&f.starter===true),mineName),'starter flag stored on the font');
 await page.click('#page-library [data-act=new]');await page.click('[data-kind=starter]');
 const sid=await page.evaluate(()=>[...FontLabApp.S.fonts.values()].find(f=>f.starter===true)?.id);const sn=await page.evaluate(id=>FontLabApp.S.fonts.get(id).glyphs.length,sid);
 await page.selectOption('#nf-starter-sel',sid);await page.click('#bar-done');await page.waitForSelector('#edit');
 assert.strictEqual(await page.evaluate(()=>FontLabApp.S.fonts.get(FontLabApp.S.cur).glyphs.length),sn,'new font copied the starter glyphs');assert.strictEqual(await page.locator('[data-act=add-starter]').count(),0,'no separate add-starter button');
 /* offline: with the service worker installed the app still opens without a network */
 {const octx=await browser.newContext({viewport:{width:390,height:844}}),op=await octx.newPage();await op.goto(base);await op.waitForSelector('.card');
  await op.evaluate(()=>navigator.serviceWorker.ready);await op.waitForFunction(()=>navigator.serviceWorker.controller,null,{timeout:8000});await op.reload();await op.waitForSelector('.card');
  const cached=await op.evaluate(async()=>(await caches.keys()).filter(k=>k.startsWith('fontlab-offline-')).length);assert.strictEqual(cached,1,'offline cache exists');
  await octx.setOffline(true);await op.goto(base);await op.waitForSelector('.card',{timeout:8000});assert.strictEqual(await op.locator('.card').count(),5,'app opens offline with its starter fonts');
  await op.click('[data-open=builtin-quetzal-classic]');await op.waitForSelector('#edit',{timeout:5000});await octx.setOffline(false);await octx.close();}
 /* desktop layout */
 await page.setViewportSize({width:1280,height:820});await page.click('.tab[data-tab=library]');await page.locator('.card').first().click();await page.waitForSelector('#edit');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/studio-desktop.png':undefined});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.ok(!overflow,'no horizontal overflow');
 const lay=await page.evaluate(()=>{const st=document.querySelector('.studio'),k=[...st.children].map(c=>c.getBoundingClientRect());return{n:st.children.length,sameRow:k.length===2&&Math.abs(k[0].top-k[1].top)<4,rightOfLeft:k.length===2&&k[1].left>k[0].left+100,glyphsInRight:!!st.children[1]?.querySelector('#s-glyphs')};});
 assert.strictEqual(lay.n,2,'studio has exactly two columns (left: draw + preview, right: glyph list)');assert.ok(lay.sameRow&&lay.rightOfLeft&&lay.glyphsInRight,'glyph list sits beside the canvas on a wide screen: '+JSON.stringify(lay));
 const bal=await page.evaluate(()=>{const html=document.querySelector('#page-studio').innerHTML,d=(html.match(/<div/g)||[]).length,c=(html.match(/<\/div>/g)||[]).length;return d-c;});assert.strictEqual(bal,0,'studio markup has balanced <div> tags');
 /* sidebar extras + settings page (1280 px viewport) */
 await page.click('.tab[data-tab=library]');
 assert.ok(await page.locator('.side-sec [data-recent]').count()>=1,'recent fonts are listed in the sidebar');assert.strictEqual(await page.locator('.side-ver').count(),0,'no version text in the sidebar (it lives in Settings → About)');assert.ok((await page.locator('[data-cloud-text]').first().innerText()).length>3,'sidebar shows the cloud status');
 {const neon=await page.evaluate(()=>{const d=document.querySelector('.side-status .cdot'),c=getComputedStyle(d);return{name:c.animationName,dur:parseFloat(c.animationDuration)};});assert.ok(neon.name==='neon'&&neon.dur>=1,'status light glows with a slow neon pulse: '+JSON.stringify(neon));}
  {const sz=await page.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.cbtn .cdot')).width));assert.ok(sz<=6.5,'status dot on the cloud icon is small: '+sz);}
{const ring=await page.evaluate(()=>{document.getAnimations().forEach(a=>{a.pause();a.currentTime=1500;});return getComputedStyle(document.querySelector('.side-status .cdot')).boxShadow;});assert.ok(!/0px 0px 0px 2px/.test(ring),'no dark ring around the status light: '+ring);}
 await page.locator('[data-sidefilter]').first().click();assert.strictEqual(await page.evaluate(()=>FontLabApp.S.tab),'library');assert.ok(await page.locator('.side-item.on').count()>=1,'console filter highlighted');await page.locator('[data-sidefilter]').first().click();
 assert.ok(!(await page.locator('#page-library [data-act=new]').isVisible()),'no duplicate new-font icon in the top bar on wide screens');assert.strictEqual(await page.locator('.side-foot [data-act=theme]').count(),0,'theme toggle only at the top right');
 await page.locator('.sq[data-act=new]').click();assert.ok(await page.locator('.sheet .bar-title').count(),'quick action opens the new-font sheet');await page.keyboard.press('Escape');
 await page.click('.tab[data-tab=settings]');assert.ok(/ตั้งค่า/.test(await page.locator('#page-settings h1').innerText()));
 await page.click('#set-theme [data-m=dark]');assert.strictEqual(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');await page.click('#set-theme [data-m=system]');assert.strictEqual(await page.evaluate(()=>document.documentElement.dataset.theme||'system'),'system');
 await page.click('#set-auto');assert.strictEqual(await page.locator('#set-auto').getAttribute('aria-checked'),'true');await page.click('#set-auto');
 await page.locator('#page-settings .sel').first().click();await page.click('.menu [role=option]:has-text("Super Famicom")');assert.strictEqual(await page.evaluate(()=>localStorage.getItem('fontlab.defaultConsole')),'snes');
 await page.click('.tab[data-tab=library]');await page.click('.sq[data-act=new]');assert.strictEqual(await page.locator('#nf-con').inputValue(),'snes','default console used for new fonts');await page.keyboard.press('Escape');
 await page.click('.tab[data-tab=settings]');await page.click('#set-clear');assert.ok(/ลบข้อมูลฟอนต์ในเครื่อง/.test(await page.locator('.sheet').innerText()),'clear-local asks first');await page.keyboard.press('Escape');
 await browser.close();server.close();
 const real=errors.filter(e=>!/Failed to load resource/.test(e));assert.deepStrictEqual(real,[],'console errors');
 console.log('fontlab browser ok');
})().catch(e=>{console.error(e);process.exit(1);});
