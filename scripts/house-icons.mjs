import sharp from 'sharp';
import fs from 'node:fs';
const house=await sharp('public/brand/the-den-house.png').trim().png().toBuffer();
for(const size of [16,32,180,192,512]){
 const inset=Math.round(size*.09);
 await sharp(house).resize(size-inset*2,size-inset*2,{fit:'contain',background:'#efefed'}).extend({top:inset,bottom:inset,left:inset,right:inset,background:'#efefed'}).png().toFile('public/brand/house-'+size+'.png');
}
const sizes=[16,32], images=sizes.map(s=>fs.readFileSync('public/brand/house-'+s+'.png'));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const p=6+i*16;header[p]=size;header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(images[i].length,p+8);header.writeUInt32LE(offset,p+12);offset+=images[i].length});
fs.writeFileSync('public/favicon.ico',Buffer.concat([header,...images]));
const svg=fs.readFileSync('public/brand/the-den-opening.svg','utf8').replace('width="404" height="338" viewBox="0 0 404 338"','width="64" height="64" viewBox="48 -10 308 270"');
fs.writeFileSync('public/favicon.svg',svg);
