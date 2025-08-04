import type { Core } from '@strapi/strapi';

export default {
  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Check for pending POs
    const pendingPOs = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
      filters: { 
        supplier: where.id,
        po_status: { $in: ['draft', 'confirmed'] }
      },
      pagination: { limit: 1 }
    });

    if (pendingPOs && pendingPOs.length > 0) {
      throw new Error('Cannot delete supplier with pending purchase orders');
    }

    // TODO: Check for unpaid invoices when purchase invoice system is implemented
    console.log('Supplier deletion validation passed');
  }
};
