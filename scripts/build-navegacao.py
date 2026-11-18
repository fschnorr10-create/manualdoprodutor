"""Incorpora a navegação por assuntos no HTML portátil, sem duplicar o módulo."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
page = ROOT / 'index.html'
html = page.read_text()
for tag, name in [('style', 'schnorr-topic-style'), ('script', 'schnorr-topic-menu')]:
    html = re.sub(rf'<{tag} id="{name}">.*?</{tag}>\s*', '', html, flags=re.S)
html = html.replace('</head>', '<style id="schnorr-topic-style">'+(ROOT/'assets/navegacao/menu.css').read_text()+'</style>\n</head>')
html = html.replace('</body>', '<script id="schnorr-topic-menu">'+(ROOT/'assets/navegacao/menu.js').read_text()+'</script>\n</body>')
page.write_text(html)
