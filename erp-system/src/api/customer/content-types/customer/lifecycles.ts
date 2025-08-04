import type { Core } from '@strapi/strapi';

export default {
  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Prevent deletion if unpaid invoices exist
    const unpaidInvoices = await strapi.entityService.findMany('api::invoice.invoice', {
      filters: { 
        customer: where.id,
        invoice_status: { $in: ['draft', 'sent', 'overdue'] }
      },
      pagination: { limit: 1 }
    });

    if (unpaidInvoices && unpaidInvoices.length > 0) {
      throw new Error('Cannot delete customer with unpaid invoices');
    }

    // Prevent deletion if active orders exist
    const activeOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
      filters: { 
        customer: where.id,
        order_status: { $in: ['draft', 'confirmed'] }
      },
      pagination: { limit: 1 }
    });

    if (activeOrders && activeOrders.length > 0) {
      throw new Error('Cannot delete customer with active sales orders');
    }
  }
};
