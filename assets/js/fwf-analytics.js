(()=>{
  window.dataLayer=window.dataLayer||[];
  const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
  const path=()=>location.pathname;
  const servicePage=()=>/^\/services\//.test(path())||['/printing-services/','/signage-led/','/packaging-solutions/','/graphic-design/','/apparel/','/digital-marketing/','/web-design/'].includes(path());
  const serviceName=()=>{
    const h1=document.querySelector('main h1');
    return clean(h1?h1.textContent:document.title.split('|')[0]);
  };
  const push=(event,data={})=>window.dataLayer.push({event,...data});

  document.addEventListener('click',e=>{
    const lightbox=e.target.closest('[data-lightbox]');
    if(lightbox){
      const img=lightbox.querySelector('img');
      push('portfolio_open',{
        project_name:clean((img&&img.alt)||lightbox.getAttribute('aria-label')||'Portfolio project').replace(/^Open larger image:\s*/i,''),
        project_category:clean(lightbox.dataset.workCategory||'portfolio')
      });
    }

    const link=e.target.closest('a[href]');
    if(!link||!servicePage())return;
    let href='';
    try{href=new URL(link.href,location.href).pathname}catch{return}
    if(href==='/get-a-quote/'||href==='/contact/'){
      push('service_cta_click',{
        service_name:serviceName(),
        cta_text:clean(link.textContent||link.getAttribute('aria-label')||'Contact')
      });
    }
  },{passive:true});

  document.addEventListener('submit',e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement))return;
    if(path()==='/get-a-quote/') sessionStorage.setItem('fwf_submit_source','quote_submit');
    if(path()==='/contact/') sessionStorage.setItem('fwf_submit_source','contact_submit');
  });

  if(path()==='/thanks/'){
    const source=sessionStorage.getItem('fwf_submit_source');
    if(source==='quote_submit'||source==='contact_submit'){
      push(source,{page_path:path()});
      sessionStorage.removeItem('fwf_submit_source');
    }
  }
})();
