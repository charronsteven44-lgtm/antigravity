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

const ProgramSelector = require('./js/program-selector');

// --- EMAIL GENERATOR ---
function generateEmailHTML(userData, program, link) {
    let template = fs.readFileSync(path.join(__dirname, 'email-template.html'), 'utf8');

    // Construction du tableau de planning
    const exerciseDb = require('./js/exercises-db');

    const scheduleRows = program.schedule.map(s => {
        const exerciseInfo = exerciseDb[s.activity] || null;
        const thumbnailHtml = exerciseInfo ?
            `<div style="margin-bottom: 10px;">
                <img src="${exerciseInfo.thumbnail}" alt="${s.activity}" style="width: 100%; max-width: 200px; border-radius: 10px; border: 1px solid #49e619;">
            </div>` : '';

        const linkHtml = exerciseInfo ?
            `<a href="${link}&ex=${encodeURIComponent(s.activity)}" style="color: #49e619; text-decoration: none; font-size: 12px; font-weight: bold;">Voir la démonstration →</a>` : '';

        return `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 15px 12px; color: #49e619; font-weight: bold; width: 80px; vertical-align: top;">${s.day}</td>
                <td style="padding: 15px 12px; color: #ffffff; vertical-align: top;">
                    ${thumbnailHtml}
                    <div style="font-weight: bold; margin-bottom: 5px;">${s.activity}</div>
                    ${linkHtml}
                </td>
                <td style="padding: 15px 12px; color: #888; text-align: right; vertical-align: top;">${s.duration}</td>
            </tr>
        `;
    }).join('');

    const replacements = {
        '{{name}}': userData.name,
        '{{program_title}}': program.title,
        '{{goal}}': program.goal,
        '{{frequency}}': userData.responses[7] || '3x / semaine',
        '{{duration}}': userData.responses[6] || '30 min',
        '{{summary}}': program.summary,
        '{{schedule_table}}': scheduleRows,
        '{{program_link}}': link
    };

    for (const [key, value] of Object.entries(replacements)) {
        template = template.split(key).join(value);
    }

    return template;
}

// --- PROGRAM STORAGE ---
function saveProgram(program) {
    const programsDir = path.join(__dirname, 'programs');
    if (!fs.existsSync(programsDir)) fs.mkdirSync(programsDir);

    // Générer un ID court et unique
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const filePath = path.join(programsDir, `${id}.json`);

    fs.writeFileSync(filePath, JSON.stringify(program, null, 2));
    return id;
}

async function handleEmailRequest(req, res) {
    try {
        const data = await parsePostBody(req);

        // Production configuration
        const PRODUCTION_URL = "https://essor-active.com";

        // Sélection du programme intelligent
        const program = ProgramSelector.select(data.responses);
        if (!program) throw new Error("Erreur lors de la sélection du programme.");

        // Enrichissement pour le stockage
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
            subject: `🔥 Ton Programme Personnalisé : ${program.title}`,
            html: generateEmailHTML(data, program, programLink)
        };

        if (process.env.SENDGRID_API_KEY) {
            await sgMail.send(msg);
            logToFile(`SUCCESS: Email envoyé à ${data.email} (${program.id})`);
        } else {
            logToFile(`WARNING: Simulation Mode (No API Key) - Program: ${program.id}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, programId: programId }));
    } catch (err) {
        logToFile(`ERROR: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
    }
}

// --- CLIENT AUTH ---
function saveClient(clientData) {
    const clientsDir = path.join(__dirname, 'clients');
    if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir);
    const filePath = path.join(clientsDir, `${clientData.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(clientData, null, 2));
}

function getClient(email) {
    const clientsDir = path.join(__dirname, 'clients');
    const filePath = path.join(clientsDir, `${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

async function handleClientRegister(req, res) {
    try {
        const data = await parsePostBody(req);
        if (!data.email || !data.password) throw new Error("Email et mot de passe requis.");

        const existing = getClient(data.email);
        if (existing) throw new Error("Ce compte existe déjà.");

        data.registrationDate = new Date().toISOString();
        saveClient(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: "Inscription réussie", user: data }));
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
    }
}

async function handleClientLogin(req, res) {
    try {
        const data = await parsePostBody(req);
        const client = getClient(data.email);

        if (client && client.password === data.password) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, user: client }));
        } else {
            throw new Error("Email ou mot de passe incorrect.");
        }
    } catch (err) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
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
    if (req.url === '/api/client/register' && req.method === 'POST') {
        return handleClientRegister(req, res);
    }
    if (req.url === '/api/client/login' && req.method === 'POST') {
        return handleClientLogin(req, res);
    }
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
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
