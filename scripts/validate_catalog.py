#!/usr/bin/env python3
"""Validate Lampa Setup Lab catalog data without network access."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "docs" / "data" / "plugins.json"
VALID_LEVELS = {"author_reported", "url_checked", "loaded_in_lampa", "device_tested"}
REQUIRED = {"id", "name", "summary", "category", "platforms", "plugin_url", "project_url", "evidence_url", "verification"}


def fail(message: str) -> None:
    print(f"ОШИБКА: {message}")
    raise SystemExit(1)


def main() -> None:
    try:
        items = json.loads(CATALOG.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"не удалось прочитать JSON каталога: {exc}")

    if not isinstance(items, list):
        fail("корневое значение каталога должно быть списком")

    seen_ids = set()
    seen_urls = set()
    for index, item in enumerate(items, 1):
        if not isinstance(item, dict):
            fail(f"запись {index} должна быть объектом")
        missing = REQUIRED - item.keys()
        if missing:
            fail(f"запись {index}: нет полей {', '.join(sorted(missing))}")
        if not isinstance(item["id"], str) or not item["id"].strip():
            fail(f"запись {index}: id должен быть непустой строкой")
        if item["id"] in seen_ids:
            fail(f"повторяется id: {item['id']}")
        seen_ids.add(item["id"])
        for key in ("plugin_url", "project_url", "evidence_url"):
            value = item[key]
            if not isinstance(value, str) or not value.startswith(("https://", "http://")):
                fail(f"{item['id']}: {key} должен быть полным HTTP(S)-адресом")
        if item["plugin_url"] in seen_urls:
            fail(f"повторяется URL установки: {item['plugin_url']}")
        seen_urls.add(item["plugin_url"])
        if not isinstance(item["platforms"], list) or not item["platforms"]:
            fail(f"{item['id']}: platforms должен быть непустым списком")
        if not isinstance(item["verification"], dict):
            fail(f"{item['id']}: verification должен быть объектом")
        level = item["verification"].get("level")
        if level not in VALID_LEVELS:
            fail(f"{item['id']}: неизвестный уровень проверки {level!r}")
        if level == "device_tested" and not item["verification"].get("device"):
            fail(f"{item['id']}: для device_tested нужна модель устройства")
        if level != "author_reported" and not item["verification"].get("checked_at"):
            fail(f"{item['id']}: для проверенного статуса нужна дата checked_at")

    print(f"OK: {len(items)} записей, {len(seen_ids)} уникальных ID, {len(seen_urls)} уникальных URL установки.")
    print("Сетевые URL и совместимость с реальными устройствами этим скриптом не проверялись.")


if __name__ == "__main__":
    main()
