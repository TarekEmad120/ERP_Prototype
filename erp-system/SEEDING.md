# ERP System Dummy Data Seeding

This document explains how to populate your ERP system with dummy data for testing and development purposes.

## Overview

The ERP system includes comprehensive dummy data seeding functionality that creates realistic test data across all modules:

- **Departments** (8 departments)
- **Employees** (10 employees with realistic salaries and positions)
- **Customers** (8 business customers with contact information)
- **Suppliers** (6 suppliers with detailed contact information)
- **Warehouses** (5 warehouse locations)
- **Products** (15 technology products with SKUs, prices, and stock levels)
- **Accounts** (12 accounting accounts for assets, liabilities, revenue, and expenses)
- **Purchase Orders** (10 orders with various statuses)
- **Sales Orders** (15 orders with different completion stages)
- **Stock Movements** (50 inventory movements across warehouses)
- **Invoices** (20 invoices with different payment statuses)
- **Transactions** (100 financial transactions)

## Automatic Seeding

The system automatically checks if data exists and seeds the database when you first start the application:

```bash
npm run develop
```

When the application starts, you'll see messages like:
```
🌱 Starting database seeding...
Creating departments...
Creating employees...
...
✅ Database seeding completed!
```

## Manual Seeding

If you want to manually add more dummy data or re-seed after clearing the database:

```bash
npm run seed
```

This will:
1. Check if data already exists
2. Give you a 5-second warning if data is found
3. Proceed to add the dummy data
4. Show a summary of created records

## Data Relationships

The seeded data maintains proper relationships:

- **Employees** are assigned to departments
- **Purchase Orders** are linked to suppliers and contain multiple items
- **Sales Orders** are linked to customers and contain multiple items
- **Stock Movements** track product movements between warehouses
- **Transactions** are linked to accounts and employees

## Sample Data Details

### Products
- Business laptops, monitors, keyboards, mice
- Smartphones, tablets, accessories
- Networking equipment and cables
- Printers and scanners

### Customers
- Technology companies and retailers
- Realistic business names and contact information
- Distributed across major US cities

### Financial Data
- Proper accounting structure (assets, liabilities, revenue, expenses)
- Realistic salary ranges ($50,000 - $100,000)
- Transaction amounts ranging from $100 to $55,000

## Development Usage

This dummy data is perfect for:

- **Testing** all CRUD operations
- **Developing** reports and analytics
- **Demonstrating** the system to stakeholders
- **Training** users on the interface
- **Load testing** with realistic data volumes

## Data Reset

To completely reset and re-seed the database:

1. Stop the Strapi application
2. Delete the database file (if using SQLite) or clear the database
3. Restart the application with `npm run develop`

The system will automatically detect the empty database and re-seed it.

## Customization

To modify the dummy data:

1. Edit the seed functions in `src/seeders.ts`
2. Adjust quantities, add new categories, or change realistic values
3. Restart the application to use the new seed data

## API Access

Once seeded, you can access all data through the Strapi API:

- `GET /api/customers` - List all customers
- `GET /api/products` - List all products  
- `GET /api/sales-orders` - List all sales orders
- `GET /api/employees` - List all employees
- And many more endpoints for each entity

The data is immediately available for API testing, frontend development, and system integration.
