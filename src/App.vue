<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const isMenuOpen = ref(false)
const openFaq = ref(null)

const navItems = [
  { label: 'Funzionalita', href: '#features' },
  { label: 'Come funziona', href: '#how-it-works' },
  { label: 'Testimonianze', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

const heroHighlights = ['Nessun costo nascosto', '14 giorni di prova', 'Supporto in italiano']

const features = [
  {
    icon: 'DD',
    title: 'Editor Drag and Drop',
    description:
      'Aggiorna menu, prezzi, immagini e allergeni in pochi clic con un flusso pensato per chi gestisce il locale, non per sviluppatori.',
    tone: 'orange',
  },
  {
    icon: 'UX',
    title: 'Menu Responsive',
    description:
      'Un’esperienza cliente chiara su smartphone, tablet e desktop con carrello dinamico e percorsi di ordine fluidi.',
    tone: 'blue',
  },
  {
    icon: 'RT',
    title: 'Notifiche in Tempo Reale',
    description:
      'Ogni nuovo ordine arriva subito via dashboard e alert visivi, così la cucina resta sincronizzata con la sala.',
    tone: 'green',
  },
  {
    icon: 'BI',
    title: 'Statistiche Dettagliate',
    description:
      'Monitora performance, piatti più richiesti e storico ordini con metriche leggibili e utili per decidere meglio.',
    tone: 'violet',
  },
  {
    icon: 'SC',
    title: 'Massima Sicurezza',
    description:
      'Accessi protetti, connessioni cifrate e gestione chiara dei dati per lavorare con affidabilità anche nei momenti di picco.',
    tone: 'red',
  },
  {
    icon: 'SP',
    title: 'Performance Ottimizzate',
    description:
      'Una piattaforma veloce e scalabile che riduce attriti operativi e sostiene la crescita del locale senza complessità extra.',
    tone: 'amber',
  },
]

const steps = [
  {
    number: '01',
    icon: 'RG',
    title: 'Registrati gratuitamente',
    description:
      'Apri l’account, accedi alla dashboard e parti con una prova guidata senza carta di credito.',
    tone: 'orange',
  },
  {
    number: '02',
    icon: 'MN',
    title: 'Crea il tuo menu',
    description:
      'Aggiungi piatti, categorie, varianti e allergeni con un editor visivo chiaro e immediato.',
    tone: 'blue',
  },
  {
    number: '03',
    icon: 'GO',
    title: 'Ricevi ordini online',
    description:
      'Pubblica il menu e gestisci ordini, stato tavoli e notifiche in una vista operativa unica.',
    tone: 'green',
  },
]

const testimonials = [
  {
    name: 'Marco Rossi',
    role: 'Proprietario, Trattoria da Marco',
    quote:
      'Abbiamo digitalizzato il menu in meno di un’ora. Gli ordini dal tavolo sono aumentati e il team perde molto meno tempo in spiegazioni ripetitive.',
    image:
      'https://images.unsplash.com/photo-1667725335393-3f5d14d45e6f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sofia Bianchi',
    role: 'Chef Owner, Sapori Italiani',
    quote:
      'Le notifiche in tempo reale hanno migliorato il coordinamento tra cucina e sala. Tutto e piu leggibile, piu veloce, piu controllabile.',
    image:
      'https://images.unsplash.com/photo-1512149519538-136d1b8c574a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Giovanni Ferretti',
    role: 'Manager, Pizzeria Vesuvio',
    quote:
      'Aggiorniamo il menu ogni giorno senza attriti. Il sistema e abbastanza semplice da usare anche per lo staff meno tecnico.',
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
  },
]

const stats = [
  { value: '500+', label: 'Ristoranti attivi' },
  { value: '15K+', label: 'Ordini gestiti' },
  { value: '98%', label: 'Soddisfazione media' },
]

const faqs = [
  {
    question: 'Come faccio a iniziare con la piattaforma?',
    answer:
      'Registri il locale, accedi alla dashboard e segui l’onboarding. In pochi minuti puoi impostare categorie, piatti e prime preferenze operative.',
  },
  {
    question: 'Quali sono i costi? Ci sono costi nascosti?',
    answer:
      'La prova gratuita dura 14 giorni. Dopo, i piani partono da 29 euro al mese senza costi di setup o commissioni inattese sugli ordini.',
  },
  {
    question: 'Posso modificare il menu in qualsiasi momento?',
    answer:
      'Si. Prezzi, descrizioni, immagini, allergeni e varianti possono essere aggiornati in tempo reale dalla dashboard.',
  },
  {
    question: 'Come funzionano le notifiche ordini?',
    answer:
      'Nuovi ordini, conferme e variazioni vengono segnalati subito in interfaccia con flussi pensati per non interrompere il lavoro del team.',
  },
  {
    question: 'Servono competenze tecniche?',
    answer:
      'No. L’interfaccia e progettata per un utilizzo diretto da parte di ristoratori e staff operativo, con struttura visuale e step guidati.',
  },
  {
    question: 'Come gestisco allergeni e varianti dei piatti?',
    answer:
      'Ogni voce del menu puo includere tag, note, varianti e informazioni chiare lato cliente, senza dover intervenire manualmente su codice o layout.',
  },
]

const footerColumns = [
  {
    title: 'Prodotto',
    links: ['Funzionalita', 'Prezzi', 'Come funziona', 'Richiedi demo', 'Aggiornamenti'],
  },
  {
    title: 'Risorse',
    links: ['Blog', 'Guide pratiche', 'Case study', 'FAQ', 'Supporto'],
  },
]

let observer

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

onMounted(() => {
  const animatedNodes = document.querySelectorAll('[data-animate]')

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    },
  )

  animatedNodes.forEach((node) => observer.observe(node))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="landing-page">
    <header class="site-header">
      <div class="shell header-bar">
        <a class="brand" href="#top" @click="closeMenu">
          <span class="brand-icon">MS</span>
          <span class="brand-text">MenuSmart</span>
        </a>

        <nav class="desktop-nav" aria-label="Primary">
          <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
          <a class="header-cta" href="#cta">Prova Gratis</a>
        </nav>

        <button class="menu-toggle" type="button" @click="isMenuOpen = !isMenuOpen">
          <span>{{ isMenuOpen ? 'Chiudi' : 'Menu' }}</span>
        </button>
      </div>

      <Transition name="mobile-menu">
        <div v-if="isMenuOpen" class="mobile-panel">
          <nav class="shell mobile-nav" aria-label="Mobile">
            <a v-for="item in navItems" :key="`mobile-${item.href}`" :href="item.href" @click="closeMenu">
              {{ item.label }}
            </a>
            <a class="header-cta" href="#cta" @click="closeMenu">Prova Gratis</a>
          </nav>
        </div>
      </Transition>
    </header>

    <main class="page-main" id="top">
      <section class="hero-section">
        <div class="hero-grid shell">
          <div class="hero-copy" data-animate="up">
            <div class="hero-chip">
              <span class="chip-dot"></span>
              Soluzione chiavi in mano per ristoratori
            </div>

            <h1>Digitalizza il tuo menu e semplifica gli ordini online.</h1>
            <p class="hero-lead">
              Gestisci il locale con una dashboard smart: crea menu interattivi, aggiorna prezzi e
              allergeni, ricevi ordini in real time e mantieni sala e cucina allineate.
            </p>

            <div class="hero-actions">
              <a class="button button-primary" href="#cta">Prova Gratis Ora</a>
              <a class="button button-secondary" href="#features">Scopri le Funzionalita</a>
            </div>

            <div class="hero-highlights">
              <div v-for="item in heroHighlights" :key="item" class="hero-highlight">
                <span class="check-mark">✓</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="hero-visual" data-animate="zoom">
            <div class="dashboard-card float-card">
              <div class="dashboard-topbar">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div class="dashboard-content">
                <div class="dashboard-sidebar">
                  <div class="sidebar-pill active"></div>
                  <div class="sidebar-pill"></div>
                  <div class="sidebar-pill"></div>
                  <div class="sidebar-pill short"></div>
                </div>

                <div class="dashboard-main">
                  <div class="metric-row">
                    <article class="metric-card warm">
                      <strong>€12.4K</strong>
                      <span>Incasso mensile</span>
                    </article>
                    <article class="metric-card cool">
                      <strong>128</strong>
                      <span>Ordini oggi</span>
                    </article>
                  </div>

                  <div class="chart-panel">
                    <div class="chart-line">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div class="chart-bars">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div class="order-list">
                    <div class="order-item">
                      <div>
                        <strong>Tavolo 5</strong>
                        <span>Pizza Margherita x2</span>
                      </div>
                      <em>Nuovo</em>
                    </div>
                    <div class="order-item">
                      <div>
                        <strong>Asporto</strong>
                        <span>Poke vegetariano</span>
                      </div>
                      <em>In corso</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="floating-note note-left">
              <span class="live-dot"></span>
              <div>
                <strong>Nuovo ordine</strong>
                <p>Ricevuto 2 secondi fa</p>
              </div>
            </div>

            <div class="floating-note note-right">
              <strong>+30%</strong>
              <p>Più ordini dal tavolo</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="features">
        <div class="shell">
          <div class="section-heading" data-animate="up">
            <p class="section-kicker">Funzionalita</p>
            <h2>Tutto cio che serve per digitalizzare il tuo ristorante.</h2>
            <p>
              Una piattaforma unica per menu, ordini, alert e statistiche, progettata per locali
              che vogliono semplificare l’operativita senza perdere controllo.
            </p>
          </div>

          <div class="feature-grid">
            <article
              v-for="(feature, index) in features"
              :key="feature.title"
              class="feature-card"
              :class="`tone-${feature.tone}`"
              :style="{ transitionDelay: `${index * 90}ms` }"
              data-animate="up"
            >
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section section-tinted" id="how-it-works">
        <div class="shell">
          <div class="section-heading" data-animate="up">
            <p class="section-kicker">Come funziona</p>
            <h2>Tre passaggi chiari, nessuna complessita superflua.</h2>
            <p>
              L’onboarding e rapido, l’editor e guidato, la pubblicazione e immediata. Il sistema
              e costruito per arrivare al valore in pochi minuti.
            </p>
          </div>

          <div class="steps-grid">
            <div class="steps-line" aria-hidden="true"></div>
            <article
              v-for="(step, index) in steps"
              :key="step.number"
              class="step-card"
              :class="`tone-${step.tone}`"
              :style="{ transitionDelay: `${index * 120}ms` }"
              data-animate="up"
            >
              <div class="step-icon">{{ step.icon }}</div>
              <span class="step-number">{{ step.number }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section testimonials-section" id="testimonials">
        <div class="shell">
          <div class="section-heading" data-animate="up">
            <p class="section-kicker">Testimonianze</p>
            <h2>Ristoratori che hanno gia scelto la digitalizzazione.</h2>
            <p>
              Feedback concreti da chi ha ridotto attrito operativo, migliorato il flusso ordini e
              reso il menu piu semplice da mantenere.
            </p>
          </div>

          <div class="testimonial-grid">
            <article
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.name"
              class="testimonial-card"
              :style="{ transitionDelay: `${index * 100}ms` }"
              data-animate="up"
            >
              <div class="stars" aria-hidden="true">★★★★★</div>
              <p class="testimonial-quote">“{{ testimonial.quote }}”</p>
              <div class="testimonial-person">
                <img :src="testimonial.image" :alt="testimonial.name" loading="lazy" />
                <div>
                  <strong>{{ testimonial.name }}</strong>
                  <span>{{ testimonial.role }}</span>
                </div>
              </div>
            </article>
          </div>

          <div class="stats-band" data-animate="up">
            <article v-for="stat in stats" :key="stat.label" class="stat-item">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </article>
          </div>
        </div>
      </section>

      <section class="section faq-section" id="faq">
        <div class="shell faq-shell">
          <div class="section-heading" data-animate="up">
            <p class="section-kicker">FAQ</p>
            <h2>Le risposte operative prima di partire.</h2>
            <p>
              Le domande piu comuni su attivazione, costi, aggiornamenti del menu, notifiche e
              sicurezza del sistema.
            </p>
          </div>

          <div class="faq-list">
            <article
              v-for="(faq, index) in faqs"
              :key="faq.question"
              class="faq-item"
              :style="{ transitionDelay: `${index * 60}ms` }"
              data-animate="up"
            >
              <button class="faq-trigger" type="button" @click="toggleFaq(index)">
                <span>{{ faq.question }}</span>
                <span class="faq-symbol">{{ openFaq === index ? '−' : '+' }}</span>
              </button>

              <Transition name="faq-expand">
                <div v-if="openFaq === index" class="faq-answer-wrap">
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
              </Transition>
            </article>
          </div>
        </div>
      </section>

      <section class="cta-section" id="cta">
        <div class="shell cta-shell" data-animate="zoom">
          <p class="section-kicker">Conversione</p>
          <h2>Pronto a digitalizzare il tuo ristorante?</h2>
          <p>
            Inizia con una prova gratuita, configura il menu in pochi minuti e verifica subito
            quanto puo migliorare il flusso operativo del tuo locale.
          </p>

          <div class="cta-actions">
            <a class="button cta-primary" href="#top">Prova Gratis per 14 Giorni</a>
            <a class="button cta-secondary" href="#faq">Richiedi una Demo</a>
          </div>

          <div class="cta-points">
            <span>✓ Nessuna carta richiesta</span>
            <span>✓ Setup in 10 minuti</span>
            <span>✓ Supporto in italiano</span>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell footer-grid">
        <section class="footer-brand">
          <a class="brand" href="#top">
            <span class="brand-icon">MS</span>
            <span class="brand-text">MenuSmart</span>
          </a>
          <p>
            La piattaforma completa per digitalizzare il ristorante e gestire menu e ordini online
            con una UX piu semplice, veloce e leggibile.
          </p>
          <div class="social-row">
            <a href="#top">Fb</a>
            <a href="#top">Ig</a>
            <a href="#top">In</a>
          </div>
        </section>

        <section v-for="column in footerColumns" :key="column.title">
          <h3>{{ column.title }}</h3>
          <ul class="footer-links">
            <li v-for="link in column.links" :key="link">
              <a href="#top">{{ link }}</a>
            </li>
          </ul>
        </section>

        <section>
          <h3>Contatti</h3>
          <ul class="contact-list">
            <li>
              <strong>Email</strong>
              <a href="mailto:info@menusmart.it">info@menusmart.it</a>
            </li>
            <li>
              <strong>Telefono</strong>
              <a href="tel:+390212345678">+39 02 1234 5678</a>
            </li>
            <li>
              <strong>Indirizzo</strong>
              <span>Via Roma 123, Milano, Italia</span>
            </li>
          </ul>
        </section>
      </div>

      <div class="shell footer-bottom">
        <p>© 2026 MenuSmart. Tutti i diritti riservati.</p>
        <div>
          <a href="#top">Privacy Policy</a>
          <a href="#top">Termini di Servizio</a>
          <a href="#top">Cookie Policy</a>
        </div>
      </div>
    </footer>
  </div>
</template>
