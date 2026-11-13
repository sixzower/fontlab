/* Browser test (Supabase mocked). Usage: node tests/browser.cjs */
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
const server=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404).end();return;}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{
 await new Promise(r=>server.listen(0,r));const base='http://127.0.0.1:'+server.address().port+'/index.html';
 const browser=await chromium.launch(),errors=[];
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,acceptDownloads:true}),page=await ctx.newPage();
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
 assert.strictEqual(await page.locator('.card').count(),4,'4 built-in fonts');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/library.png':undefined,...(process.env.SHOTS?{}:{type:'png'})});
 /* a stale page loads the newer version by itself (no hard refresh), and does not loop */
 const stale=await ctx.newPage();await stale.route('**/version.json*',r=>r.fulfill({status:200,contentType:'application/json',body:'{"version":"99.0.0"}'}));
 await stale.goto(base);await stale.waitForURL(/[?&]v=99\.0\.0/,{timeout:8000});await stale.waitForSelector('.card');await stale.waitForTimeout(500);assert.ok(/[?&]v=99\.0\.0/.test(stale.url()),'moved to the new version');await stale.close();
 const wide=await ctx.newPage();await wide.setViewportSize({width:1900,height:900});await wide.goto(base);await wide.waitForSelector('.card');
 assert.ok(await wide.evaluate(()=>document.querySelector('.page.on').getBoundingClientRect().width)>1900-260,'page fills the screen next to the sidebar');await wide.close();
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
 await page.click('[data-tool=fill]');await page.click('[data-color="2"]');await page.mouse.click(box.x+box.width-5,box.y+5);assert.ok(await ink()>drawn,'fill works');
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
 const before=await shadows();await page.click('#sh-go');const after=await shadows();assert.ok(after>before,'shadow pixels were added ('+before+' -> '+after+')');
 await page.click('#u-undo');assert.strictEqual(await shadows(),before,'one undo removes every shadow');await page.click('#u-redo');assert.strictEqual(await shadows(),after,'redo restores them');
 /* built-in is read only, duplicate to edit */
 await page.click('.tab[data-tab=library]');await page.click('[data-open=builtin-sword-shield-th]');
 await page.click('#edit');assert.ok(await page.locator('.toast.on').count(),'read-only toast');
 await page.click('[data-act=dup-edit]');await page.waitForFunction(()=>!FontLabApp.S.fonts.get(FontLabApp.S.cur).builtin);
 /* persistence */
 await page.waitForTimeout(700);await page.reload();await page.click('.tab[data-tab=library]');await page.waitForSelector('.card');assert.strictEqual(await page.locator('.card').count(),6,'user fonts persisted');
 /* cloud: automatic, no login, no cloud tab */
 assert.strictEqual(await page.locator('.tab').count(),3,'no cloud tab');assert.strictEqual(await page.locator('[data-act=sync],#c-form').count(),0,'no login form');
 await page.waitForFunction(()=>document.querySelector('.cdot.ok'),null,{timeout:8000});
 const code=await page.evaluate(()=>localStorage.getItem('fontlab.code.v2'));assert.ok(/^[a-f0-9]{64}$/.test(code),'backup code created automatically');
 await page.waitForFunction(c=>true,code);const vault=()=>vaults.get(code);
 assert.strictEqual(vault().size,2,'2 user fonts auto-uploaded: '+calls.join(','));
 assert.ok(![...vault().values()].some(r=>r.font_id.startsWith('builtin')),'built-ins are not uploaded');
 const row=[...vault().values()][0];assert.ok(row.data.glyphs&&row.width&&row.glyph_count);
 /* editing saves to the cloud by itself */
 await page.click('.tab[data-tab=library]');await page.locator('.card:not(:has-text("ในตัว"))').first().click();await page.waitForSelector('#edit');
 const b3=await page.locator('#edit').boundingBox();await page.mouse.click(b3.x+b3.width/2,b3.y+b3.height/2);
 await page.waitForFunction(()=>document.querySelector('.cdot.ok'));await page.waitForTimeout(300);
 const t0=Math.max(...[...vault().values()].map(r=>Date.parse(r.updated_at)));assert.ok(Date.now()-t0<15000,'edit uploaded');
 /* status sheet shows the code, a second device can use it */
 await page.click('#page-studio [data-act=cloud]');assert.ok(/••••/.test(await page.locator('#cc-code').innerText()),'code masked');
 await page.click('#cc-show');assert.strictEqual(await page.locator('#cc-code').innerText(),code);await page.keyboard.press('Escape');
 const ctx2=await browser.newContext({viewport:{width:390,height:844}});await ctx2.addInitScript(()=>{window.FontLabSyncDelay=50;});await ctx2.route('https://*.supabase.co/**',handler);const page2=await ctx2.newPage();page2.on('pageerror',e=>errors.push(e.message));await page2.goto(base);await page2.waitForSelector('.card');
 assert.notStrictEqual(await page2.evaluate(()=>localStorage.getItem('fontlab.code.v2')),code);
 await page2.click('#page-library [data-act=cloud]');await page2.fill('#cc-in',code);await page2.click('#cc-use');
 await page2.waitForFunction(()=>[...document.querySelectorAll('.card')].filter(c=>!/ในตัว/.test(c.innerText)).length===2,null,{timeout:8000});
 assert.strictEqual(await page2.locator('.card').count(),6,'fonts arrived on the other device');await ctx2.close();
 /* delete -> removed from cloud */
 await page.click('.tab[data-tab=library]');await page.locator('.card:not(:has-text("ในตัว")) .more').first().click();await page.click('[data-act=del]');await page.click('[data-act=yes]');
 await page.waitForFunction(()=>document.querySelector('.cdot.ok'));await page.waitForTimeout(400);
 assert.strictEqual(vault().size,1,'deleted font removed from cloud');
 await page.click('#page-library [data-act=cloud]');await page.fill('#cc-in','xyz');await page.click('#cc-use');assert.ok(await page.locator('.toast.on').count(),'bad code rejected');await page.keyboard.press('Escape');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/cloud.png':undefined});
 /* desktop layout */
 await page.setViewportSize({width:1280,height:820});await page.click('.tab[data-tab=library]');await page.locator('.card').first().click();await page.waitForSelector('#edit');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/studio-desktop.png':undefined});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.ok(!overflow,'no horizontal overflow');
 await browser.close();server.close();
 const real=errors.filter(e=>!/Failed to load resource/.test(e));assert.deepStrictEqual(real,[],'console errors');
 console.log('fontlab browser ok');
})().catch(e=>{console.error(e);process.exit(1);});
