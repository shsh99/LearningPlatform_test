import type { InstructorStats } from '../../types/dashboard';

interface InstructorStatsTableProps {
  instructorStats: InstructorStats[];
}

export const InstructorStatsTable = ({ instructorStats }: InstructorStatsTableProps) => {
  if (instructorStats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">강사별 배정 현황</h3>
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">강사별 배정 현황</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강사명
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                배정 차수
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                진행중
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                완료
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                진행률
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {instructorStats.map((instructor) => {
              const progressRate =
                instructor.assignedTerms > 0
                  ? Math.round((instructor.completedTerms / instructor.assignedTerms) * 100)
                  : 0;

              return (
                <tr key={instructor.instructorId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#6600FF]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#6600FF]">
                          {instructor.instructorName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {instructor.instructorName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{instructor.assignedTerms}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {instructor.inProgressTerms}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {instructor.completedTerms}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6600FF] rounded-full transition-all"
                          style={{ width: `${progressRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-10 text-right">{progressRate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
