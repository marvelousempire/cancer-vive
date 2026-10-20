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
    return {'schema':'researchthat.public-carrier-build/v1','producer_commit':pin['producer_commit'],'files':len(FILES),'output':str(destination),'deployed':False}

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--write',type=Path);a=p.parse_args()
    print(json.dumps(build(a.write)if a.write else {'verified':True,'producer_commit':verify()['producer_commit'],'files':len(FILES),'write':False},indent=2))
