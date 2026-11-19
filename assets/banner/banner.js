/* Fotografias e capas originais, com extensão visual em CSS e sem rastreamento. */
(() => {
'use strict';
const slides=__SCHNORR_BANNER_SLIDES__;
const ui={pt:{region:'Divulgação institucional Schnorr',free:'Ferramenta gratuita · Uma iniciativa Schnorr',pause:'Pausar rotação',play:'Retomar rotação',slide:'Banner',website:'Site do escritório',contact:'Contato',instagram:'Instagram',illustration:'Imagem ilustrativa'},en:{region:'Schnorr institutional information',free:'Free tool · A Schnorr initiative',pause:'Pause rotation',play:'Resume rotation',slide:'Banner',website:'Firm website',contact:'Contact',instagram:'Instagram',illustration:'Illustrative image'},es:{region:'Información institucional Schnorr',free:'Herramienta gratuita · Una iniciativa Schnorr',pause:'Pausar rotación',play:'Reanudar rotación',slide:'Banner',website:'Sitio del despacho',contact:'Contacto',instagram:'Instagram',illustration:'Imagen ilustrativa'}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,paused=reduced.matches,timer=null,focused=false;
const lang=()=>document.documentElement.lang.startsWith('en')?'en':document.documentElement.lang.startsWith('es')?'es':'pt';
const banner=document.createElement('aside');banner.className='schnorr-banner';banner.dataset.campaign='photos-v3';banner.setAttribute('aria-roledescription','carousel');
banner.innerHTML='<div class="banner-backdrop" aria-hidden="true"></div><div class="banner-brand"><img decoding="async"></div><div class="banner-shade" aria-hidden="true"></div><div class="banner-front"><div class="banner-topline"></div><div class="banner-layout"><div class="banner-copy"><p class="banner-kicker"></p><h2></h2><p class="banner-description"></p><a class="banner-cta" target="_blank" rel="noopener noreferrer"></a></div></div><div class="banner-bottom"><nav class="banner-links"></nav><div class="banner-controls"><span class="banner-count" aria-live="off"></span><button type="button" class="banner-pause"></button></div></div></div><span class="banner-illustration"></span>';
document.querySelector('main').prepend(banner);
const image=banner.querySelector('.banner-brand img'),links=banner.querySelector('.banner-links');
for(const [key,url] of [['instagram','https://www.instagram.com/advschnorr/'],['website','https://advschnorr.com.br/'],['contact','https://advschnorr.com.br/#atendimento']]){const a=document.createElement('a');a.dataset.label=key;a.href=url;a.target='_blank';a.rel='noopener noreferrer';links.append(a);}
const preload=new Set();function warm(i){const s=slides[i%slides.length];if(preload.has(s.image))return;preload.add(s.image);const im=new Image();im.src=s.image;}
function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
function schedule(){stop();if(!paused&&!focused&&!document.hidden)timer=setInterval(()=>show(index+1),2000);}
function show(next){
 index=(next+slides.length)%slides.length;const s=slides[index],l=lang(),w=ui[l],[k,h,d,c]=s.text[l];
 banner.dataset.slideId=s.id;banner.dataset.kind=s.kind;banner.style.setProperty('--campaign-color',s.color);banner.style.setProperty('--campaign-position',s.position);banner.style.setProperty('--campaign-fit',s.fit);banner.setAttribute('aria-label',w.region);
 banner.querySelector('.banner-topline').textContent=w.free;banner.querySelector('.banner-kicker').textContent=k;banner.querySelector('h2').textContent=h;banner.querySelector('.banner-description').textContent=d;
 const cta=banner.querySelector('.banner-cta');cta.textContent=c;cta.href=s.url;
 image.src=s.image;image.alt=s.alt;banner.querySelector('.banner-backdrop').style.backgroundImage='url("'+s.image+'")';
 const count=banner.querySelector('.banner-count');count.replaceChildren(...slides.map((_,i)=>{const b=document.createElement('i');if(i===index)b.className='active';b.setAttribute('aria-hidden','true');return b;}));count.setAttribute('aria-label',w.slide+' '+(index+1)+' / '+slides.length);
 const pause=banner.querySelector('.banner-pause');pause.textContent=paused?w.play:w.pause;pause.setAttribute('aria-pressed',String(paused));
 links.setAttribute('aria-label',w.region);links.querySelectorAll('a').forEach(a=>a.textContent=w[a.dataset.label]);banner.querySelector('.banner-illustration').textContent=s.illustration?w.illustration:'';
 warm(index+1);
}
banner.querySelector('.banner-pause').addEventListener('click',()=>{paused=!paused;show(index);schedule();});
banner.addEventListener('focusin',()=>{focused=true;stop();});banner.addEventListener('focusout',e=>{focused=banner.contains(e.relatedTarget);schedule();});
document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',e=>{if(e.matches)paused=true;show(index);schedule();});new MutationObserver(()=>show(index)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});show(0);schedule();
})();
