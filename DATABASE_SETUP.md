# 📝 Sistema di Registrazione con SQLite

## Panoramica
Ho creato un sistema completo di registrazione con:
- **Frontend**: Modulo Vue con form di registrazione (TrialRegistration.vue)
- **Backend**: Server Node.js Express su porta 3001
- **Database**: SQLite per salvare le registrazioni

## 📁 Struttura dei file

```
api/
  ├── server.js          # Server Express
  ├── database.js        # Gestione database SQLite
  └── verify-db.js       # Script di verifica dati

src/
  └── components/
      └── TrialRegistration.vue  # Form di registrazione

registrations.db        # Database SQLite (creato automaticamente)
```

## 🚀 Come avviare

### Terminal 1 - Dev Vite (Frontend)
```bash
npm run dev
```
Il frontend è accessibile su `http://localhost:5173`

### Terminal 2 - Server API (Backend)
```bash
npm run server
```
Il server API è accessibile su `http://localhost:3001`

## 📋 Endpoint API

### Registrazione utente
**POST** `http://localhost:3001/api/register`

**Body:**
```json
{
  "name": "Marco Rossi",
  "email": "marco@example.com",
  "phone": "+39 3388765432",
  "restaurantName": "Ristorante Rossi",
  "city": "Milano"
}
```

**Risposta (successo):**
```json
{
  "success": true,
  "message": "Registrazione completata con successo",
  "registrationId": 1
}
```

### Statistiche
**GET** `http://localhost:3001/api/stats`

**Risposta:**
```json
{
  "total": 10,
  "cities": 5,
  "days_active": 3
}
```

## 🔍 Verificare i dati

```bash
node api/verify-db.js
```

## 📊 Struttura Database

### Tabella: registrations

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | INTEGER PRIMARY KEY | ID univoco |
| name | TEXT | Nome e cognome |
| email | TEXT UNIQUE | Email (unica) |
| phone | TEXT | Numero di telefono |
| restaurant_name | TEXT | Nome del ristorante |
| city | TEXT | Città |
| ip_address | TEXT | Indirizzo IP del client |
| user_agent | TEXT | User agent del browser |
| created_at | DATETIME | Data/ora di registrazione |

### Indici
- `idx_email` su email per ricerche veloci

## ✨ Funzionalità

✅ Validazione form lato client  
✅ Validazione email lato server  
✅ Protezione email duplicate  
✅ Salvataggio metadata (IP, user agent)  
✅ Messaggi di errore personalizzati  
✅ Messaggi di successo con feedback visivo  
✅ CORS configurato per localhost:5173  
✅ Database SQLite persistente  

## 🛠 Tecnologie

- **Frontend**: Vue 3
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Middleware**: CORS, Body-parser

## 📝 Note

- Il database viene creato automaticamente al primo avvio
- La tabella viene creata se non esiste
- Le email duplicate vengono rifiutate con messaggio di errore
- I dati persistono anche dopo il riavvio

## 🔧 Sviluppo futuro

Possibili miglioramenti:
- [ ] Autenticazione JWT
- [ ] Email di conferma
- [ ] Dashboard admin per visualizzare registrazioni
- [ ] Export dati CSV
- [ ] Rate limiting
- [ ] Captcha
- [ ] Multi-language support
