/* Divisor de referência para o regime comum; não representa horas de presença no mês. */
(function(root){
'use strict';
function reference(stage){if(![44,42,40].includes(stage))throw Error('stage');return stage*5;}
function money(value){
 if(typeof value!=='string'||!/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value.trim()))throw Error('salary');
 const number=Number(value.trim().replace(',','.'));if(!Number.isFinite(number)||number<=0||number>100000000)throw Error('salary');return number;
}
function divisor(value){
 if(value==='')return null;
 if(typeof value!=='string'||!/^\d{1,3}(?:[.,]\d{1,2})?$/.test(value.trim()))throw Error('divisor');
 const number=Number(value.trim().replace(',','.'));if(!Number.isFinite(number)||number<=0||number>220)throw Error('divisor');return number;
}
function compare(salary,moreFavourable=null){
 if(!Number.isFinite(salary)||salary<=0||salary>100000000)throw Error('salary');
 if(moreFavourable!==null&&(!Number.isFinite(moreFavourable)||moreFavourable<=0||moreFavourable>220))throw Error('divisor');
 return [44,42,40].map(stage=>{const standard=reference(stage),applied=moreFavourable===null?standard:Math.min(standard,moreFavourable),hour=salary/applied;return {stage,standard,applied,hour,overtime50:hour*1.5};});
}
const api=Object.freeze({reference,money,divisor,compare});
if(typeof module==='object'&&module.exports)module.exports=api;else root.SchnorrDecreeCalculation=api;
})(typeof window==='object'?window:globalThis);
