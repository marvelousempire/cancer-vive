#!/usr/bin/env python3
"""Check the sealed ResearchThat public artifact; --write emits a new Pages directory."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT=Path(__file__).resolve().parents[1]
FILES={'index.html','research-frame.js','research-face.js','research-frame.css','research-face.css','research-paint.json','app-profile.json','public-data.json','release.json'}|{'public-docs/'+n for n in ['claims.md','sources.md','MASTER-CANCER-DETRIMENT-MATRIX.md','TRUTH-FILTER.md']}

def verify(root=ROOT):
    folder=root/'public-researchthat'
    pin=json.loads((root/'public-researchthat-carrier.json').read_text())
    if pin.get('schema')!='researchthat.public-carrier/v1' or pin.get('producer_repository')!='https://git.jailynmarvin.com/averygoodman/researchTHAT' or not re.fullmatch('[a-f0-9]{40}',pin.get('producer_commit','')):
        raise ValueError('Exact ResearchThat producer required')
    if folder.is_symlink() or set(pin['files'])!=FILES:
        raise ValueError('Exact public file list required')
    if {str(p.relative_to(folder))for p in folder.rglob('*')if p.is_file()or p.is_symlink()}!=FILES:
        raise ValueError('Unexpected public files')
    for name,expected in pin['files'].items():
        path=folder/name
        if any(p.is_symlink()for p in [path,*path.parents]) or hashlib.sha256(path.read_bytes()).hexdigest()!=expected:
            raise ValueError('Public artifact changed: '+name)
    release=json.loads((folder/'release.json').read_text())
    if release.get('source_revision')!=pin['producer_commit'] or release.get('source_dirty')is not False or release.get('private_data')is not False or release.get('private_writes')is not False:
        raise ValueError('Clean public-only producer required')
    if set(release['files'])!=FILES-{'release.json'} or any(pin['files'][name]!=value for name,value in release['files'].items()):
        raise ValueError('Producer output hashes must match carrier')
    public=json.loads((folder/'public-data.json').read_text())
    if public.get('mode')!='public-readonly' or public.get('private_records_included')is not False or len(public['cancer']['messages']['normal_view']['topics'])!=27:
        raise ValueError('The27 public topics and private-data boundary are required')
    return pin

def build(destination,root=ROOT):
    pin=verify(root)
    if destination.exists()or destination.is_symlink():
        raise ValueError('Existing output is preserved; choose a new directory')
    shutil.copytree(root/'public-researchthat',destination)
    # Overlay is deliberately applied *after* verifying and copying the exact
    # sealed producer. Private files and source claims are never touched.
    page=destination/'index.html'
    html=page.read_text()
    marker='<link rel="stylesheet" href="./research-face.css">'
    script_marker='<script src="./research-frame.js"></script>'
    if html.count(marker)!=1 or html.count(script_marker)!=1:
        raise ValueError('Public page anchors changed; mobile patch refused')
    css=root/'scripts/public-mobile-menu.css'
    js=root/'scripts/public-mobile-menu.js'
    html=html.replace(marker,marker+'<link rel="stylesheet" href="./public-mobile-menu.css?v=20261113e">',1)
    html=html.replace(script_marker,script_marker+'<script src="./public-mobile-menu.js?v=20261113e" defer></script>',1)
    guide_css=root/'scripts/public-learning-guide.css'
    guide_js=root/'scripts/public-learning-guide.js'
    html=html.replace(marker+'<link rel="stylesheet" href="./public-mobile-menu.css?v=20261113e">',
                      marker+'<link rel="stylesheet" href="./public-mobile-menu.css?v=20261113e"><link rel="stylesheet" href="./public-learning-guide.css?v=20261114a">',1)
    html=html.replace('<script src="./public-mobile-menu.js?v=20261113e" defer></script>',
                      '<script src="./public-mobile-menu.js?v=20261113e" defer></script><script src="./public-learning-guide.js?v=20261114a" defer></script>',1)
    border_css=root/'scripts/public-borderless-study.css'
    html=html.replace('<link rel="stylesheet" href="./public-learning-guide.css?v=20261114a">',
                      '<link rel="stylesheet" href="./public-learning-guide.css?v=20261114a"><link rel="stylesheet" href="./public-borderless-study.css?v=20261114b">',1)
    # One new public read-only Matrix projection from the already sealed source.
    # Keep the original Markdown unchanged and verify all eight columns.
    import runpy
    matrix_count=runpy.run_path(str(ROOT/'scripts/public_matrix.py'))['build_matrix'](root,destination)
    html=html.replace('<link rel="stylesheet" href="./public-borderless-study.css?v=20261114b">',
                      '<link rel="stylesheet" href="./public-borderless-study.css?v=20261114b"><link rel="stylesheet" href="./public-matrix.css?v=20261114c">',1)
    html=html.replace('<script src="./public-learning-guide.js?v=20261114a" defer></script>',
                      '<script src="./public-learning-guide.js?v=20261114a" defer></script><script src="./public-matrix.js?v=20261114c" defer></script>',1)
    page.write_text(html)
    shutil.copy2(root/'scripts/public-matrix.css',destination/'public-matrix.css')
    shutil.copy2(root/'scripts/public-matrix.js',destination/'public-matrix.js')
    shutil.copy2(border_css,destination/'public-borderless-study.css')
    shutil.copy2(css,destination/'public-mobile-menu.css')
    shutil.copy2(js,destination/'public-mobile-menu.js')
    shutil.copy2(guide_css,destination/'public-learning-guide.css')
    shutil.copy2(guide_js,destination/'public-learning-guide.js')
    return {'schema':'researchthat.public-carrier-build/v1','producer_commit':pin['producer_commit'],'files':len(FILES),'output':str(destination),'deployed':False,'matrix_items':matrix_count}

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--write',type=Path);a=p.parse_args()
    print(json.dumps(build(a.write)if a.write else {'verified':True,'producer_commit':verify()['producer_commit'],'files':len(FILES),'write':False},indent=2))
