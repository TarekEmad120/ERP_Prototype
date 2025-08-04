import type { Core } from '@strapi/strapi';

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Ensure SKU uniqueness
    if (data.sku) {
      const existingProduct = await strapi.entityService.findMany('api::product.product', {
        filters: { sku: data.sku },
        pagination: { limit: 1 }
      });

      if (existingProduct && existingProduct.length > 0) {
        throw new Error(`Product with SKU ${data.sku} already exists`);
      }
    }
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Prevent stock change if linked to pending orders
    if (data.stock_quantity !== undefined) {
      // Check for pending sales orders
      const pendingSalesItems = await strapi.entityService.findMany('api::sales-order-item.sales-order-item', {
        filters: { 
          product: where.id
        },
        populate: { 
          sales_order: {
            fields: ['order_status']
          }
        }
      });

      const hasPendingOrders = pendingSalesItems.some((item: any) => 
        item.sales_order && ['draft', 'confirmed'].includes(item.sales_order.order_status)
      );

      if (hasPendingOrders && data.stock_quantity < 0) {
        throw new Error('Cannot reduce stock below zero when product has pending orders');
      }
    }

    // Ensure SKU uniqueness on update
    if (data.sku) {
      const existingProduct = await strapi.entityService.findMany('api::product.product', {
        filters: { 
          sku: data.sku,
          id: { $ne: where.id }
        },
        pagination: { limit: 1 }
      });

      if (existingProduct && existingProduct.length > 0) {
        throw new Error(`Product with SKU ${data.sku} already exists`);
      }
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Trigger stock revaluation if unit_price changes
    if (event.params.data.unit_price !== undefined) {
      console.log(`💰 Unit price changed for product ${result.name} (SKU: ${result.sku})`);
      console.log(`    New price: ${result.unit_price}`);
      console.log(`    Stock quantity: ${result.stock_quantity}`);
      console.log(`    Total value: ${result.unit_price * result.stock_quantity}`);
      
      // TODO: Implement stock revaluation logic
      // This could involve updating inventory valuation records, 
      // creating accounting entries, etc.
    }
  }
};
