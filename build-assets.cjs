const fs=require('fs');const cp=require('child_process');fs.mkdirSync('public',{recursive:true});if(!fs.existsSync('evylo_vercel_ready_v22.zip')){console.error('Archive EVYLO absente: evylo_vercel_ready_v22.zip');process.exit(1)}cp.execFileSync('unzip',['-oq','evylo_vercel_ready_v22.zip','-d','public'],{stdio:'inherit'});for(const f of ['index.html','evylo-v2-global.png','hero-microsoft-editorial.jpg','evylo-001.jpg','evylo-100.jpg']){if(!fs.existsSync('public/'+f))throw Error('Missing '+f)}fs.copyFileSync('evylo-magazine-v23.html','public/evylo-magazine-v23.html');if(!fs.existsSync('public/evylo-magazine-v23.html'))throw Error('Missing V2.3');console.log('EVYLO V2.3 HTML and assets verified');
fs.copyFileSync('evylo-magazine-v24.html','public/evylo-magazine-v24.html');if(!fs.existsSync('public/evylo-magazine-v24.html'))throw Error('Missing V2.4');

fs.copyFileSync('evylo-magazine-v25.html','public/evylo-magazine-v25.html');if(!fs.existsSync('public/evylo-magazine-v25.html'))throw Error('Missing V2.5');

fs.copyFileSync('evylo-magazine-v26.html','public/evylo-magazine-v26.html');if(!fs.existsSync('public/evylo-magazine-v26.html'))throw Error('Missing V2.6');

fs.copyFileSync('evylo-magazine-v27.html','public/evylo-magazine-v27.html');if(!fs.existsSync('public/evylo-magazine-v27.html'))throw Error('Missing V2.7');

fs.copyFileSync('evylo-magazine-v28.html','public/evylo-magazine-v28.html');if(!fs.existsSync('public/evylo-magazine-v28.html'))throw Error('Missing V2.8');

fs.copyFileSync('evylo-magazine-v29.html','public/evylo-magazine-v29.html');if(!fs.existsSync('public/evylo-magazine-v29.html'))throw Error('Missing V2.9');

// Publish the approved, unmodified EVYLO header for email clients.
if(!fs.existsSync('evylo-header.jpg'))throw Error('Missing approved evylo-header.jpg');
fs.copyFileSync('evylo-header.jpg','public/evylo-header.jpg');

// Serve the magazine preview using the approved public images.
fs.copyFileSync('evylo-magazine-v30.html','public/evylo-magazine-v30.html');

// EVYLO Market Pulse: publish manifest and gallery; extract image archive when uploaded.
fs.mkdirSync('public/market-pulse',{recursive:true});
fs.copyFileSync('evylo-market-pulse-registry-v4.json','public/market-pulse/registry.json');
fs.copyFileSync('evylo-market-pulse-gallery-v4.html','public/market-pulse/index.html');
const mpZip='EVYLO_Market_Pulse_41_assets_local_et_bloc3.zip';
if(fs.existsSync(mpZip)){
  cp.execFileSync('unzip',['-oq',mpZip,'images/*','-d','public/market-pulse'],{stdio:'inherit'});
  const files=fs.readdirSync('public/market-pulse/images').filter(x=>x.endsWith('.jpg'));
  if(files.length!==41)throw Error('EVYLO Market Pulse expected 41 images, found '+files.length);
  console.log('Market Pulse: 41 images extracted');
}else{console.log('Market Pulse: manifest published, 41 images awaiting ZIP upload');}
