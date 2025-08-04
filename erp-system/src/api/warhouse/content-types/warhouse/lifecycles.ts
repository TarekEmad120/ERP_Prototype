import type { Core } from '@strapi/strapi';

export default {
  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Block deletion if stock movements are still present
    const stockMovements = await strapi.entityService.findMany('api::stock-movement.stock-movement', {
      filters: { warhouse: where.id },
      pagination: { limit: 1 }
    });

    if (stockMovements && stockMovements.length > 0) {
      throw new Error('Cannot delete warehouse that has associated stock movements');
    }

    console.log('Warehouse deletion validation passed');
  }
};
