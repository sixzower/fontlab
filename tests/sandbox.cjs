/* FontLab must work inside sandboxed preview iframes (no localStorage, no history changes). Run npm run build first. */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{const b=await chromium.launch(),p=await b.newPage(),errs=[];p.on('pageerror',e=>errs.push('page:'+e.message));p.on('console',m=>m.type()==='error'&&errs.push('c:'+m.text()));
const html=fs.readFileSync(path.resolve(__dirname,'../download/index.html'),'utf8');
for(const [label,sbx] of [['sandbox allow-scripts','allow-scripts'],['sandbox +same-origin','allow-scripts allow-same-origin']]){
 errs.length=0;await p.setContent('<iframe id=f style="width:420px;height:660px" sandbox="'+sbx+'"></iframe>');
 await p.evaluate(h=>{document.getElementById('f').srcdoc=h;},html);const f=p.frameLocator('#f');await f.locator('.card').first().waitFor({timeout:8000}).catch(()=>errs.push('no library'));
 const res={};for(const t of ['consoles','studio']){await f.locator('.tab[data-tab='+t+']').click();await p.waitForTimeout(150);res[t]=await f.locator('#page-'+t).evaluate(e=>e.innerText.trim().length);}
 assert.ok(res.consoles>100&&res.studio>50,label+' pages render '+JSON.stringify(res));assert.deepStrictEqual([...new Set(errs)].filter(e=>!/Failed to load/.test(e)),[],label+' errors');console.log('ok',label);}
await b.close();})();
