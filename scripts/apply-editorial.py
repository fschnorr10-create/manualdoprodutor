"""Aplica a identidade Schnorr sem reescrever o conteúdo ou o JavaScript do manual."""
from pathlib import Path
import base64,re
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets/editorial'
def data_url(name):
 return 'data:image/png;base64,'+base64.b64encode((ASSETS/name).read_bytes()).decode()
def build():
 path=ROOT/'index.html';page=path.read_text()
 page=re.sub(r'<style id="schnorr-editorial">.*?</style>','',page,flags=re.S)
 page=re.sub(r'class="([^"]*)"',lambda m:'class="'+' '.join(c for c in m.group(1).split() if not c.startswith('editorial-'))+'"',page)
 themes={'campo':['safra','migrantes','terra','sst','casos'],'calendario':['experiencia','determinado','intermitente','pequeno','segurado','jornada','rescisao']}
 def section(match):
  attrs=match.group(1);key=re.search(r'data-key="([^"]+)"',attrs)
  if not key:return match.group(0)
  key=key.group(1)
  if key in ['inicio','fontes']:theme='campo'
  else:theme=next((t for t,keys in themes.items() if key in keys),'negociacao')
  # Espelhamento horizontal apenas em ilustrações sem texto, números ou marca.
  corner=['br','bl'][sum(map(ord,key))%2]
  attrs=attrs.replace('class="','class="editorial-wash editorial-theme-'+theme+' editorial-corner-'+corner+' ',1)
  return '<section'+attrs+'>'
 page=re.sub(r'<section([^>]+)>',section,page)
 logo=data_url('logo-schnorr-transparente.png')
 def replace_logo(m):
  tag=m.group(0)
  if 'Schnorr &amp;' in tag or 'Schnorr & Advogados' in tag:tag=re.sub(r'src="[^"]+"',lambda _: 'src="'+logo+'"',tag)
  return tag
 page=re.sub(r'<img\b[^>]*>',replace_logo,page)
 css=(ASSETS/'editorial.css').read_text()
 for theme,name in [('campo','campo-aquarela.png'),('calendario','calendario.png'),('negociacao','negociacao.png')]:
  css+='\n.editorial-theme-'+theme+'::before{background-image:url("'+data_url(name)+'")}\n'
 page=page.replace('</head>','<style id="schnorr-editorial">'+css+'</style></head>')
 path.write_text(page)
if __name__=='__main__':build()
