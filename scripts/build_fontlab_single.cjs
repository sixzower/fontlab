/* Builds one self-contained fontlab/download/index.html (CSS, JS, data, font and logo inlined). */
const fs=require('fs'),path=require('path');
const dir=path.resolve(__dirname,'../fontlab');let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const b64=(f,t)=>'data:'+t+';base64,'+fs.readFileSync(f).toString('base64');
let css=fs.readFileSync(path.join(dir,'fontlab.css'),'utf8').replace("url('../fonts/Prompt-Regular.ttf')","url('"+b64(path.resolve(dir,'../fonts/Prompt-Regular.ttf'),'font/ttf')+"')");
html=html.replace('<link rel="stylesheet" href="fontlab.css">',()=>'<style>'+css+'</style>');
const logo=b64(path.join(dir,'logo.svg'),'image/svg+xml');
html=html.replace(/<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>\n?/g,'').replace('<title>FontLab</title>','<title>FontLab</title>\n<link rel="icon" href="'+logo+'">');
for(const s of ['data/fonts.js','data/schema.js','config.js','core.js','cloud.js','app.js']){let js=fs.readFileSync(path.join(dir,s),'utf8').replace(/<\/script/g,'<\\/script');if(s==='app.js')js=js.replace('src="logo.svg"','src="'+logo+'"');html=html.replace('<script src="'+s+'"></script>',()=>'<script>'+js+'</script>');}
if(/<script src=|href="fontlab\.css/.test(html))throw Error('unresolved asset');
fs.mkdirSync(path.join(dir,'download'),{recursive:true});fs.writeFileSync(path.join(dir,'download/index.html'),html);console.log('single file',(html.length/1024|0)+' KB');
