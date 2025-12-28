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
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(PUBLIC_DIR))

function log(message) {
  const ts = new Date().toISOString()
  const line = `[${ts}] ${message}`
  try { fs.appendFileSync(DEBUG_LOG, line + '\n', 'utf8') } catch (e) { console.error('log error:', e && e.message) }
  console.log(line)
}

function generateWorkoutProgram(userId, options = {}) {
  const duration = Number(options.duration) || 12
  const difficulty = options.difficulty || 'intermediate'
  const name = options.name || 'Custom Workout Program'
  const program = { id: `program-${Date.now()}`, userId, name, duration, difficulty, createdAt: new Date().toISOString(), weeks: [] }
  for (let w = 1; w <= duration; w++) {
    program.weeks.push({ week: w, workouts: [ { day: 'Monday', type: 'Strength', minutes: 45 }, { day: 'Wednesday', type: 'Cardio', minutes: 30 }, { day: 'Friday', type: 'Mixed', minutes: 40 } ] })
  }
  return program
}

async function sendEmail(to, subject, html) {
  if (!sgMail || !process.env.SENDGRID_FROM_EMAIL) { log(`Skip email: ${subject} -> ${to}`); return }
  try { await sgMail.send({ to, from: process.env.SENDGRID_FROM_EMAIL, subject, html }); log(`Email sent to ${to}`) } catch (e) { log(`SendGrid error: ${e && e.message}`) }
}

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.post('/api/send-program', async (req, res) => {
  try {
    const { email, userId, preferences } = req.body || {}
    if (!email || !userId) return res.status(400).json({ error: 'Missing email or userId' })
    const program = generateWorkoutProgram(userId, preferences || {})
    const filename = path.join(PROGRAMS_DIR, program.id + '.json')
    fs.writeFileSync(filename, JSON.stringify(program, null, 2), 'utf8')
    log(`Saved program ${program.id}`)
    if (email && sgMail) {
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`
      const html = `<h1>Your workout program</h1><p>Name: ${program.name}</p><p>Duration: ${program.duration} weeks</p><p>Difficulty: ${program.difficulty}</p><p><a href="${appUrl}/my-program.html?id=${program.id}">View your program</a></p>`
      try { await sendEmail(email, `Your Workout Program: ${program.name}`, html) } catch (e) { log(`Email error: ${e && e.message}`) }
    }
    res.json({ ok: true, id: program.id })
  } catch (e) { log(`save error ${e && e.message}`); res.status(500).json({ error: e.message }) }
})

app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body || {}
  const ok = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
  if (ok) return res.json({ ok: true })
  return res.status(401).json({ ok: false })
})

app.get(['/api/get-program', '/api/get-program/:id'], (req, res) => {
  try {
    const id = req.params.id || req.query.id
    if (!id) return res.status(400).json({ error: 'Missing program id' })
    const filename = path.join(PROGRAMS_DIR, id + '.json')
    if (!fs.existsSync(filename)) { log(`Program not found: ${id}`); return res.status(404).json({ error: 'Program not found' }) }
    const program = JSON.parse(fs.readFileSync(filename, 'utf8'))
    res.json(program)
  } catch (e) { log(`get-program error ${e && e.message}`); res.status(500).json({ error: e.message }) }
})

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')))
app.get('/questionnaire', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'questionnaire.html')))
app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => { log(`Server error: ${err && err.message}`); res.status(500).json({ error: 'Internal server error' }) })

const server = http.createServer(app)
server.listen(PORT, '0.0.0.0', () => { log(`Server listening on 0.0.0.0:${PORT}`); console.log(`Server listening on 0.0.0.0:${PORT}`) })
