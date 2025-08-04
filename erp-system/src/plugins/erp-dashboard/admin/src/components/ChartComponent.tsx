import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@strapi/design-system';

interface ChartComponentProps {
  title: string;
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: any;
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ title, type, data, height = 300 }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const loadChartJS = async () => {
      // Dynamically import Chart.js to avoid SSR issues
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (chartRef.current) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          chartInstance.current = new Chart(ctx, {
            type,
            data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                },
              },
              scales: type === 'doughnut' || type === 'pie' ? {} : {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      }
    };

    loadChartJS();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data]);

  return (
    <Box
      background="neutral0"
      padding={4}
      borderRadius="4px"
      shadow="filterShadow"
      hasRadius
    >
      <Typography variant="beta" marginBottom={3}>
        {title}
      </Typography>
      <Box style={{ position: 'relative', height: `${height}px` }}>
        <canvas ref={chartRef} />
      </Box>
    </Box>
  );
};

export default ChartComponent;
