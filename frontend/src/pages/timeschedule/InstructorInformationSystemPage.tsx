import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getInstructorInformationSystems } from '../../api/instructorInformationSystem';
import type { InstructorInformationSystem } from '../../types/instructorInformationSystem';

export const InstructorInformationSystemPage = () => {
  const [records, setRecords] = useState<InstructorInformationSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [timeKey, setTimeKey] = useState<string>('');

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const query = {
        userKey: userKey ? Number(userKey) : undefined,
        timeKey: timeKey ? Number(timeKey) : undefined,
      };
      const data = await getInstructorInformationSystems(query);
      setRecords(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load IIS records:', err);
      setError('IIS 기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecords();
  };

  const handleReset = () => {
    setUserKey('');
    setTimeKey('');
  };

  if (isLoading && records.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IIS 조회</h1>
            <p className="text-gray-600">강사 배정 이력을 조회할 수 있습니다.</p>
          </div>

          {/* 검색 필터 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  강사 ID (userKey)
                </label>
                <Input
                  type="number"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  placeholder="강사 ID를 입력하세요"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차수 ID (timeKey)
                </label>
                <Input
                  type="number"
                  value={timeKey}
                  onChange={(e) => setTimeKey(e.target.value)}
                  placeholder="차수 ID를 입력하세요"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">검색</Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  className="!bg-gray-500 hover:!bg-gray-600"
                >
                  초기화
                </Button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">조회된 IIS 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      강사 ID (userKey)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      차수 ID (timeKey)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      배정 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성 시각
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.userKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.timeKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.assignmentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.timestamp).toLocaleString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
