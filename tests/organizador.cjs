const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../assets/organizador/engine.js');
const base={date:'2026-12-21',contract:2640,rests:[6,5],weeks:4,basis:'liminar',custom:false};
test('marcos inclusivos 44/42/40',()=>{
 for(const [date,expected]of[['2026-12-15',44],['2026-12-16',42],['2027-12-15',42],['2027-12-16',40]])assert.equal(E.stage(date),expected);
});
test('42 horas equivalem a cinco dias de 8h24 e dois DSRs',()=>{
 const p=E.plan(base);assert.equal(p.total,2520);assert.deepEqual(p.daily,[504,504,504,504,504,0,0]);assert.deepEqual(p.issues,[]);
 assert.equal(p.calendar[0].days.filter(d=>d.kind==='dsr').length,2);
});
test('44h distinguem DSR de folga compensatória e exigem base',()=>{
 const p=E.plan({...base,date:'2026-12-14',basis:'unknown'});assert.equal(p.total,2640);assert.equal(p.daily[0],528);assert(p.issues.includes('basis'));
 const regular=E.plan({...base,date:'2026-11-23',basis:'individual'});assert.equal(regular.calendar[0].days.filter(d=>d.kind==='comp').length,1);
});
test('não aumenta contrato de 30h para 42h ou 40h',()=>{
 for(const date of ['2026-12-21','2027-12-20'])assert.equal(E.plan({...base,date,contract:1800,basis:'unknown'}).total,1800);
});
test('40h não recebem autorização subsidiária de 8h24',()=>{
 const p=E.plan({...base,date:'2027-12-20',custom:true,daily:[504,504,504,504,384,0,0]});assert(p.issues.includes('basis'));assert(p.issues.includes('liminarStage'));
});
test('distribuição 4x8h30 + 8h exige outra base',()=>{
 const p=E.plan({...base,custom:true,daily:[510,510,510,510,480,0,0]});assert.equal(p.total,2520);assert(p.issues.includes('basis'));assert(p.issues.includes('liminarLimit'));
});
test('dias separados e minutos não divisíveis por cinco',()=>{
 const p=E.plan({...base,contract:2401,rests:[6,1]});assert.equal(p.total,2401);assert.equal(p.daily[1],0);assert.equal(p.daily[6],0);
});
test('semanas mistas sinalizadas sem inventar teto proporcional',()=>{
 for(const date of ['2026-12-16','2027-12-16']){const p=E.plan({...base,date});assert(p.calendar[0].mixed);assert.equal(p.calendar[0].total,p.calendar[0].target);}
});
test('validação de datas, descansos repetidos, duração e excesso',()=>{
 assert.throws(()=>E.parseDate('2026-02-30'));assert.throws(()=>E.minutes('8.24'));assert.throws(()=>E.minutes('08:60'));
 assert(E.plan({...base,rests:[6,6]}).errors.includes('rests'));
 assert(E.plan({...base,contract:9999}).errors.includes('contract'));
 assert(E.plan({...base,custom:true,daily:[528,528,528,528,528,0,0]}).issues.includes('excess'));
});

test('entradas nulas e calendários no limite não causam exceção',()=>{assert(E.plan(null).errors.length);for(const date of ['2020-01-01','2100-12-31'])assert.equal(E.plan({...base,date,weeks:8}).calendar.length,8);});
