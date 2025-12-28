const http = require('http')
const express = require('express')
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

let sgMail = null
try {
  sgMail = require('@sendgrid/mail')
  if (process.env.SENDGRID_API_KEY) sgMail.setApiKey(process.env.SENDGRID_API_KEY)
} catch (e) {
  sgMail = null
}

const app = express()
const PORT = Number(process.env.PORT) || 3000
const PROGRAMS_DIR = path.join(__dirname, 'programs')
const PUBLIC_DIR = path.join(__dirname, 'public')
const DEBUG_LOG = path.join(__dirname, 'debug.log')

if (!fs.existsSync(PROGRAMS_DIR)) fs.mkdirSync(PROGRAMS_DIR, { recursive: true })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(PUBLIC_DIR))

function log(message) {
  const ts = new Date().toISOString()
  const line = `[${ts}] ${message}`
  try { fs.appendFileSync(DEBUG_LOG, line + '\n', 'utf8') } catch (e) { console.error('log error:', e && e.message) }
  console.log(line)
}

// --- WORKOUT GENERATOR ---
function generateWorkout(data) {
  const responses = data.responses || {};
  const goal = responses[5] || 'forme';
  const level = responses[4] || 'débutant';
  const frequencyStr = responses[7] || '3x / semaine';

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
      (frequency === 4 && (i === 1 || i === 2 || i === 4 || i === 5)) || // Simple logic for 4x
      (frequency === 7);

    if (isTrainingDay) {
      activity = `Séance : ${goal} (${responses[6] || '30 min'})`;
    }
    schedule.push({ day: days[i], activity: activity });
  }

  const detailsSnippet = `
        <p>Objectif: <strong>${goal}</strong> | Niveau: <strong>${level}</strong></p>
        <ul style="line-height: 1.6; margin: 15px 0; padding-left: 20px;">
            ${schedule.map(s => `<li><strong>${s.day}:</strong> ${s.activity}</li>`).join('')}
        </ul>
    `;

  return {
    title,
    schedule,
    details: detailsSnippet,
    id: 'prog_' + Date.now(),
    isPremium: false,
    created: Date.now()
  };
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

app.post('/api/send-program', async (req, res) => {
  try {
    const data = req.body;
    const program = generateWorkout(data);

    // Enrich program with user data for storage
    program.user = {
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    program.responses = data.responses;

    const filename = path.join(PROGRAMS_DIR, program.id + '.json');
    fs.writeFileSync(filename, JSON.stringify(program, null, 2), 'utf8');
    log(`Saved program ${program.id} for ${data.email}`);

    if (sgMail && data.email) {
      try {
        const PRODUCTION_URL = process.env.APP_URL || "https://essor-active.com";
        const programLink = `${PRODUCTION_URL}/my-program-pro.html?id=${program.id}`;
        const msg = {
          to: data.email,
          from: process.env.SENDGRID_FROM_EMAIL || 'contact@essor-active.com',
          subject: `🔥 Ton Programme : ${program.title}`,
          html: generateEmailHTML(data, program, programLink)
        };
        await sgMail.send(msg);
        log(`Email sent to ${data.email}`);
      } catch (emailErr) {
        log(`Email failed for ${data.email}: ${emailErr.message}`);
        if (emailErr.response) log(`SendGrid Error Detail: ${JSON.stringify(emailErr.response.body)}`);
        // Do not throw here, allow the response to be successful since data is saved.
      }
    }

    res.json({ success: true, programId: program.id });
  } catch (err) {
    log(`Global API Error: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/get-program', (req, res) => {
  try {
    const id = req.query.id;
    const filename = path.join(PROGRAMS_DIR, id + '.json');
    if (fs.existsSync(filename)) {
      const program = JSON.parse(fs.readFileSync(filename, 'utf8'));
      res.json(program);
    } else {
      res.status(404).json({ error: 'Program not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin-login', (req, res) => {
  const { password } = req.body || {}
  if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
    return res.json({ success: true, token: 'authenticated' })
  }
  return res.status(401).json({ success: false })
})

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')))
app.get('/questionnaire', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'questionnaire.html')))

app.listen(PORT, '0.0.0.0', () => {
  log(`Server listening on 0.0.0.0:${PORT}`)
})
