'use strict';
(function(){
  const root=document.getElementById('recomendador');
  if(root){
    const selected={persona:'',ocasion:'',estilo:''};
    const summary=document.getElementById('reco-summary');
    const whatsapp=document.getElementById('reco-whatsapp');
    const reset=document.getElementById('reco-reset');
    function updateRecommendation(){
      const labels=[];
      if(selected.persona) labels.push('Para: '+selected.persona);
      if(selected.ocasion) labels.push('Ocasión: '+selected.ocasion);
      if(selected.estilo) labels.push('Estilo: '+selected.estilo);
      summary.textContent=labels.length?labels.join(' · '):'Elige tus preferencias y te preparamos una recomendación.';
      const lines=['Hola Elite Scents RD, quiero una recomendación de perfume.'];
      if(selected.persona) lines.push('Para quién: '+selected.persona+'.');
      if(selected.ocasion) lines.push('Ocasión: '+selected.ocasion+'.');
      if(selected.estilo) lines.push('Estilo que busco: '+selected.estilo+'.');
      lines.push('Presupuesto aproximado: ______.');
      whatsapp.href='https://wa.me/18094333348?text='+encodeURIComponent(lines.join('\n'));
    }
    root.addEventListener('click',function(event){
      const button=event.target.closest('[data-reco]');
      if(!button) return;
      const group=button.dataset.group;
      root.querySelectorAll('[data-reco][data-group="'+group+'"]').forEach(function(item){item.classList.remove('selected');item.setAttribute('aria-pressed','false');});
      button.classList.add('selected');
      button.setAttribute('aria-pressed','true');
      selected[group]=button.dataset.reco;
      updateRecommendation();
    });
    reset.addEventListener('click',function(){
      selected.persona='';selected.ocasion='';selected.estilo='';
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
    function openViewer(img){
      lastFocus=img;viewer.src=img.currentSrc||img.src;viewer.alt=img.alt||'Catálogo Elite Scents RD';viewer.classList.remove('zoomed');box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus();
    }
    function closeViewer(){
      box.classList.remove('open');box.setAttribute('aria-hidden','true');viewer.classList.remove('zoomed');viewer.src='';document.body.style.overflow='';if(lastFocus)lastFocus.focus();
    }
    document.querySelectorAll('.catalog-block img').forEach(function(img){
      img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar '+img.alt);
      img.addEventListener('click',function(){openViewer(img);});
      img.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();openViewer(img);}});
    });
    viewer.addEventListener('click',function(event){event.stopPropagation();viewer.classList.toggle('zoomed');});
    closeBtn.addEventListener('click',closeViewer);
    stage.addEventListener('click',function(event){if(event.target===stage)closeViewer();});
    box.addEventListener('click',function(event){if(event.target===box)closeViewer();});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&box.classList.contains('open'))closeViewer();});
  }
})();