import { useState } from 'react';
import type { DashboardStats } from '../../types/dashboard';

interface ApplicationStatusChartProps {
  stats: DashboardStats;
}

const COLORS = {
  pending: '#F59E0B',
  approved: '#22C55E',
  rejected: '#EF4444',
};

export const ApplicationStatusChart = ({ stats }: ApplicationStatusChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { name: '대기중', value: stats.pendingApplications, color: COLORS.pending },
    { name: '승인', value: stats.approvedApplications, color: COLORS.approved },
    { name: '거절', value: stats.rejectedApplications, color: COLORS.rejected },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 신청 현황</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 신청 현황</h3>
      <div className="space-y-4 py-4">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div
              key={item.name}
              className={'flex items-center gap-4 p-2 rounded-lg transition-colors ' + (hoveredIndex === index ? 'bg-gray-50' : '')}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="w-16 text-sm text-gray-600 shrink-0">{item.name}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: percentage + '%',
                    backgroundColor: item.color,
                    minWidth: item.value > 0 ? '40px' : '0',
                  }}
                >
                  {item.value > 0 && (
                    <span className="text-white text-sm font-medium">{item.value}건</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-6 pt-4 border-t border-gray-100">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.name}:</span>
            <span className="font-medium text-gray-900">{item.value}건</span>
          </div>
        ))}
      </div>
    </div>
  );
};
