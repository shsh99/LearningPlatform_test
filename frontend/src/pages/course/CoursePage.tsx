import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, searchCourses } from '../../api/course';
import type { Course } from '../../types/course';
import { CourseCard } from '../../components/course/CourseCard';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';

export const CoursePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchCourses();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchCourses(searchKeyword);
      setCourses(data);
    } catch (err) {
      setError('검색에 실패했습니다.');
      console.error('Error searching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
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
      <PageHeader
        title="강의 목록"
        description="원하는 강의를 선택하여 수강 신청하세요."
        backTo="/"
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">

        {/* 검색 */}
        <div className="mb-6 flex gap-2">
          <Input
            type="text"
            placeholder="강의 제목으로 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSearch}>검색</Button>
          <Button onClick={fetchCourses} variant="secondary">
            전체보기
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 강의 목록 */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">표시할 강의가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}

        {/* 강의 개수 */}
        {courses.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            총 {courses.length}개의 강의
          </div>
        )}
      </div>
    </div>
    </>
  );
};
