import React, { useState, useEffect } from 'react';
import KPICards from './KPICards';
import RevenueExpensesChart from './charts/RevenueExpensesChart';
import InvoicesSummaryChart from './charts/InvoicesSummaryChart';
import TopProductsChart from './charts/TopProductsChart';
import EmployeesByDepartmentChart from './charts/EmployeesByDepartmentChart';
import SalaryDistributionChart from './charts/SalaryDistributionChart';
import NewHiresChart from './charts/NewHiresChart';
import AccountBalancesChart from './charts/AccountBalancesChart';
import ExpenseBreakdownChart from './charts/ExpenseBreakdownChart';
import CashFlowChart from './charts/CashFlowChart';
import TransactionsByAccountChart from './charts/TransactionsByAccountChart';
import SalesOverTimeChart from './charts/SalesOverTimeChart';
import OrdersStatusChart from './charts/OrdersStatusChart';
import TopCustomersChart from './charts/TopCustomersChart';
import ProcurementSpendChart from './charts/ProcurementSpendChart';
import PurchaseOrdersStatusChart from './charts/PurchaseOrdersStatusChart';
import StockLevelsChart from './charts/StockLevelsChart';
import InventoryMovementChart from './charts/InventoryMovementChart';
import StockByWarehouseChart from './charts/StockByWarehouseChart';

interface DashboardProps {}

interface DateRange {
  start: Date;
  end: Date;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedModule, setSelectedModule] = useState<string>('general');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  const modules = [
    { id: 'general', label: '📊 General Dashboard', icon: '📊' },
    { id: 'hr', label: '👩‍💼 HR Module', icon: '👩‍💼' },
    { id: 'finance', label: '💸 Finance Module', icon: '💸' },
    { id: 'sales', label: '🛒 Sales Module', icon: '🛒' },
    { id: 'procurement', label: '🏬 Procurement Module', icon: '🏬' },
    { id: 'inventory', label: '📦 Inventory Module', icon: '📦' },
  ];

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const moduleTabsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px'
  };

  const tabStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const getTabStyle = (moduleId: string) => ({
    ...tabStyle,
    backgroundColor: selectedModule === moduleId ? '#007bff' : 'white',
    color: selectedModule === moduleId ? 'white' : '#666',
    boxShadow: selectedModule === moduleId ? '0 2px 4px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
  });

  const chartsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  };

  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '350px'
  };

  const renderGeneralDashboard = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <RevenueExpensesChart dateRange={dateRange} />
      </div>
      <div style={chartContainerStyle}>
        <InvoicesSummaryChart />
      </div>
      <div style={chartContainerStyle}>
        <TopProductsChart />
      </div>
    </div>
  );

  const renderHRModule = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <EmployeesByDepartmentChart />
      </div>
      <div style={chartContainerStyle}>
        <SalaryDistributionChart />
      </div>
      <div style={chartContainerStyle}>
        <NewHiresChart dateRange={dateRange} />
      </div>
    </div>
  );

  const renderFinanceModule = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <AccountBalancesChart />
      </div>
      <div style={chartContainerStyle}>
        <ExpenseBreakdownChart />
      </div>
      <div style={chartContainerStyle}>
        <CashFlowChart dateRange={dateRange} />
      </div>
      <div style={chartContainerStyle}>
        <TransactionsByAccountChart />
      </div>
    </div>
  );

  const renderSalesModule = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <SalesOverTimeChart dateRange={dateRange} />
      </div>
      <div style={chartContainerStyle}>
        <OrdersStatusChart />
      </div>
      <div style={chartContainerStyle}>
        <TopCustomersChart />
      </div>
    </div>
  );

  const renderProcurementModule = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <ProcurementSpendChart dateRange={dateRange} />
      </div>
      <div style={chartContainerStyle}>
        <PurchaseOrdersStatusChart />
      </div>
    </div>
  );

  const renderInventoryModule = () => (
    <div style={chartsGridStyle}>
      <div style={chartContainerStyle}>
        <StockLevelsChart />
      </div>
      <div style={chartContainerStyle}>
        <InventoryMovementChart dateRange={dateRange} />
      </div>
      <div style={chartContainerStyle}>
        <StockByWarehouseChart />
      </div>
    </div>
  );

  const renderModuleContent = () => {
    switch (selectedModule) {
      case 'general':
        return renderGeneralDashboard();
      case 'hr':
        return renderHRModule();
      case 'finance':
        return renderFinanceModule();
      case 'sales':
        return renderSalesModule();
      case 'procurement':
        return renderProcurementModule();
      case 'inventory':
        return renderInventoryModule();
      default:
        return renderGeneralDashboard();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>
          📊 ERP Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
              From:
            </label>
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                start: new Date(e.target.value) 
              }))}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>
              To:
            </label>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                end: new Date(e.target.value) 
              }))}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards - Always visible */}
      <KPICards dateRange={dateRange} />

      {/* Module Tabs */}
      <div style={moduleTabsStyle}>
        {modules.map((module) => (
          <button
            key={module.id}
            style={getTabStyle(module.id)}
            onClick={() => setSelectedModule(module.id)}
          >
            {module.icon} {module.label}
          </button>
        ))}
      </div>

      {/* Module Content */}
      {renderModuleContent()}
    </div>
  );
};

export default Dashboard;
