const fs=require('fs');const cp=require('child_process');fs.mkdirSync('public',{recursive:true});if(!fs.existsSync('evylo_vercel_ready_v22.zip')){console.error('Archive EVYLO absente: evylo_vercel_ready_v22.zip');process.exit(1)}cp.execFileSync('unzip',['-oq','evylo_vercel_ready_v22.zip','-d','public'],{stdio:'inherit'});for(const f of ['index.html','evylo-v2-global.png','hero-microsoft-editorial.jpg','evylo-001.jpg','evylo-100.jpg']){if(!fs.existsSync('public/'+f))throw Error('Missing '+f)}fs.copyFileSync('evylo-magazine-v23.html','public/evylo-magazine-v23.html');if(!fs.existsSync('public/evylo-magazine-v23.html'))throw Error('Missing V2.3');console.log('EVYLO V2.3 HTML and assets verified');
fs.copyFileSync('evylo-magazine-v24.html','public/evylo-magazine-v24.html');if(!fs.existsSync('public/evylo-magazine-v24.html'))throw Error('Missing V2.4');

fs.copyFileSync('evylo-magazine-v25.html','public/evylo-magazine-v25.html');if(!fs.existsSync('public/evylo-magazine-v25.html'))throw Error('Missing V2.5');

fs.copyFileSync('evylo-magazine-v26.html','public/evylo-magazine-v26.html');if(!fs.existsSync('public/evylo-magazine-v26.html'))throw Error('Missing V2.6');

fs.copyFileSync('evylo-magazine-v27.html','public/evylo-magazine-v27.html');if(!fs.existsSync('public/evylo-magazine-v27.html'))throw Error('Missing V2.7');
