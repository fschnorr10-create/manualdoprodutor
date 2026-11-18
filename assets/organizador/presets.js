/* Modelos completos por etapa. Os ajustes ficam separados dos exemplos de referência. */
(function(root){
'use strict';
const E=root.SchnorrSchedule||require('./engine.js');
const stages=[44,42,40],start={44:'2020-01-01',42:'2026-12-16',40:'2027-12-16'},end={44:'2026-12-15',42:'2027-12-15',40:'2100-12-31'};
function example(stage){
 if(!stages.includes(stage))throw Error('stage');
 return {stage,contract:2640,rest1:6,rest2:stage===44?-1:5,basis:stage===42?'liminar':'unknown',custom:false,daily:stage===44?[480,480,480,480,480,240,0]:[...Array(5).fill(stage===42?504:480),0,0]};
}
function automatic(c){
 const target=Math.min(c.contract,c.stage*60),rests=[c.rest1,c.rest2],work=Array.from({length:7},(_,i)=>i).filter(i=>!rests.includes(i));
 if(c.stage===44&&c.contract===2640&&c.rest1===6&&c.rest2===-1)return [480,480,480,480,480,240,0];
 return Array.from({length:7},(_,i)=>rests.includes(i)?0:Math.floor(target/work.length)+(work.indexOf(i)<target%work.length?1:0));
}
function assess(c){
 const errors=[];
 if(!c||!stages.includes(c.stage))return {errors:['stage']};
 if(!Number.isInteger(c.contract)||c.contract<6||c.contract>2640)errors.push('contract');
 if(!Number.isInteger(c.rest1)||c.rest1<0||c.rest1>6||!Number.isInteger(c.rest2)||c.rest2<(c.stage===44?-1:0)||c.rest2>6||c.rest1===c.rest2)errors.push('rests');
 if(!['unknown','individual','collective','liminar'].includes(c.basis))errors.push('basis');
 if(typeof c.custom!=='boolean')errors.push('time');
 if(errors.length)return {errors};
 const target=Math.min(c.contract,c.stage*60),daily=c.custom?c.daily:automatic(c);
 if(!Array.isArray(daily)||daily.length!==7||daily.some((n,i)=>!Number.isInteger(n)||n<0||n>600||([c.rest1,c.rest2].includes(i)?n!==0:n===0)))return {errors:['time']};
 const total=daily.reduce((a,b)=>a+b,0),issues=[];
 if(total>target)issues.push('excess');if(total<target)issues.push('short');
 if(daily.some(n=>n>480)){
  const allowed=c.basis==='collective'||c.stage===44&&c.basis==='individual'||c.stage===42&&c.basis==='liminar'&&daily.every(n=>n<=504);
  if(!allowed)issues.push('basis');
 }
 if(c.basis==='liminar'&&c.stage!==42)issues.push('liminarStage');
 if(c.basis==='liminar'&&daily.some(n=>n>504))issues.push('liminarLimit');
 if(![c.rest1,c.rest2].includes(6))issues.push('sunday');
 if(c.basis==='collective')issues.push('collective');
 return {errors:[],target,total,daily:daily.slice(),issues,days:daily.map((minutes,i)=>({weekday:i,minutes,kind:i===c.rest1?'dsr':i===c.rest2?(c.stage===44?'comp':'dsr'):'work'}))};
}
function calendar(c,date,weeks){
 let first;try{first=E.parseDate(date);}catch{return {errors:['date']};}
 if(date<start[c.stage]||date>end[c.stage])return {errors:['period']};
 if(![1,4,8].includes(weeks))return {errors:['weeks']};
 const a=assess(c);if(a.errors.length)return {errors:a.errors};
 const day=86400000,monday=new Date(+first-((first.getUTCDay()+6)%7)*day),rows=[];let truncated=false;
 for(let w=0;w<weeks;w++){
  const dates=Array.from({length:7},(_,i)=>new Date(+monday+(w*7+i)*day).toISOString().slice(0,10));
  const days=dates.flatMap((d,i)=>d>=start[c.stage]&&d<=end[c.stage]?[{...a.days[i],date:d}]:[]);
  if(!days.length){truncated=true;continue;}
  rows.push({days,partial:days.length!==7,total:days.reduce((sum,d)=>sum+d.minutes,0)});
 }
 return {errors:[],rows,truncated};
}
const api=Object.freeze({example,automatic,assess,calendar,start,end});
if(typeof module==='object'&&module.exports)module.exports=api;else root.SchnorrSchedulePresets=api;
})(typeof window==='object'?window:globalThis);
