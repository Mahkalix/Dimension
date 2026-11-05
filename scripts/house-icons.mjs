import sharp from 'sharp';
import fs from 'node:fs';
const house=await sharp('public/brand/the-den-house.svg').trim().png().toBuffer();
for(const size of [16,32,48,180,192,512]){
 const inset=Math.round(size*.04);
 await sharp(house).resize(size-inset*2,size-inset*2,{fit:'contain',background:'#efefed'}).extend({top:inset,bottom:inset,left:inset,right:inset,background:'#efefed'}).flatten({background:'#efefed'}).png().toFile('public/brand/house-'+size+'.png');
}
const sizes=[16,32,48], images=sizes.map(s=>fs.readFileSync('public/brand/house-'+s+'.png'));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const p=6+i*16;header[p]=size;header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(images[i].length,p+8);header.writeUInt32LE(offset,p+12);offset+=images[i].length});
fs.writeFileSync('public/favicon.ico',Buffer.concat([header,...images]));
fs.copyFileSync('public/favicon.ico','public/brand/the-den-favicon.ico');
fs.copyFileSync('public/brand/house-32.png','public/brand/the-den-favicon.png');
const original=fs.readFileSync('public/brand/the-den-house.svg').toString('base64');
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480"><rect width="480" height="480" rx="64" fill="#efefed"/><image x="12" y="39" width="456" height="402" href="data:image/svg+xml;base64,'+original+'"/></svg>';
fs.writeFileSync('public/favicon.svg',svg);

