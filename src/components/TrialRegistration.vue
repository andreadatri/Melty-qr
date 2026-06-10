<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  phone: '',
  restaurantName: '',
  city: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const submitted = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  if (!formData.value.acceptTerms) {
    errorMessage.value = 'Accetta i termini e le condizioni per continuare'
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Le password non coincidono'
    return
  }

  if (formData.value.password.length < 8) {
    errorMessage.value = 'La password deve essere di almeno 8 caratteri'
    return
  }

  errorMessage.value = ''
  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        restaurantName: formData.value.restaurantName,
        city: formData.value.city,
        password: formData.value.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Errore durante la registrazione'
      throw new Error(data.error)
    }

    submitted.value = true
    // Reset del form dopo 3 secondi
    setTimeout(() => {
      resetForm()
    }, 3000)
  } catch (error) {
    console.error('Errore registrazione:', error)
    if (!errorMessage.value) {
      errorMessage.value = 'Errore durante la registrazione. Riprova.'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  }
  submitted.value = false
}
</script>

<template>
  <div class="landing-page trial-page">
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
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="trial-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="shell">
          <div class="hero-inner">
            <div class="hero-text">
              <p class="eyebrow">Prova Gratuita</p>
              <h1 class="hero-title">Inizia i tuoi 14 giorni gratis</h1>
              <p class="hero-description">
                Accedi subito alla piattaforma. Nessuna carta di credito richiesta. Inizia a digitalizzare il tuo menu e a
                gestire gli ordini online in pochi minuti.
              </p>
              <div class="highlights">
                <div class="highlight-item">
                  <span class="check-icon">✓</span>
                  <span>Accesso illimitato a tutte le funzionalità</span>
                </div>
                <div class="highlight-item">
                  <span class="check-icon">✓</span>
                  <span>Supporto in italiano via chat e email</span>
                </div>
                <div class="highlight-item">
                  <span class="check-icon">✓</span>
                  <span>Nessun impegno, cancella quando vuoi</span>
                </div>
              </div>
            </div>

            <!-- Registration Form -->
            <div class="form-card">
              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <div v-if="submitted" class="success-message">
                <div class="success-icon">✓</div>
                <h3>Registrazione completata!</h3>
                <p>Ti abbiamo inviato un email di conferma a <strong>{{ formData.email }}</strong></p>
                <p class="success-detail">Accedi al tuo account e inizia subito la prova gratuita.</p>
              </div>

              <form v-else @submit.prevent="submitForm" class="registration-form">
                <h2 class="form-title">Inizia Subito</h2>

                <div class="form-group">
                  <label for="name" class="form-label">Nome e Cognome *</label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="form-input"
                    placeholder="Mario Rossi"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-input"
                    placeholder="mario@ristorante.it"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="phone" class="form-label">Telefono *</label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+39 3XX XXX XXXX"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="restaurantName" class="form-label">Nome del Ristorante *</label>
                  <input
                    id="restaurantName"
                    v-model="formData.restaurantName"
                    type="text"
                    class="form-input"
                    placeholder="Es. La Bella Napoli"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="city" class="form-label">Città *</label>
                  <input
                    id="city"
                    v-model="formData.city"
                    type="text"
                    class="form-input"
                    placeholder="Milano"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="password" class="form-label">Password *</label>
                  <input
                    id="password"
                    v-model="formData.password"
                    type="password"
                    class="form-input"
                    placeholder="Minimo 8 caratteri"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="confirmPassword" class="form-label">Conferma Password *</label>
                  <input
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    type="password"
                    class="form-input"
                    placeholder="Ripeti la password"
                    required
                  />
                </div>

                <div class="form-group checkbox-group">
                  <input
                    id="terms"
                    v-model="formData.acceptTerms"
                    type="checkbox"
                    class="form-checkbox"
                    required
                  />
                  <label for="terms" class="checkbox-label">
                    Accetto i <a href="#" class="link">termini e le condizioni</a> e l'informativa sulla privacy *
                  </label>
                </div>

                <button type="submit" class="submit-button" :disabled="loading">
                  <span v-if="!loading">Inizia la Prova Gratuita</span>
                  <span v-else>Sto registrando...</span>
                </button>

                <p class="form-footer">
                  Hai già un account?
                  <a href="#login" class="link">Accedi qui</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="trust-section">
        <div class="shell">
          <h3 class="trust-title">Scelti da ristoratori italiani</h3>
          <div class="trust-grid">
            <div class="trust-item">
              <div class="trust-stat">4.9★</div>
              <p>Valutazione media</p>
            </div>
            <div class="trust-item">
              <div class="trust-stat">500+</div>
              <p>Ristoranti attivi</p>
            </div>
            <div class="trust-item">
              <div class="trust-stat">24/7</div>
              <p>Supporto in italiano</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.trial-page {
  background:
    radial-gradient(circle at top left, rgba(255, 196, 141, 0.18), transparent 24%),
    linear-gradient(180deg, #fff9f1 0%, #fff7ee 36%, #fffdf9 100%);
}

.primary-nav {
  display: flex;
  gap: 32px;
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

.hero-section {
  padding: 120px 0;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-text {
  max-width: 580px;
}

.eyebrow {
  font-size: 14px;
  font-weight: 600;
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 24px;
  color: var(--ink);
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 32px;
}

.highlights {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: var(--ink);
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--orange);
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
}

.form-card {
  background: var(--surface-strong);
  border-radius: var(--radius-xl);
  padding: 48px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
}

.error-message {
  background-color: rgba(229, 93, 88, 0.1);
  border: 1px solid var(--red);
  color: var(--red);
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--ink);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.form-input {
  padding: 12px 16px;
  border: 2px solid var(--line);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
  background: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:hover {
  border-color: var(--orange);
}

.form-input:focus {
  outline: none;
  border-color: var(--orange);
  box-shadow: 0 0 0 3px rgba(240, 111, 45, 0.1);
}

.checkbox-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 8px;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: var(--orange);
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
  cursor: pointer;
}

.link {
  color: var(--orange);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: var(--orange-deep);
}

.submit-button {
  padding: 16px 32px;
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

.form-footer {
  text-align: center;
  font-size: 14px;
  color: var(--muted);
  margin-top: 16px;
}

.success-message {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--green);
  color: white;
  border-radius: 50%;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
}

.success-message h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 12px;
}

.success-message p {
  font-size: 16px;
  color: var(--muted);
  margin: 0;
}

.success-detail {
  margin-top: 8px;
  font-size: 14px;
}

.trust-section {
  padding: 80px 0;
  border-top: 1px solid var(--line);
}

.trust-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 40px;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.trust-item {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.5);
}

.trust-stat {
  font-size: 28px;
  font-weight: 700;
  color: var(--orange);
  margin-bottom: 8px;
}

.trust-item p {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-section {
    padding: 60px 0;
  }

  .hero-title {
    font-size: 36px;
  }

  .form-card {
    padding: 32px 24px;
  }

  .trust-grid {
    gap: 24px;
  }
}
</style>
