import React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Box
      background="neutral0"
      padding={4}
      borderRadius="4px"
      shadow="filterShadow"
      hasRadius
      style={{
        border: `2px solid ${color}20`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <Flex alignItems="center" gap={3}>
        <Box
          style={{
            fontSize: '24px',
            width: '48px',
            height: '48px',
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box flex="1">
          <Typography variant="sigma" textColor="neutral600">
            {title}
          </Typography>
          <Flex alignItems="center" gap={2}>
            <Typography variant="alpha" fontWeight="bold" style={{ color }}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="pi"
                style={{
                  color: trend.isPositive ? '#28a745' : '#dc3545',
                  fontSize: '12px',
                }}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </Typography>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default KPICard;
