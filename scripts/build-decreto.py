"""Atualiza apenas a jornada e incorpora a nova referência, sem republicar o livro."""
from pathlib import Path
import json,re,html
ROOT=Path(__file__).resolve().parents[1]
DOU='https://www.in.gov.br/web/dou/-/decreto-n-13.173-de-19-de-novembro-de-2026-745538217'
def section(l):
 t=json.loads((ROOT/'assets/decreto/conteudo.json').read_text())[l];e=html.escape
 parts=[f'<section class="chapter decree-module" data-key="decreto" data-decree-module="{l}" id="{l}-decreto"><p class="decree-badge">{e(t["updated"])}</p><h2>{e(t["title"])}</h2><p>{e(t["intro"])}</p>']
 for s in t['sections']:
  parts.append(f'<div class="decree-item"><h3>{e(s["title"])}</h3><p>{e(s["body"])}</p>')
  if s.get('quote'):parts.append(f'<blockquote><em>“{e(s["quote"])}”</em> (art. 5º, parágrafo único)</blockquote>')
  parts.append(f'<p class="decree-example"><strong>{e(t["exampleLabel"])}:</strong> {e(s["example"])}</p><p class="caption">{e(s["source"])}</p></div>')
 parts.append(f'<div class="decree-calculator"><h3>{e(t["calcTitle"])}</h3><p>{e(t["calcIntro"])}</p><form><label>{e(t["salary"])}<input name="salary" inputmode="decimal" value="2500.00" maxlength="12" required></label><label>{e(t["favourable"])}<input name="favourable" inputmode="decimal" maxlength="6"></label><div class="button-row"><button type="submit">{e(t["apply"])}</button><button type="button" class="decree-reset">{e(t["reset"])}</button></div></form><p class="decree-error" role="status"></p><div class="decree-result" aria-live="polite"></div><p class="caption">{e(t["note"])}</p></div><p><a href="#organizador">{e(t["plannerLink"])}</a></p><h3>{e(t["sources"])}</h3><p>{e(t["scope"])}</p><p>{e(t["book"])}</p><p><a href="{DOU}" target="_blank" rel="noopener noreferrer">{e(t["sourceLabel"])}: Decreto 13.173/2026</a></p><script type="application/json" data-decree-ui>{json.dumps(t,ensure_ascii=False).replace("<","&lt;")}</script></section>')
 return ''.join(parts)
def build():
 p=ROOT/'index.html';s=p.read_text()
 # O módulo não contém sections aninhadas, permitindo substituição determinística.
 s=re.sub(r'<section class="chapter decree-module".*?</section>','',s,flags=re.S)
 for kind,name in [('style','schnorr-decree-style'),('script','schnorr-decree-calculation'),('script','schnorr-decree-interface')]:s=re.sub(rf'<{kind} id="{name}">.*?</{kind}>','',s,flags=re.S)
 langs=iter(['pt','en','es']);s=re.sub(r'<section\b(?=[^>]*data-key="fontes")[^>]*>',lambda m:section(next(langs))+m.group(),s)
 s=s.replace('</head>','<style id="schnorr-decree-style">'+(ROOT/'assets/decreto/style.css').read_text()+'</style></head>')
 scripts='<script id="schnorr-decree-calculation">'+(ROOT/'assets/decreto/calculo.js').read_text()+'</script><script id="schnorr-decree-interface">'+(ROOT/'assets/decreto/interface.js').read_text()+'</script>'
 s=s.replace('<script id="schnorr-topic-menu">',scripts+'<script id="schnorr-topic-menu">',1)
 # Corrige a referência geral antiga do capítulo de jornada, sem rever seus outros temas.
 changes=[('A referência geral é de 8 horas diárias e 44 semanais, ressalvados regimes válidos.','Até 15/12/2026, a referência geral é de 8 horas diárias e 44 semanais. A transição passa a 42h e dois DSRs em 16/12/2026 e a 40h em 16/12/2027. O Decreto 13.173/2026 fixa os divisores 210 e 200 nas respectivas etapas, preservado o mais favorável. Consulte o item Decreto 13.173 no menu para regimes especiais e salário-hora.'),('The general reference is 8 hours daily and 44 weekly, subject to valid alternative regimes.','The general reference through 15/12/2026 is 8 daily and 44 weekly hours. The transition brings 42h and two paid rest days on 16/12/2026 and 40h on 16/12/2027. See the Decree 13,173 menu item for hourly pay and special regimes.'),('La referencia general es de 8 horas diarias y 44 semanales, salvo regímenes válidos.','Hasta el 15/12/2026, la referencia general es de 8 horas diarias y 44 semanales. La transición pasa a 42h y dos descansos el 16/12/2026 y a 40h el 16/12/2027. Consulte Decreto 13.173 en el menú para salario-hora y regímenes especiales.')]
 for a,b in changes:s=s.replace(a,b)
 p.write_text(s)
if __name__=='__main__':build()
