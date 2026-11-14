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
    await page.addInitScript(()=>{
      // Reproduce the reported returning-phone condition: old Color selections.
      localStorage.setItem('researchthat.appearance.v2','color');
      localStorage.setItem('cancer-vive.theme.v1','color');
    });
    await page.goto(liveUrl || ('http://127.0.0.1:'+server.address().port+base),{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('.public-phone-nav').waitFor({state:'visible',timeout:25000});
    assert.equal((await page.locator('.public-phone-brand').innerText()).trim(),'ResearchTHAT');
    await page.waitForFunction(()=>document.querySelector('.research-domain')?.dataset.researchAppearance==='auto');
    assert.equal(await page.locator('.research-domain #theme').inputValue(),'auto','Initial appearance must be Auto');
    const actualAppearance=async(expected)=>{
      await page.waitForFunction(expected=>{
        const rgb=getComputedStyle(document.querySelector('.review')).backgroundColor;
        const body=getComputedStyle(document.body).backgroundColor;
        const stage=getComputedStyle(document.querySelector('.research-domain')).backgroundColor;
        const nav=getComputedStyle(document.querySelector('.public-phone-nav')).backgroundColor;
        const sel=document.querySelector('.research-domain #theme')?.value;
        return [rgb,body,stage,nav].every(v=>v===expected)&&sel==='auto';
      },expected,{timeout:12000});
    };
    await page.emulateMedia({colorScheme:'dark'});
    await actualAppearance('rgb(23, 20, 17)');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.research-domain')).getPropertyValue('--bg').trim()==='#171411');
    await page.emulateMedia({colorScheme:'light'});
    await actualAppearance('rgb(255, 255, 255)');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.research-domain')).getPropertyValue('--bg').trim()==='#ffffff');
    await page.waitForFunction(()=>document.documentElement.classList.contains('public-phone-menu-ready'),null,{timeout:25000});
    assert.ok(await page.locator('.footer-rail .build-path button').count()>=5,'Real ACT page buttons must exist');
    assert.equal(await page.locator('.research-domain .research-identity').isVisible(),false,'Duplicate ResearchThat title hidden');
    await page.locator('.research-catalog').waitFor({state:'visible',timeout:12000});
    await page.waitForFunction(()=>document.querySelectorAll('.research-catalog-card').length>=20);
    assert.ok(await page.locator('.research-catalog-card').count()>=20,'Filed catalog cards should appear without searching');
    assert.equal(await page.locator('.research-catalog-search').evaluate(el=>document.activeElement===el),false,'No keyboard on landing');
    assert.equal(await page.locator('.research-catalog-toolbar button').count(),3,'Grid, List and Filter visible');
    await page.locator('.research-catalog-toolbar button').nth(1).click();
    assert.equal(await page.locator('.research-catalog-cards.as-list').count(),1,'List view works');
    await page.locator('.research-catalog-toolbar button').first().click();
    assert.equal(await page.locator('.research-catalog-cards.as-list').count(),0,'Grid view works');
    await page.locator('.research-catalog-toolbar button').nth(2).click();
    await page.locator('.research-catalog-chip').last().click();
    assert.ok((await page.locator('.research-catalog-empty').innerText()).includes('No verified recipes'),'No fabricated recipe cards');
    await page.locator('.research-catalog-chip').first().click();
    await page.locator('.research-catalog-search').fill('fenugreek');
    assert.equal(await page.locator('.research-catalog-card').count(),1,'Catalog searches filed names');
    await page.locator('.research-catalog-card').first().click();
    assert.ok((await page.locator('.research-catalog-reader').innerText()).includes('What does the evidence say?'),'Plain-language evidence is visible first');
    assert.ok((await page.locator('.research-catalog-reader').innerText()).includes('Important limits'),'Safety limits are immediately visible');
    await page.locator('.research-catalog-evidence summary').first().click();
    assert.ok((await page.locator('.research-catalog-reader').innerText()).includes('Human cancer research'),'Human evidence is readable when expanded');
    assert.equal(await page.locator('.research-catalog-source').count(),1,'Original source link must be reachable');
    const cck=await page.locator('.research-catalog-card').first().evaluate(el=>({
      radius:getComputedStyle(el).borderTopLeftRadius,
      border:getComputedStyle(el).borderTopWidth,
      padding:getComputedStyle(el).paddingLeft
    }));
    assert.equal(cck.radius,'26px','CCK cards use the accepted large corner radius');
    assert.equal(cck.border,'1px','CCK resting cards keep a fine border');
    await page.locator('.research-catalog-back').click();
    await page.locator('.research-catalog-search').fill('strawberry breast');
    assert.ok(await page.locator('.research-catalog-empty').count()===1,'Combination search must not invent medical connections');
    await page.locator('.research-catalog-search').fill('');
    const catalogButton = await page.locator('.research-catalog-card').first().evaluate(el=>({height:el.getBoundingClientRect().height,padding:getComputedStyle(el).paddingLeft}));
    assert.ok(catalogButton.height>=120,'Mobile cards must be comfortably sized');
    assert.ok(parseFloat(catalogButton.padding)>=16,'Cards must have generous inner padding');
    assert.ok(!(await page.locator('.research-catalog').innerText()).includes('Food or ingredient mention'),'Do not claim a verified food identity from a keyword guess');
    assert.equal(await page.locator('.research-domain .intro > h1').isVisible(),false,'Old introduction must not compete');
    // One-tap mobile Matrix with exact filed items, names and eight-column data.
    assert.equal(await page.locator('.public-matrix-launch').count(),1,'One Matrix entrance, no repeated CTA');
    const matrixOpen=page.locator('.public-matrix-quick .public-matrix-launch');
    await matrixOpen.waitFor({state:'visible',timeout:12000});
    await matrixOpen.click();
    await page.locator('.public-matrix-search').waitFor({state:'visible'});
    await page.waitForFunction(()=>document.querySelector('.public-matrix-count')?.textContent.includes('filed items'));
    const matrixItemBorder=await page.locator('.public-matrix-item').first().evaluate(el=>getComputedStyle(el).borderBottomWidth);
    assert.equal(matrixItemBorder,'0px','Matrix rows should float without permanent separators');

    assert.ok(await page.locator('.public-matrix-item').count()>=20,'All filed items appear BEFORE typing');
    assert.notEqual(await page.locator('.public-matrix-search').evaluate(el=>el===document.activeElement),true,
      'Opening Matrix must not focus search and summon the mobile keyboard');
    const rails=await page.evaluate(()=>['.review .footer-rail','.review .pages','.review .edge-tools'].map(selector=>{
      const el=document.querySelector(selector);if(!el)return null;
      const s=getComputedStyle(el);return {selector,border:s.borderTopWidth,background:s.backgroundColor};
    }));
    for(const rail of rails.filter(Boolean))assert.equal(rail.border,'0px',rail.selector+' must have no line');
    assert.ok(await page.locator('.public-matrix-item').count()>=20,'All approved filed Matrix items are searchable');
    await page.locator('.public-matrix-search').fill('Fenugreek');
    assert.equal(await page.locator('.public-matrix-item').count(),1);
    await page.locator('.public-matrix-item').first().click();
    assert.ok((await page.locator('.public-matrix-detail').innerText()).includes('Food is not lab extract'),'Preserve the original form and safety distinction');
    await page.locator('.public-matrix-detail .public-matrix-back').click();
    await page.locator('.public-matrix-search').fill('Dandelion oil extract');
    assert.equal(await page.locator('.public-matrix-item').count(),1);
    await page.locator('.public-matrix-view').last().click();
    assert.equal(await page.locator('.public-matrix-table thead th').count(),8,'Desktop/table mode must keep all eight source fields');
    await page.locator('.public-matrix-head .public-matrix-back').click();
    assert.equal(await page.locator('.public-matrix').isVisible(),false,'Close Matrix without losing previous research state');

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
