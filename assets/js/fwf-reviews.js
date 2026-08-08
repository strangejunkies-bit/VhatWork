(()=>{
  const section=document.querySelector('[data-google-reviews]');
  if(!section)return;
  const endpoint=section.dataset.reviewsEndpoint;
  const grid=section.querySelector('[data-google-review-grid]');
  const ratingEl=section.querySelector('[data-google-rating]');
  const countEl=section.querySelector('[data-google-review-count]');
  const reviewsLink=section.querySelector('[data-google-reviews-link]');
  const profileLink=section.querySelector('[data-google-profile-link]');
  const writeLink=section.querySelector('[data-google-write-review]');
  const fallback='https://maps.app.goo.gl/EJw92vgT3aAMV26S9?g_st=aw';
  const escStars=(rating)=>'★'.repeat(Math.max(0,Math.min(5,Math.round(Number(rating)||0))))+'☆'.repeat(Math.max(0,5-Math.round(Number(rating)||0)));
  const safeUrl=(value,fallbackUrl=fallback)=>{try{const u=new URL(value);return /^https:$/.test(u.protocol)?u.href:fallbackUrl}catch{return fallbackUrl}};
  const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!=null)el.textContent=text;return el};
  const renderReview=(review)=>{
    const card=make('article','google-review-card');
    const author=make('div','google-review-author');
    const attr=review.author||{};
    if(attr.photoUri){const img=make('img','google-review-avatar');img.src=safeUrl(attr.photoUri,'');img.alt=`${attr.displayName||'Google reviewer'} profile photo`;img.loading='lazy';img.referrerPolicy='no-referrer';author.append(img)}
    const authorCopy=make('div','google-review-author-copy');
    if(attr.uri){const a=make('a',null,attr.displayName||'Google reviewer');a.href=safeUrl(attr.uri);a.target='_blank';a.rel='noopener';authorCopy.append(a)}else{authorCopy.append(make('strong',null,attr.displayName||'Google reviewer'))}
    if(review.relativeTime)authorCopy.append(make('span','google-review-time',review.relativeTime));
    author.append(authorCopy);card.append(author);
    const stars=make('div','google-review-stars',escStars(review.rating));stars.setAttribute('aria-label',`${review.rating||0} out of 5 stars`);card.append(stars);
    if(review.text)card.append(make('p','google-review-text',review.text));
    const source=make('a','google-review-source','View this review on Google Maps →');source.href=safeUrl(review.googleMapsUri);source.target='_blank';source.rel='noopener';card.append(source);
    return card;
  };
  const showFallback=()=>{
    grid.setAttribute('aria-busy','false');grid.replaceChildren();
    const box=make('div','google-reviews-error');box.append(make('p',null,'Read our current customer reviews directly on Google Maps.'));
    const a=make('a',null,'Open Google Reviews →');a.href=fallback;a.target='_blank';a.rel='noopener';box.append(a);grid.append(box);
  };
  fetch(endpoint,{headers:{Accept:'application/json'}})
    .then(r=>{if(!r.ok)throw new Error('Reviews unavailable');return r.json()})
    .then(data=>{
      const rating=Number(data.rating);if(Number.isFinite(rating))ratingEl.textContent=rating.toFixed(1);
      if(Number.isFinite(Number(data.reviewCount)))countEl.textContent=`${Number(data.reviewCount).toLocaleString()} Google reviews`;
      const profile=safeUrl(data.reviewsUri||data.googleMapsUri);[reviewsLink,profileLink].forEach(a=>{if(a)a.href=profile});
      if(writeLink)writeLink.href=safeUrl(data.writeAReviewUri||data.googleMapsUri);
      grid.replaceChildren();
      const reviews=Array.isArray(data.reviews)?data.reviews:[];
      reviews.filter(r=>r&&r.text).slice(0,5).forEach(r=>grid.append(renderReview(r)));
      grid.setAttribute('aria-busy','false');
      if(!grid.children.length)showFallback();
    })
    .catch(showFallback);
})();
