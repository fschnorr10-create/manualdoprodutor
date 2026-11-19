"""Camada visual portátil para o manual existente e a publicação ChatGPT Sites."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'index.html';s=p.read_text()
for kind,name in [('style','schnorr-modern-style'),('script','schnorr-modern-script')]:s=re.sub(rf'<{kind} id="{name}">.*?</{kind}>','',s,flags=re.S)
s=s.replace('</head>','<style id="schnorr-modern-style">'+(ROOT/'assets/modern/modern.css').read_text()+'</style></head>')
s=s.replace('</body>','<script id="schnorr-modern-script">'+(ROOT/'assets/modern/modern.js').read_text()+'</script></body>');p.write_text(s)
