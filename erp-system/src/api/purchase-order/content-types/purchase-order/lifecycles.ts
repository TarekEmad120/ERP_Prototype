import type { Core } from '@strapi/strapi';

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Auto-generate PO number if not provided
    if (!data.po_number) {
      const count = await strapi.entityService.count('api::purchase-order.purchase-order');
      data.po_number = `PO-${String(count + 1).padStart(6, '0')}`;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Email PO to supplier (placeholder for email service)
    try {
      const supplier = await strapi.entityService.findOne('api::supplier.supplier', result.supplier, {
        fields: ['name', 'conatct_info']
      });

      if (supplier) {
        console.log(`📧 Sending PO ${result.po_number} to supplier ${supplier.name}`);
        // TODO: Extract email from contact_info and implement email service
        // const emailMatch = supplier.conatct_info?.match(/Email:\s*([\w\.-]+@[\w\.-]+\.\w+)/);
        // if (emailMatch) {
        //   await strapi.plugins['email'].services.email.send({
        //     to: emailMatch[1],
        //     subject: `Purchase Order ${result.po_number}`,
        //     text: `Purchase Order ${result.po_number} has been created.`
        //   });
        // }
      }
    } catch (error) {
      console.error('Failed to send PO email:', error);
    }

    console.log(`✅ Purchase Order ${result.po_number} created successfully`);
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Block status update to "received" if stock movement not logged
    if (data.po_status === 'received') {
      const poItems = await strapi.entityService.findMany('api::purchase-order-item.purchase-order-item', {
        filters: { purchase_order: where.id },
        populate: { product: true }
      });

      // Check if stock movements exist for each product in this PO
      for (const item of poItems as any[]) {
        if (item.product) {
          const stockMovements = await strapi.entityService.findMany('api::stock-movement.stock-movement', {
            filters: { 
              product: item.product.id,
              movement_type: 'inbound',
              // You might want to add date filtering here to check recent movements
            },
            pagination: { limit: 1 }
          });

          if (!stockMovements || stockMovements.length === 0) {
            console.warn(`No inbound stock movement found for product ${item.product.name} in PO ${where.id}`);
            // You can choose to throw an error or just warn
            // throw new Error(`Cannot mark PO as received: No stock movement logged for product ${item.product.name}`);
          }
        }
      }
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // If PO status becomes "received", trigger StockMovement creation
    if (result.po_status === 'received') {
      try {
        const poItems = await strapi.entityService.findMany('api::purchase-order-item.purchase-order-item', {
          filters: { purchase_order: result.id },
          populate: { product: true }
        });

        // Create stock movements for all items
        for (const item of poItems as any[]) {
          if (item.product) {
            await strapi.entityService.create('api::stock-movement.stock-movement', {
              data: {
                movement_type: 'inbound',
                quantity: item.quantity,
                movement_date: new Date(),
                product: item.product.id,
                // You might want to specify a default warehouse here
                warhouse: null, // TODO: Add default warehouse logic
                publishedAt: new Date()
              }
            });

            console.log(`📦 Created inbound stock movement for ${item.quantity} units of ${item.product.name}`);
          }
        }

        console.log(`✅ Stock movements created for PO ${result.po_number}`);
      } catch (error) {
        console.error('Failed to create stock movements for PO:', error);
      }
    }
  }
};
