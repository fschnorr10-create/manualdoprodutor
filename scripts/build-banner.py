"""Incorpora o banner institucional no HTML portátil, preservando a navegação."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
page=ROOT/'index.html'
html=page.read_text()
for tag,name in [('style','schnorr-banner-style'),('script','schnorr-banner-script')]:
    html=re.sub(rf'<{tag} id="{name}">.*?</{tag}>\s*','',html,flags=re.S)
html=html.replace('</head>','<style id="schnorr-banner-style">'+(ROOT/'assets/banner/banner.css').read_text()+'</style>\n</head>')
html=html.replace('</body>','<script id="schnorr-banner-script">'+(ROOT/'assets/banner/banner.js').read_text()+'</script>\n</body>')
page.write_text(html)
