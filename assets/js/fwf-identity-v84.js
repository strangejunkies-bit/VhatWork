(()=>{
  const shell=document.querySelector('.design-proof .identity-rail-shell');
  if(!shell)return;
  requestAnimationFrame(()=>{
    const prev=shell.querySelector('.rail-prev');
    const next=shell.querySelector('.rail-next');
    if(prev)prev.setAttribute('aria-label','Previous identity set');
    if(next)next.setAttribute('aria-label','Next identity set');
  });
})();
