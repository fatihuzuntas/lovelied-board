// Vercel serverless function for board data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel'de /tmp klasörünü kullan
const dataDir = '/tmp/lovelied-board';
const boardJsonPath = path.join(dataDir, 'board.json');

// Klasörleri oluştur
const ensureDirs = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Default board data
const getDefaultBoardData = () => ({
  slides: [],
  duty: { 
    date: new Date().toISOString().split('T')[0], 
    teachers: [], 
    students: [] 
  },
  birthdays: [],
  countdowns: [],
  marqueeTexts: [],
  config: { 
    schoolName: "Lovelied Board", 
    timezone: "Europe/Istanbul", 
    primaryColor: "", 
    secondaryColor: "" 
  },
  quotes: [],
  bellSchedule: [],
  daySchedules: []
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    ensureDirs();

    if (req.method === 'GET') {
      // GET /api/board
      let boardData;
      
      if (fs.existsSync(boardJsonPath)) {
        const json = fs.readFileSync(boardJsonPath, 'utf-8');
        boardData = JSON.parse(json);
      } else {
        boardData = getDefaultBoardData();
        fs.writeFileSync(boardJsonPath, JSON.stringify(boardData, null, 2), 'utf-8');
      }
      
      res.status(200).json(boardData);
    } 
    else if (req.method === 'PUT') {
      // PUT /api/board
      const body = JSON.stringify(req.body, null, 2);
      fs.writeFileSync(boardJsonPath, body, 'utf-8');
      res.status(200).json({ ok: true });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
