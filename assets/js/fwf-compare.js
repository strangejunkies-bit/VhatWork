(()=>{
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  qa('[data-before-after]').forEach(wrap=>{
    const handle=q('[data-ba-handle]',wrap);
    const handleBtn=handle?.querySelector('.ba-handle-btn');
    const after=q('[data-ba-after]',wrap);
    const range=q('[data-ba-range]',wrap);
    const afterImg=after?.querySelector('img');
    let dragging=false;
    let current=Number(range?.value || 50);

    function syncWidth(){
      if(afterImg) afterImg.style.width=wrap.clientWidth+'px';
      setPct(current,false);
    }

    function positionButton(p){
      if(!handleBtn) return;
      if(p<=1){
        handleBtn.style.left='0';
        handleBtn.style.transform='translate(0,-50%)';
      }else if(p>=99){
        handleBtn.style.left='100%';
        handleBtn.style.transform='translate(-100%,-50%)';
      }else{
        handleBtn.style.left='50%';
        handleBtn.style.transform='translate(-50%,-50%)';
      }
    }

    function setPct(p,updateRange=true){
      p=Math.min(100,Math.max(0,Number(p)||0));
      current=p;
      if(after) after.style.width=p+'%';
      if(handle) handle.style.left=p+'%';
      positionButton(p);
      if(range && updateRange) range.value=String(Math.round(p));
    }

    function fromX(x){
      const r=wrap.getBoundingClientRect();
      if(!r.width) return;
      setPct((x-r.left)/r.width*100);
    }

    syncWidth();
    addEventListener('resize',syncWidth,{passive:true});

    if(range){
      range.min='0';
      range.max='100';
      range.addEventListener('input',()=>setPct(+range.value,false));
      setPct(+range.value||50,false);
    }

    wrap.addEventListener('pointerdown',e=>{
      if(e.button!==undefined && e.button!==0 && e.pointerType==='mouse') return;
      dragging=true;
      wrap.setPointerCapture?.(e.pointerId);
      fromX(e.clientX);
    });
    wrap.addEventListener('pointermove',e=>{
      if(!dragging) return;
      fromX(e.clientX);
    });
    const stop=e=>{
      dragging=false;
      if(e?.pointerId!==undefined) wrap.releasePointerCapture?.(e.pointerId);
    };
    wrap.addEventListener('pointerup',stop);
    wrap.addEventListener('pointercancel',stop);

    // Keyboard access remains available through the invisible native range control.
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
      let played=false;
      const io=new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting && !played){
          played=true;
          io.disconnect();
          const seq=[50,22,78,50];
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
