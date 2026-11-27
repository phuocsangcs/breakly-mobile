"""Build the web slide deck in ../presentation from the slide sources in this folder.

Usage (from the repository root):  python presentation-src/build.py

Image paths inside the slides:
  graphics/...  a file under report/graphics (app screenshots, diagrams)
  images/...    a file under presentation-src/images (logos, photos)
"""
import json
import os
import re
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DECK = os.path.join(HERE, "deck")
OUT = os.path.join(ROOT, "presentation")
SOURCES = {
    "graphics/": os.path.join(ROOT, "report", "graphics"),
    "images/": os.path.join(HERE, "images"),
}

ICONS = {
    "Clock": '<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4"/></svg>',
    "Lightbulb": '<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>',
}


def main():
    assets = os.path.join(OUT, "assets")
    shutil.rmtree(assets, ignore_errors=True)
    os.makedirs(assets)
    used = {}

    def asset(m):
        prefix, rel = m.group(2), m.group(3)
        src = os.path.join(SOURCES[prefix], rel)
        if not os.path.isfile(src):
            raise SystemExit("missing image: " + prefix + rel)
        name = os.path.basename(rel)
        if rel.startswith("logos/"):
            name = "logo_" + name
        if used.setdefault(name, src) != src:
            raise SystemExit("two images share the name " + name)
        shutil.copyfile(src, os.path.join(assets, name))
        return m.group(1) + '"assets/' + name + '"'

    def icon(m):
        return ICONS[m.group(1)].replace("{cls}", m.group(2))

    def shape(m):
        return '<span class="{} {}"></span>'.format(m.group(2), "tri-r" if m.group(1) == "arrow-right" else "tri-l")

    def connector(m):
        return '<span class="conn conn-{}" style="{}"></span>'.format(m.group(1), m.group(2))

    idx = json.load(open(os.path.join(DECK, "deck.json"), encoding="utf8"))
    css = open(os.path.join(DECK, "deck.css"), encoding="utf8").read()
    slides, notes = [], []
    for sid in idx["order"]:
        h = open(os.path.join(DECK, "slides", sid + ".html"), encoding="utf8").read()
        h = re.sub(r'(src=)"(graphics/|images/)([^"]+)"', asset, h)
        h = re.sub(r'<x-icon name="(\w+)" class="([\w ]+)"></x-icon>', icon, h)
        h = re.sub(r'<x-shape kind="(arrow-right|arrow-left)" class="([\w ]+)"></x-shape>', shape, h)
        h = re.sub(r'<x-connector head="(\w+)"[^>]*?style="([^"]*)"></x-connector>', connector, h)
        note = re.search(r"<aside>(.*?)</aside>", h, re.S)
        notes.append(note.group(1).strip() if note else "")
        h = re.sub(r"<aside>.*?</aside>", "", h, flags=re.S)
        h = h.replace("<section ", '<section data-slide="{}" '.format(len(slides)), 1)
        slides.append(h)
    page_html = "\n".join(slides)
    if "<x-" in page_html or "/_blob/" in page_html:
        raise SystemExit("a slide still has an unconverted element or image")

    template = open(os.path.join(HERE, "web_template.html"), encoding="utf8").read()
    page = (template.replace("/*DECK_CSS*/", css)
            .replace("<!--SLIDES-->", page_html)
            .replace("/*NOTES*/[]", json.dumps(notes, ensure_ascii=False))
            .replace("{{TITLE}}", idx["title"])
            .replace("1 / 17", "1 / {}".format(len(slides))))
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf8", newline="\n") as f:
        f.write(page)
    print("built presentation/index.html:", len(slides), "slides,", len(used), "images")


if __name__ == "__main__":
    main()
