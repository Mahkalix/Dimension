import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const origin=process.env.TEST_URL||'http://localhost:3159';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const [width,height] of [[320,568],[360,640],[568,320],[700,900],[701,900],[820,900],[1024,768],[1440,900]]){
  const context=await browser.newContext({viewport:{width,height}});const p=await context.newPage();
  async function fits(label){assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,label+' overflow at '+width);}
  await p.goto(origin+'/player');await p.getByRole('heading',{name:'Listen',exact:true}).waitFor();await fits('Home');
  for(const name of ['Home','Account menu','Play','Next track']){const box=await p.getByLabel(name,{exact:true}).boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width+1&&box.y>=0&&box.y+box.height<=height+1,name+' inaccessible '+width);}
  await p.locator('.track').first().click();
  const preview=p.locator(width<=700?'dialog[open]':'.track-preview');await preview.waitFor();await fits('Preview');
  const close=preview.getByRole('button',{name:'Back to tracks',exact:true});await close.click();
  await p.getByRole('button',{name:'All playlists',exact:true}).click();await p.getByRole('button',{name:'Create playlist',exact:true}).click();
  await p.getByRole('button',{name:'Edit playlist name'}).click();
  await p.getByRole('dialog').getByLabel('Name',{exact:true}).fill('LongPlaylistName'.repeat(5));
  await p.getByRole('dialog').getByRole('button',{name:'Save',exact:true}).click();await fits('Personal playlist');
  await p.getByRole('searchbox',{name:'Find tracks'}).fill('Carefree');await p.getByRole('button',{name:'Add Carefree',exact:true}).click();await fits('Editable tracks');
  await p.getByLabel('Playlist options',{exact:true}).click();await p.locator('summary').filter({hasText:'Share'}).click();await fits('Share menu');
  const link=p.getByRole('button',{name:'Copy playlist link',exact:true});await link.scrollIntoViewIfNeeded();const box=await link.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1,'Share clipped '+width);
  await p.goto(origin+'/login');await fits('Login');
  console.log('Responsive passed '+width+'x'+height);await context.close();
 }
} finally {await browser.close();}

