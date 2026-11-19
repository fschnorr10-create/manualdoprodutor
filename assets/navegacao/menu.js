/* Navegação por assunto, com links compartilháveis e conteúdo integral preservado para impressão. */
(() => {
  'use strict';
  const groups = [
    ['organizador',['Escala 5 × 2','5 × 2 schedule','Escala 5 × 2'],['organizador']],
    ['decreto',['Decreto 13.173 e salário-hora','Decree 13,173 and hourly pay','Decreto 13.173 y salario-hora'],['decreto']],
    ['contratos',['Tipos de contratos de trabalho','Employment contract types','Tipos de contratos de trabajo'],['fundamentos','escolha','indeterminado','experiencia','determinado','safra','intermitente','pequeno','consorcio','avulso','temporario','terceirizacao','mei','cooperativa']],
    ['gestao',['Admissão e gestão do trabalho','Onboarding and employment management','Ingreso y gestión del trabajo'],['admissao','migrantes','jornada','rescisao','coletiva']],
    ['protecao',['Saúde e segurança no campo','Rural health and safety','Salud y seguridad rural'],['sst']],
    ['previdencia',['Previdência e benefícios','Social security and benefits','Previsión y beneficios'],['segurado','beneficios']],
    ['atividade',['Atividade e contratos rurais','Rural activities and agreements','Actividad y contratos rurales'],['terra','casos']],
    ['ferramentas',['Ferramentas e checklist','Tools and checklist','Herramientas y lista de control'],['ferramentas']],
    ['fontes',['Fontes e referências','Sources and references','Fuentes y referencias'],['fontes']]
  ];
  const words={pt:{home:'Menu principal',choose:'O que você quer consultar?',intro:'Escolha um assunto para abrir diretamente o conteúdo.',back:'Voltar ao menu principal',search:'Resultados da busca',all:'Ver todos os itens deste assunto'},en:{home:'Main menu',choose:'What would you like to consult?',intro:'Choose a topic to open its content directly.',back:'Back to main menu',search:'Search results',all:'View every item in this topic'},es:{home:'Menú principal',choose:'¿Qué desea consultar?',intro:'Seleccione un tema para abrir directamente su contenido.',back:'Volver al menú principal',search:'Resultados de búsqueda',all:'Ver todos los elementos de este tema'}};
  DATA.ui.menu={pt:'Menu principal',en:'Main menu',es:'Menú principal'};
  const language=()=>document.documentElement.lang.startsWith('en')?'en':document.documentElement.lang.startsWith('es')?'es':'pt';
  const title=(g,l)=>g[1][['pt','en','es'].indexOf(l)];
  const link=(key,label)=>{const a=document.createElement('a');a.href='#'+key;a.textContent=label;return a;};
  let route=decodeURIComponent(location.hash.slice(1))||'inicio';
  const legacy=document.querySelector('.toc');legacy.classList.add('legacy-toc');
  const nav=document.createElement('nav');nav.className='topic-nav';legacy.before(nav);
  for(const article of document.querySelectorAll('.language')){
    const l=article.dataset.lang,w=words[l],home=document.createElement('section');home.className='topic-home';home.dataset.key='menu';
    const heading=document.createElement('h2');heading.textContent=w.choose;home.append(heading);
    const p=document.createElement('p');p.textContent=w.intro;home.append(p);
    const cards=document.createElement('div');cards.className='topic-cards';
    groups.forEach(g=>cards.append(link(g[0],title(g,l))));home.append(cards);
    article.querySelector('.hero').after(home);
    const bar=document.createElement('section');bar.className='topic-bar';
    bar.append(link('inicio',w.back));const h=document.createElement('h2');h.tabIndex=-1;bar.append(h);
    const sub=document.createElement('nav');sub.className='topic-subnav';bar.append(sub);home.after(bar);
  }
  function render(key=route,scroll=false){
    route=key;const l=language(),w=words[l],article=document.querySelector('.language[data-lang="'+l+'"]');
    document.querySelectorAll('[data-ui=menu]').forEach(e=>e.textContent=w.home);
    const query=document.getElementById('search').value.trim();
    let group=groups.find(g=>g[0]===key)||groups.find(g=>g[2].includes(key));
    if(!group&&key!=='inicio'&&key!=='menu'){route='inicio';key='inicio';}
    const home=!query&&(!group||key==='inicio'||key==='menu');
    const keys=group?(group[0]===key?group[2]:[key]):[];
    for(const a of document.querySelectorAll('.language')){
      a.querySelector('.hero').classList.add('route-hidden');
      a.querySelector('.stats').classList.add('route-hidden');a.querySelector('.scope').classList.add('route-hidden');
      a.querySelector('.topic-home').classList.toggle('route-hidden',!home);
      a.querySelector('.topic-bar').classList.toggle('route-hidden',home);
      a.querySelectorAll('.chapter').forEach(s=>s.classList.toggle('route-hidden',home||(!query&&!keys.includes(s.dataset.key))));
    }
    nav.replaceChildren(link('inicio',w.home),...groups.map(g=>link(g[0],title(g,l))));nav.setAttribute('aria-label',w.home);
    nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+(home?'inicio':group?.[0]))a.setAttribute('aria-current','page');});
    const bar=article.querySelector('.topic-bar');bar.querySelector('h2').textContent=query?w.search:group?title(group,l):w.home;
    const sub=bar.querySelector('nav');sub.replaceChildren();sub.setAttribute('aria-label',group?title(group,l):w.search);
    if(group&&group[2].length>1&&!query){
      sub.append(link(group[0],w.all));
      for(const id of group[2]){const ch=DATA.chapters.find(c=>c.id===id);if(ch)sub.append(link(id,ch.title[l]));}
    }
    document.getElementById('no-results').hidden=!query||!!article.querySelector('.chapter:not(.search-hidden)');
    document.body.classList.remove('menu-open');document.querySelector('.menu-btn').setAttribute('aria-expanded','false');
    if(scroll){
      const target=home?article.querySelector('.topic-home'):(key!==group?.[0]&&!query?article.querySelector('[data-key="'+CSS.escape(key)+'"]'):bar);
      target?.scrollIntoView({behavior:'auto',block:'start'});
    }
  }
  function navigate(key){
    const search=document.getElementById('search');search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
    const url=new URL(location.href);url.hash=key;history.pushState(null,'',url.pathname+url.search+url.hash);render(key,true);
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');if(!a||a.hash==='#main')return;
    e.preventDefault();e.stopImmediatePropagation();navigate(decodeURIComponent(a.hash.slice(1))||'inicio');
  },true);
  document.getElementById('search').addEventListener('input',()=>render());
  document.getElementById('clear-search').addEventListener('click',()=>render());
  window.addEventListener('popstate',()=>render(decodeURIComponent(location.hash.slice(1))||'inicio',true));
  window.addEventListener('hashchange',()=>render(decodeURIComponent(location.hash.slice(1))||'inicio',true));
  new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  render();
})();
