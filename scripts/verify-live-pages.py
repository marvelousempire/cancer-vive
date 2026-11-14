#!/usr/bin/env python3
"""Verify the actual GitHub Pages URL serves this repository's current public overlay."""
import argparse
import hashlib
import json
from pathlib import Path
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = "https://marvelousempire.github.io/cancer-vive/"
OVERLAY = ("public-mobile-menu.js", "public-mobile-menu.css", "public-learning-guide.js", "public-learning-guide.css", "public-borderless-study.css", "public-matrix.js", "public-matrix.css")

def sha(data):
    return hashlib.sha256(data).hexdigest()

def fetch(base, path):
    url = base.rstrip("/") + "/" + path
    request = Request(url, headers={"User-Agent":"cancer-vive-pages-release-check/1", "Cache-Control":"no-cache"})
    with urlopen(request, timeout=15) as response:
        if response.status != 200:
            raise ValueError(f"{path} returned HTTP {response.status}")
        return response.read()

def inspect(base=DEFAULT_URL):
    if base.rstrip("/") != DEFAULT_URL.rstrip("/"):
        raise ValueError("Refusing unexpected public site URL")
    html = fetch(base, "").decode("utf-8")
    if "<title>ResearchThat</title>" not in html:
        raise ValueError("Wrong public identity")
    for name in OVERLAY:
        source = (ROOT / "scripts" / name).read_bytes()
        # The asset must actually be referenced in published HTML and served byte-for-byte.
        version = "20261114c" if name.startswith("public-matrix.") else ("20261114b" if name == "public-borderless-study.css" else ("20261114a" if name.startswith("public-learning-guide.") else "20261113e"))
        if "./" + name + "?v=" + version not in html:
            raise ValueError("Live page is missing current public design asset: " + name)
        published = fetch(base, name + "?v=" + version)
        if sha(published) != sha(source):
            raise ValueError("Live mobile asset does not match checked source: " + name)
    matrix=json.loads(fetch(base,"public-matrix.json"))
    raw=fetch(base,"public-docs/MASTER-CANCER-DETRIMENT-MATRIX.md")
    if(matrix.get("schema")!="researchthat.matrix-public-readonly/v1" or
       matrix.get("private_records_included") is not False or
       hashlib.sha256(raw).hexdigest()!=matrix.get("source_sha256") or
       len(matrix.get("rows",[]))<20 or
       any(len(row)!=8 for row in matrix["rows"])):
        raise ValueError("Live Matrix does not match the sealed public Markdown")
    data = json.loads(fetch(base, "public-data.json"))
    if (data.get("mode") != "public-readonly" or
        data.get("private_records_included") is not False or
        len(data["cancer"]["messages"]["normal_view"]["topics"]) != 27):
        raise ValueError("Public content count or privacy boundary mismatch")
    return {
        "site":base, "status":"live_http_assets_verified",
        "mobile_js_sha256":sha((ROOT / "scripts/public-mobile-menu.js").read_bytes()),
        "mobile_css_sha256":sha((ROOT / "scripts/public-mobile-menu.css").read_bytes()),
        "cancer_topics":27, "researchthat_title":True,
        "privacy":"public-readonly",
        "browser_interaction_verified":False
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--attempts", type=int, default=1)
    parser.add_argument("--delay", type=int, default=5)
    args = parser.parse_args()
    if not 1 <= args.attempts <= 24:
        parser.error("--attempts must be between 1 and 24")
    for attempt in range(1,args.attempts+1):
        try:
            print(json.dumps(inspect(args.url),indent=2),flush=True)
            return
        except (OSError, ValueError, KeyError, HTTPError, URLError) as e:
            print(f"Live Pages verification attempt {attempt}/{args.attempts}: {e}",flush=True)
            if attempt == args.attempts:
                raise SystemExit("Live site NOT verified: do not claim shipped")
            time.sleep(args.delay)

if __name__ == "__main__":
    main()
