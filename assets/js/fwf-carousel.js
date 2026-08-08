(()=>{
  const rails=[...document.querySelectorAll('[data-rail]')];
  if(!rails.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const states=new Map();
  const visibleCards=rail=>[...rail.children].filter(el=>el.matches('.work-tile')&&!el.hidden);
  rails.forEach(rail=>{
    const state={timer:null,manualUntil:0};
    states.set(rail,state);
    const gap=()=>parseFloat(getComputedStyle(rail).gap)||0;
    const step=()=>{const c=visibleCards(rail)[0];return c?c.getBoundingClientRect().width+gap():rail.clientWidth*.8};
    const canScroll=()=>rail.scrollWidth>rail.clientWidth+4;
    const atEnd=()=>rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-step()*.35;
    const advance=()=>{
      if(document.hidden||Date.now()<state.manualUntil||!canScroll())return;
      if(atEnd())rail.scrollTo({left:0,behavior:'smooth'});
      else rail.scrollBy({left:step(),behavior:'smooth'});
    };
    const stop=()=>{if(state.timer){clearInterval(state.timer);state.timer=null}};
    const start=()=>{if(reduced||state.timer)return;state.timer=setInterval(advance,3000)};
    const hold=()=>{state.manualUntil=Date.now()+6500};
    rail.addEventListener('pointerdown',hold,{passive:true});
    rail.addEventListener('wheel',hold,{passive:true});
    rail.addEventListener('touchstart',hold,{passive:true});
    rail.addEventListener('focusin',hold);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
    start();
  });

  const home=document.querySelector('.home-work');
  const homeRail=home?.querySelector('[data-rail]');
  const filters=home?[...home.querySelectorAll('[data-work-filter]')]:[];
  if(home&&homeRail&&filters.length){
    const tiles=[...homeRail.querySelectorAll('.work-tile[data-work-category]')];
    const apply=value=>{
      home.classList.add('is-filtering');
      home.classList.toggle('is-business-cards',value==='business-cards');
      filters.forEach(btn=>{const active=btn.dataset.workFilter===value;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active))});
      tiles.forEach(tile=>{const cats=(tile.dataset.workCategory||'').split(/\s+/);tile.hidden=value!=='all'&&!cats.includes(value)});
      homeRail.scrollTo({left:0,behavior:reduced?'auto':'smooth'});
      const state=states.get(homeRail);if(state)state.manualUntil=Date.now()+900;
      requestAnimationFrame(()=>requestAnimationFrame(()=>home.classList.remove('is-filtering')));
    };
    filters.forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.workFilter||'all')));
    apply('all');
  }
})();