// Vercel serverless function for file uploads
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel'de /tmp klasörünü kullan
const mediaDir = '/tmp/lovelied-board/media';

// Klasörleri oluştur
const ensureDirs = () => {
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    ensureDirs();
    
    const { dataUrl, suggestedName } = req.body;
    
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'Missing or invalid dataUrl' });
    }
    
    const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
    if (!match) {
      return res.status(400).json({ error: 'Invalid dataUrl format' });
    }
    
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');
    const ext = mime.split('/')[1] || 'bin';
    const safeNameBase = (suggestedName || `media_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeNameBase}.${ext}`;
    const filePath = path.join(mediaDir, filename);
    
    fs.writeFileSync(filePath, buffer);
    
    // Vercel'de dosya URL'i
    const url = `/api/media/${filename}`;
    
    res.status(200).json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}
