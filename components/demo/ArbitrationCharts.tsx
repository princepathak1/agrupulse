'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts';
import { MandiArbitrationResult } from '@/lib/types';
import { useThemeLanguage } from '../layout/ThemeLanguageContext';

interface ArbitrationChartsProps {
  results: MandiArbitrationResult[];
  recommendedId: string;
}

export function ArbitrationCharts({ results, recommendedId }: ArbitrationChartsProps) {
  const { lang } = useThemeLanguage();
  // Data for Net Return Bar Chart
  const barData = results.map((m) => ({
    name: m.mandiName.split(' ')[0],
    fullName: m.mandiName,
    netReturn: m.netReturn,
    isRecommended: m.mandiId === recommendedId,
    transportCost: m.transportCost,
  }));

  // Data for Spoilage vs Transit Hours Line Chart
  const lineData = results
    .map((m) => ({
      name: m.mandiName.split(' ')[0],
      transitHours: m.transitHours,
      spoilagePercent: m.spoilageOnArrivalPercent,
      distanceKm: m.distanceKm,
    }))
    .sort((a, b) => a.transitHours - b.transitHours);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {/* Chart 1: Net Return Comparison Bar Chart */}
      <div className="p-4 rounded-xl bg-[var(--surface-muted)]/60 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-[var(--foreground)]">
            {lang === 'hi' ? 'शुद्ध किसान आय तुलना (₹)' : 'Expected net return by mandi (₹)'}
          </h4>
          <span className="text-[11px] text-[var(--secondary)]">
            {lang === 'hi' ? 'अधिकतम शुद्ध मुनाफा' : 'Sorted by net realization'}
          </span>
        </div>
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" angle={-20} textAnchor="end" tick={{ fontSize: 10, fill: 'var(--secondary)' }} />
              <YAxis
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: 'var(--secondary)' }}
              />
              <Tooltip
                formatter={(value: any) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  lang === 'hi' ? 'शुद्ध आय' : 'Net return',
                ]}
                labelFormatter={(label) => `${lang === 'hi' ? 'मंडी:' : 'Mandi:'} ${label}`}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '11px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
              <Bar dataKey="netReturn" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isRecommended ? '#28784A' : '#94A3B8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Spoilage % vs Transit Hours Line Chart */}
      <div className="p-4 rounded-xl bg-[var(--surface-muted)]/60 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-[var(--foreground)]">
            {lang === 'hi' ? 'यात्रा समय बनाम फसल सड़न %' : 'Transit hours vs. spoilage risk (%)'}
          </h4>
          <span className="text-[11px] text-[var(--secondary)]">
            {lang === 'hi' ? 'क्षरण दर' : 'Cumulative degradation'}
          </span>
        </div>
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="var(--border)" />
              <XAxis dataKey="transitHours" unit="h" tick={{ fontSize: 10, fill: 'var(--secondary)' }} label={{ value: 'Transit hours', position: 'insideBottom', offset: -10, fontSize: 10, fill: 'var(--secondary)' }} />
              <YAxis unit="%" tick={{ fontSize: 10, fill: 'var(--secondary)' }} domain={[0, 'auto']} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Spoilage on arrival']}
                labelFormatter={(val) => `${val}h transit`}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '11px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
              <Line
                type="monotone"
                dataKey="spoilagePercent"
                stroke="#B7791F"
                strokeWidth={2}
                dot={{ r: 3, fill: '#B7791F' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
