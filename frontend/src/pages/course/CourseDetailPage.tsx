import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../api/course';
import { enrollCourse } from '../../api/enrollment';
import type { Course } from '../../types/course';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetail(Number(id));
    }
  }, [id]);

  const fetchCourseDetail = async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError('강의 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching course detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!id) return;

    // TODO: termId는 실제로는 학기 선택 UI에서 받아야 함
    // 현재는 임시로 courseId를 termId로 사용
    const termId = Number(id);

    try {
      setEnrolling(true);
      setError(null);
      await enrollCourse({
        termId,
        studentId: user.id,
      });
      alert('수강 신청이 완료되었습니다!');
      navigate('/my-enrollments');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '수강 신청에 실패했습니다.';
      setError(errorMessage);
      console.error('Error enrolling course:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleBack = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || '강의를 찾을 수 없습니다.'}</p>
            <Button onClick={handleBack}>목록으로 돌아가기</Button>
          </div>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };

    const statusText = {
      APPROVED: '승인됨',
      REJECTED: '거부됨',
      PENDING: '대기중',
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded ${
          statusStyles[status as keyof typeof statusStyles]
        }`}
      >
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          목록으로
        </button>

        {/* 강의 상세 정보 */}
        <Card className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            {getStatusBadge(course.status)}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">강의 설명</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {course.description || '설명이 없습니다.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">최대 수강 인원</div>
              <div className="text-2xl font-bold text-gray-900">
                {course.maxStudents}명
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">생성일</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(course.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">최종 수정일</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(course.updatedAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>

          {/* 수강 신청 버튼 */}
          {course.status === 'APPROVED' && (
            <div className="flex gap-2">
              <Button
                onClick={handleEnroll}
                className="flex-1"
                disabled={enrolling}
              >
                {enrolling ? '신청 중...' : '수강 신청하기'}
              </Button>
            </div>
          )}

          {course.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              이 강의는 거부되었습니다. 수강 신청이 불가능합니다.
            </div>
          )}

          {course.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
              이 강의는 승인 대기 중입니다.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
