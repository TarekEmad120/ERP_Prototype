import type { Core } from '@strapi/strapi';

export default {
  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Block deletion if linked transactions exist
    const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
      filters: { account: where.id },
      pagination: { limit: 1 }
    });

    if (transactions && transactions.length > 0) {
      throw new Error('Cannot delete account that has associated transactions');
    }
  }
};
