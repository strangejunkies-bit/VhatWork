(()=>{
  const rails=[...document.querySelectorAll('[data-rail]')];
  if(!rails.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  rails.forEach(rail=>{
    const cards=[...rail.children].filter(el=>el.matches('.work-tile'));
    if(cards.length<2)return;
    let timer=null, manualUntil=0;
    const gap=()=>parseFloat(getComputedStyle(rail).gap)||0;
    const step=()=>{const c=cards[0];return c?c.getBoundingClientRect().width+gap():rail.clientWidth*.8};
    const atEnd=()=>rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-step()*.35;
    const advance=()=>{
      if(document.hidden||Date.now()<manualUntil)return;
      if(atEnd())rail.scrollTo({left:0,behavior:'smooth'});
      else rail.scrollBy({left:step(),behavior:'smooth'});
    };
    const stop=()=>{if(timer){clearInterval(timer);timer=null}};
    const start=()=>{if(reduced||timer)return;timer=setInterval(advance,3000)};
    const hold=()=>{manualUntil=Date.now()+6500};
    rail.addEventListener('pointerdown',hold,{passive:true});
    rail.addEventListener('wheel',hold,{passive:true});
    rail.addEventListener('touchstart',hold,{passive:true});
    rail.addEventListener('focusin',hold);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
    start();
  });
})();