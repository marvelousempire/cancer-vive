// Test the actual generated GitHub Pages output in a browser, including clicks.
// Requires npm install --no-save playwright-core and an installed Chrome/Chromium.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright-core');
const root = path.resolve(__dirname, '../dist');
const liveUrl = process.env.PUBLIC_PAGES_URL || '';
const base = '/cancer-vive/';
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.md':'text/plain'};
if (!liveUrl && !fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build first');
if (liveUrl && liveUrl !== 'https://marvelousempire.github.io/cancer-vive/') throw new Error('Unexpected public URL refused');
const executable = process.env.CHROME_BIN || ['google-chrome','google-chrome-stable','chromium','chromium-browser']
  .map(name=>{try{return execFileSync('which',[name],{encoding:'utf8'}).trim()}catch{return ''}}).find(Boolean);
if (!executable) throw new Error('No Chrome/Chromium found; browser test is NOT a pass');
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://127.0.0.1');
  if (req.method!=='GET' || !url.pathname.startsWith(base)) {res.writeHead(404);return res.end();}
  const relative = decodeURIComponent(url.pathname.slice(base.length))||'index.html';
  const full = path.resolve(root,relative);
  if (!full.startsWith(root+path.sep) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {res.writeHead(404);return res.end();}
  res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(fs.readFileSync(full));
});
(async()=>{
  if (!liveUrl) await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox']});
  const errors=[];
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    page.on('pageerror',err=>errors.push(err.message));
    await page.goto(liveUrl || ('http://127.0.0.1:'+server.address().port+base),{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('.public-phone-nav').waitFor({state:'visible',timeout:25000});
    assert.equal((await page.locator('.public-phone-brand').innerText()).trim(),'ResearchTHAT');
    await page.waitForFunction(()=>document.documentElement.classList.contains('public-phone-menu-ready'),null,{timeout:25000});
    assert.ok(await page.locator('.footer-rail .build-path button').count()>=5,'Real ACT page buttons must exist');
    assert.equal(await page.locator('.research-domain .research-identity').isVisible(),false,'Duplicate ResearchThat title hidden');
    // Prior test incorrectly passed while three large ACT icon rows still
    // occupied the top of the screenshot. This is a real visual acceptance gate.
    const actHeader=page.locator('.review > header.identity');
    assert.equal(await actHeader.count(),1,'ACT owner header must be located by the real selector');
    assert.equal(await actHeader.isVisible(),false,'ACT icon bank must not appear above public mobile header');
    const mobileHeaderBox=await page.locator('.public-phone-nav').boundingBox();
    assert.ok(mobileHeaderBox && mobileHeaderBox.y<140,
      'ResearchTHAT header must begin near the top, not below ACT icon banks: '+JSON.stringify(mobileHeaderBox));

    await page.locator('.public-phone-menu > summary').click();
    await page.locator('[data-public-room="sources"]').click();
    await page.waitForFunction(()=>document.querySelector('.public-phone-current')?.textContent==='Sources');
    await page.locator('.public-phone-menu > summary').click();
    await page.locator('[data-public-room="topics"]').click();
    await page.waitForFunction(()=>document.querySelector('.public-phone-current')?.textContent==='Evidence');
    await page.locator('.public-phone-options').click();
    await page.locator('#subject').waitFor({state:'visible'});
    await page.locator('#theme').waitFor({state:'visible'});
    await page.locator('.public-phone-options').click();
    assert.equal(await page.locator('#subject').isVisible(),false,'Options must hide after closing');
    const width = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:window.innerWidth}));
    assert.ok(width.scroll <= width.view+2,'Unwanted body horizontal scrolling: '+JSON.stringify(width));
    fs.mkdirSync(path.resolve(__dirname,'../artifacts'),{recursive:true});
    await page.screenshot({path:path.resolve(__dirname,'../artifacts/public-phone-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1280,height:900});
    assert.equal(await page.locator('.public-phone-nav').isVisible(),false,'Desktop should retain original frame');
    assert.equal(await page.locator('.review > header.identity').isVisible(),true,'Desktop ACT header must remain intact');
    assert.deepEqual(errors,[],'Browser script errors: '+errors.join('; '));
    console.log('PASS: '+(liveUrl?'LIVE public GitHub Pages':'built Pages site')+' in Chrome: actual ACT footer navigation, Sections clicks, Options controls, phone/desktop layout, no JS errors.');
  } finally {
    await browser.close();
    if (!liveUrl) await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1; if (!liveUrl && server.listening) server.close()});
