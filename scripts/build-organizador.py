"""Insere o módulo 5x2 no HTML offline preservando os demais capítulos e ferramentas."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'index.html';page=p.read_text()
for kind,id in [('style','schnorr-schedule-style'),('script','schnorr-schedule-engine'),('script','schnorr-schedule-interface')]:
 page=re.sub(r'<'+kind+r' id="'+id+r'">.*?</'+kind+'>','',page,flags=re.S)
page=re.sub(r'<section[^>]*data-schedule-planner[^>]*></section>','',page)
page=re.sub(r'<a[^>]*data-schedule-(?:nav|entry)[^>]*>.*?</a>','',page,flags=re.S)
labels={'pt':'Organizador da escala 5 × 2','en':'5 × 2 work schedule planner','es':'Organizador de la escala 5 × 2'}
count=0
def insert(m):
 global count
 l=['pt','en','es'][count];count+=1
 return '<section class="chapter editorial-wash editorial-theme-calendario editorial-corner-br schedule-planner" data-key="organizador" data-schedule-planner aria-labelledby="schedule-'+l+'-title"></section>'+m.group(0)
page=re.sub(r'<section\b(?=[^>]*data-key="fontes")[^>]*>',insert,page);assert count==3
page=page.replace('<a href="#fontes" data-nav="fontes">','<a href="#organizador" data-nav="organizador" data-schedule-nav><span>5×2</span><b>'+labels['pt']+'</b></a><a href="#fontes" data-nav="fontes">',1)
# Atalho visível na abertura de cada idioma.
count=0
def entry(m):
 global count
 l=['pt','en','es'][count];count+=1
 tag='<a class="button secondary" href="#organizador" data-schedule-entry>'+labels[l]+'</a>'
 return m.group(1)+m.group(2).replace('<div class="button-row">','<div class="button-row">'+tag,1)+m.group(3)
page=re.sub(r'(<section\b(?=[^>]*data-key="inicio")[^>]*>)(.*?)(</section>)',entry,page,flags=re.S)
assert count==3
css=(ROOT/'assets/organizador/style.css').read_text();engine=(ROOT/'assets/organizador/engine.js').read_text();ui=(ROOT/'assets/organizador/interface.js').read_text()
page=page.replace('</head>','<style id="schnorr-schedule-style">'+css+'</style></head>')
page=page.replace('</body>','<script id="schnorr-schedule-engine">'+engine+'</script><script id="schnorr-schedule-interface">'+ui+'</script></body>')
p.write_text(page)
