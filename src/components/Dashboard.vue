<script setup>
import { ref, onMounted, computed } from 'vue'

const user = ref(null)
const activeSection = ref('overview')

// Dati mock della dashboard
const stats = [
  { label: 'Incasso oggi', value: '€ 1.240', delta: '+12%', tone: 'orange', icon: '€' },
  { label: 'Ordini oggi', value: '38', delta: '+5', tone: 'blue', icon: '🧾' },
  { label: 'Tavoli attivi', value: '7', delta: '', tone: 'green', icon: '🪑' },
  { label: 'Soddisfazione', value: '4.8★', delta: '', tone: 'amber', icon: '⭐' },
]

const recentOrders = [
  { id: '#0041', table: 'Tavolo 3', items: 'Pizza Margherita x2, Acqua x2', total: '€ 22.00', status: 'nuovo', time: '2 min fa' },
  { id: '#0040', table: 'Tavolo 7', items: 'Risotto ai funghi x1, Vino rosso x1', total: '€ 28.50', status: 'in-corso', time: '8 min fa' },
  { id: '#0039', table: 'Asporto', items: 'Poke vegetariano x2', total: '€ 19.00', status: 'pronto', time: '15 min fa' },
  { id: '#0038', table: 'Tavolo 1', items: 'Tagliatelle al ragù x3, Birra x2', total: '€ 47.00', status: 'consegnato', time: '22 min fa' },
  { id: '#0037', table: 'Tavolo 5', items: 'Tiramisù x2, Caffè x2', total: '€ 14.00', status: 'consegnato', time: '31 min fa' },
]

const menuCategories = [
  { name: 'Antipasti', items: 6, active: true },
  { name: 'Primi', items: 8, active: true },
  { name: 'Secondi', items: 7, active: true },
  { name: 'Pizze', items: 12, active: true },
  { name: 'Dessert', items: 5, active: false },
  { name: 'Bevande', items: 10, active: true },
]

const navLinks = [
  { id: 'overview', label: 'Panoramica', icon: '📊' },
  { id: 'orders', label: 'Ordini', icon: '🧾' },
  { id: 'menu', label: 'Menu', icon: '📋' },
  { id: 'settings', label: 'Impostazioni', icon: '⚙️' },
]

const trialDaysLeft = 14

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
    if (stored) {
      const parsed = JSON.parse(stored)
      // Verifica che sia un oggetto utente valido
      if (parsed && typeof parsed === 'object' && parsed.email) {
        user.value = parsed
      } else {
        window.location.hash = '#login'
      }
    } else {
      window.location.hash = '#login'
    }
  } catch {
    // Valore non valido in storage → pulisce e manda al login
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    window.location.hash = '#login'
  }
})
</script>

<template>
  <div class="dashboard-app" v-if="user">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">M</div>
        <span class="brand-text">Meally</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="link in navLinks"
          :key="link.id"
          class="nav-item"
          :class="{ active: activeSection === link.id }"
          @click="activeSection = link.id"
        >
          <span class="nav-icon">{{ link.icon }}</span>
          <span>{{ link.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="trial-pill">
          <span class="trial-dot"></span>
          <span>{{ trialDaysLeft }} giorni rimasti</span>
        </div>
        <button class="logout-btn" @click="logout">
          <span>↩</span> Esci
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="dashboard-main">

      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">
            {{ navLinks.find(l => l.id === activeSection)?.label }}
          </h1>
          <p class="topbar-sub">{{ user.restaurantName }} · {{ user.city }}</p>
        </div>
        <div class="topbar-right">
          <div class="user-chip">
            <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <span>{{ user.name.split(' ')[0] }}</span>
          </div>
        </div>
      </header>

      <!-- Panoramica -->
      <main v-if="activeSection === 'overview'" class="section-content">

        <!-- Stats -->
        <div class="stats-grid">
          <article v-for="stat in stats" :key="stat.label" class="stat-card" :class="`tone-${stat.tone}`">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-body">
              <span class="stat-label">{{ stat.label }}</span>
              <strong class="stat-value">{{ stat.value }}</strong>
            </div>
            <span v-if="stat.delta" class="stat-delta">{{ stat.delta }}</span>
          </article>
        </div>

        <!-- Ordini recenti + grafico -->
        <div class="content-grid">
          <section class="card orders-card">
            <div class="card-header">
              <h2>Ordini recenti</h2>
              <button class="view-all" @click="activeSection = 'orders'">Vedi tutti →</button>
            </div>
            <div class="orders-list">
              <div v-for="order in recentOrders.slice(0,4)" :key="order.id" class="order-row">
                <div class="order-info">
                  <strong>{{ order.table }}</strong>
                  <span>{{ order.items }}</span>
                </div>
                <div class="order-meta">
                  <strong>{{ order.total }}</strong>
                  <span class="order-badge" :class="`badge-${order.status}`">{{ order.status }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="card activity-card">
            <div class="card-header">
              <h2>Attività oggi</h2>
            </div>
            <div class="chart-bars-demo">
              <div v-for="(h, i) in [40, 65, 50, 90, 75, 55, 80, 95, 60, 45, 70, 38]"
                :key="i" class="bar-col">
                <div class="bar-fill" :style="{ height: h + '%' }"></div>
                <span class="bar-label">{{ 8 + i }}h</span>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-dot"></span> Ordini per ora
            </div>
          </section>
        </div>

        <!-- Menu snapshot -->
        <section class="card">
          <div class="card-header">
            <h2>Categorie menu</h2>
            <button class="view-all" @click="activeSection = 'menu'">Gestisci →</button>
          </div>
          <div class="categories-grid">
            <div v-for="cat in menuCategories" :key="cat.name" class="category-chip" :class="{ inactive: !cat.active }">
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ cat.items }} voci</span>
              <span class="cat-status">{{ cat.active ? '● attiva' : '○ nascosta' }}</span>
            </div>
          </div>
        </section>

      </main>

      <!-- Ordini -->
      <main v-else-if="activeSection === 'orders'" class="section-content">
        <section class="card">
          <div class="card-header">
            <h2>Tutti gli ordini</h2>
            <span class="badge-count">{{ recentOrders.length }} oggi</span>
          </div>
          <table class="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tavolo</th>
                <th>Articoli</th>
                <th>Totale</th>
                <th>Ora</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="order-id">{{ order.id }}</td>
                <td><strong>{{ order.table }}</strong></td>
                <td class="order-items-cell">{{ order.items }}</td>
                <td><strong>{{ order.total }}</strong></td>
                <td class="order-time">{{ order.time }}</td>
                <td><span class="order-badge" :class="`badge-${order.status}`">{{ order.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <!-- Menu -->
      <main v-else-if="activeSection === 'menu'" class="section-content">
        <section class="card">
          <div class="card-header">
            <h2>Gestione menu</h2>
            <button class="btn-primary">+ Aggiungi piatto</button>
          </div>
          <div class="menu-categories-full">
            <div v-for="cat in menuCategories" :key="cat.name" class="menu-cat-row">
              <div class="menu-cat-info">
                <strong>{{ cat.name }}</strong>
                <span>{{ cat.items }} voci</span>
              </div>
              <div class="menu-cat-actions">
                <span class="cat-toggle" :class="{ on: cat.active }" @click="cat.active = !cat.active">
                  {{ cat.active ? 'Visibile' : 'Nascosta' }}
                </span>
                <button class="btn-ghost">Modifica →</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Impostazioni -->
      <main v-else-if="activeSection === 'settings'" class="section-content">
        <section class="card">
          <div class="card-header">
            <h2>Profilo ristorante</h2>
          </div>
          <div class="settings-grid">
            <div class="setting-field">
              <label>Nome titolare</label>
              <input type="text" class="setting-input" :value="user.name" readonly />
            </div>
            <div class="setting-field">
              <label>Email</label>
              <input type="email" class="setting-input" :value="user.email" readonly />
            </div>
            <div class="setting-field">
              <label>Ristorante</label>
              <input type="text" class="setting-input" :value="user.restaurantName" readonly />
            </div>
            <div class="setting-field">
              <label>Città</label>
              <input type="text" class="setting-input" :value="user.city" readonly />
            </div>
          </div>
          <div class="settings-footer">
            <button class="btn-danger" @click="logout">Disconnetti account</button>
          </div>
        </section>
      </main>

    </div>
  </div>
</template>

<style scoped>
/* Layout principale */
.dashboard-app {
  display: flex;
  min-height: 100vh;
  background: #f7f3ee;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 28px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 16px;
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: var(--orange);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.brand-text {
  font-weight: 700;
  font-size: 17px;
  color: var(--ink);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  text-align: left;
  transition: background 0.2s, color 0.2s;
  width: 100%;
}

.nav-item:hover {
  background: var(--peach);
  color: var(--ink);
}

.nav-item.active {
  background: var(--peach);
  color: var(--orange);
  font-weight: 600;
}

.nav-icon { font-size: 16px; }

.sidebar-footer {
  padding: 16px 16px 0;
  border-top: 1px solid var(--line);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trial-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--peach);
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--orange-deep);
}

.trial-dot {
  width: 8px;
  height: 8px;
  background: var(--orange);
  border-radius: 50%;
  flex-shrink: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 8px 4px;
  transition: color 0.2s;
}

.logout-btn:hover { color: var(--red); }

/* Topbar */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  background: white;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 2px;
}

.topbar-sub {
  font-size: 13px;
  color: var(--muted);
  margin: 0;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--peach);
  border-radius: 24px;
  padding: 8px 16px 8px 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--orange);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

/* Contenuto sezioni */
.section-content {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--line);
  position: relative;
}

.stat-icon {
  font-size: 22px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tone-orange .stat-icon { background: rgba(240, 111, 45, 0.12); }
.tone-blue   .stat-icon { background: rgba(75, 139, 255, 0.12); }
.tone-green  .stat-icon { background: rgba(38, 168, 106, 0.12); }
.tone-amber  .stat-icon { background: rgba(212, 154, 44, 0.12); }

.stat-body { flex: 1; }

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
}

.stat-delta {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--green);
  background: rgba(38, 168, 106, 0.1);
  padding: 3px 8px;
  border-radius: 20px;
}

/* Card */
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--line);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}

.view-all {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--orange);
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.view-all:hover { text-decoration: underline; }

/* Griglia contenuto */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Ordini lista */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.order-row:last-child { border-bottom: none; }

.order-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-info strong { font-size: 14px; color: var(--ink); }
.order-info span { font-size: 12px; color: var(--muted); }

.order-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.order-meta strong { font-size: 14px; color: var(--ink); }

/* Badge stati ordine */
.order-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  text-transform: capitalize;
}

.badge-nuovo       { background: rgba(240, 111, 45, 0.12); color: var(--orange); }
.badge-in-corso    { background: rgba(75, 139, 255, 0.12);  color: var(--blue); }
.badge-pronto      { background: rgba(38, 168, 106, 0.12);  color: var(--green); }
.badge-consegnato  { background: rgba(100, 100, 100, 0.1);  color: var(--muted); }

.badge-count {
  font-size: 13px;
  font-weight: 600;
  background: var(--peach);
  color: var(--orange);
  padding: 4px 12px;
  border-radius: 20px;
}

/* Grafico a barre */
.chart-bars-demo {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
  padding: 0 4px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  background: var(--orange);
  border-radius: 4px 4px 0 0;
  opacity: 0.75;
  min-height: 4px;
  transition: height 0.5s ease;
}

.bar-label { font-size: 10px; color: var(--muted); }

.chart-legend {
  margin-top: 12px;
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--orange);
  border-radius: 50%;
}

/* Categorie */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.category-chip {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: border-color 0.2s;
}

.category-chip:hover { border-color: var(--orange); }

.category-chip.inactive { opacity: 0.5; }

.cat-name { font-size: 14px; font-weight: 600; color: var(--ink); }
.cat-count { font-size: 12px; color: var(--muted); }
.cat-status { font-size: 11px; color: var(--green); font-weight: 500; }
.category-chip.inactive .cat-status { color: var(--muted); }

/* Tabella ordini */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.orders-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  padding: 0 12px 12px 0;
  border-bottom: 1px solid var(--line);
}

.orders-table td {
  padding: 14px 12px 14px 0;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.orders-table tr:last-child td { border-bottom: none; }

.order-id { font-size: 12px; color: var(--muted); }
.order-items-cell { color: var(--muted); max-width: 220px; }
.order-time { font-size: 12px; color: var(--muted); }

/* Menu gestione */
.menu-categories-full {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-cat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.menu-cat-row:last-child { border-bottom: none; }

.menu-cat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-cat-info strong { font-size: 15px; color: var(--ink); }
.menu-cat-info span { font-size: 13px; color: var(--muted); }

.menu-cat-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-toggle {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  cursor: pointer;
  background: rgba(100, 100, 100, 0.1);
  color: var(--muted);
  transition: all 0.2s;
}

.cat-toggle.on {
  background: rgba(38, 168, 106, 0.12);
  color: var(--green);
}

.btn-ghost {
  background: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
  transition: border-color 0.2s;
}

.btn-ghost:hover { border-color: var(--orange); color: var(--orange); }

.btn-primary {
  background: var(--orange);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background 0.2s;
}

.btn-primary:hover { background: var(--orange-deep); }

/* Impostazioni */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-field label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.setting-input {
  padding: 11px 14px;
  border: 2px solid var(--line);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink);
  background: #fafaf9;
}

.settings-footer {
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.btn-danger {
  background: rgba(229, 93, 88, 0.1);
  color: var(--red);
  border: 1px solid rgba(229, 93, 88, 0.3);
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background 0.2s;
}

.btn-danger:hover { background: rgba(229, 93, 88, 0.2); }

/* Responsive */
@media (max-width: 900px) {
  .sidebar { display: none; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .content-grid { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .settings-grid { grid-template-columns: 1fr; }
  .section-content { padding: 20px 16px; }
  .topbar { padding: 16px; }
}
</style>
