<script setup>
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const loading = ref(false)
const errorMessage = ref('')
const loggedIn = ref(false)
const userData = ref(null)
const showPassword = ref(false)

const submitLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Credenziali non valide'
      return
    }

    // Salva token
    const storage = formData.value.rememberMe ? localStorage : sessionStorage
    storage.setItem('auth_token', data.token)
    storage.setItem('user', JSON.stringify(data.user))

    userData.value = data.user
    loggedIn.value = true
    window.location.hash = '#menu-utente'
  } catch (error) {
    console.error('Errore login:', error)
    errorMessage.value = 'Errore di connessione. Il server è attivo?'
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('user')
  loggedIn.value = false
  userData.value = null
  formData.value = { email: '', password: '', rememberMe: false }
}
</script>

<template>
  <div class="landing-page login-page">
    <!-- Header -->
    <header class="site-header">
      <div class="shell">
        <div class="header-bar">
          <a href="#top" class="brand">
            <div class="brand-icon" style="background: var(--orange); color: white; font-weight: 700">
              M
            </div>
            <span style="font-weight: 600; font-size: 18px">Meally</span>
          </a>
          <nav class="primary-nav">
            <a href="#top" class="nav-link">Torna alla Home</a>
            <a href="#trial" class="nav-link-cta">Registrati gratis</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="login-content">
      <div class="shell">
        <div class="login-wrapper">

          <!-- Pannello sinistro: info -->
          <div class="login-info">
            <p class="eyebrow">Bentornato</p>
            <h1 class="login-title">Accedi alla tua dashboard</h1>
            <p class="login-description">
              Gestisci il menu, monitora gli ordini e mantieni la cucina sincronizzata in un unico posto.
            </p>
            <div class="login-features">
              <div class="feature-row">
                <span class="feature-dot orange"></span>
                <span>Menu aggiornabile in tempo reale</span>
              </div>
              <div class="feature-row">
                <span class="feature-dot blue"></span>
                <span>Ordini e notifiche istantanee</span>
              </div>
              <div class="feature-row">
                <span class="feature-dot green"></span>
                <span>Statistiche e report dettagliati</span>
              </div>
            </div>

            <div class="trial-badge">
              <span class="badge-icon">🎁</span>
              <div>
                <strong>Non hai ancora un account?</strong>
                <p><a href="#trial" class="badge-link">Prova gratis 14 giorni</a> senza carta di credito.</p>
              </div>
            </div>
          </div>

          <!-- Pannello destro: form -->
          <div class="login-card">
            <!-- Stato: loggato -->
            <div v-if="loggedIn" class="logged-in-state">
              <div class="logged-avatar">{{ userData.name.charAt(0).toUpperCase() }}</div>
              <h2>Bentornato, {{ userData.name.split(' ')[0] }}!</h2>
              <p class="logged-restaurant">{{ userData.restaurantName }}</p>
              <p class="logged-email">{{ userData.email }}</p>

              <a href="#menu-utente" class="dashboard-button">
                Vai al Menu →
              </a>

              <button class="logout-link" @click="logout">Disconnetti</button>
            </div>

            <!-- Form login -->
            <form v-else @submit.prevent="submitLogin" class="login-form">
              <h2 class="form-title">Accedi</h2>
              <p class="form-subtitle">Inserisci le tue credenziali per continuare</p>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  placeholder="mario@ristorante.it"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  Password
                  <a href="#reset-password" class="forgot-link">Password dimenticata?</a>
                </label>
                <div class="password-wrapper">
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Nascondi password' : 'Mostra password'"
                  >
                    {{ showPassword ? '🙈' : '👁' }}
                  </button>
                </div>
              </div>

              <div class="form-group remember-row">
                <input
                  id="rememberMe"
                  v-model="formData.rememberMe"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="rememberMe" class="checkbox-label">Ricordami per 7 giorni</label>
              </div>

              <button type="submit" class="submit-button" :disabled="loading">
                <span v-if="!loading">Accedi</span>
                <span v-else>Accesso in corso...</span>
              </button>

              <p class="form-footer">
                Non hai un account?
                <a href="#trial" class="link">Registrati gratis</a>
              </p>
            </form>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  background:
    radial-gradient(circle at top left, rgba(255, 196, 141, 0.18), transparent 24%),
    linear-gradient(180deg, #fff9f1 0%, #fff7ee 36%, #fffdf9 100%);
  min-height: 100vh;
}

.primary-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--orange);
}

.nav-link-cta {
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--orange);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  transition: background 0.3s ease;
}

.nav-link-cta:hover {
  background: var(--orange-deep);
}

.login-content {
  padding: 100px 0 80px;
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

/* Pannello sinistro */
.login-info {
  max-width: 480px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}

.login-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink);
  margin: 0 0 20px;
}

.login-description {
  font-size: 17px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 32px;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
}

.feature-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--ink);
}

.feature-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.feature-dot.orange { background: var(--orange); }
.feature-dot.blue   { background: var(--blue); }
.feature-dot.green  { background: var(--green); }

.trial-badge {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: var(--peach);
  border: 1px solid rgba(240, 111, 45, 0.2);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.badge-icon { font-size: 24px; }

.trial-badge strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 4px;
}

.trial-badge p {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
}

.badge-link {
  color: var(--orange);
  font-weight: 600;
}

/* Card login */
.login-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 4px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.forgot-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--orange);
}

.forgot-link:hover { text-decoration: underline; }

.password-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--line);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
  background: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-input:hover { border-color: var(--orange); }

.form-input:focus {
  outline: none;
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(240, 111, 45, 0.1);
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
}

.remember-row {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--orange);
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 14px;
  color: var(--muted);
  cursor: pointer;
}

.submit-button {
  padding: 15px;
  background: var(--orange);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.submit-button:hover:not(:disabled) {
  background: var(--orange-deep);
  box-shadow: 0 8px 24px rgba(240, 111, 45, 0.25);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.link {
  color: var(--orange);
  font-weight: 600;
}

.link:hover { text-decoration: underline; }

.form-footer {
  text-align: center;
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}

.error-message {
  background-color: rgba(229, 93, 88, 0.1);
  border: 1px solid var(--red);
  color: var(--red);
  padding: 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
}

/* Stato loggato */
.logged-in-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 20px 0;
}

.logged-avatar {
  width: 72px;
  height: 72px;
  background: var(--orange);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.logged-in-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.logged-restaurant {
  font-size: 16px;
  font-weight: 600;
  color: var(--orange);
  margin: 0;
}

.logged-email {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}

.dashboard-button {
  display: inline-block;
  margin-top: 12px;
  padding: 14px 28px;
  background: var(--orange);
  color: white;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.dashboard-button:hover { background: var(--orange-deep); }

.logout-link {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-decoration: underline;
}

.logout-link:hover { color: var(--red); }

/* Responsive */
@media (max-width: 768px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .login-content {
    padding: 60px 0;
  }

  .login-title {
    font-size: 36px;
  }

  .login-card {
    padding: 32px 24px;
  }
}
</style>
