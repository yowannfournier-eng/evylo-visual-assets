'use strict';
const fs=require('fs');
const manifest=JSON.parse(fs.readFileSync('public/market-pulse/registry.json','utf8'));
const config=JSON.parse(fs.readFileSync('evylo-newsletter-demo-config.json','utf8'));
function renderNewsletter(config, registry) {
 const base="https://evylo-email-public-assets-yowannfournier-9902.vercel.app";
 const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const label=(s)=>esc(s);
 const cells=config.marketPulse.map((id)=>{
   const a=registry.assets.find(x=>x.id===id);
   if(!a) throw Error(`Actif inconnu ${id}`);
   const q=config.quotes?.[id];
   const valid=!!(q&&Number.isFinite(q.price)&&Number.isFinite(q.changePct)&&q.source&&q.quoteTime&&q.retrievedAt&&q.unit);
   const value=valid?`${q.price.toLocaleString("fr-CA",{maximumFractionDigits:3})} ${esc(q.unit)}`:"—";
   const change=valid?`${q.changePct>0?"+":""}${q.changePct.toFixed(2).replace(".",",")}%`:"Variation non disponible";
   return `<td width="50%" valign="top" style="width:50%;padding:5px 5px 7px">
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A2032;border:1px solid #B99A65;border-radius:9px;overflow:hidden">
       <tr><td><img src="${base}/market-pulse/images/${encodeURIComponent(id.toLowerCase())}.jpg" width="300" alt="Photographie illustrative ${esc(a.label)}" style="width:100%;height:auto;display:block;border:0;max-width:300px"/></td></tr>
       <tr><td style="padding:10px 11px 12px">
         <div style="color:#E6C07B;font-family:Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase">${esc(a.label)}</div>
         <div style="color:#FFFFFF;font-size:24px;font-family:Arial,sans-serif;font-weight:800;line-height:1.25;padding-top:6px">${value}</div>
         <div style="color:${valid?(q.changePct>=0?"#4FE0B1":"#FF9393"):"#B2C0CD"};font-size:11px;line-height:1.35;padding-top:5px">${esc(change)}</div>
         ${valid?`<div style="font-size:9px;color:#95AABD;padding-top:5px">${esc(q.source)} · ${esc(q.quoteTime)}</div>`:""}
       </td></tr>
     </table></td>`;
 });
 const market=`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed"><tr>${cells.slice(0,2).join("")}</tr><tr>${cells.slice(2,4).join("")}</tr></table>`;
 const photoCard=(id,category,title,summary)=>{
  if(!registry.assets.some(x=>x.id===id))throw Error(`Image non enregistrée ${id}`);
  return `<td width="33.33%" valign="top" style="padding:5px;width:33.33%"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #B99A65;border-radius:8px;overflow:hidden;background:#0B1C2F"><tr><td><img alt="${esc(category)}" src="${base}/market-pulse/images/${id.toLowerCase()}.jpg" width="195" style="display:block;width:100%;height:auto;border:0"/></td></tr><tr><td style="padding:10px 8px 13px"><div style="color:#E0B866;font-size:10px;font-weight:700;letter-spacing:1px">${esc(category)}</div><div style="color:white;font:bold 15px/1.18 Georgia,serif;padding-top:6px">${esc(title)}</div><div style="color:#BCC9D5;font:11px/1.45 Arial,sans-serif;padding-top:7px">${esc(summary)}</div></td></tr></table></td>`;
 };
 const mini=(head,body,img)=>`<tr><td style="border-bottom:1px solid #27435C;padding:11px 0" valign="top"><table width="100%" cellspacing="0" cellpadding="0" role="presentation"><tr><td width="96" valign="top" style="width:96px"><img src="${base}/market-pulse/images/${img}.jpg" alt="" width="90" style="display:block;width:90px;height:auto;border:0;border-radius:4px"/></td><td valign="top"><div style="color:#E5BD79;font-size:11px;letter-spacing:.6px;font-weight:bold">${esc(head)}</div><div style="color:#E2EBF3;font-size:12px;line-height:1.45;padding-top:5px">${esc(body)}</div></td></tr></table></td></tr>`;
 const heading=(x)=>`<tr><td style="padding:23px 14px 10px"><div style="font:bold 14px Arial,sans-serif;letter-spacing:2px;color:#EFC776;padding-bottom:8px;border-bottom:1px solid #AC8B50">${esc(x)}</div></td></tr>`;
 const dossier=(number,cat,title,body,last)=>`<tr><td style="padding:5px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0A2436;border:1px solid #51657A;border-left:4px solid #D7A54D;border-radius:9px"><tr><td style="padding:15px 14px 18px"><div style="color:#E9B965;font:700 11px Arial,sans-serif;letter-spacing:1px">${number} · ${esc(cat)}</div><div style="color:#fff;font:bold 23px/1.14 Georgia,serif;padding-top:8px">${esc(title)}</div><div style="color:#DBE1EB;font:13px/1.55 Arial,sans-serif;padding-top:9px">${esc(body)}</div><div style="color:#E6BB75;font:700 10px Arial,sans-serif;letter-spacing:.6px;padding-top:12px">À SURVEILLER · ${esc(last)}</div></td></tr></table></td></tr>`;
 const docs=[
  ["01","TECHNOLOGIE","L’IA au-delà des résultats financiers","L'expansion de l'intelligence artificielle ne se résume pas aux ventes de puces. Elle touche également les centres de données, les réseaux électriques, le refroidissement et les investissements en infrastructure. Pour comprendre ses effets économiques, une analyse EVYLO confronte les annonces d'investissements aux projets effectivement livrés, puis examine les fournisseurs d'énergie, d'équipements et de services. Cette édition de démonstration illustre ce type de lecture transversale; elle ne présente aucun résultat trimestriel non vérifié.","Investissements, capacité électrique, marges et délais des projets"],
  ["02","ÉCONOMIE","Comprendre les décisions monétaires","Les annonces des banques centrales peuvent influencer le coût du crédit, les obligations, les devises et les valorisations d'actifs. Mais le niveau d'un taux ne suffit pas à raconter toute l'histoire : les projections, le marché de l'emploi, l'inflation et le ton des décideurs comptent aussi. EVYLO doit relier ces données aux marchés et distinguer les informations confirmées des interprétations. Dans cette édition de démonstration, nous présentons la méthode éditoriale sans inventer une décision de taux, une prévision ou une réaction boursière.","Inflation, emploi, communications officielles et rendements obligataires"]
 ];
 const date=esc(config.dateLabel||"Édition de démonstration");
 const testflag="DÉMONSTRATION VISUELLE — AUCUNE ACTUALITÉ OU DONNÉE DE MARCHÉ FICTIVE";
 return `<!doctype html><html lang="fr-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>EVYLO · Le Magazine d’intelligence globale</title><style type="text/css">@media only screen and (max-width:620px){.container{width:100%!important}.inner{padding-left:10px!important;padding-right:10px!important}.twothirds{font-size:28px!important}.smalltext{font-size:11px!important}}.ExternalClass{width:100%}img{-ms-interpolation-mode:bicubic}</style></head><body style="margin:0;padding:0;background:#030C18;color:#FFFFFF;-webkit-text-size-adjust:100%">
 <div style="display:none;font-size:1px;color:#030C18;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Aperçu EVYLO Magazine Premium — Market Pulse à quatre actifs variables, sans cours inventés.</div>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#030C18"><tr><td align="center">
 <table class="container" role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#041528;border:0">
 <tr><td><img width="640" src="${base}/evylo-header.jpg" alt="EVYLO — See Beyond The Headlines · Le Magazine d'intelligence globale" style="display:block;width:100%;height:auto;border:0"/></td></tr>
 <tr><td style="background:#102944;padding:11px 16px;color:#F3D19D;font:700 11px/1.4 Arial,sans-serif;letter-spacing:1px;text-align:center">${esc(testflag)}</td></tr>
 <tr><td style="padding:19px 15px 4px"><div style="color:#EAC07D;font:bold 12px Arial,sans-serif;letter-spacing:2px">EVYLO / MARKET PULSE</div><div style="color:#FFFFFF;font:bold 30px/1.15 Georgia,serif;padding-top:4px">Les marchés <span style="color:#E9B96A;font-style:italic">en un regard</span></div><div style="color:#9EB0C5;font:11px Arial,sans-serif;padding-top:7px">${date}</div></td></tr>
 <tr><td style="padding:5px 8px 14px">${market}</td></tr>
 <tr><td style="padding:0 13px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #A6834D;border-radius:8px;background:#10283D"><tr><td width="34%" valign="middle" style="padding:13px 12px;color:#EAB95F;font:bold 13px/1.3 Arial,sans-serif;letter-spacing:1px;border-right:1px solid #80683E">✦ LE PULSE DU JOUR</td><td valign="middle" style="padding:11px 12px;color:#D8E1E8;font:12px/1.5 Arial,sans-serif">Sélection de quatre actifs selon leur importance éditoriale. Les cours, variations et graphiques sont affichés uniquement lorsqu'ils sont vérifiés et datés.</td></tr></table></td></tr>
 <tr><td style="padding:8px 14px 0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071829;border:1px solid #A78654;border-radius:10px;overflow:hidden"><tr><td style="background:#182B3C;padding:10px 13px;color:#EBC579;font:800 12px Arial,sans-serif;letter-spacing:1px">À LA UNE · DOSSIER DE DÉMONSTRATION</td></tr><tr><td><img src="${base}/market-pulse/images/wti.jpg" alt="Photographie éditoriale du secteur énergétique" width="610" style="display:block;width:100%;height:auto;border:0"/></td></tr><tr><td style="padding:18px 15px 20px"><div style="font:bold 32px/1.09 Georgia,serif;color:#fff">Énergie, technologie, marchés : <em style="color:#F4C671">les liens à comprendre</em></div><div style="font:13px/1.55 Arial,sans-serif;color:#D6E2EC;padding-top:10px">Une lecture éditoriale des interactions entre ressources, infrastructures et décisions économiques. Ce texte est une démonstration de mise en page, pas une nouvelle du jour.</div><div style="color:#E8BD71;font:700 11px Arial,sans-serif;padding-top:12px">ANALYSE COMPLÈTE · À PUBLIER APRÈS VÉRIFICATION DES SOURCES</div></td></tr></table></td></tr>
 <tr><td style="padding:19px 8px 2px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="table-layout:fixed"><tr>${photoCard("SEMIS","TECHNOLOGIE","La chaîne mondiale des puces","Comprendre les capacités de production et les investissements.")}${photoCard("POLICY","ÉCONOMIE","La politique monétaire","Suivre les décisions et leurs répercussions sur les marchés.")}${photoCard("XAU","MATIÈRES PREMIÈRES","L’or et ses moteurs","Analyser la demande et les facteurs macroéconomiques.")}</tr></table></td></tr>
 ${heading("LE TOUR DU MONDE · À LA UNE EN BREF")}
 <tr><td style="padding:0 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">
 ${mini("GÉOPOLITIQUE","Veille des annonces et décisions officielles, à intégrer après vérification.","DEFENSE")}
 ${mini("ÉCONOMIE MONDIALE","Indicateurs macroéconomiques et perspectives sourcées.","SPX")}
 ${mini("SCIENCE & TECHNOLOGIE","Innovations documentées et leurs implications.","AI")}
 </table></td></tr>
 ${heading("EARNINGS & INSIDER")}
 <tr><td style="padding:7px 14px 12px;color:#CAD7E2;font:13px/1.5 Arial,sans-serif">Résultats financiers et déclarations d'initiés : contenu à alimenter à partir de documents réglementaires vérifiés. Aucun chiffre ni transaction fictifs.</td></tr>
 ${heading("CRYPTO COMMAND CENTER")}
 <tr><td style="padding:0 9px 11px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
 ${["BTC","ETH","SOL"].map(id=>{let a=registry.assets.find(x=>x.id===id);return `<td width="33.33%" valign="top" style="padding:4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B263D;border:1px solid #59728D"><tr><td><img src="${base}/market-pulse/images/${id.toLowerCase()}.jpg" alt="${id}" width="185" style="width:100%;display:block;height:auto"/></td></tr><tr><td style="padding:8px;color:#EDBE72;font:700 12px Arial,sans-serif">${id} <span style="color:#D5DDE5;font-weight:normal">—</span></td></tr></table></td>`}).join("")}
 </tr></table><div style="text-align:center;font:10px Arial,sans-serif;color:#96AABF">Cours non affichés sans données vérifiées.</div></td></tr>
 ${heading("DOSSIERS ESSENTIELS · À LIRE")}
 ${docs.map(x=>dossier(...x)).join("")}
 <tr><td style="padding:18px 13px 9px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D2A253;border-radius:11px;background:#071D2C"><tr><td width="30%" valign="middle" style="width:30%"><img src="${base}/evylo-stratege-approved.jpg" alt="Le Stratège — portrait classique doré" width="176" style="display:block;width:100%;height:auto;border:0"/></td><td valign="middle" style="padding:12px 15px"><div style="color:#E9BD70;font:bold 17px Arial,sans-serif;letter-spacing:1px">LE STRATÈGE</div><div style="padding-top:8px;color:#FFFFFF;font:italic 18px/1.36 Georgia,serif">« La diversification et la qualité des actifs comptent autant que la recherche de rendement. »</div><div style="color:#AEBED0;font:10px Arial,sans-serif;padding-top:8px">Exemple de commentaire éditorial, non une citation attribuée</div></td></tr></table></td></tr>
 <tr><td style="border-top:1px solid #B68D55;margin-top:12px;background:#051525;padding:22px 18px 27px;text-align:center"><div style="color:#EFBE72;font:bold 26px Georgia,serif">Pour en savoir plus</div><div style="color:#CED7E2;font:12px/1.55 Arial,sans-serif;padding:8px 0">Analyses complètes, sources et listes de suivi dans l'univers EVYLO.</div><div style="color:#E3C08B;font:bold 13px Arial,sans-serif;padding:9px 0">EVYLO.com · Application EVYLO (à venir)</div><div style="color:#91A5B9;font:10px/1.5 Arial,sans-serif;padding-top:10px">Édition de démonstration — aucun cours réel et aucune nouvelle fictive.<br/>Visuels illustratifs générés par IA. Ne pas diffuser comme une édition d'actualité.</div></td></tr>
 </table></td></tr></table></body></html>`;
}
const html=renderNewsletter(config,manifest);
fs.writeFileSync('public/market-pulse/newsletter-preview.html',html);
console.log('EVYLO: magazine email preview generated with 4 selected market assets');
