(()=>{
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const body=document.body,header=q('[data-header]'),toggle=q('.menu-toggle'),mobile=q('.mobile-nav');
  function closeMenu(){
    if(!mobile||!toggle)return;
    mobile.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    body.classList.remove('menu-open');
  }
  if(toggle&&mobile){
    toggle.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
      body.classList.toggle('menu-open',open);
    });
    qa('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('click',e=>{if(mobile.classList.contains('open')&&header&&!header.contains(e.target))closeMenu()});
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
    const targets=qa('.section-head,.service-row,.use-case,.step,.testimonial,.work-tile,.gallery-card,.category-card,.service-directory-group,.catalog-detail,.deep-link-grid>a,.split>.prose,.side-image,.service-spec');
    targets.forEach(el=>el.classList.add('reveal'));
    const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');io.unobserve(x.target)}}),{rootMargin:'0px 0px -7% 0px',threshold:.05});
    targets.forEach(el=>io.observe(el));
  }
  const params=new URLSearchParams(location.search),interest=params.get('service');
  if(interest){const hi=q('input[name="interest"]');if(hi)hi.value=interest;const ta=q('textarea[name="message"]');if(ta&&!ta.value)ta.value=`I'm interested in ${interest}. `}
  qa('form').forEach(form=>form.addEventListener('submit',()=>{const btn=q('button[type="submit"],input[type="submit"]',form);if(btn){if(btn.tagName==='INPUT')btn.value='Sending…';else btn.textContent='Sending…';btn.setAttribute('aria-busy','true')}}));
})();