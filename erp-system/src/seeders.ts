// import type { Core } from '@strapi/strapi';

// export async function seedDepartments(strapi: Core.Strapi) {
//   const departments = [
//     { name: 'Sales', publishedAt: new Date() },
//     { name: 'Marketing', publishedAt: new Date() },
//     { name: 'Engineering', publishedAt: new Date() },
//     { name: 'Human Resources', publishedAt: new Date() },
//     { name: 'Finance', publishedAt: new Date() },
//     { name: 'Operations', publishedAt: new Date() },
//     { name: 'Customer Support', publishedAt: new Date() },
//     { name: 'Research & Development', publishedAt: new Date() }
//   ];

//   const createdDepartments = [];
//   for (const dept of departments) {
//     try {
//       // Check if department already exists
//       const existing = await strapi.entityService.findMany('api::department.department', {
//         filters: { name: dept.name },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdDepartments.push(existing[0]);
//         console.log(`Department '${dept.name}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::department.department', {
//           data: dept
//         });
//         createdDepartments.push(created);
//         console.log(`Created department: ${dept.name}`);
//       }
//     } catch (error) {
//       console.log(`Error creating department '${dept.name}':`, error.message);
//       // Try to find existing department in case of race condition
//       const existing = await strapi.entityService.findMany('api::department.department', {
//         filters: { name: dept.name },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdDepartments.push(existing[0]);
//       }
//     }
//   }
//   return createdDepartments;
// }

// export async function seedEmployees(strapi: Core.Strapi, departments: any[]) {
//   const employees = [
//     { name: 'John Smith', email: 'john.smith@company.com', position: 'Sales Manager', Salary: 75000, department: departments[0].id },
//     { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', position: 'Marketing Specialist', Salary: 65000, department: departments[1].id },
//     { name: 'Mike Chen', email: 'mike.chen@company.com', position: 'Software Engineer', Salary: 90000, department: departments[2].id },
//     { name: 'Emily Davis', email: 'emily.davis@company.com', position: 'HR Coordinator', Salary: 55000, department: departments[3].id },
//     { name: 'Robert Wilson', email: 'robert.wilson@company.com', position: 'Financial Analyst', Salary: 70000, department: departments[4].id },
//     { name: 'Lisa Anderson', email: 'lisa.anderson@company.com', position: 'Operations Manager', Salary: 80000, department: departments[5].id },
//     { name: 'David Brown', email: 'david.brown@company.com', position: 'Customer Support Lead', Salary: 60000, department: departments[6].id },
//     { name: 'Jennifer Garcia', email: 'jennifer.garcia@company.com', position: 'R&D Scientist', Salary: 95000, department: departments[7].id },
//     { name: 'Alex Thompson', email: 'alex.thompson@company.com', position: 'Senior Developer', Salary: 100000, department: departments[2].id },
//     { name: 'Maria Rodriguez', email: 'maria.rodriguez@company.com', position: 'Sales Representative', Salary: 50000, department: departments[0].id }
//   ];

//   const createdEmployees = [];
//   for (const emp of employees) {
//     try {
//       // Check if employee already exists
//       const existing = await strapi.entityService.findMany('api::employee.employee', {
//         filters: { email: emp.email },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdEmployees.push(existing[0]);
//         console.log(`Employee '${emp.name}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::employee.employee', {
//           data: { ...emp, publishedAt: new Date() }
//         });
//         createdEmployees.push(created);
//         console.log(`Created employee: ${emp.name}`);
//       }
//     } catch (error) {
//       console.log(`Error creating employee '${emp.name}':`, error.message);
//       // Try to find existing employee in case of race condition
//       const existing = await strapi.entityService.findMany('api::employee.employee', {
//         filters: { email: emp.email },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdEmployees.push(existing[0]);
//       }
//     }
//   }
//   return createdEmployees;
// }

// export async function seedCustomers(strapi: Core.Strapi) {
//   const customers = [
//     { name: 'Acme Corporation', email: 'orders@acme.com', phone_number: '+12125551001', address: '123 Business Ave, New York, NY 10001' },
//     { name: 'TechStart Inc.', email: 'procurement@techstart.com', phone_number: '+14155551002', address: '456 Innovation Dr, San Francisco, CA 94105' },
//     { name: 'Global Solutions Ltd.', email: 'purchasing@globalsol.com', phone_number: '+13125551003', address: '789 Corporate Blvd, Chicago, IL 60601' },
//     { name: 'Metro Retailers', email: 'orders@metroret.com', phone_number: '+12135551004', address: '321 Commerce St, Los Angeles, CA 90210' },
//     { name: 'Enterprise Systems', email: 'buying@entsys.com', phone_number: '+15125551005', address: '654 Technology Way, Austin, TX 78701' },
//     { name: 'Future Industries', email: 'orders@futureind.com', phone_number: '+12065551006', address: '987 Progress Rd, Seattle, WA 98101' },
//     { name: 'Prime Manufacturing', email: 'supply@primemfg.com', phone_number: '+13135551007', address: '147 Industrial Park, Detroit, MI 48201' },
//     { name: 'Digital Dynamics', email: 'procurement@digdyn.com', phone_number: '+16175551008', address: '258 Tech Center, Boston, MA 02101' }
//   ];

//   const createdCustomers = [];
//   for (const customer of customers) {
//     try {
//       // Check if customer already exists
//       const existing = await strapi.entityService.findMany('api::customer.customer', {
//         filters: { email: customer.email },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdCustomers.push(existing[0]);
//         console.log(`Customer '${customer.name}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::customer.customer', {
//           data: { ...customer, publishedAt: new Date() }
//         });
//         createdCustomers.push(created);
//         console.log(`Created customer: ${customer.name}`);
//       }
//     } catch (error) {
//       console.log(`Error creating customer '${customer.name}':`, error.message);
//       // Try to find existing customer in case of race condition
//       const existing = await strapi.entityService.findMany('api::customer.customer', {
//         filters: { email: customer.email },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdCustomers.push(existing[0]);
//       }
//     }
//   }
//   return createdCustomers;
// }

// export async function seedSuppliers(strapi: Core.Strapi) {
//   const suppliers = [
//     { name: 'Component Supply Co.', conatct_info: 'Email: sales@compsupply.com\nPhone: +1-555-0101\nAddress: 100 Supply Chain Ave, Houston, TX 77001' },
//     { name: 'Materials Direct', conatct_info: 'Email: orders@matdirect.com\nPhone: +1-555-0102\nAddress: 200 Wholesale Blvd, Phoenix, AZ 85001' },
//     { name: 'Tech Parts Inc.', conatct_info: 'Email: sales@techparts.com\nPhone: +1-555-0103\nAddress: 300 Electronics Way, San Jose, CA 95101' },
//     { name: 'Industrial Supplies Ltd.', conatct_info: 'Email: info@indsupplies.com\nPhone: +1-555-0104\nAddress: 400 Manufacturing Dr, Cleveland, OH 44101' },
//     { name: 'Quality Components', conatct_info: 'Email: sales@qualcomp.com\nPhone: +1-555-0105\nAddress: 500 Quality St, Milwaukee, WI 53201' },
//     { name: 'Global Suppliers Network', conatct_info: 'Email: orders@globalsup.com\nPhone: +1-555-0106\nAddress: 600 International Ave, Miami, FL 33101' }
//   ];

//   const createdSuppliers = [];
//   for (const supplier of suppliers) {
//     const created = await strapi.entityService.create('api::supplier.supplier', {
//       data: { ...supplier, publishedAt: new Date() }
//     });
//     createdSuppliers.push(created);
//   }
//   return createdSuppliers;
// }

// export async function seedWarehouses(strapi: Core.Strapi) {
//   const warehouses = [
//     { name: 'Main Warehouse', location: '1000 Distribution Center Dr, Memphis, TN 38101' },
//     { name: 'West Coast Depot', location: '2000 Logistics Blvd, Los Angeles, CA 90021' },
//     { name: 'East Coast Hub', location: '3000 Shipping Ave, Newark, NJ 07101' },
//     { name: 'Central Storage', location: '4000 Storage Way, Kansas City, MO 64101' },
//     { name: 'Northern Facility', location: '5000 Cold Storage Rd, Minneapolis, MN 55401' }
//   ];

//   const createdWarehouses = [];
//   for (const warehouse of warehouses) {
//     const created = await strapi.entityService.create('api::warhouse.warhouse', {
//       data: { ...warehouse, publishedAt: new Date() }
//     });
//     createdWarehouses.push(created);
//   }
//   return createdWarehouses;
// }

// export async function seedProducts(strapi: Core.Strapi) {
//   const products = [
//     { sku: 'LAPTOP-001', name: 'Business Laptop Pro', description: 'High-performance laptop for business use', unit_price: 1299.99, stock_quantity: 50 },
//     { sku: 'MOUSE-001', name: 'Wireless Optical Mouse', description: 'Ergonomic wireless mouse with precision tracking', unit_price: 29.99, stock_quantity: 200 },
//     { sku: 'KEYBOARD-001', name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', unit_price: 149.99, stock_quantity: 75 },
//     { sku: 'MONITOR-001', name: '27" 4K Monitor', description: 'Ultra-high definition 27-inch monitor', unit_price: 399.99, stock_quantity: 30 },
//     { sku: 'PHONE-001', name: 'Business Smartphone', description: 'Enterprise-grade smartphone with security features', unit_price: 899.99, stock_quantity: 100 },
//     { sku: 'TABLET-001', name: 'Professional Tablet', description: '11-inch tablet for mobile productivity', unit_price: 649.99, stock_quantity: 40 },
//     { sku: 'HEADSET-001', name: 'Noise-Canceling Headset', description: 'Professional headset for video calls', unit_price: 199.99, stock_quantity: 85 },
//     { sku: 'DOCK-001', name: 'USB-C Docking Station', description: 'Multi-port docking station for laptops', unit_price: 249.99, stock_quantity: 60 },
//     { sku: 'CABLE-001', name: 'USB-C Cable 6ft', description: 'High-speed USB-C charging and data cable', unit_price: 19.99, stock_quantity: 300 },
//     { sku: 'ADAPTER-001', name: 'Power Adapter 65W', description: 'Universal 65W power adapter', unit_price: 49.99, stock_quantity: 150 },
//     { sku: 'SSD-001', name: '1TB NVMe SSD', description: 'High-speed 1TB solid state drive', unit_price: 199.99, stock_quantity: 120 },
//     { sku: 'RAM-001', name: '16GB DDR4 RAM', description: '16GB DDR4 memory module', unit_price: 89.99, stock_quantity: 80 },
//     { sku: 'PRINTER-001', name: 'Color Laser Printer', description: 'High-speed color laser printer', unit_price: 599.99, stock_quantity: 25 },
//     { sku: 'SCANNER-001', name: 'Document Scanner', description: 'High-resolution document scanner', unit_price: 299.99, stock_quantity: 35 },
//     { sku: 'ROUTER-001', name: 'Enterprise WiFi Router', description: 'High-performance enterprise router', unit_price: 449.99, stock_quantity: 20 }
//   ];

//   const createdProducts = [];
//   for (const product of products) {
//     try {
//       // Check if product already exists
//       const existing = await strapi.entityService.findMany('api::product.product', {
//         filters: { sku: product.sku },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdProducts.push(existing[0]);
//         console.log(`Product '${product.name}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::product.product', {
//           data: { ...product, publishedAt: new Date() }
//         });
//         createdProducts.push(created);
//         console.log(`Created product: ${product.name}`);
//       }
//     } catch (error) {
//       console.log(`Error creating product '${product.name}':`, error.message);
//       // Try to find existing product in case of race condition
//       const existing = await strapi.entityService.findMany('api::product.product', {
//         filters: { sku: product.sku },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdProducts.push(existing[0]);
//       }
//     }
//   }
//   return createdProducts;
// }

// export async function seedAccounts(strapi: Core.Strapi) {
//   const accounts = [
//     { name: 'Cash', type: 'asset' as const },
//     { name: 'Accounts Receivable', type: 'asset' as const },
//     { name: 'Inventory', type: 'asset' as const },
//     { name: 'Equipment', type: 'asset' as const },
//     { name: 'Accounts Payable', type: 'liability' as const },
//     { name: 'Bank Loan', type: 'liability' as const },
//     { name: 'Sales Revenue', type: 'revenue' as const },
//     { name: 'Service Revenue', type: 'revenue' as const },
//     { name: 'Office Supplies Expense', type: 'expense' as const },
//     { name: 'Salary Expense', type: 'expense' as const },
//     { name: 'Rent Expense', type: 'expense' as const },
//     { name: 'Utilities Expense', type: 'expense' as const }
//   ];

//   const createdAccounts = [];
//   for (const account of accounts) {
//     try {
//       // Check if account already exists
//       const existing = await strapi.entityService.findMany('api::account.account', {
//         filters: { name: account.name },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdAccounts.push(existing[0]);
//         console.log(`Account '${account.name}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::account.account', {
//           data: { ...account, publishedAt: new Date() }
//         });
//         createdAccounts.push(created);
//         console.log(`Created account: ${account.name}`);
//       }
//     } catch (error) {
//       console.log(`Error creating account '${account.name}':`, error.message);
//       // Try to find existing account in case of race condition
//       const existing = await strapi.entityService.findMany('api::account.account', {
//         filters: { name: account.name },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdAccounts.push(existing[0]);
//       }
//     }
//   }
//   return createdAccounts;
// }

// export async function seedPurchaseOrders(strapi: Core.Strapi, suppliers: any[]) {
//   const now = new Date();
//   const purchaseOrders = [];

//   for (let i = 0; i < 10; i++) {
//     const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
//     const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
//     const statuses = ['draft', 'confirmed', 'received', 'closed'] as const;
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
    
//     const po = {
//       po_number: `PO-${String(i + 1).padStart(4, '0')}`,
//       order_date: orderDate,
//       po_status: status,
//       total_amount: Math.floor(Math.random() * 50000) + 5000, // Random amount between 5000-55000
//       supplier: supplier.id,
//       publishedAt: new Date()
//     };
    
//     purchaseOrders.push(po);
//   }

//   const createdPurchaseOrders = [];
//   for (const po of purchaseOrders) {
//     try {
//       // Check if purchase order already exists
//       const existing = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
//         filters: { po_number: po.po_number },
//         pagination: { limit: 1 }
//       });

//       if (existing && existing.length > 0) {
//         createdPurchaseOrders.push(existing[0]);
//         console.log(`Purchase Order '${po.po_number}' already exists, using existing one.`);
//       } else {
//         const created = await strapi.entityService.create('api::purchase-order.purchase-order', {
//           data: po
//         });
//         createdPurchaseOrders.push(created);
//         console.log(`Created purchase order: ${po.po_number}`);
//       }
//     } catch (error) {
//       console.log(`Error creating purchase order '${po.po_number}':`, error.message);
//       // Try to find existing purchase order in case of race condition
//       const existing = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
//         filters: { po_number: po.po_number },
//         pagination: { limit: 1 }
//       });
//       if (existing && existing.length > 0) {
//         createdPurchaseOrders.push(existing[0]);
//       }
//     }
//   }
//   return createdPurchaseOrders;
// }

// export async function seedPurchaseOrderItems(strapi: Core.Strapi, purchaseOrders: any[], products: any[]) {
//   for (const po of purchaseOrders) {
//     const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items per PO
    
//     for (let i = 0; i < itemCount; i++) {
//       const product = products[Math.floor(Math.random() * products.length)];
//       const quantity = Math.floor(Math.random() * 20) + 1;
//       const unitCost = product.unit_price * (0.8 + Math.random() * 0.4); // Cost is 80-120% of selling price
//       // Note: subtotal will be calculated automatically by the lifecycle hooks
      
//       await strapi.entityService.create('api::purchase-order-item.purchase-order-item', {
//         data: {
//           quantity,
//           unit_cost: unitCost,
//           product: product.id,
//           purchase_order: po.id,
//           publishedAt: new Date()
//         }
//       });
//     }
//   }
// }

// export async function seedSalesOrders(strapi: Core.Strapi, customers: any[]) {
//   const now = new Date();
//   const salesOrders = [];

//   // Check if sales orders already exist
//   const existingSOs = await strapi.entityService.findMany('api::sales-order.sales-order', {
//     start: 0,
//     limit: 1
//   });

//   if (existingSOs && existingSOs.length > 0) {
//     console.log('Sales orders already exist, fetching existing ones...');
//     const allSOs = await strapi.entityService.findMany('api::sales-order.sales-order', {
//       start: 0,
//       limit: 100
//     });
//     return allSOs;
//   }

//   for (let i = 0; i < 15; i++) {
//     const orderDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Random date within last 60 days
//     const customer = customers[Math.floor(Math.random() * customers.length)];
//     const statuses = ['draft', 'confirmed', 'shipped', 'completed'] as const;
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
    
//     const so = {
//       order_number: `SO-${String(i + 1).padStart(4, '0')}`,
//       order_date: orderDate,
//       order_status: status,
//       total_number: Math.floor(Math.random() * 25000) + 1000, // Random amount between 1000-26000
//       customer: customer.id,
//       publishedAt: new Date()
//     };
    
//     salesOrders.push(so);
//   }

//   const createdSalesOrders = [];
//   for (const so of salesOrders) {
//     try {
//       const created = await strapi.entityService.create('api::sales-order.sales-order', {
//         data: so
//       });
//       createdSalesOrders.push(created);
//       console.log(`Created sales order: ${so.order_number}`);
//     } catch (error) {
//       console.log(`Error creating sales order '${so.order_number}':`, error.message);
//     }
//   }
//   return createdSalesOrders;
// }

// export async function seedSalesOrderItems(strapi: Core.Strapi, salesOrders: any[], products: any[]) {
//   // Check if sales order items already exist
//   const existingItems = await strapi.entityService.findMany('api::sales-order-item.sales-order-item', {
//     start: 0,
//     limit: 1
//   });

//   if (existingItems && existingItems.length > 0) {
//     console.log('Sales order items already exist, skipping creation...');
//     return;
//   }

//   console.log(`Creating items for ${salesOrders.length} sales orders...`);
  
//   for (const so of salesOrders) {
//     const itemCount = Math.floor(Math.random() * 8) + 1; // 1-8 items per SO
    
//     for (let i = 0; i < itemCount; i++) {
//       const product = products[Math.floor(Math.random() * products.length)];
//       const quantity = Math.floor(Math.random() * 15) + 1;
//       const unitPrice = product.unit_price;
//       // Note: subtotal will be calculated automatically by the lifecycle hooks
      
//       try {
//         await strapi.entityService.create('api::sales-order-item.sales-order-item', {
//           data: {
//             quantity,
//             unit_price: unitPrice,
//             product: product.id,
//             sales_order: so.id,
//             publishedAt: new Date()
//           }
//         });
//         console.log(`Created sales order item for SO ${so.order_number} - ${product.name}`);
//       } catch (error) {
//         console.log(`Error creating sales order item for SO ${so.order_number}:`, error.message);
//       }
//     }
//   }
// }

// export async function seedStockMovements(strapi: Core.Strapi, products: any[], warehouses: any[]) {
//   const movementTypes = ['inbound', 'outbound', 'adjustment'] as const;
  
//   for (let i = 0; i < 50; i++) {
//     const product = products[Math.floor(Math.random() * products.length)];
//     const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
//     const movementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];
//     const quantity = Math.floor(Math.random() * 100) + 1;
//     const movementDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Random date within last 90 days
    
//     await strapi.entityService.create('api::stock-movement.stock-movement', {
//       data: {
//         movement_type: movementType,
//         quantity,
//         movement_date: movementDate,
//         product: product.id,
//         warhouse: warehouse.id,
//         publishedAt: new Date()
//       }
//     });
//   }
// }

// export async function seedInvoices(strapi: Core.Strapi, customers: any[], salesOrders: any[]) {
//   // Check if invoices already exist
//   const existingInvoices = await strapi.entityService.findMany('api::invoice.invoice', {
//     start: 0,
//     limit: 1
//   });

//   if (existingInvoices && existingInvoices.length > 0) {
//     console.log('Invoices already exist, fetching existing ones...');
//     const allInvoices = await strapi.entityService.findMany('api::invoice.invoice', {
//       start: 0,
//       limit: 100
//     });
//     return allInvoices;
//   }

//   const statuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const;
//   const createdInvoices = [];
  
//   for (let i = 0; i < 25; i++) {
//     const customer = customers[Math.floor(Math.random() * customers.length)];
//     const salesOrder = salesOrders[Math.floor(Math.random() * salesOrders.length)];
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
//     const amount = Math.floor(Math.random() * 15000) + 500; // Random amount between 500-15500
//     const issuedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
//     const dueDate = new Date(issuedDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Random future date within 60 days from issued date
//     const paidAmount = status === 'paid' ? amount : (status === 'overdue' ? Math.floor(amount * Math.random()) : 0);
    
//     try {
//       const created = await strapi.entityService.create('api::invoice.invoice', {
//         data: {
//           invoice_number: `INV-${String(i + 1).padStart(4, '0')}`,
//           amount,
//           issued_date: issuedDate,
//           due_date: dueDate,
//           paid_amount: paidAmount,
//           invoice_status: status,
//           customer: customer.id,
//           sales_order: salesOrder.id,
//           notes: `Invoice for ${customer.name} - ${salesOrder.order_number}`,
//           publishedAt: new Date()
//         }
//       });
//       createdInvoices.push(created);
//       console.log(`Created invoice: INV-${String(i + 1).padStart(4, '0')} for ${customer.name}`);
//     } catch (error) {
//       console.log(`Error creating invoice INV-${String(i + 1).padStart(4, '0')}:`, error.message);
//     }
//   }
//   return createdInvoices;
// }

// export async function seedTransactions(strapi: Core.Strapi, accounts: any[], employees: any[], invoices?: any[]) {
//   // Check if transactions already exist
//   const existingTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
//     start: 0,
//     limit: 1
//   });

//   if (existingTransactions && existingTransactions.length > 0) {
//     console.log('Transactions already exist, skipping creation...');
//     return;
//   }

//   const descriptions = [
//     'Monthly salary payment',
//     'Office supplies purchase',
//     'Equipment maintenance',
//     'Sales commission',
//     'Rent payment',
//     'Utility bill payment',
//     'Travel expense reimbursement',
//     'Marketing campaign expense',
//     'Training program fee',
//     'Software license renewal',
//     'Customer payment received',
//     'Supplier payment made',
//     'Bank service charge',
//     'Interest income',
//     'Insurance premium payment'
//   ];
  
//   const createdTransactions = [];
  
//   // Create regular transactions
//   for (let i = 0; i < 80; i++) {
//     const account = accounts[Math.floor(Math.random() * accounts.length)];
//     const employee = employees[Math.floor(Math.random() * employees.length)];
//     const description = descriptions[Math.floor(Math.random() * descriptions.length)];
//     const amount = Math.floor(Math.random() * 10000) + 100; // Random amount between 100-10100
//     const date = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Random date within last 180 days
    
//     try {
//       const created = await strapi.entityService.create('api::transaction.transaction', {
//         data: {
//           description,
//           amount,
//           date,
//           account: account.id,
//           employee: employee.id,
//           publishedAt: new Date()
//         }
//       });
//       createdTransactions.push(created);
//     } catch (error) {
//       console.log(`Error creating transaction:`, error.message);
//     }
//   }

//   // Create invoice-related transactions for paid invoices
//   if (invoices && invoices.length > 0) {
//     const paidInvoices = invoices.filter(inv => inv.invoice_status === 'paid');
    
//     for (const invoice of paidInvoices) {
//       const account = accounts.find(acc => acc.name === 'Cash') || accounts[0];
//       const employee = employees[Math.floor(Math.random() * employees.length)];
      
//       try {
//         const created = await strapi.entityService.create('api::transaction.transaction', {
//           data: {
//             description: `Payment received for invoice ${invoice.invoice_number}`,
//             amount: invoice.paid_amount || invoice.amount,
//             date: new Date(invoice.issued_date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Payment within 7 days of invoice
//             account: account.id,
//             employee: employee.id,
//             invoice: invoice.id,
//             publishedAt: new Date()
//           }
//         });
//         createdTransactions.push(created);
//         console.log(`Created transaction for invoice ${invoice.invoice_number}`);
//       } catch (error) {
//         console.log(`Error creating transaction for invoice ${invoice.invoice_number}:`, error.message);
//       }
//     }
//   }
  
//   return createdTransactions;
// }
