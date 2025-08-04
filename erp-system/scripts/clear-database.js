const Strapi = require('@strapi/strapi');

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...');
  
  const strapi = await Strapi({
    distDir: './dist'
  }).load();

  const entities = [
    'api::transaction.transaction',
    'api::invoice.invoice', 
    'api::stock-movement.stock-movement',
    'api::sales-order-item.sales-order-item',
    'api::sales-order.sales-order',
    'api::purchase-order-item.purchase-order-item',
    'api::purchase-order.purchase-order',
    'api::account.account',
    'api::product.product',
    'api::warhouse.warhouse',
    'api::supplier.supplier',
    'api::customer.customer',
    'api::employee.employee',
    'api::department.department'
  ];

  try {
    for (const entity of entities) {
      try {
        // Get all entries
        const entries = await strapi.entityService.findMany(entity, {
          start: 0,
          limit: 1000
        });

        // Delete each entry
        if (entries && entries.length > 0) {
          for (const entry of entries) {
            await strapi.entityService.delete(entity, entry.id);
          }
          console.log(`✅ Cleared ${entries.length} entries from ${entity}`);
        } else {
          console.log(`⚪ No entries found in ${entity}`);
        }
      } catch (error) {
        console.log(`❌ Error clearing ${entity}:`, error.message);
      }
    }

    console.log('✅ Database cleanup completed!');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

clearDatabase();
