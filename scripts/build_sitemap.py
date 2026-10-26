#!/usr/bin/env python3
"""Build a sitemap after the public GitHub Pages URL is known."""

import argparse
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
PAGES = [
    "index.html",
    "lampa-samsung-tizen.html",
    "lampa-lg-webos.html",
    "lampa-android-tv.html",
    "how-to-add-plugin.html",
    "lampa-plugin-not-working.html",
    "verification.html",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", required=True, help="Публичный HTTPS URL сайта, например https://user.github.io/lampa-setup-lab/")
    args = parser.parse_args()
    base = args.base_url.rstrip("/") + "/"
    urls = "\n".join(f"  <url><loc>{urljoin(base, page)}</loc></url>" for page in PAGES)
    xml = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n'
    (DOCS / "sitemap.xml").write_text(xml, encoding="utf-8")
    print(f"Готов sitemap.xml для {len(PAGES)} страниц.")


if __name__ == "__main__":
    main()
