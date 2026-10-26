[English](README.en.md) | [Русский](README.md)

# Lampa Setup Lab

A device-oriented directory of Lampa extensions. Every entry shows where its information came from and how much has actually been tested. Author claims are not presented as independent verification.

## Included

- Searchable extension directory.
- Filters for device and verification level.
- Separate pages for Samsung Tizen, LG webOS and Android TV.
- A beginner-friendly installation guide.
- A four-step evidence scale: author-reported, URL checked, launched in Lampa, tested on a device.
- A catalog validator for schema errors and duplicate URLs.

## Run locally

Open `docs/index.html` directly, or serve the `docs` folder:

```bash
cd docs
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Validate the catalog from the repository root:

```bash
python scripts/validate_catalog.py
```

The validator is offline. It checks the data structure but does not fetch extension URLs or claim device compatibility.

## Verification policy

- **Author-reported** means the feature or compatibility appears in the author's own source.
- **URL checked** means the extension URL returned a network response on the recorded date.
- **Loaded in Lampa** means a test confirmed that Lampa loaded the extension.
- **Device tested** means the test passed on the named physical device and OS version.

The current entries are sourced from authors' pages and community catalogs. No independent TV runs have been performed yet, so entries are marked **author-reported**.

## License

The site's code and project tools are MIT licensed. Third-party extensions belong to their respective authors and may use different licenses. Review the source and permissions before installing an extension.
