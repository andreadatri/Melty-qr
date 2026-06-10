<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

const menuSections = [
  {
    name: 'Antipasti',
    items: [
      { name: 'Bruschette al pomodoro', description: 'Pane croccante, pomodorini, basilico', price: '€ 6.50', tags: ['Vegetariano'] },
      { name: 'Tagliere misto', description: 'Selezione di salumi e formaggi locali', price: '€ 11.00', tags: ['Contiene lattosio'] },
    ],
  },
  {
    name: 'Primi',
    items: [
      { name: 'Tagliatelle al ragù', description: 'Pasta fresca con ragù tradizionale', price: '€ 12.00', tags: ['Specialità'] },
      { name: 'Risotto ai funghi porcini', description: 'Mantecato al parmigiano', price: '€ 13.50', tags: ['Vegetariano'] },
    ],
  },
  {
    name: 'Secondi',
    items: [
      { name: 'Filetto di salmone', description: 'Con verdure grigliate di stagione', price: '€ 16.00', tags: ['Pesce'] },
      { name: 'Cotoletta alla milanese', description: 'Con patate al forno', price: '€ 14.00', tags: [] },
    ],
  },
  {
    name: 'Dessert',
    items: [
      { name: 'Tiramisù della casa', description: 'Ricetta classica con mascarpone', price: '€ 6.00', tags: ['Contiene lattosio'] },
      { name: 'Panna cotta ai frutti rossi', description: 'Salsa ai frutti rossi artigianale', price: '€ 5.50', tags: [] },
    ],
  },
]

const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('user')
  window.location.hash = '#login'
}

onMounted(() => {
  try {
    const stored = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (!stored) {
      window.location.hash = '#login'
      return
    }

    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object' || !parsed.email) {
      window.location.hash = '#login'
      return
    }

    user.value = parsed
  } catch {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    window.location.hash = '#login'
  }
})
</script>

<template>
  <div class="menu-page" v-if="user">
    <header class="menu-header">
      <div class="shell header-inner">
        <a href="#top" class="brand">
          <div class="brand-icon">M</div>
          <span class="brand-text">Meally</span>
        </a>
        <div class="header-actions">
          <span class="user-chip">{{ user.name }}</span>
          <a href="#dashboard" class="ghost-btn">Dashboard</a>
          <button class="logout-btn" @click="logout">Esci</button>
        </div>
      </div>
    </header>

    <main class="shell menu-main">
      <section class="hero">
        <p class="eyebrow">Utente connesso</p>
        <h1>Menu del ristorante</h1>
        <p>{{ user.restaurantName }} · {{ user.city }}</p>
      </section>

      <section class="menu-grid">
        <article v-for="section in menuSections" :key="section.name" class="menu-card">
          <h2>{{ section.name }}</h2>
          <div class="menu-items">
            <div v-for="item in section.items" :key="item.name" class="menu-item">
              <div class="item-top">
                <strong>{{ item.name }}</strong>
                <span class="price">{{ item.price }}</span>
              </div>
              <p>{{ item.description }}</p>
              <div v-if="item.tags.length" class="tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.menu-page {
  min-height: 100vh;
  background: #f7f3ee;
}

.menu-header {
  background: white;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-chip {
  background: var(--peach);
  color: var(--ink);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.ghost-btn,
.logout-btn {
  border: 1px solid var(--line);
  background: white;
  color: var(--ink);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.logout-btn {
  cursor: pointer;
}

.menu-main {
  padding: 32px 0 56px;
}

.hero {
  margin-bottom: 26px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--orange);
  font-weight: 700;
}

.hero h1 {
  margin: 0;
  font-size: 34px;
}

.hero p {
  margin: 8px 0 0;
  color: var(--muted);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.menu-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.menu-card h2 {
  margin: 0 0 14px;
  font-size: 20px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.menu-item {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.menu-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.item-top strong {
  font-size: 15px;
}

.price {
  color: var(--orange);
  font-weight: 700;
}

.menu-item p {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.tags {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  color: var(--blue);
  background: rgba(75, 139, 255, 0.12);
  border-radius: 999px;
  padding: 4px 8px;
}

@media (max-width: 900px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .header-inner {
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding: 14px 0;
  }
}
</style>
