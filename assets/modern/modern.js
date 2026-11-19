(() => {
'use strict';
const paths={home:'M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10',organizador:'M5 5h14v16H5zM8 3v4m8-4v4M5 10h14M8 14h3m3 0h2m-8 3h3',decreto:'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h5',contratos:'M6 3h9l4 4v14H6zM9 11h6m-6 4h4',gestao:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 11h5m-2-3 3 3-3 3',protecao:'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7zM8 12l3 3 5-6',previdencia:'M12 21S2 15 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 7-10 13-10 13',atividade:'M4 21V5m0 12c10 0 16-6 16-14C8 3 4 8 4 17m0 0L16 7',ferramentas:'M4 3h16v18H4zM8 7l1 1 2-2m2 1h3M8 12l1 1 2-2m2 1h3M8 17l1 1 2-2m2 1h3',fontes:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16'};
function decorate(){for(const a of document.querySelectorAll('.topic-nav a,.topic-cards a')){if(a.querySelector('svg'))continue;const key=a.hash.slice(1).replace(/^(pt|en|es)-/,'');const path=paths[key==='inicio'?'home':key]||paths.contratos;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','topic-icon');svg.setAttribute('aria-hidden','true');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',path);svg.append(p);a.prepend(svg);}}
new MutationObserver(decorate).observe(document.querySelector('.topic-nav'),{childList:true});decorate();
})();
/* Unidades informadas pelo escritório; sem endereços de rua presumidos. */
(() => {
 const units=document.createElement('div');units.className='schnorr-units';units.innerHTML='<strong>Unidades</strong><span>Alphaville/SP</span><span>Petrolina/PE</span><span>Recife/PE</span>';document.querySelector('main').append(units);
 const sync=()=>{units.querySelector('strong').textContent=document.documentElement.lang.startsWith('en')?'Locations':document.documentElement.lang.startsWith('es')?'Unidades':'Unidades';};new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});sync();
})();
