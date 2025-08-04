import type { Core } from '@strapi/strapi';

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Send welcome email and create login (placeholder)
    console.log(`👋 Welcome email would be sent to new employee: ${result.name} (${result.email})`);
    
    // TODO: Implement user account creation
    // TODO: Implement email service integration
    /*
    try {
      // Create user account
      const user = await strapi.plugins['users-permissions'].services.user.add({
        username: result.email,
        email: result.email,
        password: 'temporary-password', // Should be randomly generated
        role: 'employee', // Default role
        confirmed: false
      });

      // Send welcome email with login instructions
      await strapi.plugins['email'].services.email.send({
        to: result.email,
        subject: 'Welcome to the Company',
        text: `Welcome ${result.name}! Your account has been created.`
      });

      console.log(`✅ User account created for employee: ${result.name}`);
    } catch (error) {
      console.error('Failed to create user account or send welcome email:', error);
    }
    */
  },

  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Check for associated transactions
    const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
      filters: { employee: where.id },
      pagination: { limit: 1 }
    });

    if (transactions && transactions.length > 0) {
      throw new Error('Cannot delete employee with associated transactions. Archive employee instead.');
    }

    // TODO: Check for other employee-related records like timesheets, performance reviews, etc.
    console.log('Employee deletion validation passed');
  }
};
