import { useState } from 'react';

interface UserRoleChartProps {
  usersByRole: Record<string, number>;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: '관리자',
  OPERATOR: '운영자',
  INSTRUCTOR: '강사',
  STUDENT: '수강생',
  USER: '일반 사용자',
};

const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444'];

export const UserRoleChart = ({ usersByRole }: UserRoleChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = Object.entries(usersByRole).map(([role, count], index) => ({
    name: ROLE_LABELS[role] || role,
    value: count,
    color: COLORS[index % COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 역할 분포</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  const radius = 80;
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

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathD = 'M ' + centerX + ' ' + centerY + ' L ' + x1 + ' ' + y1 + ' A ' + radius + ' ' + radius + ' 0 ' + largeArcFlag + ' 1 ' + x2 + ' ' + y2 + ' Z';

    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    return { ...item, pathD, labelX, labelY, percentage, index };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 역할 분포</h3>
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
              {segment.percentage >= 10 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
        </svg>

        {hoveredIndex !== null && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm z-10">
            <span className="font-medium">{segments[hoveredIndex].name}</span>: {segments[hoveredIndex].value}명
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
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-600">{item.name}:</span>
              <span className="font-medium text-gray-900">{item.value}명</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
