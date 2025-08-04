import type { Core } from '@strapi/strapi';

// Helper function to update purchase order total
async function updatePurchaseOrderTotal(strapi: Core.Strapi, purchaseOrderId: string) {
  try {
    const orderItems = await strapi.entityService.findMany('api::purchase-order-item.purchase-order-item', {
      filters: { purchase_order: { id: purchaseOrderId } },
      fields: ['subtotal']
    });

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0);

    await strapi.entityService.update('api::purchase-order.purchase-order', purchaseOrderId, {
      data: { total_amount: totalAmount }
    });

    console.log(`Updated Purchase Order ${purchaseOrderId} total: ${totalAmount}`);
  } catch (error) {
    console.error('Failed to update purchase order total:', error);
  }
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Calculate subtotal automatically
    if (data.quantity && data.unit_cost) {
      data.subtotal = data.quantity * data.unit_cost;
    }
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Calculate subtotal if quantity or unit_cost is being updated
    if (data.quantity !== undefined || data.unit_cost !== undefined) {
      // Get current record to fill in missing values
      const currentRecord = await strapi.entityService.findOne('api::purchase-order-item.purchase-order-item', where.id, {
        fields: ['quantity', 'unit_cost']
      });

      const finalQuantity = data.quantity !== undefined ? data.quantity : currentRecord?.quantity || 0;
      const finalUnitCost = data.unit_cost !== undefined ? data.unit_cost : currentRecord?.unit_cost || 0;
      
      data.subtotal = finalQuantity * finalUnitCost;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update PurchaseOrder total amount
    await updatePurchaseOrderTotal(strapi, result.purchase_order);
  },

  async afterUpdate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update PurchaseOrder total amount
    await updatePurchaseOrderTotal(strapi, result.purchase_order);
  },

  async afterDelete(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Recalculate total_amount of PurchaseOrder
    await updatePurchaseOrderTotal(strapi, result.purchase_order);
  }
};
