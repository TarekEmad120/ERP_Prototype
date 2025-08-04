/**
 * sales-order-item controller
 */

import { factories } from '@strapi/strapi'
import type { Core } from '@strapi/strapi';

export default factories.createCoreController('api::sales-order-item.sales-order-item', ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    // Calculate subtotal before creating
    if (ctx.request.body.data) {
      const { quantity, unit_price } = ctx.request.body.data;
      if (quantity && unit_price) {
        ctx.request.body.data.subtotal = quantity * unit_price;
      }
    }

    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    // Calculate subtotal before updating
    if (ctx.request.body.data) {
      const { quantity, unit_price } = ctx.request.body.data;
      
      // If quantity or unit_price is being updated, recalculate subtotal
      if (quantity !== undefined || unit_price !== undefined) {
        // Get current record to fill in missing values
        const currentRecord = await strapi.entityService.findOne('api::sales-order-item.sales-order-item', ctx.params.id, {
          fields: ['quantity', 'unit_price']
        });

        const finalQuantity = quantity !== undefined ? quantity : currentRecord?.quantity || 0;
        const finalUnitPrice = unit_price !== undefined ? unit_price : currentRecord?.unit_price || 0;
        
        ctx.request.body.data.subtotal = finalQuantity * finalUnitPrice;
      }
    }

    const response = await super.update(ctx);
    return response;
  }
}));
