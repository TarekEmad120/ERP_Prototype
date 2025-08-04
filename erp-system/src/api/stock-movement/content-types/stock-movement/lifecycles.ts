import type { Core } from '@strapi/strapi';

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Validate quantity > 0
    if (!data.quantity || data.quantity <= 0) {
      throw new Error('Stock movement quantity must be greater than 0');
    }

    // Validate movement type
    const validTypes = ['inbound', 'outbound', 'adjustment'];
    if (!data.movement_type || !validTypes.includes(data.movement_type)) {
      throw new Error(`Invalid movement type. Must be one of: ${validTypes.join(', ')}`);
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update product stock quantity
    if (result.product) {
      const product = await strapi.entityService.findOne('api::product.product', result.product, {
        fields: ['stock_quantity']
      });

      if (product) {
        let newStockQuantity = product.stock_quantity || 0;

        switch (result.movement_type) {
          case 'inbound':
            newStockQuantity += result.quantity;
            break;
          case 'outbound':
            newStockQuantity = Math.max(0, newStockQuantity - result.quantity);
            break;
          case 'adjustment':
            // For adjustments, the quantity field represents the new total stock
            newStockQuantity = result.quantity;
            break;
        }

        await strapi.entityService.update('api::product.product', result.product, {
          data: { stock_quantity: newStockQuantity }
        });

        console.log(`📦 Updated product stock - Movement: ${result.movement_type}, Quantity: ${result.quantity}, New Stock: ${newStockQuantity}`);
      }
    }
  },

  async afterDelete(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Revert stock change
    if (result.product) {
      const product = await strapi.entityService.findOne('api::product.product', result.product, {
        fields: ['stock_quantity']
      });

      if (product) {
        let newStockQuantity = product.stock_quantity || 0;

        // Reverse the movement
        switch (result.movement_type) {
          case 'inbound':
            newStockQuantity = Math.max(0, newStockQuantity - result.quantity);
            break;
          case 'outbound':
            newStockQuantity += result.quantity;
            break;
          case 'adjustment':
            console.warn('Cannot automatically revert adjustment movement. Manual review required.');
            return;
        }

        await strapi.entityService.update('api::product.product', result.product, {
          data: { stock_quantity: newStockQuantity }
        });

        console.log(`🔄 Reverted stock movement - Type: ${result.movement_type}, Quantity: ${result.quantity}, New Stock: ${newStockQuantity}`);
      }
    }
  }
};
