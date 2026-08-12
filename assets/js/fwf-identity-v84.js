(()=>{
  const rails=[...document.querySelectorAll('.design-proof [data-rail]')];
  if(!rails.length)return;
  rails.forEach(rail=>{
    [...rail.children].forEach((tile,index)=>{
      if(!tile.matches('.work-tile'))return;
      const img=tile.querySelector('img');if(!img)return;
      const match=(img.getAttribute('src')||'').match(/brand-identity-(\d{2})\.webp$/);if(!match)return;
      const id=match[1],caption=tile.dataset.caption||`Identity Set ${index+1}`,baseAlt=img.alt||caption;
      const card=document.createElement('article');card.className='identity-group-card';card.dataset.railItem='';card.setAttribute('aria-label',caption);
      const main=document.createElement('button');main.type='button';main.className='identity-main';main.dataset.lightbox='';main.dataset.caption=`${caption} · Logo 1`;main.setAttribute('aria-label',`Open larger image: ${caption}, logo 1`);
      const mainImg=document.createElement('img');mainImg.src=`/assets/images/portfolio/identity-panels/brand-identity-${id}-1.webp`;mainImg.alt=`${baseAlt} — logo option 1`;mainImg.loading='lazy';mainImg.decoding='async';mainImg.width=396;mainImg.height=680;main.append(mainImg);
      const options=document.createElement('div');options.className='identity-options';options.setAttribute('role','group');options.setAttribute('aria-label',`Choose logo from ${caption}`);
      for(let n=1;n<=3;n++){
        const b=document.createElement('button');b.type='button';b.className=`identity-option${n===1?' is-active':''}`;b.dataset.identityOption=String(n);b.setAttribute('aria-pressed',String(n===1));b.setAttribute('aria-label',`Show logo ${n} from ${caption}`);
        const thumb=document.createElement('img');thumb.src=`/assets/images/portfolio/identity-panels/brand-identity-${id}-${n}.webp`;thumb.alt='';thumb.setAttribute('aria-hidden','true');thumb.loading='lazy';thumb.decoding='async';b.append(thumb);
        b.addEventListener('click',()=>{
          if(b.classList.contains('is-active'))return;
          const src=thumb.src;new Image().src=src;main.classList.add('is-switching');
          setTimeout(()=>{mainImg.src=src;mainImg.alt=`${baseAlt} — logo option ${n}`;main.dataset.caption=`${caption} · Logo ${n}`;main.setAttribute('aria-label',`Open larger image: ${caption}, logo ${n}`);options.querySelectorAll('.identity-option').forEach(o=>{const active=o===b;o.classList.toggle('is-active',active);o.setAttribute('aria-pressed',String(active))});main.classList.remove('is-switching')},90);
        });
        options.append(b);
      }
      card.append(main,options);tile.replaceWith(card);
    });
  });
})();
