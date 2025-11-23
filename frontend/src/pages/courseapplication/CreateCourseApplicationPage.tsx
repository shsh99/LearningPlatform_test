import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourseApplication } from '../../api/courseApplication';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const CreateCourseApplicationPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createCourseApplication({ title, description });
      alert('강의 개설 신청이 완료되었습니다.');
      navigate('/my-applications');
    } catch (err) {
      setError('강의 개설 신청에 실패했습니다.');
      console.error('Error creating application:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            강의 개설 신청
          </h1>
          <p className="text-gray-600">
            개설하고 싶은 강의에 대한 정보를 입력해주세요.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* 강의 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                강의 제목 <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: React 기초부터 심화까지"
                maxLength={200}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {title.length}/200자
              </p>
            </div>

            {/* 강의 설명 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                강의 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="강의 내용, 목표, 대상 수강생 등을 자세히 작성해주세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={10}
                maxLength={2000}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {description.length}/2000자
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? '신청 중...' : '신청하기'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                variant="secondary"
                disabled={loading}
              >
                취소
              </Button>
            </div>
          </form>
        </Card>

        {/* 안내 사항 */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">안내 사항</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 신청하신 내용은 운영자가 검토합니다.</li>
            <li>• 승인까지 영업일 기준 3-5일 정도 소요될 수 있습니다.</li>
            <li>• 신청 상태는 '내 신청 목록'에서 확인할 수 있습니다.</li>
            <li>• 거부된 경우 사유를 확인하고 다시 신청할 수 있습니다.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
