import type { Core } from '@strapi/strapi';

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Validate account exists
    if (data.account) {
      const account = await strapi.entityService.findOne('api::account.account', data.account);
      if (!account) {
        throw new Error('Account does not exist');
      }
    }

    // Validate invoice if attached and ensure correct amount
    if (data.invoice) {
      const invoice = await strapi.entityService.findOne('api::invoice.invoice', data.invoice);
      if (!invoice) {
        throw new Error('Invoice does not exist');
      }

      // Check if payment amount doesn't exceed invoice amount
      const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
      if (data.amount > remainingAmount) {
        throw new Error(`Payment amount (${data.amount}) exceeds remaining invoice amount (${remainingAmount})`);
      }
    }

    // Prevent overspending from account (simplified - you can enhance this with actual balance tracking)
    if (data.account && data.amount < 0) {
      const account = await strapi.entityService.findOne('api::account.account', data.account);
      if (account.type === 'asset' && Math.abs(data.amount) > 1000000) { // Basic check
        throw new Error('Insufficient funds in account');
      }
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update invoice's paid_amount if transaction is linked to an invoice
    if (result.invoice) {
      const invoice = await strapi.entityService.findOne('api::invoice.invoice', result.invoice, {
        fields: ['amount', 'paid_amount', 'invoice_status']
      });

      const newPaidAmount = (invoice.paid_amount || 0) + result.amount;
      const updateData: any = {
        paid_amount: newPaidAmount
      };

      // If paid_amount >= amount, mark invoice as "paid"
      if (newPaidAmount >= invoice.amount) {
        updateData.invoice_status = 'paid';
      }

      await strapi.entityService.update('api::invoice.invoice', result.invoice, {
        data: updateData
      });

      console.log(`Updated invoice ${result.invoice} - Paid amount: ${newPaidAmount}`);
    }

    // TODO: Log audit trail when audit-log entity is created
    console.log(`Transaction created: ${result.description} - Amount: ${result.amount}`);
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Ensure transaction date is not backdated (more than 30 days ago)
    if (data.date) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (new Date(data.date) < thirtyDaysAgo) {
        throw new Error('Transaction date cannot be more than 30 days in the past');
      }
    }
  },

  async afterDelete(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Reverse invoice payment if transaction was linked to an invoice
    if (result.invoice) {
      const invoice = await strapi.entityService.findOne('api::invoice.invoice', result.invoice, {
        fields: ['amount', 'paid_amount', 'invoice_status']
      });

      const newPaidAmount = Math.max(0, (invoice.paid_amount || 0) - result.amount);
      const updateData: any = {
        paid_amount: newPaidAmount
      };

      // Update invoice status based on new paid amount
      if (newPaidAmount < invoice.amount) {
        updateData.invoice_status = newPaidAmount > 0 ? 'sent' : 'draft';
      }

      await strapi.entityService.update('api::invoice.invoice', result.invoice, {
        data: updateData
      });

      console.log(`Reversed payment for invoice ${result.invoice} - New paid amount: ${newPaidAmount}`);
    }

    // TODO: Log audit trail when audit-log entity is created
    console.log(`Transaction deleted: ${result.description} - Amount: ${result.amount}`);
  }
};
