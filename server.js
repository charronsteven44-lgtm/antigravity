const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DEBUG_LOG = path.join(__dirname, 'debug.log');
const PROGRAMS_DIR = path.join(__dirname, 'programs');

// Ensure programs directory exists
if (!fs.existsSync(PROGRAMS_DIR)) {
  fs.mkdirSync(PROGRAMS_DIR, { recursive: true });
}

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Utility: Log to file and console
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(DEBUG_LOG, logMessage + '\n');
}

// Utility: Generate a workout program
function generateWorkoutProgram(userId, preferences) {
  return {
    id: `program-${Date.now()}`,
    userId,
    name: preferences.name || 'Workout Program',
    duration: preferences.duration || 12,
    difficulty: preferences.difficulty || 'intermediate',
    createdAt: new Date().toISOString(),
    weeks: Array.from({ length: preferences.duration || 12 }, (_, i) => ({
      week: i + 1,
      workouts: [
        { day: 'Monday', exercise: 'Strength Training', duration: 60 },
        { day: 'Wednesday', exercise: 'Cardio', duration: 45 },
        { day: 'Friday', exercise: 'Strength Training', duration: 60 }
      ]
    }))
  };
}

// Utility: Send email via SendGrid
async function sendEmail(to, subject, htmlContent) {
  if (!process.env.SENDGRID_API_KEY) {
    log(`Email not sent (no SENDGRID_API_KEY): ${subject} to ${to}`);
    return;
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@essor-active.com',
      subject,
      html: htmlContent
    });
    log(`Email sent: ${subject} to ${to}`);
  } catch (err) {
    log(`Error sending email: ${err.message}`);
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/send-program - Generate and send a workout program
app.post('/api/send-program', async (req, res) => {
  try {
    const { email, userId, preferences } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId required' });
    }

    log(`Generating program for user ${userId}`);
    const program = generateWorkoutProgram(userId, preferences || {});

    // Save program to file
    const programFile = path.join(PROGRAMS_DIR, `${program.id}.json`);
    fs.writeFileSync(programFile, JSON.stringify(program, null, 2));
    log(`Program saved: ${program.id}`);

    // Send email
    const emailHtml = `
      <h2>Your Workout Program: ${program.name}</h2>
      <p>Duration: ${program.duration} weeks</p>
      <p>Difficulty: ${program.difficulty}</p>
      <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/my-program.html?id=${program.id}">View your program</a></p>
    `;
    await sendEmail(email, `Your Workout Program: ${program.name}`, emailHtml);

    res.json({ ok: true, programId: program.id, message: 'Program generated and emailed' });
  } catch (err) {
    log(`Error in /api/send-program: ${err.message}`);
    res.status(500).json({ error: 'Failed to generate program' });
  }
});

// POST /api/admin-login - Admin authentication
app.post('/api/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation (in production, use proper auth with hashed passwords)
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'password';

    if (username === adminUser && password === adminPass) {
      log(`Admin login successful for ${username}`);
      res.json({ ok: true, token: 'mock-token-' + Date.now() });
    } else {
      log(`Admin login failed for ${username}`);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    log(`Error in /api/admin-login: ${err.message}`);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/get-program - Retrieve a specific program
app.get('/api/get-program/:id', (req, res) => {
  try {
    const { id } = req.params;
    const programFile = path.join(PROGRAMS_DIR, `${id}.json`);

    if (!fs.existsSync(programFile)) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const program = JSON.parse(fs.readFileSync(programFile, 'utf8'));
    log(`Program retrieved: ${id}`);
    res.json(program);
  } catch (err) {
    log(`Error in /api/get-program: ${err.message}`);
    res.status(500).json({ error: 'Failed to retrieve program' });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  log(`Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
  log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'debug.log'), logLine);
    } catch (e) {
        console.error('Logging failed:', e.message);
    }
}

// Mime types for static file serving (if used as fallback)
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// CORS Helper
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or specifically 'https://essor-active.com'
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Helpers
function parsePostBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        });
    });
}

// --- WORKOUT GENERATOR ---
function generateWorkout(data) {
    const goal = data.responses[5] || 'forme';
    const level = data.responses[4] || 'débutant';
    const frequencyStr = data.responses[7] || '3x / semaine';

    let frequency = 3;
    if (frequencyStr.includes('2x')) frequency = 2;
    if (frequencyStr.includes('4x')) frequency = 4;
    if (frequencyStr.includes('Tous les jours')) frequency = 7;

    let title = "Programme ESSOR - ";
    if (goal.includes('poids')) title += "Perte de Poids";
    else if (goal.includes('muscle')) title += "Prise de Muscle";
    else if (goal.includes('douleurs')) title += "Mobilité & Santé";
    else if (goal.includes('Performance')) title += "Performance Athlétique";
    else title += "Remise en Forme";

    title += (level.includes('Avancé') ? " (Avancé)" : " (Initial)");

    let schedule = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    for (let i = 0; i < 7; i++) {
        let activity = "Repos / Récupération Active";
        const isTrainingDay = (frequency === 2 && (i === 1 || i === 4)) ||
            (frequency === 3 && (i === 0 || i === 2 || i === 4)) ||
            (frequency === 4 && (i === 0 || i === 1 || i === 3 || i === 4)) ||
            (frequency === 7);

        if (isTrainingDay) {
            activity = `Séance : ${goal} (${data.responses[6] || '30 min'})`;
        }

        schedule.push({ day: days[i], activity: activity });
    }

    const details = `
        <h3 style="color: #49e619;">🏃 ${title}</h3>
        <p>Objectif: ${goal} | Niveau: ${level}</p>
        <ul style="line-height: 1.6;">
            ${schedule.map(s => `<li><strong>${s.day}:</strong> ${s.activity}</li>`).join('')}
        </ul>
        <p><em>"La régularité est la clé du succès. On lâche rien !"</em></p>
    `;

    return {
        title,
        schedule,
        details,
        id: 'prog_' + Date.now(),
        isPremium: false,
        created: Date.now()
    };
}

function saveProgram(programData) {
    // Note: Render free tier filesystem is ephemeral. Re-deploys will delete these.
    const programsDir = path.join(__dirname, 'programs');
    if (!fs.existsSync(programsDir)) fs.mkdirSync(programsDir);

    const filePath = path.join(programsDir, `${programData.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(programData, null, 2));
    return programData.id;
}

function generateEmailHTML(data, program, link) {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px;">
        <h1 style="color: #49e619; text-align: center;">${program.title}</h1>
        <p>Bonjour ${data.name},</p>
        <p>Ton coach virtuel a analysé tes réponses. Voici ton plan d'action :</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #49e619; margin: 20px 0;">
            ${program.details}
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${link}" style="background-color: #49e619; color: black; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Voir mon Programme Complet</a>
        </div>
    </div>
</body>
</html>`;
}

async function handleEmailRequest(req, res) {
    try {
        const data = await parsePostBody(req);

        // Use PRODUCTION domain for links
        const PRODUCTION_URL = "https://essor-active.com";
        const program = generateWorkout(data);
        const programId = saveProgram(program);
        const programLink = `${PRODUCTION_URL}/my-program-pro.html?id=${programId}`;

        const msg = {
            to: data.email,
            from: process.env.SENDGRID_FROM_EMAIL || 'contact@essor-active.com',
            subject: `🔥 Ton Programme : ${program.title}`,
            html: generateEmailHTML(data, program, programLink)
        };

        if (process.env.SENDGRID_API_KEY) {
            await sgMail.send(msg);
            logToFile(`SUCCESS: Email sent to ${data.email}`);
        } else {
            logToFile('WARNING: Simulation Mode (No API Key)');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, programId: programId }));
    } catch (err) {
        logToFile(`ERROR: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
    }
}

const server = http.createServer(async (req, res) => {
    // Handle OPTIONS (Preflight)
    if (req.method === 'OPTIONS') {
        setCORSHeaders(res);
        res.writeHead(204);
        res.end();
        return;
    }

    // Always set CORS for all other requests
    setCORSHeaders(res);

    // API Handling
    if (req.url === '/api/send-program' && req.method === 'POST') {
        return handleEmailRequest(req, res);
    }

    // ADMIN LOGIN
    if (req.url === '/api/admin-login' && req.method === 'POST') {
        try {
            const body = await parsePostBody(req);
            if (body.password === (process.env.ADMIN_PASSWORD || "admin123")) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, token: 'authenticated' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: "Incorrect password" }));
            }
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
        }
        return;
    }

    if (req.url.startsWith('/api/get-program') && req.method === 'GET') {
        const urlObj = new URL(req.url, `http://localhost:${PORT}`);
        const id = urlObj.searchParams.get('id');
        const programPath = path.join(__dirname, 'programs', `${id}.json`);

        if (fs.existsSync(programPath)) {
            let program = JSON.parse(fs.readFileSync(programPath, 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(program));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Programme introuvable' }));
        }
        return;
    }

    // Static Asset Handling (Fallback/Development)
    let safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '\\' || safePath === '/') safePath = '/index.html';

    let filePath = path.join(__dirname, safePath).split('?')[0];

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            const extname = String(path.extname(filePath)).toLowerCase();
            res.writeHead(200, { 'Content-Type': mimeTypes[extname] || 'text/plain' });
            res.end(content, 'utf-8');
        }
    });
});

// Crash prevention
process.on('uncaughtException', (err) => console.error('ERROR:', err));

server.listen(PORT, '0.0.0.0', () => {
    console.log(`PRODUCTION SERVER running on port ${PORT}`);
});
