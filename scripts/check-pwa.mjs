import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_URL || 'http://localhost:3158';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto(origin+'/player');
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();
 assert.ok(await page.evaluate(()=>!!navigator.serviceWorker.controller));
 const manifest=await (await context.request.get(origin+'/manifest.json')).json();
 assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/player');
 for(const icon of manifest.icons){const r=await context.request.get(origin+icon.src);assert.equal(r.status(),200);const data=await r.body();assert.equal(data.readUInt32BE(16),Number(icon.sizes.split('x')[0]));}
 const sw=await context.request.get(origin+'/sw.js');assert.match(sw.headers()['cache-control'],/no-store/);assert.equal(sw.headers()['set-cookie'],undefined);
 await page.goto(origin+'/account');
 const cached=await page.evaluate(async()=>{const keys=await caches.keys();return (await Promise.all(keys.filter(k=>k.startsWith('the-den-offline-')).map(async k=>(await (await caches.open(k)).keys()).map(r=>new URL(r.url).pathname)))).flat();});
 assert.deepEqual(cached.sort(),['/offline.html','/brand/house-192.png','/brand/house-512.png'].sort());
 await context.setOffline(true);await page.goto(origin+'/player');await page.getByRole('heading',{name:'A quiet moment.'}).waitFor();
 await context.setOffline(false);await page.getByRole('link',{name:'Try again'}).click();await page.getByRole('heading',{name:'Listen',exact:true}).waitFor();
 console.log('PWA passed: active worker, manifest/icons, uncached auth, offline fallback and online recovery.');
 await context.close();
}finally{await browser.close();}
