import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { sourceLinks } from './source-link-policy.mjs';
const version=JSON.parse(readFileSync('package.json','utf8')).version;
const identity=JSON.parse(readFileSync('product.identity.json','utf8'));
const config=JSON.parse(readFileSync('apps/cancer-vive-desktop/src-tauri/tauri.conf.json','utf8'));
const cargo=readFileSync('apps/cancer-vive-desktop/src-tauri/Cargo.toml','utf8');
const swift=readFileSync('interface/swift/project.yml','utf8');
if(identity.version!==version || config.version!==version || !cargo.includes(`version = "${version}"`) || !swift.includes(`MARKETING_VERSION: ${version}`)) throw new Error('Suit versions do not match');
execFileSync(process.execPath,['scripts/check-evidence.mjs'],{stdio:'inherit'});
const release={version,commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),dirty:Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())};
const links=sourceLinks(JSON.parse(readFileSync('src/user-messages.json','utf8')),readFileSync('literature/sources.md','utf8'));
const expectedPolicy=JSON.stringify(links,null,2)+'\n';
if(!process.argv.includes('--write') && readFileSync('literature/source-links.json','utf8')!==expectedPolicy) throw new Error('Filed source-link policy is stale');
const inputs={'user-messages.json':'src/user-messages.json','claims.md':'literature/claims.md','sources.md':'literature/sources.md','icon.png':'apps/cancer-vive-desktop/src-tauri/icons/icon.png'};
const hashes=Object.fromEntries(Object.entries(inputs).map(([name,path])=>[name,createHash('sha256').update(readFileSync(path)).digest('hex')]));
if(process.argv.includes('--write')) {
  writeFileSync('literature/source-links.json',JSON.stringify(links,null,2)+'\n');
  mkdirSync('interface/swift/Resources',{recursive:true});
  const ui=JSON.parse(readFileSync('src/user-messages.json','utf8')).normal_view.ui;
  writeFileSync('interface/swift/Sources/GeneratedMessages.swift',`enum GeneratedMessages { static let loadFailed = ${JSON.stringify(ui.load_failed)} }\n`);
  for(const [name,path] of Object.entries(inputs)) copyFileSync(path,`interface/swift/Resources/${name}`);
  copyFileSync('literature/source-links.json','interface/swift/Resources/source-links.json');
  writeFileSync('interface/swift/Resources/release.json',JSON.stringify(release,null,2)+'\n');
}
console.log(JSON.stringify({mode:process.argv.includes('--write')?'write':'plan',release,resources:hashes},null,2));
