/**
 * purchase-order-item controller
 */

import { factories } from '@strapi/strapi'
import type { Core } from '@strapi/strapi';

export default factories.createCoreController('api::purchase-order-item.purchase-order-item', ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    // Calculate subtotal before creating
    if (ctx.request.body.data) {
      const { quantity, unit_cost } = ctx.request.body.data;
      if (quantity && unit_cost) {
        ctx.request.body.data.subtotal = quantity * unit_cost;
      }
    }

    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    // Calculate subtotal before updating
    if (ctx.request.body.data) {
      const { quantity, unit_cost } = ctx.request.body.data;
      
      // If quantity or unit_cost is being updated, recalculate subtotal
      if (quantity !== undefined || unit_cost !== undefined) {
        // Get current record to fill in missing values
        const currentRecord = await strapi.entityService.findOne('api::purchase-order-item.purchase-order-item', ctx.params.id, {
          fields: ['quantity', 'unit_cost']
        });

        const finalQuantity = quantity !== undefined ? quantity : currentRecord?.quantity || 0;
        const finalUnitCost = unit_cost !== undefined ? unit_cost : currentRecord?.unit_cost || 0;
        
        ctx.request.body.data.subtotal = finalQuantity * finalUnitCost;
      }
    }

    const response = await super.update(ctx);
    return response;
  }
}));
