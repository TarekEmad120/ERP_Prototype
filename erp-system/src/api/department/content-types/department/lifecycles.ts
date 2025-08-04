import type { Core } from '@strapi/strapi';

export default {
  async beforeDelete(event: any) {
    const { where } = event.params;
    const { strapi }: { strapi: Core.Strapi } = event.state;

    // Block deletion if employees are still assigned to this department
    const employees = await strapi.entityService.findMany('api::employee.employee', {
      filters: { department: where.id },
      pagination: { limit: 1 }
    });

    if (employees && employees.length > 0) {
      throw new Error('Cannot delete department with assigned employees. Please reassign employees first.');
    }

    console.log('Department deletion validation passed');
  }
};
