// import type { Core } from '@strapi/strapi';

// /**
//  * Repair and establish all relationships in the database
//  * This function ensures all relationships are properly linked
//  */
// export async function repairRelationships(strapi: Core.Strapi) {
//   console.log('🔧 Starting relationship repair...');

//   try {
//     // 1. Fix Employee-Department relationships
//     await repairEmployeeDepartmentRelationships(strapi);
    
//     // 2. Fix Customer-Sales Order relationships  
//     await repairCustomerSalesOrderRelationships(strapi);
    
//     // 3. Fix Supplier-Purchase Order relationships
//     await repairSupplierPurchaseOrderRelationships(strapi);
    
//     // 4. Fix Product relationships
//     await repairProductRelationships(strapi);
    
//     // 5. Fix Account-Transaction relationships
//     await repairAccountTransactionRelationships(strapi);
    
//     // 6. Fix Employee-Transaction relationships
//     await repairEmployeeTransactionRelationships(strapi);
    
//     // 7. Fix Warehouse-Stock Movement relationships
//     await repairWarehouseStockMovementRelationships(strapi);

//     // 8. Fix Invoice relationships  
//     await repairInvoiceRelationships(strapi);

//     console.log('✅ Relationship repair completed successfully!');
//   } catch (error) {
//     console.error('❌ Error during relationship repair:', error);
//   }
// }

// async function repairEmployeeDepartmentRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Employee-Department relationships...');
  
//   // Get all departments
//   const departments = await strapi.entityService.findMany('api::department.department', {
//     fields: ['id', 'name']
//   }) as any[];
  
//   // Get all employees
//   const employees = await strapi.entityService.findMany('api::employee.employee', {
//     fields: ['id', 'name', 'email'],
//     populate: { department: true }
//   }) as any[];

//   // Map department names to IDs
//   const deptMap: Record<string, any> = {
//     'Sales': departments.find(d => d.name === 'Sales')?.id,
//     'Marketing': departments.find(d => d.name === 'Marketing')?.id,
//     'Engineering': departments.find(d => d.name === 'Engineering')?.id,
//     'Human Resources': departments.find(d => d.name === 'Human Resources')?.id,
//     'Finance': departments.find(d => d.name === 'Finance')?.id,
//     'Operations': departments.find(d => d.name === 'Operations')?.id,
//     'Customer Support': departments.find(d => d.name === 'Customer Support')?.id,
//     'Research & Development': departments.find(d => d.name === 'Research & Development')?.id,
//   };

//   // Employee to department mapping
//   const employeeDeptMapping: Record<string, any> = {
//     'john.smith@company.com': deptMap['Sales'],
//     'sarah.johnson@company.com': deptMap['Marketing'],
//     'mike.chen@company.com': deptMap['Engineering'],
//     'emily.davis@company.com': deptMap['Human Resources'],
//     'robert.wilson@company.com': deptMap['Finance'],
//     'lisa.anderson@company.com': deptMap['Operations'],
//     'david.brown@company.com': deptMap['Customer Support'],
//     'jennifer.garcia@company.com': deptMap['Research & Development'],
//     'alex.thompson@company.com': deptMap['Engineering'],
//     'maria.rodriguez@company.com': deptMap['Sales'],
//   };

//   // Update each employee with the correct department
//   for (const employee of employees) {
//     const correctDeptId = employeeDeptMapping[employee.email];
//     if (correctDeptId && (!employee.department || employee.department.id !== correctDeptId)) {
//       await strapi.entityService.update('api::employee.employee', employee.id, {
//         data: {
//           department: correctDeptId
//         }
//       });
//       console.log(`    ✓ Updated ${employee.name} -> ${Object.keys(deptMap).find(key => deptMap[key] === correctDeptId)}`);
//     }
//   }
// }

// async function repairCustomerSalesOrderRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Customer-Sales Order relationships...');
  
//   const customers = await strapi.entityService.findMany('api::customer.customer', {
//     fields: ['id', 'name', 'email']
//   }) as any[];

//   const salesOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
//     fields: ['id', 'order_number'],
//     populate: { customer: true }
//   }) as any[];

//   // If sales orders exist but don't have customers assigned, assign them randomly
//   for (const order of salesOrders) {
//     if (!order.customer && customers.length > 0) {
//       const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
//       await strapi.entityService.update('api::sales-order.sales-order', order.id, {
//         data: {
//           customer: randomCustomer.id
//         }
//       });
//       console.log(`    ✓ Assigned ${order.order_number} -> ${randomCustomer.name}`);
//     }
//   }
// }

// async function repairSupplierPurchaseOrderRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Supplier-Purchase Order relationships...');
  
//   const suppliers = await strapi.entityService.findMany('api::supplier.supplier', {
//     fields: ['id', 'name']
//   }) as any[];

//   const purchaseOrders = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
//     fields: ['id', 'po_number'],
//     populate: { supplier: true }
//   }) as any[];

//   // If purchase orders exist but don't have suppliers assigned, assign them randomly
//   for (const order of purchaseOrders) {
//     if (!order.supplier && suppliers.length > 0) {
//       const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
//       await strapi.entityService.update('api::purchase-order.purchase-order', order.id, {
//         data: {
//           supplier: randomSupplier.id
//         }
//       });
//       console.log(`    ✓ Assigned ${order.po_number} -> ${randomSupplier.name}`);
//     }
//   }
// }

// async function repairProductRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Product relationships...');
  
//   const products = await strapi.entityService.findMany('api::product.product', {
//     fields: ['id', 'name', 'sku']
//   }) as any[];

//   // Fix Purchase Order Items
//   const purchaseOrderItems = await strapi.entityService.findMany('api::purchase-order-item.purchase-order-item', {
//     fields: ['id'],
//     populate: { product: true, purchase_order: true }
//   }) as any[];

//   for (const item of purchaseOrderItems) {
//     if (!item.product && products.length > 0) {
//       const randomProduct = products[Math.floor(Math.random() * products.length)];
//       await strapi.entityService.update('api::purchase-order-item.purchase-order-item', item.id, {
//         data: {
//           product: randomProduct.id
//         }
//       });
//       console.log(`    ✓ Assigned PO Item -> ${randomProduct.name}`);
//     }
//   }

//   // Fix Sales Order Items
//   const salesOrderItems = await strapi.entityService.findMany('api::sales-order-item.sales-order-item', {
//     fields: ['id'],
//     populate: { product: true, sales_order: true }
//   }) as any[];

//   for (const item of salesOrderItems) {
//     if (!item.product && products.length > 0) {
//       const randomProduct = products[Math.floor(Math.random() * products.length)];
//       await strapi.entityService.update('api::sales-order-item.sales-order-item', item.id, {
//         data: {
//           product: randomProduct.id
//         }
//       });
//       console.log(`    ✓ Assigned SO Item -> ${randomProduct.name}`);
//     }
//   }
// }

// async function repairAccountTransactionRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Account-Transaction relationships...');
  
//   const accounts = await strapi.entityService.findMany('api::account.account', {
//     fields: ['id', 'name']
//   }) as any[];

//   const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
//     fields: ['id', 'description'],
//     populate: { account: true }
//   }) as any[];

//   for (const transaction of transactions) {
//     if (!transaction.account && accounts.length > 0) {
//       const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
//       await strapi.entityService.update('api::transaction.transaction', transaction.id, {
//         data: {
//           account: randomAccount.id
//         }
//       });
//       console.log(`    ✓ Assigned Transaction -> ${randomAccount.name}`);
//     }
//   }
// }

// async function repairEmployeeTransactionRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Employee-Transaction relationships...');
  
//   const employees = await strapi.entityService.findMany('api::employee.employee', {
//     fields: ['id', 'name']
//   }) as any[];

//   const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
//     fields: ['id', 'description'],
//     populate: { employee: true }
//   }) as any[];

//   for (const transaction of transactions) {
//     if (!transaction.employee && employees.length > 0) {
//       const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
//       await strapi.entityService.update('api::transaction.transaction', transaction.id, {
//         data: {
//           employee: randomEmployee.id
//         }
//       });
//       console.log(`    ✓ Assigned Transaction -> ${randomEmployee.name}`);
//     }
//   }
// }

// async function repairWarehouseStockMovementRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Warehouse-Stock Movement relationships...');
  
//   const warehouses = await strapi.entityService.findMany('api::warhouse.warhouse', {
//     fields: ['id', 'name']
//   }) as any[];

//   const products = await strapi.entityService.findMany('api::product.product', {
//     fields: ['id', 'name']
//   }) as any[];

//   const stockMovements = await strapi.entityService.findMany('api::stock-movement.stock-movement', {
//     fields: ['id'],
//     populate: { warhouse: true, product: true }
//   }) as any[];

//   for (const movement of stockMovements) {
//     let needsUpdate = false;
//     const updateData: any = {};

//     if (!movement.warhouse && warehouses.length > 0) {
//       const randomWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
//       updateData.warhouse = randomWarehouse.id;
//       needsUpdate = true;
//       console.log(`    ✓ Assigned Stock Movement -> ${randomWarehouse.name}`);
//     }

//     if (!movement.product && products.length > 0) {
//       const randomProduct = products[Math.floor(Math.random() * products.length)];
//       updateData.product = randomProduct.id;
//       needsUpdate = true;
//       console.log(`    ✓ Assigned Stock Movement -> ${randomProduct.name}`);
//     }

//     if (needsUpdate) {
//       await strapi.entityService.update('api::stock-movement.stock-movement', movement.id, {
//         data: updateData
//       });
//     }
//   }
// }

// async function repairInvoiceRelationships(strapi: Core.Strapi) {
//   console.log('  - Repairing Invoice relationships...');
  
//   const customers = await strapi.entityService.findMany('api::customer.customer', {
//     fields: ['id', 'name']
//   }) as any[];

//   const salesOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
//     fields: ['id', 'order_number']
//   }) as any[];

//   const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
//     fields: ['id', 'invoice_number'],
//     populate: { customer: true, sales_order: true }
//   }) as any[];

//   for (const invoice of invoices) {
//     let needsUpdate = false;
//     const updateData: any = {};

//     // Assign customer if missing
//     if (!invoice.customer && customers.length > 0) {
//       const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
//       updateData.customer = randomCustomer.id;
//       needsUpdate = true;
//       console.log(`    ✓ Assigned Invoice ${invoice.invoice_number} -> Customer: ${randomCustomer.name}`);
//     }

//     // Assign sales order if missing
//     if (!invoice.sales_order && salesOrders.length > 0) {
//       const randomSalesOrder = salesOrders[Math.floor(Math.random() * salesOrders.length)];
//       updateData.sales_order = randomSalesOrder.id;
//       needsUpdate = true;
//       console.log(`    ✓ Assigned Invoice ${invoice.invoice_number} -> Sales Order: ${randomSalesOrder.order_number}`);
//     }

//     if (needsUpdate) {
//       await strapi.entityService.update('api::invoice.invoice', invoice.id, {
//         data: updateData
//       });
//     }
//   }
// }
