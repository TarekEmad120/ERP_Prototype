import React from 'react';
import { Box, Typography, Button, Flex, Card, CardContent } from '@strapi/design-system';
import { Download } from '@strapi/icons';

const FinancialJournals = () => {
  const downloadReport = async (reportType: string, filename: string) => {
    try {
      // Use fetch directly since useFetchClient might not be available
      const response = await fetch(`/api/dashboard/${reportType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading ${reportType}:`, error);
      alert(`Failed to download ${filename}. Please try again.`);
    }
  };

  const reports = [
    {
      title: 'Income Statement',
      description: 'Download a comprehensive income statement showing revenue, expenses, and net income for the current period.',
      endpoint: 'income-statement',
      filename: 'income-statement.pdf',
      icon: '📊',
    },
    {
      title: 'Balance Sheet',
      description: 'Download a balance sheet showing assets, liabilities, and equity at the current date.',
      endpoint: 'balance-sheet',
      filename: 'balance-sheet.pdf',
      icon: '⚖️',
    },
    {
      title: 'Cash Flow Statement',
      description: 'Download a cash flow statement showing operating, investing, and financing activities.',
      endpoint: 'cash-flow-statement',
      filename: 'cash-flow-statement.pdf',
      icon: '💰',
    },
  ];

  return (
    <Box padding={8}>
      <Box marginBottom={6}>
        <Typography variant="alpha" textColor="neutral800">
          Financial Journals
        </Typography>
        <Typography variant="omega" textColor="neutral600">
          Generate and download financial reports based on your ERP data
        </Typography>
      </Box>

      <Flex direction="row" wrap="wrap" gap={4}>
        {reports.map((report) => (
          <Box key={report.endpoint} style={{ flex: '0 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Box marginBottom={4}>
                  <Box style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {report.icon}
                  </Box>
                  <Typography variant="beta" fontWeight="bold" marginBottom={2}>
                    {report.title}
                  </Typography>
                  <Typography variant="epsilon" textColor="neutral600">
                    {report.description}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="default"
                    startIcon={<Download />}
                    onClick={() => downloadReport(report.endpoint, report.filename)}
                    fullWidth
                  >
                    Download PDF
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Flex>

      <Box marginTop={8} padding={4} background="neutral100" borderRadius="4px">
        <Typography variant="delta" fontWeight="bold" marginBottom={2}>
          About Financial Reports
        </Typography>
        <Typography variant="epsilon" textColor="neutral700">
          These reports are generated in real-time based on your current ERP data including:
        </Typography>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>Sales orders and revenue data</li>
          <li>Purchase orders and cost information</li>
          <li>Transaction records</li>
          <li>Product inventory valuations</li>
        </ul>
        <Typography variant="epsilon" textColor="neutral600" marginTop={3}>
          Reports are generated as PDF files and will be automatically downloaded to your device.
        </Typography>
      </Box>
    </Box>
  );
};

export default FinancialJournals;
