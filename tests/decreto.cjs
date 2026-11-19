const {test}=require('node:test');const assert=require('node:assert/strict');const C=require('../assets/decreto/calculo.js');
test('divisores 220/210/200 e salário preservado no exemplo comum',()=>{const r=C.compare(2500);assert.deepEqual(r.map(x=>x.applied),[220,210,200]);assert.equal(r[1].hour,2500/210);assert.equal(r[2].overtime50,18.75);});
test('divisor inferior prevalece em todas as etapas',()=>assert.deepEqual(C.compare(2500,180).map(x=>x.applied),[180,180,180]));
test('divisor informado maior não elimina o mais favorável legal',()=>assert.deepEqual(C.compare(2500,215).map(x=>x.applied),[215,210,200]));
test('valida valores sem truncamento silencioso ou separador ambíguo',()=>{assert.equal(C.money('2500,50'),2500.5);assert.equal(C.divisor(''),null);for(const v of ['','0','-1','2.500,00','Infinity','<img>','2500.123'])assert.throws(()=>C.money(v));for(const v of ['0','-1','221','NaN'])assert.throws(()=>C.divisor(v));});
test('API rejeita não finitos e etapa inválida',()=>{assert.throws(()=>C.reference(41));assert.throws(()=>C.compare(NaN));assert.throws(()=>C.compare(2500,0));});
