/* O exemplo começa calculado; entradas inválidas não substituem resultados válidos. */
(() => {
'use strict';
const C=window.SchnorrDecreeCalculation;
for(const section of document.querySelectorAll('[data-decree-module]')){
 const l=section.dataset.decreeModule,t=JSON.parse(section.querySelector('[data-decree-ui]').textContent),form=section.querySelector('form'),output=section.querySelector('.decree-result'),error=section.querySelector('.decree-error');
 const fmt=new Intl.NumberFormat(l==='en'?'en-US':l==='es'?'es-ES':'pt-BR',{style:'currency',currency:'BRL'});
 function calculate(){
  let rows;try{rows=C.compare(C.money(form.elements.salary.value),C.divisor(form.elements.favourable.value));}catch(e){error.textContent=t.errors[e.message]||t.errors.salary;return;}
  error.textContent='';const table=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');
  for(const label of t.headers){const th=document.createElement('th');th.scope='col';th.textContent=label;tr.append(th);}head.append(tr);table.append(head);const body=document.createElement('tbody');
  rows.forEach((r,i)=>{const tr=document.createElement('tr');for(const v of [r.stage+'h',t.periods[i],r.standard,r.applied,fmt.format(r.hour),fmt.format(r.overtime50)]){const td=document.createElement('td');td.textContent=v;tr.append(td);}body.append(tr);});table.append(body);output.replaceChildren(table);
 }
 form.addEventListener('submit',e=>{e.preventDefault();calculate();});section.querySelector('.decree-reset').addEventListener('click',()=>{form.elements.salary.value='2500.00';form.elements.favourable.value='';calculate();});calculate();
}
})();
