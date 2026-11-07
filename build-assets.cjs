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

// EVYLO Market Pulse v6: deploy 41 source-verified images from single archive.
fs.mkdirSync('public/market-pulse',{recursive:true});
const archive='EVYLO_Market_Pulse_41_FINAL_VALIDATED.zip';
const mpSegments=Array.from({length:10},(_,i)=>'marketpulse_payload/part'+String(i+1).padStart(2,'0')+'.txt');
let mpArchive=archive;
if(!fs.existsSync(archive) && mpSegments.every(p=>fs.existsSync(p))){
  const crypto=require('crypto');
  const b64=mpSegments.map(p=>fs.readFileSync(p,'utf8').trim()).join('');
  const payload=Buffer.from(b64,'base64');
  const digest=crypto.createHash('sha256').update(payload).digest('hex');
  const expected='0f67c9906c693997694792ca1a6a6bb4983a5a850854a1e7b015bfd062cc26c0';
  if(digest!==expected)throw Error('EVYLO Market Pulse archive SHA-256 mismatch: '+digest);
  mpArchive='/tmp/evylo-market-pulse-41-final.zip';
  fs.writeFileSync(mpArchive,payload);
  console.log('EVYLO Market Pulse archive reconstructed from 10 verified GitHub segments: '+payload.length+' bytes');
}
if (fs.existsSync(mpArchive)){
  cp.execFileSync('unzip',['-oq',mpArchive,'-d','public/market-pulse'],{stdio:'inherit'});
  const root='public/market-pulse';
  const report=JSON.parse(fs.readFileSync(root+'/registry.json','utf8'));
  const crypto=require('crypto');
  if(report.assets.length!==41)throw Error('EVYLO expected 41 assets, got '+report.assets.length);
  const ids=new Set(),shas=new Set();
  for(const asset of report.assets){
    if(ids.has(asset.id))throw Error('Duplicate EVYLO asset '+asset.id);
    ids.add(asset.id);
    const p=root+'/'+asset.filename;
    if(!fs.existsSync(p))throw Error('Missing EVYLO image: '+p);
    const sha=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    if(sha!==asset.sha256)throw Error('SHA-256 mismatch for '+asset.id);
    if(shas.has(sha))throw Error('EVYLO duplicate image '+asset.id);
    shas.add(sha);
  }
  console.log('EVYLO Market Pulse: 41 distinct assets, all SHA-256 verified');
}else{
  fs.copyFileSync('evylo-market-pulse-registry-v4.json','public/market-pulse/registry.json');
  fs.copyFileSync('evylo-market-pulse-gallery-v4.html','public/market-pulse/index.html');
  console.log('EVYLO Market Pulse HOLD: publish 41-asset ZIP before enabling image gallery');
}

// Approved Le Stratège artwork, cropped without modification from EVYLO signed-off mockup.
fs.writeFileSync('public/evylo-stratege-portrait.jpg',Buffer.from(fs.readFileSync('evylo-stratege-portrait-base64.txt','utf8').trim(),'base64'));
