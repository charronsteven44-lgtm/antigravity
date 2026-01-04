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
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; background-color: #f8f8f8; color: #111; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 30px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 14px; color: #888; margin-bottom: 10px;">ESSOR ACTIVE</h2>
            <div style="height: 1px; width: 40px; background: #eee; margin: 0 auto;"></div>
        </div>
        
        <h1 style="color: #000; text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 20px;">Analyse en cours...</h1>
        
        <p style="font-size: 16px;">Bonjour <strong>${data.name}</strong>,</p>
        
        <p style="font-size: 16px;">Merci d'avoir complété le questionnaire ESSOR ACTIVE. Nos algorithmes analysent actuellement vos réponses pour générer votre programme optimal.</p>
        
        <div style="background: #fafafa; padding: 30px; border-radius: 15px; border: 1px solid #eee; margin: 30px 0;">
            <p style="margin-top: 0; font-weight: bold; color: #000;">Résumé de votre profil :</p>
            ${program.details}
        </div>

        <p style="font-size: 16px; margin-bottom: 30px;">Nous vous recontacterons très prochainement pour affiner cette analyse si nécessaire.</p>

        <div style="text-align: center; margin-top: 40px;">
            <a href="${link}" style="background-color: #000; color: #fff; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; transition: all 0.3s;">Accéder à mon espace</a>
        </div>

        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #aaa; font-size: 12px;">
            <p>© 2025 ESSOR ACTIVE. Tous droits réservés.</p>
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

        // Enrich program with user data for storage
        program.user = {
            name: data.name,
            email: data.email,
            phone: data.phone
        };
        program.responses = data.responses;

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
