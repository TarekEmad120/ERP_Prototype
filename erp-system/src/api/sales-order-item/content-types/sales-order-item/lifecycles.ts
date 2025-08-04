import type { Core } from '@strapi/strapi';

// Helper function to update sales order total
async function updateSalesOrderTotal(strapi: Core.Strapi, salesOrderId: string) {
  try {
    const orderItems = await strapi.entityService.findMany('api::sales-order-item.sales-order-item', {
      filters: { sales_order: { id: salesOrderId } },
      fields: ['subtotal']
    });

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0);

    await strapi.entityService.update('api::sales-order.sales-order', salesOrderId, {
      data: { total_number: totalAmount }
    });

    console.log(`Updated Sales Order ${salesOrderId} total: ${totalAmount}`);
  } catch (error) {
    console.error('Failed to update sales order total:', error);
  }
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Validate product availability and price consistency
    if (data.product) {
      const product = await strapi.entityService.findOne('api::product.product', data.product, {
        fields: ['stock_quantity', 'unit_price', 'name']
      });

      if (!product) {
        throw new Error('Product does not exist');
      }

      // Check stock availability
      if (data.quantity > product.stock_quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${data.quantity}`);
      }

      // Ensure price consistency (allow some flexibility for discounts)
      if (data.unit_price && Math.abs(data.unit_price - product.unit_price) > product.unit_price * 0.5) {
        throw new Error(`Unit price ${data.unit_price} is too different from product price ${product.unit_price}`);
      }

      // Auto-set unit price if not provided
      if (!data.unit_price) {
        data.unit_price = product.unit_price;
      }
    }

    // Calculate subtotal automatically
    if (data.quantity && data.unit_price) {
      data.subtotal = data.quantity * data.unit_price;
    }
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Calculate subtotal if quantity or unit_price is being updated
    if (data.quantity !== undefined || data.unit_price !== undefined) {
      // Get current record to fill in missing values
      const currentRecord = await strapi.entityService.findOne('api::sales-order-item.sales-order-item', where.id, {
        fields: ['quantity', 'unit_price']
      });

      const finalQuantity = data.quantity !== undefined ? data.quantity : currentRecord?.quantity || 0;
      const finalUnitPrice = data.unit_price !== undefined ? data.unit_price : currentRecord?.unit_price || 0;
      
      data.subtotal = finalQuantity * finalUnitPrice;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update SalesOrder total amount
    await updateSalesOrderTotal(strapi, result.sales_order);
  },

  async afterUpdate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Update SalesOrder total amount
    await updateSalesOrderTotal(strapi, result.sales_order);
  },

  async afterDelete(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Recalculate total_amount of SalesOrder
    await updateSalesOrderTotal(strapi, result.sales_order);
  }
};
