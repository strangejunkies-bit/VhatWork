(()=>{
  const rails=[...document.querySelectorAll('[data-rail]')];
  if(!rails.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states=new Map();
  const visibleCards=rail=>[...rail.children].filter(el=>!el.hidden&&(el.matches('.work-tile')||el.matches('[data-rail-item]')));
  rails.forEach(rail=>{
    const state={timer:null,manualUntil:0,raf:0};states.set(rail,state);
    const gap=()=>parseFloat(getComputedStyle(rail).gap)||0;
    const step=()=>{const c=visibleCards(rail)[0];return c?c.getBoundingClientRect().width+gap():rail.clientWidth*.82};
    const canScroll=()=>rail.scrollWidth>rail.clientWidth+4;
    const atEnd=()=>rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-step()*.35;
    const atStart=()=>rail.scrollLeft<=4;
    const advance=()=>{if(document.hidden||Date.now()<state.manualUntil||!canScroll())return;atEnd()?rail.scrollTo({left:0,behavior:'smooth'}):rail.scrollBy({left:step(),behavior:'smooth'})};
    const stop=()=>{if(state.timer){clearInterval(state.timer);state.timer=null}};
    const start=()=>{if(reduced||state.timer)return;state.timer=setInterval(advance,2800)};
    const hold=()=>{state.manualUntil=Date.now()+5200};
    const shell=rail.closest('[data-rail-shell]')||rail.parentElement;
    let actions=shell?.querySelector('.rail-actions[data-generated-controls]');
    if(shell&&!actions){
      actions=document.createElement('div');actions.className='rail-actions';actions.dataset.generatedControls='';actions.setAttribute('aria-label','Carousel controls');
      actions.innerHTML='<button class="rail-arrow rail-prev" type="button" aria-label="Previous projects">←</button><button class="rail-arrow rail-next" type="button" aria-label="Next projects">→</button>';
      shell.append(actions);
    }
    const prev=actions?.querySelector('.rail-prev'),next=actions?.querySelector('.rail-next');
    const update=()=>{if(!prev||!next)return;const scrollable=canScroll();actions.hidden=!scrollable;prev.disabled=!scrollable||atStart();next.disabled=!scrollable||atEnd()};
    const manualMove=dir=>{hold();rail.scrollBy({left:dir*step(),behavior:reduced?'auto':'smooth'});setTimeout(update,360)};
    prev?.addEventListener('click',()=>manualMove(-1));next?.addEventListener('click',()=>manualMove(1));
    rail.addEventListener('pointerdown',hold,{passive:true});rail.addEventListener('wheel',hold,{passive:true});rail.addEventListener('touchstart',hold,{passive:true});rail.addEventListener('focusin',hold);
    rail.addEventListener('scroll',()=>{if(state.raf)return;state.raf=requestAnimationFrame(()=>{state.raf=0;update()})},{passive:true});
    if('ResizeObserver'in window)new ResizeObserver(update).observe(rail);else addEventListener('resize',update,{passive:true});
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():start()});
    requestAnimationFrame(update);start();
  });
  const home=document.querySelector('.home-work'),homeRail=home?.querySelector('[data-rail]'),filters=home?[...home.querySelectorAll('[data-work-filter]')]:[];
  if(home&&homeRail&&filters.length){
    const tiles=[...homeRail.querySelectorAll('.work-tile[data-work-category]')];
    let status=home.querySelector('[data-work-status]');
    if(!status){status=document.createElement('div');status.className='sr-only';status.dataset.workStatus='';status.setAttribute('aria-live','polite');home.append(status)}
    const apply=value=>{
      home.classList.add('is-filtering');home.classList.toggle('is-business-cards',value==='business-cards');
      filters.forEach(btn=>{const active=btn.dataset.workFilter===value;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active))});
      tiles.forEach(tile=>{const cats=(tile.dataset.workCategory||'').split(/\s+/);tile.hidden=value!=='all'&&!cats.includes(value)});
      homeRail.scrollTo({left:0,behavior:reduced?'auto':'smooth'});const state=states.get(homeRail);if(state)state.manualUntil=Date.now()+900;
      const active=filters.find(b=>b.dataset.workFilter===value);status.textContent=`Showing ${visibleCards(homeRail).length} ${active?.textContent.trim()||'work'} projects`;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{home.classList.remove('is-filtering');homeRail.dispatchEvent(new Event('scroll'))}));
    };
    filters.forEach((btn,i)=>{
      btn.addEventListener('click',()=>apply(btn.dataset.workFilter||'all'));
      btn.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let next=i;if(e.key==='ArrowLeft')next=(i-1+filters.length)%filters.length;if(e.key==='ArrowRight')next=(i+1)%filters.length;if(e.key==='Home')next=0;if(e.key==='End')next=filters.length-1;filters[next].focus();filters[next].click();filters[next].scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'})});
    });
    apply('all');
  }
})();
