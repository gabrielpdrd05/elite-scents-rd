'use strict';
(function(){
  const PRODUCTS=Array.isArray(window.PRODUCTS)?window.PRODUCTS:[];
  const root=document.getElementById('recomendador');

  const PROFILE_OVERRIDES={
    '9 PM EDP Men Afnan':{styles:['Dulce','Intenso','Elegante','Árabe'],occasions:['Citas','Fiestas','Noche']},
    'Acqua di Giò Profondo EDP Men':{styles:['Fresco','Elegante','Amaderado'],occasions:['Uso diario','Oficina','Citas','Regalo']},
    'Dolce & Gabbana Light Blue Men':{styles:['Fresco','Elegante'],occasions:['Uso diario','Oficina','Regalo']},
    'Calvin Klein One':{styles:['Fresco'],occasions:['Uso diario','Oficina','Regalo']},
    'Ariana Grande Cloud':{styles:['Dulce','Elegante'],occasions:['Uso diario','Citas','Regalo']},
    'Lattafa Eclaire':{styles:['Dulce','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Lattafa Asad':{styles:['Intenso','Amaderado','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Lattafa Asad Elixir':{styles:['Intenso','Amaderado','Árabe'],occasions:['Citas','Fiestas','Noche']},
    'JPG Le Beau Paradise Garden':{styles:['Fresco','Elegante','Amaderado'],occasions:['Uso diario','Citas','Regalo']},
    'Armani Stronger With You EDP':{styles:['Dulce','Elegante'],occasions:['Citas','Fiestas','Noche','Regalo']},
    'Armani Stronger With You EDT':{styles:['Dulce','Elegante'],occasions:['Citas','Noche','Regalo']},
    'Armani Stronger With You Absolutely EDP':{styles:['Dulce','Intenso','Elegante'],occasions:['Citas','Fiestas','Noche']},
    'Armani Stronger With You Intensely EDP':{styles:['Dulce','Intenso','Elegante'],occasions:['Citas','Fiestas','Noche']},
    'Azzaro Most Wanted EDP':{styles:['Dulce','Intenso','Elegante'],occasions:['Citas','Fiestas','Noche']},
    'Azzaro Most Wanted EDT Intense':{styles:['Dulce','Intenso','Elegante'],occasions:['Citas','Fiestas','Noche']},
    'Dior Sauvage EDP':{styles:['Fresco','Elegante','Intenso','Amaderado'],occasions:['Uso diario','Oficina','Citas','Regalo']},
    'Dior Sauvage EDT Men':{styles:['Fresco','Elegante'],occasions:['Uso diario','Oficina','Citas','Regalo']},
    'Dior Sauvage Elixir':{styles:['Intenso','Elegante','Amaderado'],occasions:['Citas','Fiestas','Noche']},
    'Armaf Odyssey Aqua':{styles:['Fresco','Árabe'],occasions:['Uso diario','Oficina','Regalo']},
    'Armaf Club de Nuit Intense Men':{styles:['Elegante','Intenso','Amaderado','Árabe'],occasions:['Citas','Fiestas','Noche','Regalo']},
    'Armaf Club de Nuit Sillage':{styles:['Fresco','Elegante','Árabe'],occasions:['Uso diario','Oficina','Regalo']},
    'Armaf Club de Nuit Milestone':{styles:['Fresco','Elegante','Árabe'],occasions:['Uso diario','Oficina','Regalo']},
    'Al Haramain Aqua Dubai':{styles:['Fresco','Elegante','Árabe'],occasions:['Uso diario','Oficina','Regalo']},
    'Al Haramain Dubai Night':{styles:['Intenso','Elegante','Árabe'],occasions:['Citas','Fiestas','Noche']},
    'Afnan Zimaya Tiramisu Caramel':{styles:['Dulce','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Afnan Zimaya Tiramisu Coco':{styles:['Dulce','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Armaf Odyssey Toffee Coffee':{styles:['Dulce','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Armaf Odyssey Dubai Chocolate':{styles:['Dulce','Árabe'],occasions:['Citas','Noche','Regalo']},
    "Lattafa Bade'e Al Oud For Glory":{styles:['Intenso','Amaderado','Árabe'],occasions:['Fiestas','Noche']},
    'French Avenue Liquid Brun':{styles:['Dulce','Amaderado','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Barakkat Rouge 540 Extrait EDP':{styles:['Dulce','Elegante','Árabe'],occasions:['Citas','Noche','Regalo']},
    'Ariana Grande Sweet Like Candy':{styles:['Dulce'],occasions:['Uso diario','Citas','Regalo']},
    'Dolce & Gabbana Devotion':{styles:['Dulce','Elegante'],occasions:['Citas','Noche','Regalo']},
    'Britney Spears Fantasy EDP':{styles:['Dulce'],occasions:['Uso diario','Citas','Regalo']},
    'Paco Rabanne Invictus':{styles:['Fresco','Elegante'],occasions:['Uso diario','Citas','Regalo']},
    'Paco Rabanne Invictus Parfum':{styles:['Fresco','Elegante','Intenso'],occasions:['Citas','Noche','Regalo']},
    "Issey Miyake L'Eau d'Issey":{styles:['Fresco','Elegante'],occasions:['Uso diario','Oficina','Regalo']},
    'Issey Miyake Pour Homme':{styles:['Fresco','Elegante'],occasions:['Uso diario','Oficina','Regalo']},
    'Issey Miyake Sport':{styles:['Fresco'],occasions:['Uso diario','Oficina']}
  };

  function text(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function parsePrice(value){const matches=String(value||'').match(/[\d,]+/g);if(!matches)return null;const nums=matches.map(function(v){return Number(v.replace(/,/g,''));}).filter(Number.isFinite);return nums.length?Math.min.apply(null,nums):null;}
  function brandOf(name){return text(name).split(/\s+/)[0]||'otro';}
  function add(set,label){set.add(label);}

  function profileFor(p){
    const styles=new Set();
    const occasions=new Set();
    const n=text(p.name);
    const override=PROFILE_OVERRIDES[p.name];
    if(override){override.styles.forEach(function(v){add(styles,v);});override.occasions.forEach(function(v){add(occasions,v);});}

    if(/afnan|lattafa|armaf|haramain|ana abiyedh|zimaya|french avenue|barakkat|hayaati|ishq al shuyukh|bade'e al oud|bharara|dumont/.test(n)) add(styles,'Árabe');
    if(/aqua|blue|light blue|profondo|limoni|sport|sillage|milestone|beach|bahamas|dive|l'eau|invictus|atlas|summer vibes/.test(n)) add(styles,'Fresco');
    if(/9 pm|cloud|sweet|candy|candee|eclaire|tiramisu|toffee|chocolate|caramel|devotion|fantasy|yum yum|bon bon|stronger with you|most wanted|noble blush|her confession/.test(n)) add(styles,'Dulce');
    if(/intense|intensely|elixir|absolutely|sauvage|most wanted|asad|oud|aoud|nitro|tyrant|his confession|le male elixir/.test(n)) add(styles,'Intenso');
    if(/oud|aoud|wood|sauvage|asad|code|club de nuit intense|le beau|the one|rare carbon|for glory|honor & glory|musamam|ishq|liquid brun/.test(n)) add(styles,'Amaderado');
    if(/armani|sauvage|the one|club de nuit|bond no|greenwich|tribeca|lafayette|eternity|most wanted|stronger with you|carolina herrera|coach|jpg|invictus|profondo|calvin klein/.test(n)) add(styles,'Elegante');

    if(styles.has('Fresco')){add(occasions,'Uso diario');add(occasions,'Oficina');}
    if(styles.has('Elegante')){add(occasions,'Citas');add(occasions,'Regalo');}
    if(styles.has('Dulce')){add(occasions,'Citas');add(occasions,'Noche');}
    if(styles.has('Intenso')){add(occasions,'Fiestas');add(occasions,'Noche');}
    if(styles.has('Amaderado')) add(occasions,'Noche');
    if(styles.size===0){add(occasions,'Regalo');}
    return {styles:styles,occasions:occasions};
  }

  function genderLabel(value){return value==='hombre'?'Hombre':value==='mujer'?'Mujer':'Unisex';}
  function productImageStyle(p){
    const col=p.slot%3;
    const row=Math.floor(p.slot/3);
    const localPage=p.page<=9?p.page-1:p.page-10;
    const globalRow=localPage*4+row;
    const y=globalRow*2.825;
    return {image:p.page<=9?'catalogo-1.webp':'catalogo-2.webp',position:(col*50)+'% '+y+'%'};
  }

  function scoreProduct(p,selected,budget){
    const profile=profileFor(p);
    let score=0;
    if(selected.persona){
      const wanted=text(selected.persona);
      if(p.gender===wanted) score+=7;
      else if(p.gender==='unisex'&&wanted!=='unisex') score+=3;
      else return null;
    }
    if(selected.estilo){if(profile.styles.has(selected.estilo))score+=7;else score-=1;}
    if(selected.ocasion){if(profile.occasions.has(selected.ocasion))score+=5;else score-=1;}
    const price=parsePrice(p.price);
    if(budget){
      if(price===null)return null;
      if(price<budget.min||price>budget.max)return null;
      score+=4;
    }
    if(PROFILE_OVERRIDES[p.name])score+=2;
    if(price!==null)score+=1;
    return {product:p,profile:profile,score:score,price:price};
  }

  function pickResults(selected,budget){
    const ranked=PRODUCTS.map(function(p){return scoreProduct(p,selected,budget);}).filter(Boolean).sort(function(a,b){return b.score-a.score||(a.price||999999)-(b.price||999999);});
    const chosen=[];
    const brands={};
    for(const item of ranked){
      const brand=brandOf(item.product.name);
      if((brands[brand]||0)>=2)continue;
      chosen.push(item);brands[brand]=(brands[brand]||0)+1;
      if(chosen.length===5)break;
    }
    return chosen;
  }

  function recommendationWhatsApp(p,selected){
    const lines=['Hola Elite Scents RD, me interesa '+p.name+'.'];
    if(selected.persona||selected.ocasion||selected.estilo){
      lines.push('Llegué a este perfume usando el recomendador de la página.');
      if(selected.persona)lines.push('Para: '+selected.persona+'.');
      if(selected.ocasion)lines.push('Ocasión: '+selected.ocasion+'.');
      if(selected.estilo)lines.push('Estilo: '+selected.estilo+'.');
    }
    lines.push('¿Está disponible?');
    return 'https://wa.me/18094333348?text='+encodeURIComponent(lines.join('\n'));
  }

  function makeRecommendationCard(item,selected){
    const p=item.product;
    const visual=productImageStyle(p);
    const article=document.createElement('article');article.className='reco-card';
    const photo=document.createElement('div');photo.className='reco-photo';photo.setAttribute('role','img');photo.setAttribute('aria-label',p.name);photo.style.backgroundImage="url('"+visual.image+"')";photo.style.backgroundPosition=visual.position;
    const meta=document.createElement('div');meta.className='reco-meta';meta.textContent=genderLabel(p.gender)+' · Pág. '+p.page;
    const title=document.createElement('h3');title.textContent=p.name;
    const price=document.createElement('div');price.className='reco-price';price.textContent=p.price||'Precio a confirmar';
    const size=document.createElement('div');size.className='reco-size';size.textContent=p.size||'Tamaño según disponibilidad';
    const matches=[];
    if(selected.estilo&&item.profile.styles.has(selected.estilo))matches.push(selected.estilo);
    if(selected.ocasion&&item.profile.occasions.has(selected.ocasion))matches.push(selected.ocasion);
    if(!matches.length){item.profile.styles.forEach(function(v){if(matches.length<2)matches.push(v);});}
    const why=document.createElement('div');why.className='reco-why';why.textContent=matches.length?'Coincide con: '+matches.join(' · '):'Opción del catálogo según tus preferencias';
    const button=document.createElement('a');button.className='btn reco-order';button.href=recommendationWhatsApp(p,selected);button.target='_blank';button.rel='noopener noreferrer';button.textContent='Pedir por WhatsApp';
    article.append(photo,meta,title,price,size,why,button);return article;
  }

  if(root){
    const selected={persona:'',ocasion:'',estilo:'',budget:''};
    let budget=null;
    const summary=document.getElementById('reco-summary');
    const whatsapp=document.getElementById('reco-whatsapp');
    const reset=document.getElementById('reco-reset');
    const results=document.getElementById('reco-results');
    const resultTitle=document.getElementById('reco-result-title');

    function updateRecommendation(){
      const labels=[];
      if(selected.persona)labels.push('Para: '+selected.persona);
      if(selected.ocasion)labels.push('Ocasión: '+selected.ocasion);
      if(selected.estilo)labels.push('Estilo: '+selected.estilo);
      if(selected.budget)labels.push('Presupuesto: '+selected.budget);
      summary.textContent=labels.length?labels.join(' · '):'Elige tus preferencias y te mostramos opciones del catálogo.';

      const lines=['Hola Elite Scents RD, quiero una recomendación de perfume.'];
      if(selected.persona)lines.push('Para quién: '+selected.persona+'.');
      if(selected.ocasion)lines.push('Ocasión: '+selected.ocasion+'.');
      if(selected.estilo)lines.push('Estilo que busco: '+selected.estilo+'.');
      if(selected.budget)lines.push('Presupuesto: '+selected.budget+'.');
      whatsapp.href='https://wa.me/18094333348?text='+encodeURIComponent(lines.join('\n'));

      results.replaceChildren();
      if(!selected.persona&&!selected.ocasion&&!selected.estilo&&!selected.budget){
        results.hidden=true;resultTitle.textContent='';return;
      }
      const matches=pickResults(selected,budget);
      results.hidden=false;
      resultTitle.textContent=matches.length?'Opciones que encajan contigo':'No encontramos una coincidencia exacta';
      if(!matches.length){
        const empty=document.createElement('div');empty.className='reco-empty';empty.textContent='Prueba ampliando el presupuesto o cambiando una preferencia. También puedes pedirnos una recomendación personalizada por WhatsApp.';results.appendChild(empty);return;
      }
      const grid=document.createElement('div');grid.className='reco-grid';matches.forEach(function(item){grid.appendChild(makeRecommendationCard(item,selected));});results.appendChild(grid);
    }

    root.addEventListener('click',function(event){
      const button=event.target.closest('[data-reco]');
      if(!button)return;
      const group=button.dataset.group;
      root.querySelectorAll('[data-reco][data-group="'+group+'"]').forEach(function(item){item.classList.remove('selected');item.setAttribute('aria-pressed','false');});
      button.classList.add('selected');button.setAttribute('aria-pressed','true');selected[group]=button.dataset.reco;
      if(group==='budget')budget={min:Number(button.dataset.min||0),max:Number(button.dataset.max||999999)};
      updateRecommendation();
    });

    reset.addEventListener('click',function(){
      selected.persona='';selected.ocasion='';selected.estilo='';selected.budget='';budget=null;
      root.querySelectorAll('[data-reco]').forEach(function(item){item.classList.remove('selected');item.setAttribute('aria-pressed','false');});
      updateRecommendation();
    });
    updateRecommendation();
  }

  const box=document.getElementById('catalogLightbox');
  if(box){
    const viewer=box.querySelector('.lightbox-img');
    const closeBtn=box.querySelector('.lightbox-close');
    const stage=box.querySelector('.lightbox-stage');
    let lastFocus=null;
    function openViewer(img){lastFocus=img;viewer.src=img.currentSrc||img.src;viewer.alt=img.alt||'Catálogo Elite Scents RD';viewer.classList.remove('zoomed');box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus();}
    function closeViewer(){box.classList.remove('open');box.setAttribute('aria-hidden','true');viewer.classList.remove('zoomed');viewer.src='';document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
    document.querySelectorAll('.catalog-block img').forEach(function(img){img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar '+img.alt);img.addEventListener('click',function(){openViewer(img);});img.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();openViewer(img);}});});
    viewer.addEventListener('click',function(event){event.stopPropagation();viewer.classList.toggle('zoomed');});
    closeBtn.addEventListener('click',closeViewer);stage.addEventListener('click',function(event){if(event.target===stage)closeViewer();});box.addEventListener('click',function(event){if(event.target===box)closeViewer();});document.addEventListener('keydown',function(event){if(event.key==='Escape'&&box.classList.contains('open'))closeViewer();});
  }
})();