/* Browser test for FontLab (no ROM, Supabase mocked). Usage: node tests/fontlab-browser.cjs */
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
const server=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404).end();return;}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{
 await new Promise(r=>server.listen(0,r));const base='http://127.0.0.1:'+server.address().port+'/fontlab/index.html';
 const browser=await chromium.launch(),errors=[];
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,acceptDownloads:true}),page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 /* mock Supabase: one table in memory */
 const db=new Map();let calls=[];
 await ctx.route('https://*.supabase.co/**',async route=>{const req=route.request(),u=new URL(req.url()),cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};calls.push(req.method()+' '+u.pathname+u.search);
  if(req.method()==='OPTIONS')return route.fulfill({status:204,headers:cors});
  const json=(b,s=200)=>route.fulfill({status:s,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(b)});
  if(u.pathname==='/auth/v1/token')return json({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'u1',email:'a@b.co'}});
  if(u.pathname==='/auth/v1/signup')return json({user:{id:'u1'}});
  if(u.pathname==='/rest/v1/fontlab_fonts'){
   if(req.method()==='POST'){for(const r of JSON.parse(req.postData()))db.set(r.font_id,r);return route.fulfill({status:201,headers:cors,body:''});}
   if(req.method()==='DELETE'){db.delete(u.searchParams.get('font_id').replace('eq.',''));return route.fulfill({status:204,headers:cors});}
   const eq=u.searchParams.get('font_id');if(eq)return json([...db.values()].filter(r=>r.font_id===eq.replace('eq.','')).map(r=>({data:r.data})));
   return json([...db.values()].map(({font_id,name,console,glyph_count,updated_at})=>({font_id,name,console,glyph_count,updated_at})));}
  route.fulfill({status:404,headers:cors,body:'{}'});});
 await page.goto(base);
 await page.waitForSelector('.card');
 assert.strictEqual(await page.locator('.card').count(),4,'4 built-in fonts');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/library.png':undefined,...(process.env.SHOTS?{}:{type:'png'})});
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
 /* built-in is read only, duplicate to edit */
 await page.click('.tab[data-tab=library]');await page.click('[data-open=builtin-sword-shield-th]');
 await page.click('#edit');assert.ok(await page.locator('.toast.on').count(),'read-only toast');
 await page.click('[data-act=dup-edit]');await page.waitForFunction(()=>!FontLabApp.S.fonts.get(FontLabApp.S.cur).builtin);
 /* persistence */
 await page.waitForTimeout(700);await page.reload();await page.click('.tab[data-tab=library]');await page.waitForSelector('.card');assert.strictEqual(await page.locator('.card').count(),6,'user fonts persisted');
 /* cloud */
 await page.click('.tab[data-tab=cloud]');await page.fill('#c-email','a@b.co');await page.fill('#c-pass','secret1');await page.click('button[value=in]');
 await page.waitForSelector('[data-act=signout]');await page.waitForFunction(()=>/ซิงก์แล้ว/.test(document.body.innerText));
 assert.strictEqual(db.size,2,'2 user fonts uploaded: '+calls.join(' | '));
 assert.ok(![...db.values()].some(r=>r.font_id.startsWith('builtin')),'built-ins are not uploaded');
 const row=[...db.values()][0];assert.ok(row.user_id==='u1'&&row.data.glyphs&&row.width&&row.glyph_count);
 /* delete -> removed from cloud on next sync */
 await page.click('.tab[data-tab=library]');await page.locator('.card .more').first().click();await page.click('[data-act=del]');await page.click('[data-act=yes]');
 await page.click('.tab[data-tab=cloud]');await page.click('[data-act=sync]');await page.waitForFunction(()=>/ซิงก์แล้ว/.test(document.body.innerText));await page.waitForTimeout(200);
 assert.strictEqual(db.size,1,'deleted font removed from cloud');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/cloud.png':undefined});
 /* desktop layout */
 await page.setViewportSize({width:1280,height:820});await page.click('.tab[data-tab=library]');await page.locator('.card').first().click();await page.waitForSelector('#edit');
 await page.screenshot({path:process.env.SHOTS?process.env.SHOTS+'/studio-desktop.png':undefined});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.ok(!overflow,'no horizontal overflow');
 await browser.close();server.close();
 const real=errors.filter(e=>!/Failed to load resource/.test(e));assert.deepStrictEqual(real,[],'console errors');
 console.log('fontlab browser ok');
})().catch(e=>{console.error(e);process.exit(1);});
