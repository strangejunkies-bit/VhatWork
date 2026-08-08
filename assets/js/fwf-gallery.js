(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)],body=document.body;
  let overlay,img,items=[],index=0,lastFocus=null,lockedY=0,touchStart=null;
  const eligible=()=>qa('[data-lightbox]').filter(el=>!el.hidden&&!el.closest('[hidden]'));
  function lockPage(){lockedY=window.scrollY||window.pageYOffset||0;body.style.top=`-${lockedY}px`;body.classList.add('is-lightbox-open')}
  function unlockPage(){body.classList.remove('is-lightbox-open');body.style.top='';window.scrollTo(0,lockedY)}
  function ensure(){
    if(overlay)return;
    overlay=document.createElement('div');overlay.className='lightbox';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Project image viewer');
    overlay.innerHTML='<div class="lightbox-stage"><button class="lightbox-close" type="button" aria-label="Close image viewer">×</button><button class="lightbox-prev" type="button" aria-label="Previous project">←</button><img alt=""><div class="lightbox-count" aria-hidden="true"></div><button class="lightbox-next" type="button" aria-label="Next project">→</button><div class="sr-only" aria-live="polite" data-lightbox-status></div></div>';
    body.appendChild(overlay);img=q('img',overlay);
    q('.lightbox-close',overlay).addEventListener('click',close);
    q('.lightbox-prev',overlay).addEventListener('click',()=>move(-1));
    q('.lightbox-next',overlay).addEventListener('click',()=>move(1));
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    overlay.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;const t=e.touches[0];touchStart={x:t.clientX,y:t.clientY}},{passive:true});
    overlay.addEventListener('touchend',e=>{if(!touchStart||!e.changedTouches.length)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1)},{passive:true});
  }
  function source(el){const im=el.tagName==='IMG'?el:q('img',el);return{src:el.dataset.full||im?.currentSrc||im?.src||'',alt:im?.alt||'Project image'}}
  function render(){
    if(!items.length)return;index=(index+items.length)%items.length;const x=source(items[index]);img.src=x.src;img.alt=x.alt;
    const status=q('[data-lightbox-status]',overlay),count=q('.lightbox-count',overlay),label=`${index+1} / ${items.length}`;
    if(status)status.textContent=`Project ${index+1} of ${items.length}: ${x.alt}`;if(count)count.textContent=label;
  }
  function open(el){ensure();items=eligible();index=Math.max(0,items.indexOf(el));lastFocus=document.activeElement;render();overlay.classList.add('open');lockPage();q('.lightbox-close',overlay).focus({preventScroll:true})}
  function close(){if(!overlay?.classList.contains('open'))return;overlay.classList.remove('open');unlockPage();lastFocus?.focus?.({preventScroll:true})}
  function move(n){index+=n;render()}
  qa('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const value=btn.dataset.filter;qa('[data-filter]').forEach(b=>{b.classList.toggle('is-active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});qa('[data-gallery-category]').forEach(card=>{card.hidden=value!=='all'&&!((card.dataset.galleryCategory||'').split(/\s+/).includes(value))})}));
  qa('[data-lightbox]').forEach(el=>{if(!['BUTTON','A'].includes(el.tagName)){el.tabIndex=0;el.setAttribute('role','button')}el.addEventListener('click',e=>{if(el.tagName==='A')e.preventDefault();open(el)});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el)}})});
  document.addEventListener('keydown',e=>{if(!overlay?.classList.contains('open'))return;if(e.key==='Escape'){close();return}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='Tab'){const focusables=qa('button,[href],[tabindex]:not([tabindex="-1"])',overlay).filter(el=>!el.disabled&&el.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
})();
