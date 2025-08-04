import type { Core } from '@strapi/strapi';

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Ensure related SalesOrder or Customer exists
    if (data.sales_order) {
      const salesOrder = await strapi.entityService.findOne('api::sales-order.sales-order', data.sales_order);
      if (!salesOrder) {
        throw new Error('Related Sales Order does not exist');
      }
    }

    if (data.customer) {
      const customer = await strapi.entityService.findOne('api::customer.customer', data.customer);
      if (!customer) {
        throw new Error('Related Customer does not exist');
      }
    }

    // Auto-generate invoice number if not provided
    if (!data.invoice_number) {
      const count = await strapi.entityService.count('api::invoice.invoice');
      data.invoice_number = `INV-${String(count + 1).padStart(6, '0')}`;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Generate PDF and send to customer via email (placeholder for email service)
    if (result.customer) {
      try {
        const customer = await strapi.entityService.findOne('api::customer.customer', result.customer, {
          fields: ['email', 'name']
        });

        if (customer?.email) {
          console.log(`📧 Sending invoice ${result.invoice_number} to ${customer.email}`);
          // TODO: Implement actual email service integration
          // await strapi.plugins['email'].services.email.send({
          //   to: customer.email,
          //   subject: `Invoice ${result.invoice_number}`,
          //   text: `Dear ${customer.name}, your invoice is ready.`
          // });
        }
      } catch (error) {
        console.error('Failed to send invoice email:', error);
      }
    }

    console.log(`✅ Invoice ${result.invoice_number} created successfully`);
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Prevent status from moving backward (e.g., Paid → Draft)
    if (data.invoice_status) {
      const currentInvoice = await strapi.entityService.findOne('api::invoice.invoice', where.id, {
        fields: ['invoice_status']
      });

      const statusOrder = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
      const currentIndex = statusOrder.indexOf(currentInvoice?.invoice_status);
      const newIndex = statusOrder.indexOf(data.invoice_status);

      // Allow moving to cancelled from any state, but prevent other backward moves
      if (data.invoice_status !== 'cancelled' && 
          data.invoice_status !== 'overdue' && 
          newIndex < currentIndex) {
        throw new Error(`Cannot change invoice status from ${currentInvoice?.invoice_status} to ${data.invoice_status}`);
      }
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // If status set to "overdue", trigger reminder email
    if (result.invoice_status === 'overdue') {
      try {
        const customer = await strapi.entityService.findOne('api::customer.customer', result.customer, {
          fields: ['email', 'name']
        });

        if (customer?.email) {
          console.log(`📧 Sending overdue reminder for invoice ${result.invoice_number} to ${customer.email}`);
          // TODO: Implement actual email service integration
          // await strapi.plugins['email'].services.email.send({
          //   to: customer.email,
          //   subject: `Overdue Invoice ${result.invoice_number}`,
          //   text: `Dear ${customer.name}, your invoice ${result.invoice_number} is overdue.`
          // });
        }
      } catch (error) {
        console.error('Failed to send overdue reminder email:', error);
      }
    }
  },

  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Prevent deletion if payment already exists
    const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
      filters: { invoice: where.id },
      pagination: { limit: 1 }
    });

    if (transactions && transactions.length > 0) {
      throw new Error('Cannot delete invoice that has associated payments/transactions');
    }
  }
};
