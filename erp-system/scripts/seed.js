#!/usr/bin/env node

/**
 * Manual seed script for ERP system
 * Run this script to manually seed the database with dummy data
 * 
 * Usage: npm run seed
 * or: node scripts/seed.js
 */

const strapi = require('@strapi/strapi');

async function seedData() {
  try {
    console.log('🚀 Starting manual database seeding...');
    
    // Start Strapi application
    const app = await strapi().load();
    
    // Import seed functions
    const {
      seedDepartments,
      seedEmployees,
      seedCustomers,
      seedSuppliers,
      seedWarehouses,
      seedProducts,
      seedAccounts,
      seedPurchaseOrders,
      seedPurchaseOrderItems,
      seedSalesOrders,
      seedSalesOrderItems,
      seedStockMovements,
      seedInvoices,
      seedTransactions
    } = require('../src/seeders');

    // Check if data already exists
    const existingCustomers = await app.entityService.findMany('api::customer.customer', {
      fields: ['id'],
      pagination: { limit: 1 }
    });

    if (existingCustomers && existingCustomers.length > 0) {
      console.log('⚠️  Database already contains data. Do you want to continue? (This will add more data)');
      console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Seed in order (respecting dependencies)
    console.log('1/14 Creating departments...');
    const departments = await seedDepartments(app);
    
    console.log('2/14 Creating employees...');
    const employees = await seedEmployees(app, departments);
    
    console.log('3/14 Creating customers...');
    const customers = await seedCustomers(app);
    
    console.log('4/14 Creating suppliers...');
    const suppliers = await seedSuppliers(app);
    
    console.log('5/14 Creating warehouses...');
    const warehouses = await seedWarehouses(app);
    
    console.log('6/14 Creating products...');
    const products = await seedProducts(app);
    
    console.log('7/14 Creating accounts...');
    const accounts = await seedAccounts(app);
    
    console.log('8/14 Creating purchase orders...');
    const purchaseOrders = await seedPurchaseOrders(app, suppliers);
    
    console.log('9/14 Creating purchase order items...');
    await seedPurchaseOrderItems(app, purchaseOrders, products);
    
    console.log('10/14 Creating sales orders...');
    const salesOrders = await seedSalesOrders(app, customers);
    
    console.log('11/14 Creating sales order items...');
    await seedSalesOrderItems(app, salesOrders, products);
    
    console.log('12/14 Creating stock movements...');
    await seedStockMovements(app, products, warehouses);
    
    console.log('13/14 Creating invoices...');
    await seedInvoices(app);
    
    console.log('14/14 Creating transactions...');
    await seedTransactions(app, accounts, employees);

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Summary of created data:
   • ${departments.length} departments
   • ${employees.length} employees  
   • ${customers.length} customers
   • ${suppliers.length} suppliers
   • ${warehouses.length} warehouses
   • ${products.length} products
   • ${accounts.length} accounts
   • ${purchaseOrders.length} purchase orders
   • ${salesOrders.length} sales orders
   • 50 stock movements
   • 20 invoices
   • 100 transactions
   • Multiple order items

🚀 You can now start your Strapi application with: npm run develop
`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedData();
