<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const restaurantName = ref('Il tuo ristorante')
const tableLabel = ref('')

const categories = [
  {
    name: 'Antipasti',
    items: [
      { name: 'Bruschette al pomodoro', description: 'Pane croccante, pomodoro fresco, basilico', price: '€ 6.00' },
      { name: 'Tagliere della casa', description: 'Salumi e formaggi selezionati', price: '€ 12.00' },
    ],
  },
  {
    name: 'Primi',
    items: [
      { name: 'Tagliatelle al ragù', description: 'Pasta fresca con ragù tradizionale', price: '€ 13.00' },
      { name: 'Risotto ai funghi', description: 'Mantecato al parmigiano', price: '€ 14.00' },
    ],
  },
  {
    name: 'Secondi',
    items: [
      { name: 'Cotoletta alla milanese', description: 'Con patate al forno', price: '€ 15.00' },
      { name: 'Salmone alla griglia', description: 'Con verdure di stagione', price: '€ 17.00' },
    ],
  },
  {
    name: 'Dessert',
    items: [
      { name: 'Tiramisù', description: 'Ricetta classica della casa', price: '€ 6.00' },
      { name: 'Panna cotta', description: 'Con coulis ai frutti rossi', price: '€ 5.50' },
    ],
  },
]

const readParamsFromUrl = () => {
  const hash = window.location.hash || ''
  const hashQueryIndex = hash.indexOf('?')
  const hashParams = new URLSearchParams(hashQueryIndex >= 0 ? hash.slice(hashQueryIndex + 1) : '')
  const searchParams = new URLSearchParams(window.location.search)

  restaurantName.value =
    hashParams.get('ristorante') ||
    hashParams.get('restaurant') ||
    searchParams.get('ristorante') ||
    searchParams.get('restaurant') ||
    'Il tuo ristorante'

  const table =
    hashParams.get('tavolo') ||
    hashParams.get('table') ||
    searchParams.get('tavolo') ||
    searchParams.get('table')

  tableLabel.value = table ? `Tavolo ${table}` : ''
}

onMounted(() => {
  readParamsFromUrl()
  window.addEventListener('hashchange', readParamsFromUrl)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', readParamsFromUrl)
})
</script>

<template>
  <div class="restaurant-menu-page">
    <header class="menu-header">
      <div class="shell header-inner">
        <div class="brand">
          <span class="brand-icon">M</span>
          <div class="brand-copy">
            <strong>{{ restaurantName }}</strong>
            <span v-if="tableLabel">{{ tableLabel }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="shell menu-content">
      <h1>Menu</h1>

      <section class="categories-grid">
        <article v-for="category in categories" :key="category.name" class="category-card">
          <h2>{{ category.name }}</h2>
          <div class="items-list">
            <div v-for="item in category.items" :key="item.name" class="item-row">
              <div>
                <strong>{{ item.name }}</strong>
                <p>{{ item.description }}</p>
              </div>
              <span class="price">{{ item.price }}</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.restaurant-menu-page {
  min-height: 100vh;
  background: #f7f3ee;
}

.menu-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid var(--line);
}

.header-inner {
  min-height: 76px;
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--orange);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 15px;
}

.brand-copy span {
  font-size: 12px;
  color: var(--muted);
}

.menu-content {
  padding: 28px 0 40px;
}

.menu-content h1 {
  margin: 0 0 16px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.category-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 18px;
}

.category-card h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.items-list {
  display: flex;
  flex-direction: column;
}

.item-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.item-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-row strong {
  font-size: 14px;
}

.item-row p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.price {
  font-weight: 700;
  color: var(--orange);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
