import assert from "node:assert/strict";
import {chromium} from "playwright-core";
const browser=await chromium.launch({channel:"chrome"});
try {
 for(const width of [1280,390]){
  const p=await browser.newPage({viewport:{width,height:width===390?844:720}});
  await p.goto(process.env.TEST_URL+"/player");
  const button=name=>p.getByRole("button",{name,exact:true});
  await p.locator(".collections button").first().click();
  await p.getByRole("heading",{name:"Après le service"}).waitFor();
  await p.locator(".track").last().click();
  await button("Ajouter à la file").click();
  assert.equal(await p.locator(".track").count(),2);
  await button("Extras").click();await p.locator(".menu-row").first().click();
  assert.equal(await p.locator(".menu-row").count(),2);
  await button("Réglages").click();await p.locator(".menu-row").first().click();
  await p.getByRole("button",{name:"35 %"}).click();
  assert.equal(await p.getByRole("button",{name:"35 %"}).getAttribute("aria-pressed"),"true");
  await p.screenshot({path:"docs/screens/volume-"+width+".png"});
  await button("Écouter").click();await p.locator(".track").first().click();
  await p.getByRole("dialog").getByRole("button",{name:"Écouter"}).click();
  await p.getByRole("heading",{name:"Weird Fishes / Arpeggi"}).waitFor();
  await p.close();
 }
 console.log("Collection, fiche, file, crédits, volume et lecture vérifiés aux deux formats");
} finally {await browser.close()}
