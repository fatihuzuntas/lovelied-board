import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgBuffer = fs.readFileSync('icon.svg');
  
  // Generate PNG icons
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('icon.png');
  
  console.log('✅ icon.png created (512x512)');
  
  // Generate ICO for Windows
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile('icon-256.png');
    
  await sharp(svgBuffer)
    .resize(128, 128)
    .png()
    .toFile('icon-128.png');
    
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile('icon-64.png');
    
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('icon-32.png');
    
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('icon-16.png');
  
  console.log('✅ Windows ICO icons created');
  
  // Generate ICNS for macOS
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile('icon-1024.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('icon-512.png');
    
  await sharp(svgBuffer)
    .resize(256, 256)
    .png()
    .toFile('icon-256-mac.png');
  
  console.log('✅ macOS ICNS icons created');
  
  console.log('🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
