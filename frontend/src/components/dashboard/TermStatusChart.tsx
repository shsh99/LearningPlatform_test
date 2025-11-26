import { useState } from 'react';
import type { DashboardStats } from '../../types/dashboard';

interface TermStatusChartProps {
  stats: DashboardStats;
}

const COLORS = {
  SCHEDULED: '#3B82F6',
  ONGOING: '#22C55E',
  COMPLETED: '#9CA3AF',
  CANCELLED: '#EF4444',
};

export const TermStatusChart = ({ stats }: TermStatusChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const allData = [
    { name: '예정', value: stats.scheduledTerms, color: COLORS.SCHEDULED },
    { name: '진행중', value: stats.inProgressTerms, color: COLORS.ONGOING },
    { name: '완료', value: stats.completedTerms, color: COLORS.COMPLETED },
    { name: '취소', value: stats.cancelledTerms, color: COLORS.CANCELLED },
  ];

  const data = allData.filter((item) => item.value > 0);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">차수 상태 현황</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  // Donut chart calculations
  const outerRadius = 80;
  const innerRadius = 50;
  const centerX = 120;
  const centerY = 120;
  let cumulativeAngle = -90;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Outer arc points
    const x1Outer = centerX + outerRadius * Math.cos(startRad);
    const y1Outer = centerY + outerRadius * Math.sin(startRad);
    const x2Outer = centerX + outerRadius * Math.cos(endRad);
    const y2Outer = centerY + outerRadius * Math.sin(endRad);

    // Inner arc points
    const x1Inner = centerX + innerRadius * Math.cos(endRad);
    const y1Inner = centerY + innerRadius * Math.sin(endRad);
    const x2Inner = centerX + innerRadius * Math.cos(startRad);
    const y2Inner = centerY + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Donut segment path
    const pathD = 'M ' + x1Outer + ' ' + y1Outer +
      ' A ' + outerRadius + ' ' + outerRadius + ' 0 ' + largeArcFlag + ' 1 ' + x2Outer + ' ' + y2Outer +
      ' L ' + x1Inner + ' ' + y1Inner +
      ' A ' + innerRadius + ' ' + innerRadius + ' 0 ' + largeArcFlag + ' 0 ' + x2Inner + ' ' + y2Inner +
      ' Z';

    // Label position (middle of arc, between inner and outer)
    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelRadius = (outerRadius + innerRadius) / 2;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    return { ...item, pathD, labelX, labelY, percentage, index };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">차수 상태 현황</h3>
      <div className="flex flex-col items-center relative">
        <svg width="240" height="240" className="mb-4">
          {segments.map((segment) => (
            <g key={segment.index}>
              <path
                d={segment.pathD}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
                style={{
                  transform: hoveredIndex === segment.index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: '120px 120px',
                }}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {segment.percentage >= 15 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#374151"
            fontSize="24"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x={centerX}
            y={centerY + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6B7280"
            fontSize="12"
          >
            총 차수
          </text>
        </svg>

        {hoveredIndex !== null && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm z-10">
            <span className="font-medium">{segments[hoveredIndex].name}</span>: {segments[hoveredIndex].value}개
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          {data.map((item, index) => (
            <div
              key={item.name}
              className={'flex items-center gap-2 text-sm p-2 rounded-lg transition-colors cursor-pointer ' + (hoveredIndex === index ? 'bg-gray-100' : '')}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600">{item.name}:</span>
              <span className="font-medium text-gray-900">{item.value}개</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
