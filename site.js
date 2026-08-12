'use strict';
(async function(){
  const WA='18094333348';

  function loadScript(src){
    return new Promise(function(resolve,reject){
      const s=document.createElement('script');
      s.src=src+'?v=4';s.async=false;
      s.onload=resolve;s.onerror=reject;
      document.head.appendChild(s);
    });
  }

  try{
    for(let i=7;i<=12;i++) await loadScript('catalogo-data-'+i+'.js');
  }catch(err){console.error('No se pudo cargar una parte del catálogo',err);}

  const seen=new Set();
  const PRODUCTS=(window.PRODUCTS||[]).filter(function(p){
    const key=[p.page,p.slot,p.name,p.price,p.size].join('|');
    if(seen.has(key))return false;seen.add(key);return true;
  });

  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function genderLabel(v){return v==='hombre'?'Hombre':v==='mujer'?'Mujer':'Unisex';}
  function parsePrice(v){const m=String(v||'').match(/[\d,]+/g);if(!m)return null;const nums=m.map(x=>Number(x.replace(/,/g,''))).filter(Number.isFinite);return nums.length?Math.min(...nums):null;}
  function visualFor(p){
    const block=p.page<=9?1:p.page<=18?2:p.page<=27?3:4;
    const start=block===1?1:block===2?10:block===3?19:28;
    const col=p.slot%3,row=Math.floor(p.slot/3),globalRow=(p.page-start)*4+row;
    return {image:'catalogo-'+block+'.webp',position:(col*50)+'% '+(globalRow*2.825)+'%'};
  }
  function wa(name,extra){
    let msg='Hola Elite Scents RD, me interesa '+name+'.';
    if(extra)msg+='\n'+extra;
    msg+='\n¿Está disponible?';
    return 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  }

  // --- Identidad de catálogo ya completado ---
  const catalogSection=document.getElementById('catalogo');
  if(catalogSection){
    const p=catalogSection.querySelector('.section-head p');
    if(p)p.textContent='Ya puedes buscar individualmente 420 productos del catálogo. También mantenemos la vista visual completa de las 36 páginas.';
    const quick=catalogSection.querySelector('.catalog-quick .btn-dark');
    if(quick){quick.href='catalogo.html';quick.textContent='Buscar entre 420 productos';}
  }

  // --- 6 destacados que cambian cada día en República Dominicana ---
  function drDateKey(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santo_Domingo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get=t=>parts.find(p=>p.type===t)?.value||'';
    return get('year')+'-'+get('month')+'-'+get('day');
  }
  function hashSeed(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function rng(seed){return function(){seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function shuffled(arr,seed){const out=arr.slice(),r=rng(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function eligibleFeatured(p){return p.page>=2&&!/^set\b/i.test(p.name)&&!/\bgift\b|\bkids\b/i.test(p.name)&&p.price;}
  function brandKey(name){const n=norm(name).replace(/^paco rabanne /,'paco ').replace(/^mont blanc /,'montblanc ').replace(/^maison alhambra /,'alhambra ');return n.split(/\s+/).slice(0,2).join(' ');}
  function dailySix(){
    const base=PRODUCTS.filter(eligibleFeatured);
    const seed=hashSeed(drDateKey());
    const groups=['hombre','mujer','unisex'];
    const chosen=[],brands={};
    groups.forEach(function(g,gi){
      const pool=shuffled(base.filter(p=>p.gender===g),seed+gi*101);
      for(const p of pool){const b=brandKey(p.name);if((brands[b]||0)>=1)continue;chosen.push(p);brands[b]=(brands[b]||0)+1;if(chosen.filter(x=>x.gender===g).length===2)break;}
    });
    if(chosen.length<6){for(const p of shuffled(base,seed+999)){if(chosen.includes(p))continue;const b=brandKey(p.name);if((brands[b]||0)>=2)continue;chosen.push(p);brands[b]=(brands[b]||0)+1;if(chosen.length===6)break;}}
    return shuffled(chosen,seed+77).slice(0,6);
  }
  function featuredCard(p){
    const v=visualFor(p),a=document.createElement('article');a.className='product-card';
    const img=document.createElement('div');img.className='product-img';img.role='img';img.setAttribute('aria-label',p.name);img.style.backgroundImage="url('"+v.image+"')";img.style.backgroundPosition=v.position;img.style.backgroundSize='300% auto';img.style.backgroundRepeat='no-repeat';
    const pill=document.createElement('span');pill.className='pill';pill.textContent='DESTACADO DEL DÍA';
    const h=document.createElement('h3');h.textContent=p.name;
    const price=document.createElement('div');price.className='price';price.textContent=p.price||'';
    const info=document.createElement('p');info.textContent=(p.size?p.size+' · ':'')+genderLabel(p.gender);
    const link=document.createElement('a');link.className='mini-link';link.href=wa(p.name,'Lo vi en los destacados de hoy.');link.target='_blank';link.rel='noopener noreferrer';link.textContent='Pedir por WhatsApp →';
    a.append(img,pill,h,price,info,link);return a;
  }
  const featured=document.querySelector('#destacados .products');
  if(featured){
    featured.replaceChildren(...dailySix().map(featuredCard));
    const p=document.querySelector('#destacados .section-head p');
    if(p)p.textContent='Seis fragancias seleccionadas automáticamente para hoy. La selección cambia cada día en República Dominicana.';
  }

  // --- Recomendador sobre los 420 productos ---
  const root=document.getElementById('recomendador');
  const OVERRIDES={
    '9 PM EDP Men Afnan':['Dulce','Intenso','Elegante','Árabe'],
    'Acqua di Giò Profondo EDP Men':['Fresco','Elegante','Amaderado'],
    'Ariana Grande Cloud':['Dulce','Elegante'],
    'Lattafa Eclaire':['Dulce','Árabe'],
    'Lattafa Khamrah':['Dulce','Intenso','Árabe'],
    'Lattafa Khamrah Qahwa':['Dulce','Intenso','Árabe'],
    'Lattafa Ramz Silver':['Dulce','Árabe'],
    'Nautica Voyage':['Fresco'],
    'Rasasi Hawas For Him':['Fresco','Árabe'],
    'Rasasi Hawas Ice':['Fresco','Árabe'],
    'Versace Dylan Blue EDT':['Fresco','Elegante'],
    'Versace Eros Eau de Parfum Men':['Dulce','Elegante','Intenso'],
    'Versace Eros Flame EDP Men':['Dulce','Intenso'],
    'Blue Chanel':['Fresco','Elegante','Amaderado'],
    'YSL Y EDT Men':['Fresco','Elegante'],
    'YSL Libre Le Parfum Women':['Dulce','Elegante']
  };
  function profile(p){
    const styles=new Set(OVERRIDES[p.name]||[]),occasions=new Set(),n=norm(p.name);
    if(/lattafa|afnan|armaf|haramain|zimaya|rasasi|rayhaan|orientica|french avenue|maison alhambra|hayaati|badee|barakkat|bharara/.test(n))styles.add('Árabe');
    if(/aqua|blue|ocean|ice|voyage|sport|sillage|milestone|limoni|dive|profondo|hawas|luna rossa|light blue|dylan blue|y edt/.test(n))styles.add('Fresco');
    if(/cloud|candy|sweet|eclaire|khamrah|qahwa|tiramisu|chocolate|caramel|vanille|vanilla|marshmallow|yara|devotion|fantasy|toffee|nebras/.test(n))styles.add('Dulce');
    if(/intense|intensely|elixir|extrait|sauvage|asad|oud|aoud|spicebomb|victory|eros flame|extradose/.test(n))styles.add('Intenso');
    if(/oud|aoud|wood|sauvage|asad|code|le beau|the one|rare carbon|musamam|spicebomb|explorer|polo green/.test(n))styles.add('Amaderado');
    if(/armani|dior|sauvage|prada|valentino|versace|ysl|yves saint laurent|chanel|givenchy|jpg|invictus|mont blanc|montblanc|lacoste|lancome|mancera|xerjoff/.test(n))styles.add('Elegante');
    if(styles.has('Fresco')){occasions.add('Uso diario');occasions.add('Oficina');}
    if(styles.has('Elegante')){occasions.add('Citas');occasions.add('Regalo');}
    if(styles.has('Dulce')){occasions.add('Citas');occasions.add('Noche');}
    if(styles.has('Intenso')){occasions.add('Fiestas');occasions.add('Noche');}
    if(styles.has('Amaderado'))occasions.add('Noche');
    if(!occasions.size)occasions.add('Regalo');
    return {styles,occasions};
  }
  function score(p,sel,budget){
    if(/^set\b/i.test(p.name))return null;
    const pr=profile(p);let s=0;
    if(sel.persona){const wanted=norm(sel.persona);if(p.gender===wanted)s+=7;else if(p.gender==='unisex'&&wanted!=='unisex')s+=3;else return null;}
    if(sel.estilo)s+=pr.styles.has(sel.estilo)?7:-1;
    if(sel.ocasion)s+=pr.occasions.has(sel.ocasion)?5:-1;
    const price=parsePrice(p.price);
    if(budget){if(price===null||price<budget.min||price>budget.max)return null;s+=4;}
    if(OVERRIDES[p.name])s+=2;
    return {p,pr,s,price};
  }
  function pick(sel,budget){
    const ranked=PRODUCTS.map(p=>score(p,sel,budget)).filter(Boolean).sort((a,b)=>b.s-a.s||(a.price||999999)-(b.price||999999));
    const out=[],brands={};
    for(const item of ranked){const b=brandKey(item.p.name);if((brands[b]||0)>=2)continue;out.push(item);brands[b]=(brands[b]||0)+1;if(out.length===5)break;}
    return out;
  }
  function recoCard(item,sel){
    const p=item.p,v=visualFor(p),a=document.createElement('article');a.className='reco-card';
    const photo=document.createElement('div');photo.className='reco-photo';photo.role='img';photo.setAttribute('aria-label',p.name);photo.style.backgroundImage="url('"+v.image+"')";photo.style.backgroundPosition=v.position;photo.style.backgroundSize='300% auto';
    const meta=document.createElement('div');meta.className='reco-meta';meta.textContent=genderLabel(p.gender)+' · Pág. '+p.page;
    const h=document.createElement('h3');h.textContent=p.name;
    const price=document.createElement('div');price.className='reco-price';price.textContent=p.price||'Precio a confirmar';
    const size=document.createElement('div');size.className='reco-size';size.textContent=p.size||'Tamaño según disponibilidad';
    const matches=[];if(sel.estilo&&item.pr.styles.has(sel.estilo))matches.push(sel.estilo);if(sel.ocasion&&item.pr.occasions.has(sel.ocasion))matches.push(sel.ocasion);
    const why=document.createElement('div');why.className='reco-why';why.textContent=matches.length?'Coincide con: '+matches.join(' · '):'Opción seleccionada según tus preferencias';
    const link=document.createElement('a');link.className='btn reco-order';link.href=wa(p.name,'Llegué a este perfume usando el recomendador de la página.');link.target='_blank';link.rel='noopener noreferrer';link.textContent='Pedir por WhatsApp';
    a.append(photo,meta,h,price,size,why,link);return a;
  }
  if(root){
    const sel={persona:'',ocasion:'',estilo:'',budget:''};let budget=null;
    const summary=document.getElementById('reco-summary'),help=document.getElementById('reco-whatsapp'),reset=document.getElementById('reco-reset'),results=document.getElementById('reco-results'),title=document.getElementById('reco-result-title');
    function renderReco(){
      const labels=[];if(sel.persona)labels.push('Para: '+sel.persona);if(sel.ocasion)labels.push('Ocasión: '+sel.ocasion);if(sel.estilo)labels.push('Estilo: '+sel.estilo);if(sel.budget)labels.push('Presupuesto: '+sel.budget);summary.textContent=labels.length?labels.join(' · '):'Elige tus preferencias y te mostramos opciones del catálogo completo.';
      help.href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hola Elite Scents RD, quiero una recomendación de perfume.\n'+labels.join('\n'));
      results.replaceChildren();if(!labels.length){results.hidden=true;title.textContent='';return;}
      const list=pick(sel,budget);results.hidden=false;title.textContent=list.length?'Opciones que encajan contigo':'No encontramos una coincidencia exacta';
      if(!list.length){const e=document.createElement('div');e.className='reco-empty';e.textContent='Prueba cambiando una preferencia o ampliando el presupuesto.';results.appendChild(e);return;}
      const grid=document.createElement('div');grid.className='reco-grid';list.forEach(x=>grid.appendChild(recoCard(x,sel)));results.appendChild(grid);
    }
    root.addEventListener('click',function(e){const b=e.target.closest('[data-reco]');if(!b)return;const g=b.dataset.group;root.querySelectorAll('[data-reco][data-group="'+g+'"]').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false');});b.classList.add('selected');b.setAttribute('aria-pressed','true');sel[g]=b.dataset.reco;if(g==='budget')budget={min:Number(b.dataset.min||0),max:Number(b.dataset.max||999999)};renderReco();});
    reset.addEventListener('click',function(){Object.keys(sel).forEach(k=>sel[k]='');budget=null;root.querySelectorAll('[data-reco]').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false');});renderReco();});renderReco();
  }

  // --- Visor del catálogo visual ---
  const box=document.getElementById('catalogLightbox');
  if(box){
    const viewer=box.querySelector('.lightbox-img'),closeBtn=box.querySelector('.lightbox-close'),stage=box.querySelector('.lightbox-stage');let last=null;
    function open(img){last=img;viewer.src=img.currentSrc||img.src;viewer.alt=img.alt||'Catálogo Elite Scents RD';viewer.classList.remove('zoomed');box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus();}
    function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');viewer.classList.remove('zoomed');viewer.src='';document.body.style.overflow='';if(last)last.focus();}
    document.querySelectorAll('.catalog-block img').forEach(img=>{img.tabIndex=0;img.role='button';img.addEventListener('click',()=>open(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(img);}});});viewer.addEventListener('click',e=>{e.stopPropagation();viewer.classList.toggle('zoomed');});closeBtn.addEventListener('click',close);stage.addEventListener('click',e=>{if(e.target===stage)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('open'))close();});
  }
})();