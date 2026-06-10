import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'registrations.db')

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore apertura database:', err.message)
  } else {
    console.log('✓ Database SQLite connesso a', dbPath)
  }
})

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT NOT NULL,
          restaurant_name TEXT NOT NULL,
          city TEXT NOT NULL,
          password_hash TEXT NOT NULL DEFAULT '',
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) { reject(err); return }
        console.log('✓ Tabella registrations creata/verificata')
      })

      // Aggiunge password_hash se la colonna non esiste (migration)
      db.run(`ALTER TABLE registrations ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''`, () => {
        // Ignora errore se la colonna esiste già
      })

      db.run(`CREATE INDEX IF NOT EXISTS idx_email ON registrations(email)`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  })
}

export const insertRegistration = (data) => {
  return new Promise((resolve, reject) => {
    const { name, email, phone, restaurantName, city, passwordHash, ipAddress, userAgent } = data

    db.run(
      `INSERT INTO registrations (name, email, phone, restaurant_name, city, password_hash, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, restaurantName, city, passwordHash, ipAddress, userAgent],
      function(err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      }
    )
  })
}

export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM registrations WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const getAllRegistrations = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, name, email, phone, restaurant_name, city, created_at FROM registrations ORDER BY created_at DESC`, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const getRegistrationStats = () => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT
        COUNT(*) as total,
        COUNT(DISTINCT city) as cities,
        COUNT(DISTINCT DATE(created_at)) as days_active
      FROM registrations
    `, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}
