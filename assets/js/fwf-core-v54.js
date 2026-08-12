(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body,header=q('[data-header]'),toggle=q('.menu-toggle'),mobile=q('.mobile-nav');
  let backdrop=null;
  if(mobile&&mobile.parentElement!==body)body.appendChild(mobile);
  if(mobile){
    backdrop=document.createElement('div');
    backdrop.className='mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    body.appendChild(backdrop);
  }
  function setMenuState(open){
    if(!mobile||!toggle)return;
    mobile.classList.toggle('open',open);
    backdrop?.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    mobile.setAttribute('aria-hidden',String(!open));
    body.classList.toggle('menu-open',open);
  }
  function closeMenu(){setMenuState(false)}
  if(toggle&&mobile){
    setMenuState(false);
    toggle.addEventListener('click',()=>setMenuState(!mobile.classList.contains('open')));
    backdrop?.addEventListener('click',closeMenu);
    qa('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('click',e=>{if(mobile.classList.contains('open')&&header&&!header.contains(e.target)&&!mobile.contains(e.target)&&e.target!==backdrop)closeMenu()});
    const mq=matchMedia('(min-width:1281px)');
    const sync=e=>{if(e.matches)closeMenu()};
    mq.addEventListener?.('change',sync);
  }
  qa('.mobile-nav details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)qa('.mobile-nav details').forEach(o=>{if(o!==d)o.open=false})}));
  qa('.faq details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){const faq=d.closest('.faq');if(faq)qa('details',faq).forEach(o=>{if(o!==d)o.open=false})}}));
  const scrollState=()=>header?.classList.toggle('is-scrolled',scrollY>10);addEventListener('scroll',scrollState,{passive:true});scrollState();
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();const active=document.activeElement;if(active&&active.closest?.('.category-mega')){active.closest('.category-item')?.querySelector('.category-top-link')?.focus()}}});
  qa('[data-current-year]').forEach(el=>el.textContent=new Date().getFullYear());
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
    const targets=qa('.section-head,.service-row,.use-case,.step,.testimonial,.work-tile,.identity-set-card,.gallery-card,.category-card,.web-showcase-card,.seo-proof-card,.account-entry-card,.account-entry-grid article,.catalog-detail,.deep-link-grid>a,.split>.prose,.side-image,.service-spec');
    targets.forEach(el=>el.classList.add('reveal'));
    const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');io.unobserve(x.target)}}),{rootMargin:'0px 0px -7% 0px',threshold:.05});
    targets.forEach(el=>io.observe(el));
  }
  const params=new URLSearchParams(location.search),interest=params.get('service');
  if(interest){const hi=q('input[name="interest"]');if(hi)hi.value=interest;const ta=q('textarea[name="message"]');if(ta&&!ta.value)ta.value=`I'm interested in ${interest}. `}
  qa('form').forEach(form=>form.addEventListener('submit',()=>{const btn=q('button[type="submit"],input[type="submit"]',form);if(btn){if(btn.tagName==='INPUT')btn.value='Sending…';else btn.textContent='Sending…';btn.setAttribute('aria-busy','true')}}));
})();
