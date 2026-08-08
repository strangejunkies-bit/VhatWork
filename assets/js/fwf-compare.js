(()=>{
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  qa('[data-before-after]').forEach(wrap=>{
    const handle=q('[data-ba-handle]',wrap);
    const after=q('[data-ba-after]',wrap);
    const range=q('[data-ba-range]',wrap);
    const afterImg=after?.querySelector('img');
    let dragging=false;

    function syncWidth(){ if(afterImg) afterImg.style.width=wrap.clientWidth+'px'; }
    syncWidth();
    addEventListener('resize',syncWidth,{passive:true});

    function setPct(p){
      p=Math.min(98,Math.max(2,p));
      if(after) after.style.width=p+'%';
      if(handle) handle.style.left=p+'%';
      if(range) range.value=p;
    }

    function fromX(x){
      const r=wrap.getBoundingClientRect();
      setPct((x-r.left)/r.width*100);
    }

    if(range){
      range.addEventListener('input',()=>setPct(+range.value));
      setPct(+range.value||50);
    }

    wrap.addEventListener('pointerdown',e=>{
      if(e.target===range) return;
      dragging=true;
      wrap.setPointerCapture?.(e.pointerId);
      fromX(e.clientX);
    });
    wrap.addEventListener('pointermove',e=>{ if(dragging) fromX(e.clientX); });
    wrap.addEventListener('pointerup',()=>{ dragging=false; });
    wrap.addEventListener('pointercancel',()=>{ dragging=false; });

    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
      let played=false;
      const io=new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting && !played){
          played=true;
          io.disconnect();
          const seq=[50,26,72,50];
          let i=0;
          const tick=()=>{
            if(i>=seq.length) return;
            setPct(seq[i++]);
            setTimeout(tick,420);
          };
          setTimeout(tick,320);
        }
      },{threshold:.45});
      io.observe(wrap);
    }
  });
})();
