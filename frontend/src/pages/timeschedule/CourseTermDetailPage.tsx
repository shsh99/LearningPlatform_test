import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { getCourseTermDetail } from '../../api/courseTerm';
import type { CourseTermDetail } from '../../types/courseTermDetail';

export const CourseTermDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [termDetail, setTermDetail] = useState<CourseTermDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermDetail = async () => {
      if (!id) {
        setError('유효하지 않은 기수 ID입니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCourseTermDetail(Number(id));
        setTermDetail(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch course term detail:', err);
        setError('강의 기수 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTermDetail();
  }, [id]);

  // Helper functions
  const formatDaysOfWeek = (days: string[]) => {
    const dayMap: Record<string, string> = {
      MONDAY: '월',
      TUESDAY: '화',
      WEDNESDAY: '수',
      THURSDAY: '목',
      FRIDAY: '금',
      SATURDAY: '토',
      SUNDAY: '일',
    };
    const order = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return days
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((d) => dayMap[d])
      .join(', ');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('ko-KR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; bgColor: string; textColor: string }
    > = {
      SCHEDULED: {
        label: '예정',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      ONGOING: {
        label: '진행중',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      COMPLETED: {
        label: '완료',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
      },
      CANCELLED: {
        label: '취소',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
    };

    const config = statusConfig[status] || statusConfig.SCHEDULED;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.label}
      </span>
    );
  };

  const getEnrollmentStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; bgColor: string; textColor: string }
    > = {
      ENROLLED: {
        label: '수강중',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      COMPLETED: {
        label: '수료',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      CANCELLED: {
        label: '취소',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
    };

    const config = statusConfig[status] || statusConfig.ENROLLED;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !termDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error || '데이터를 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate('/ts/terms')}>목록으로 돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/ts/terms')}
            className="!bg-gray-600 hover:!bg-gray-700"
          >
            ← 목록으로
          </Button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {termDetail.courseTitle} - {termDetail.termNumber}차
              </h1>
              <p className="text-gray-500 mt-1">강의 기수 상세 정보</p>
            </div>
            {getStatusBadge(termDetail.status)}
          </div>
        </div>

        {/* Term Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">기수 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">강의 기간</p>
              <p className="text-gray-900 font-medium">
                {formatDate(termDetail.startDate)} ~ {formatDate(termDetail.endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">요일</p>
              <p className="text-gray-900 font-medium">
                {formatDaysOfWeek(termDetail.daysOfWeek)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">수업 시간</p>
              <p className="text-gray-900 font-medium">
                {termDetail.startTime} ~ {termDetail.endTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">정원</p>
              <p className="text-gray-900 font-medium">
                {termDetail.currentStudents} / {termDetail.maxStudents}명
                <span className="text-gray-500 text-sm ml-2">
                  ({Math.round((termDetail.currentStudents / termDetail.maxStudents) * 100)}%
                  )
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">생성일</p>
              <p className="text-gray-900 font-medium">{formatDateTime(termDetail.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Instructor Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">담당 강사</h2>
          {termDetail.instructor ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">강사명</p>
                <p className="text-gray-900 font-medium">{termDetail.instructor.instructorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="text-gray-900 font-medium">{termDetail.instructor.instructorEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">배정일</p>
                <p className="text-gray-900 font-medium">
                  {formatDateTime(termDetail.instructor.assignedAt)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">배정된 강사가 없습니다.</p>
          )}
        </div>

        {/* Enrolled Students Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">수강생 목록</h2>
          {termDetail.enrolledStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      학생명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {termDetail.enrolledStudents.map((student, index) => (
                    <tr key={student.enrollmentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.studentEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEnrollmentStatusBadge(student.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(student.enrolledAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-8">등록된 수강생이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};
