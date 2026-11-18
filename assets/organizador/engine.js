/* Cálculo em minutos inteiros e datas UTC, sem arredondar jornadas ou depender do fuso. */
(function(root){
'use strict';
const DAY=86400000;
function parseDate(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('date');
 const d=new Date(value+'T00:00:00Z');
 if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==value||value<'1900-01-01'||value>'2200-12-31')throw Error('date');
 return d;
}
const iso=d=>d.toISOString().slice(0,10);
const add=(d,n)=>new Date(+d+n*DAY);
const weekday=d=>(d.getUTCDay()+6)%7;
function stage(date){parseDate(date);return date<'2026-12-16'?44:date<'2027-12-16'?42:40;}
function minutes(value){
 const m=typeof value==='string'&&/^(\d{1,2}):([0-5]\d)$/.exec(value);
 if(!m)throw Error('time');return Number(m[1])*60+Number(m[2]);
}
const duration=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function uniform(total,rests){
 const days=Array.from({length:7},(_,i)=>i).filter(i=>!rests.includes(i));
 return Array.from({length:7},(_,i)=>rests.includes(i)?0:Math.floor(total/5)+(days.indexOf(i)<total%5?1:0));
}
function validate(config){
 const errors=[];
 if(!config||typeof config!=='object'||Array.isArray(config))return ['date'];
 try{parseDate(config.date);if(config.date<'2020-01-01'||config.date>'2100-12-31')throw Error('date');}catch{errors.push('date');}
 if(!Number.isInteger(config.contract)||config.contract<5||config.contract>2640)errors.push('contract');
 if(!Array.isArray(config.rests)||config.rests.length!==2||config.rests.some(x=>!Number.isInteger(x)||x<0||x>6)||config.rests[0]===config.rests[1])errors.push('rests');
 if(![1,4,8].includes(config.weeks))errors.push('weeks');
 if(!['unknown','individual','collective','liminar'].includes(config.basis))errors.push('basis');
 if(typeof config.custom!=='boolean')errors.push('time');
 if(config.custom&&(!Array.isArray(config.daily)||config.daily.length!==7||config.daily.some((x,i)=>!Number.isInteger(x)||x<0||x>600||(!config.rests?.includes(i)&&x===0)||config.rests?.includes(i)&&x!==0)))errors.push('time');
 return [...new Set(errors)];
}
function plan(config){
 const errors=validate(config);if(errors.length)return {errors};
 const selectedStage=stage(config.date),target=Math.min(config.contract,selectedStage*60);
 const daily=config.custom?config.daily.slice():uniform(target,config.rests);
 const sum=daily.reduce((a,b)=>a+b,0),issues=[];
 if(sum>target)issues.push('excess');if(sum<target)issues.push('short');
 if(daily.some(x=>x>480)){
  const valid=config.basis==='collective'||selectedStage===44&&config.basis==='individual'||selectedStage===42&&config.basis==='liminar'&&daily.every(x=>x<=504);
  if(!valid)issues.push('basis');
 }
 if(config.basis==='liminar'&&selectedStage!==42)issues.push('liminarStage');
 if(config.basis==='liminar'&&daily.some(x=>x>504))issues.push('liminarLimit');
 if(!config.rests.includes(6))issues.push('sunday');
 if(config.basis==='collective')issues.push('collective');
 const monday=add(parseDate(config.date),-weekday(parseDate(config.date))),calendar=[];
 for(let w=0;w<config.weeks;w++){
  const start=add(monday,w*7),dates=Array.from({length:7},(_,i)=>iso(add(start,i))),stages=dates.map(stage);
  const weekStage=Math.min(...stages),mixed=new Set(stages).size>1;
  const weekTarget=Math.min(config.contract,weekStage*60);
  // Na semana que cruza o marco, o rascunho usa o menor teto, sem rateio proporcional.
  const wd=!mixed&&weekStage===selectedStage?daily:uniform(weekTarget,config.rests);
  calendar.push({start:dates[0],end:dates[6],stage:weekStage,mixed,target:weekTarget,total:wd.reduce((a,b)=>a+b,0),days:dates.map((date,i)=>({date,weekday:i,stage:stages[i],minutes:wd[i],kind:i===config.rests[0]?'dsr':i===config.rests[1]?(stages[i]===44?'comp':'dsr'):'work'}))});
 }
 return {errors:[],stage:selectedStage,target,total:sum,daily,issues,calendar};
}
const api=Object.freeze({parseDate,stage,minutes,duration,uniform,validate,plan});
if(typeof module==='object'&&module.exports)module.exports=api;else root.SchnorrSchedule=api;
})(typeof window==='object'?window:globalThis);
