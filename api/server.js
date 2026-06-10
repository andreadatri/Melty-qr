import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { initDatabase, insertRegistration, findUserByEmail, getAllRegistrations, getRegistrationStats } from './database.js'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'melty-qr-dev-secret-change-in-production'

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Permette richieste senza origin (es. curl/postman)
    if (!origin) return callback(null, true)

    // Consenti tutte le origin locali in sviluppo (localhost/127.0.0.1 su qualsiasi porta)
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    if (isLocalhost) return callback(null, true)

    return callback(new Error('Origin non consentita da CORS'))
  },
  credentials: true,
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Inizializza il database
await initDatabase()

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server in esecuzione' })
})

// Registrazione utente
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, restaurantName, city, password } = req.body

    // Validazione
    if (!name || !email || !phone || !restaurantName || !city || !password) {
      return res.status(400).json({
        success: false,
        error: 'Tutti i campi sono obbligatori'
      })
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email non valida'
      })
    }

    // Validazione password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'La password deve essere di almeno 8 caratteri'
      })
    }

    // Hash password con bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10)

    // Raccogli metadata
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const userAgent = req.headers['user-agent'] || 'unknown'

    const result = await insertRegistration({
      name, email, phone, restaurantName, city,
      passwordHash, ipAddress, userAgent
    })

    res.json({
      success: true,
      message: 'Registrazione completata con successo',
      registrationId: result.id
    })
  } catch (error) {
    console.error('Errore registrazione:', error.message)

    if (error.message.includes('UNIQUE constraint failed: registrations.email')) {
      return res.status(409).json({
        success: false,
        error: 'Questa email è già registrata. Accedi al tuo account.'
      })
    }

    res.status(500).json({ success: false, error: 'Errore durante la registrazione' })
  }
})

// Login utente
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e password obbligatorie' })
    }

    const user = await findUserByEmail(email)

    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenziali non valide' })
    }

    if (!user.password_hash) {
      return res.status(401).json({ success: false, error: 'Account creato senza password. Contatta il supporto.' })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Credenziali non valide' })
    }

    // Genera JWT con scadenza 7 giorni
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        restaurantName: user.restaurant_name,
        city: user.city
      }
    })
  } catch (error) {
    console.error('Errore login:', error.message)
    res.status(500).json({ success: false, error: 'Errore durante il login' })
  }
})

// Get statistiche
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getRegistrationStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get tutte le registrazioni (per admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await getAllRegistrations()
    res.json({
      total: registrations.length,
      registrations
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server in ascolto su http://localhost:${PORT}`)
  console.log(`📝 Registrazioni: POST http://localhost:${PORT}/api/register`)
  console.log(`📊 Statistiche: GET http://localhost:${PORT}/api/stats\n`)
})
