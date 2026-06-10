import { db, getAllRegistrations, getRegistrationStats } from './database.js'

console.log('\n📊 === STATISTICHE REGISTRAZIONI ===\n')

try {
  const stats = await getRegistrationStats()
  console.log('Statistiche:')
  console.log(`  • Totale registrazioni: ${stats.total}`)
  console.log(`  • Città diverse: ${stats.cities}`)
  console.log(`  • Giorni attivi: ${stats.days_active}\n`)

  const registrations = await getAllRegistrations()
  console.log('Registrazioni salvate:')
  registrations.forEach((reg, index) => {
    console.log(`\n  ${index + 1}. ${reg.name}`)
    console.log(`     Email: ${reg.email}`)
    console.log(`     Telefono: ${reg.phone}`)
    console.log(`     Ristorante: ${reg.restaurant_name}`)
    console.log(`     Città: ${reg.city}`)
    console.log(`     Data: ${reg.created_at}`)
  })

  console.log('\n✅ Database verificato con successo!\n')
} catch (error) {
  console.error('❌ Errore:', error.message)
}

process.exit(0)
