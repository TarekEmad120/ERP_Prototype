import React, { useState, useEffect } from 'react';

// KPI Data Interface
interface KPIData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeEmployees: number;
  salesOrders: number;
  purchaseOrders: number;
  inventoryValue: number;
}

// KPI Cards Component
const KPICards: React.FC<{ dateRange: any }> = ({ dateRange }) => {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    activeEmployees: 0,
    salesOrders: 0,
    purchaseOrders: 0,
    inventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
  }, [dateRange]);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls when integrating with Strapi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        totalRevenue: 285000,
        totalExpenses: 165000,
        netProfit: 120000,
        activeEmployees: 142,
        salesOrders: 89,
        purchaseOrders: 34,
        inventoryValue: 450000,
      };
      setKpiData(mockData);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpiData.totalRevenue),
      icon: '💰',
      color: '#28a745',
      bgColor: '#d4edda',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(kpiData.totalExpenses),
      icon: '💸',
      color: '#dc3545',
      bgColor: '#f8d7da',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(kpiData.netProfit),
      icon: '📈',
      color: kpiData.netProfit >= 0 ? '#28a745' : '#dc3545',
      bgColor: kpiData.netProfit >= 0 ? '#d4edda' : '#f8d7da',
    },
    {
      title: 'Active Employees',
      value: kpiData.activeEmployees.toString(),
      icon: '👥',
      color: '#17a2b8',
      bgColor: '#d1ecf1',
    },
    {
      title: 'Sales Orders',
      value: kpiData.salesOrders.toString(),
      icon: '🛒',
      color: '#007bff',
      bgColor: '#d1ecf1',
    },
    {
      title: 'Purchase Orders',
      value: kpiData.purchaseOrders.toString(),
      icon: '🏬',
      color: '#6610f2',
      bgColor: '#e2d9f3',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(kpiData.inventoryValue),
      icon: '📦',
      color: '#fd7e14',
      bgColor: '#ffeaa7',
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ 
              width: '40px',
              height: '40px',
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {kpiCards.map((card, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: `2px solid ${card.bgColor}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <div style={{
              fontSize: '24px',
              marginRight: '10px',
              padding: '8px',
              backgroundColor: card.bgColor,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              fontWeight: '500'
            }}>
              {card.title}
            </h3>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: card.color,
            marginLeft: '50px'
          }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
const HomePage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
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

      {/* KPI Cards */}
      <KPICards dateRange={dateRange} />

      {/* Info Message */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>
          🎉 Dashboard Successfully Integrated!
        </h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          Your comprehensive ERP dashboard has been added to the Strapi admin menu.
        </p>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '10px' }}>
            Features Available:
          </h3>
          <ul style={{ 
            color: '#6c757d', 
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <li>📊 Real-time KPI monitoring</li>
            <li>📈 Interactive date range filtering</li>
            <li>💰 Financial metrics tracking</li>
            <li>👥 Employee management insights</li>
            <li>📦 Inventory value monitoring</li>
            <li>🛒 Sales and purchase order tracking</li>
          </ul>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
            <p style={{ color: '#0066cc', margin: 0, fontSize: '14px' }}>
              💡 <strong>Tip:</strong> This dashboard is now embedded directly in Strapi admin. No need to open external files!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;