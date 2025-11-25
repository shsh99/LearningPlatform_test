import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
  const data = [
    { name: '예정', value: stats.scheduledTerms, color: COLORS.SCHEDULED },
    { name: '진행중', value: stats.inProgressTerms, color: COLORS.ONGOING },
    { name: '완료', value: stats.completedTerms, color: COLORS.COMPLETED },
    { name: '취소', value: stats.cancelledTerms, color: COLORS.CANCELLED },
  ].filter((item) => item.value > 0);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">차수 상태 현황</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}개`, '']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.name}:</span>
            <span className="font-medium text-gray-900">{item.value}개</span>
          </div>
        ))}
      </div>
    </div>
  );
};
