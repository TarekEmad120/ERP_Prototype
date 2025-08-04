import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Typography
} from '@strapi/design-system';
import { ArrowClockwise } from '@strapi/icons';
import KPICard from '../components/KPICard';
import ChartComponent from '../components/ChartComponent';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const kpiData = {
    totalRevenue: 285000,
    totalExpenses: 165000,
    netProfit: 120000,
    activeEmployees: 142,
    salesOrders: 89,
    purchaseOrders: 34,
    inventoryValue: 450000,
    customerCount: 256
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Chart data configurations
  const revenueExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 75000, 82000, 78000, 85000, 90000],
        borderColor: '#007bff',
        backgroundColor: '#007bff20',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: [45000, 52000, 48000, 55000, 50000, 58000],
        borderColor: '#dc3545',
        backgroundColor: '#dc354520',
        tension: 0.4
      }
    ]
  };

  const departmentData = {
    labels: ['Sales', 'HR', 'Finance', 'IT', 'Operations'],
    datasets: [{
      data: [25, 18, 12, 22, 15],
      backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1']
    }]
  };

  return (
    <Box padding={6}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" marginBottom={6}>
        <Box>
          <Typography variant="alpha">
            📊 ERP Dashboard
          </Typography>
          <Typography variant="omega" textColor="neutral600">
            Comprehensive business analytics and insights
          </Typography>
        </Box>
        <Button
          onClick={refreshData}
          loading={loading}
          startIcon={<ArrowClockwise />}
          variant="default"
        >
          Refresh Data
        </Button>
      </Flex>

      {/* KPI Cards */}
      <Typography variant="beta" marginBottom={4}>
        Key Performance Indicators
      </Typography>
      
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpiData.totalRevenue)}
          icon="💰"
          color="#28a745"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KPICard
          title="Total Expenses"
          value={formatCurrency(kpiData.totalExpenses)}
          icon="💸"
          color="#dc3545"
          trend={{ value: 3.2, isPositive: false }}
        />
        <KPICard
          title="Net Profit"
          value={formatCurrency(kpiData.netProfit)}
          icon="📈"
          color="#007bff"
          trend={{ value: 8.7, isPositive: true }}
        />
        <KPICard
          title="Active Employees"
          value={kpiData.activeEmployees}
          icon="👥"
          color="#17a2b8"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPICard
          title="Sales Orders"
          value={kpiData.salesOrders}
          icon="🛒"
          color="#6f42c1"
        />
        <KPICard
          title="Purchase Orders"
          value={kpiData.purchaseOrders}
          icon="🏬"
          color="#fd7e14"
        />
        <KPICard
          title="Inventory Value"
          value={formatCurrency(kpiData.inventoryValue)}
          icon="📦"
          color="#20c997"
        />
        <KPICard
          title="Total Customers"
          value={kpiData.customerCount}
          icon="🤝"
          color="#e83e8c"
        />
      </Box>

      {/* Charts Section */}
      <Typography variant="beta" marginBottom={4}>
        Analytics Overview
      </Typography>
      
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        <ChartComponent
          title="Revenue vs Expenses Trend"
          type="line"
          data={revenueExpenseData}
          height={350}
        />
        <ChartComponent
          title="Employee Distribution"
          type="doughnut"
          data={departmentData}
          height={350}
        />
      </Box>

      {/* Additional Information */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}
      >
        <Box
          background="neutral0"
          padding={4}
          borderRadius="4px"
          shadow="filterShadow"
          hasRadius
        >
          <Typography variant="beta" marginBottom={3}>
            📊 Business Insights
          </Typography>
          <Box>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Revenue growth: +12.5% this quarter
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Best performing department: Sales
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Customer satisfaction: 94.2%
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Inventory turnover: 6.8x annually
            </Typography>
          </Box>
        </Box>

        <Box
          background="neutral0"
          padding={4}
          borderRadius="4px"
          shadow="filterShadow"
          hasRadius
        >
          <Typography variant="beta" marginBottom={3}>
            🎯 Action Items
          </Typography>
          <Box>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Review Q3 budget allocation
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Update employee training programs
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Optimize inventory levels
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Prepare for annual review cycle
            </Typography>
          </Box>
        </Box>

        <Box
          background="neutral0"
          padding={4}
          borderRadius="4px"
          shadow="filterShadow"
          hasRadius
        >
          <Typography variant="beta" marginBottom={3}>
            📈 Recent Updates
          </Typography>
          <Box>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • New sales pipeline: $125K potential
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Completed warehouse optimization
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Implemented new CRM features
            </Typography>
            <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
              • Q2 financial reports published
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
