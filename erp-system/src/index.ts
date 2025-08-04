// import type { Core } from '@strapi/strapi';
// import {
//   seedDepartments,
//   seedEmployees,
//   seedCustomers,
//   seedSuppliers,
//   seedWarehouses,
//   seedProducts,
//   seedAccounts,
//   seedPurchaseOrders,
//   seedPurchaseOrderItems,
//   seedSalesOrders,
//   seedSalesOrderItems,
//   seedStockMovements,
//   seedInvoices,
//   seedTransactions
// } from './seeders';
// import { repairRelationships } from './relationshipRepair';

// export default {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register(/*{ strapi }: { strapi: Core.Strapi }*/) {
//     // registeration phase
//   },

//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   async bootstrap({ strapi }: { strapi: Core.Strapi }) {
//     // Check if data already exists to prevent duplicate seeding
//     const existingCustomers = await strapi.entityService.findMany('api::customer.customer', {
//       fields: ['id'],
//       pagination: { limit: 1 }
//     });

//     // Only seed if no data exists
//     if (!existingCustomers || (Array.isArray(existingCustomers) && existingCustomers.length === 0)) {
//       console.log('🌱 Starting database seeding...');
//       await seedDatabase(strapi);
//       console.log('✅ Database seeding completed!');
      
//       // Repair relationships after seeding
//       console.log('🔧 Repairing relationships...');
//       await repairRelationships(strapi);
//       console.log('✅ Relationship repair completed!');
//     } else {
//       console.log('📊 Database already contains data, skipping seeding.');
      
//       // Still run relationship repair in case it's needed
//       console.log('🔧 Checking and repairing relationships...');
//       await repairRelationships(strapi);
//       console.log('✅ Relationship check completed!');
//     }
//   },
// };

// async function seedDatabase(strapi: Core.Strapi) {
//   try {
//     // 1. Seed Departments
//     console.log('Creating departments...');
//     const departments = await seedDepartments(strapi);
    
//     // 2. Seed Employees
//     console.log('Creating employees...');
//     const employees = await seedEmployees(strapi, departments);
    
//     // 3. Seed Customers
//     console.log('Creating customers...');
//     const customers = await seedCustomers(strapi);
    
//     // 4. Seed Suppliers
//     console.log('Creating suppliers...');
//     const suppliers = await seedSuppliers(strapi);
    
//     // 5. Seed Warehouses
//     console.log('Creating warehouses...');
//     const warehouses = await seedWarehouses(strapi);
    
//     // 6. Seed Products
//     console.log('Creating products...');
//     const products = await seedProducts(strapi);
    
//     // 7. Seed Accounts
//     console.log('Creating accounts...');
//     const accounts = await seedAccounts(strapi);
    
//     // 8. Seed Purchase Orders
//     console.log('Creating purchase orders...');
//     const purchaseOrders = await seedPurchaseOrders(strapi, suppliers);
    
//     // 9. Seed Purchase Order Items
//     console.log('Creating purchase order items...');
//     await seedPurchaseOrderItems(strapi, purchaseOrders, products);
    
//     // 10. Seed Sales Orders
//     console.log('Creating sales orders...');
//     const salesOrders = await seedSalesOrders(strapi, customers);
    
//     // 11. Seed Sales Order Items
//     console.log('Creating sales order items...');
//     await seedSalesOrderItems(strapi, salesOrders, products);
    
//     // 12. Seed Stock Movements
//     console.log('Creating stock movements...');
//     await seedStockMovements(strapi, products, warehouses);
    
//     // 13. Seed Invoices
//     console.log('Creating invoices...');
//     const invoices = await seedInvoices(strapi, customers, salesOrders);
    
//     // 14. Seed Transactions
//     console.log('Creating transactions...');
//     await seedTransactions(strapi, accounts, employees, invoices);
    
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//   }
// }
