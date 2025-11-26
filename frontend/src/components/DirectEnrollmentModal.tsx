import { useState, useEffect } from 'react';
import { searchUsers, getAllUsers, type User } from '../api/user';
import { directEnrollment } from '../api/enrollment';
import { getAllCourses } from '../api/course';
import { getCourseTermsByCourseId } from '../api/courseTerm';
import type { UserSearchResponse } from '../types/user';
import type { Course } from '../types/course';
import type { CourseTerm } from '../types/courseTerm';
import { Input } from './Input';
import { Button } from './Button';

interface DirectEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DirectEnrollmentModal = ({ isOpen, onClose, onSuccess }: DirectEnrollmentModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // User search
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState<UserSearchResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<(User | UserSearchResponse)[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Course selection
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // Term selection
  const [terms, setTerms] = useState<CourseTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<CourseTerm | null>(null);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);

  // Enrollment
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState('');

  // Load courses and users on mount
  useEffect(() => {
    if (isOpen) {
      loadCourses();
      loadAllUsers();
    }
  }, [isOpen]);

  // Load terms when course selected
  useEffect(() => {
    if (selectedCourse) {
      loadTerms(selectedCourse.id);
    }
  }, [selectedCourse]);

  // User search with debounce
  useEffect(() => {
    if (userQuery.length < 2) {
      setUserResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchUsers(userQuery);
        setUserResults(results);
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [userQuery]);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadTerms = async (courseId: number) => {
    try {
      setIsLoadingTerms(true);
      const data = await getCourseTermsByCourseId(courseId);
      // 진행 중이거나 예정인 차수만
      const availableTerms = data.filter(t => t.status === 'SCHEDULED' || t.status === 'ONGOING');
      setTerms(availableTerms);
    } catch (err) {
      console.error('Failed to load terms:', err);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  const handleToggleUser = (user: User | UserSearchResponse) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleNextToStep2 = () => {
    if (selectedUsers.length === 0) return;
    setStep(2);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedTerm(null);
    setStep(3);
  };

  const handleSelectTerm = (term: CourseTerm) => {
    setSelectedTerm(term);
  };

  const handleEnroll = async () => {
    if (selectedUsers.length === 0 || !selectedTerm) return;

    try {
      setIsEnrolling(true);
      setError('');

      const results = [];
      for (const user of selectedUsers) {
        try {
          await directEnrollment({
            userId: user.id,
            termId: selectedTerm.id
          });
          results.push({ user, success: true });
        } catch (err: any) {
          results.push({
            user,
            success: false,
            error: err.response?.data?.message || '수강 신청 실패'
          });
        }
      }

      const failedCount = results.filter(r => !r.success).length;
      if (failedCount > 0) {
        const failedUsers = results.filter(r => !r.success).map(r => r.user.name).join(', ');
        setError(`${failedCount}명 실패: ${failedUsers}`);
      } else {
        onSuccess();
        handleClose();
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setUserQuery('');
    setUserResults([]);
    setSelectedUsers([]);
    setSelectedCourse(null);
    setSelectedTerm(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">수강생 등록</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isEnrolling}
            >
              ✕
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-1 ${
                      s < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: User Selection */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                1단계: 수강생 선택 {selectedUsers.length > 0 && `(${selectedUsers.length}명 선택됨)`}
              </h3>
              <Input
                label="이메일 또는 이름 검색"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="검색어를 입력하세요 (최소 2자)"
              />
              {isSearching && (
                <p className="mt-2 text-sm text-gray-500">검색 중...</p>
              )}

              {/* Search Results */}
              {userQuery.length >= 2 && userResults.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">검색 결과</p>
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {userResults.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(u => u.id === user.id)}
                          onChange={() => handleToggleUser(user)}
                          className="mr-3 h-4 w-4 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* All Users List */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">전체 사용자 목록</p>
                {isLoadingUsers ? (
                  <p className="text-gray-500">사용자 목록을 불러오는 중...</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                    {allUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(u => u.id === user.id)}
                          onChange={() => handleToggleUser(user)}
                          className="mr-3 h-4 w-4 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button
                  onClick={handleNextToStep2}
                  disabled={selectedUsers.length === 0}
                  className="w-full"
                >
                  다음 ({selectedUsers.length}명 선택됨)
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Course Selection */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                2단계: 강의 선택
              </h3>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">선택된 수강생 ({selectedUsers.length}명)</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedUsers.map((user) => (
                    <p key={user.id} className="text-sm text-gray-900">
                      • {user.name} ({user.email})
                    </p>
                  ))}
                </div>
              </div>
              {isLoadingCourses ? (
                <p className="text-gray-500">강의 목록을 불러오는 중...</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="font-semibold text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{course.description}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  이전
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Term Selection */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                3단계: 차수 선택
              </h3>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-gray-600 mb-2">선택된 수강생 ({selectedUsers.length}명)</p>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {selectedUsers.map((user) => (
                      <p key={user.id} className="text-sm text-gray-900">
                        • {user.name} ({user.email})
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">선택된 강의</p>
                  <p className="font-medium text-gray-900">{selectedCourse?.title}</p>
                </div>
              </div>
              {isLoadingTerms ? (
                <p className="text-gray-500">차수 목록을 불러오는 중...</p>
              ) : terms.length === 0 ? (
                <p className="text-gray-500">등록 가능한 차수가 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {terms.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => handleSelectTerm(term)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        selectedTerm?.id === term.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {term.termNumber}차
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(term.startDate).toLocaleDateString('ko-KR')} ~{' '}
                            {new Date(term.endDate).toLocaleDateString('ko-KR')}
                          </div>
                          <div className="text-sm text-gray-600">
                            수강생: {term.currentStudents}/{term.maxStudents}명
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            term.status === 'ONGOING'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {term.status === 'ONGOING' ? '진행중' : '예정'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  이전
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={!selectedTerm || isEnrolling}
                  className="flex-1"
                >
                  {isEnrolling ? '등록 중...' : '수강 신청하기'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
