// Test script to verify automatic subtotal calculation
const Strapi = require('@strapi/strapi');

async function testSubtotalCalculation() {
  console.log('🧪 Testing automatic subtotal calculation...');
  
  const strapi = await Strapi({
    distDir: './dist'
  }).load();

  try {
    // Test SalesOrderItem automatic calculation
    console.log('\n📝 Testing SalesOrderItem subtotal calculation...');
    
    // Get a random product and sales order
    const products = await strapi.entityService.findMany('api::product.product', {
      start: 0,
      limit: 1
    });
    
    const salesOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
      start: 0,
      limit: 1
    });
    
    if (products.length > 0 && salesOrders.length > 0) {
      const testQuantity = 5;
      const testUnitPrice = 29.99;
      const expectedSubtotal = testQuantity * testUnitPrice;
      
      console.log(`Creating SalesOrderItem with quantity: ${testQuantity}, unit_price: ${testUnitPrice}`);
      console.log(`Expected subtotal: ${expectedSubtotal}`);
      
      const salesOrderItem = await strapi.entityService.create('api::sales-order-item.sales-order-item', {
        data: {
          quantity: testQuantity,
          unit_price: testUnitPrice,
          product: products[0].id,
          sales_order: salesOrders[0].id,
          publishedAt: new Date()
        }
      });
      
      console.log(`Actual subtotal: ${salesOrderItem.subtotal}`);
      
      if (salesOrderItem.subtotal === expectedSubtotal) {
        console.log('✅ SalesOrderItem subtotal calculation works correctly!');
      } else {
        console.log('❌ SalesOrderItem subtotal calculation failed!');
      }
      
      // Clean up
      await strapi.entityService.delete('api::sales-order-item.sales-order-item', salesOrderItem.id);
    } else {
      console.log('⚠️ No products or sales orders found for testing');
    }
    
    // Test PurchaseOrderItem automatic calculation
    console.log('\n📝 Testing PurchaseOrderItem subtotal calculation...');
    
    const purchaseOrders = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
      start: 0,
      limit: 1
    });
    
    if (products.length > 0 && purchaseOrders.length > 0) {
      const testQuantity = 3;
      const testUnitCost = 15.50;
      const expectedSubtotal = testQuantity * testUnitCost;
      
      console.log(`Creating PurchaseOrderItem with quantity: ${testQuantity}, unit_cost: ${testUnitCost}`);
      console.log(`Expected subtotal: ${expectedSubtotal}`);
      
      const purchaseOrderItem = await strapi.entityService.create('api::purchase-order-item.purchase-order-item', {
        data: {
          quantity: testQuantity,
          unit_cost: testUnitCost,
          product: products[0].id,
          purchase_order: purchaseOrders[0].id,
          publishedAt: new Date()
        }
      });
      
      console.log(`Actual subtotal: ${purchaseOrderItem.subtotal}`);
      
      if (purchaseOrderItem.subtotal === expectedSubtotal) {
        console.log('✅ PurchaseOrderItem subtotal calculation works correctly!');
      } else {
        console.log('❌ PurchaseOrderItem subtotal calculation failed!');
      }
      
      // Clean up
      await strapi.entityService.delete('api::purchase-order-item.purchase-order-item', purchaseOrderItem.id);
    } else {
      console.log('⚠️ No products or purchase orders found for testing');
    }
    
    console.log('\n✅ Subtotal calculation testing completed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

testSubtotalCalculation();
