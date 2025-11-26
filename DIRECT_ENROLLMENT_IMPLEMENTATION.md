# Direct Enrollment Feature - Remaining Implementation

## ✅ Already Completed
1. ✅ DirectEnrollmentRequest DTO
2. ✅ UserSearchResponse DTO
3. ✅ UserRepository.searchActiveUsers() method
4. ✅ UserService.searchUsers() method
5. ✅ UserServiceImpl.searchUsers() implementation
6. ✅ UserController.searchUsers() endpoint

## 📋 Remaining Backend Tasks

### 1. EnrollmentService Interface
Add to `EnrollmentService.java`:
```java
/**
 * 관리자의 직접 수강 신청 (운영자용)
 */
EnrollmentResponse directEnrollment(DirectEnrollmentRequest request);
```

### 2. EnrollmentServiceImpl
Add to `EnrollmentServiceImpl.java`:
```java
@Override
@Transactional
public EnrollmentResponse directEnrollment(DirectEnrollmentRequest request) {
    // 1. 유저 조회
    User user = userRepository.findById(request.userId())
        .orElseThrow(() -> new UserNotFoundException(request.userId()));

    // 2. 차수 조회
    CourseTerm term = courseTermRepository.findById(request.termId())
        .orElseThrow(() -> new CourseTermNotFoundException(request.termId()));

    // 3. 중복 신청 확인
    boolean exists = enrollmentRepository.existsByStudentAndTerm(user, term);
    if (exists) {
        throw new BusinessException(ErrorCode.ENROLLMENT_ALREADY_EXISTS,
            "이미 해당 차수에 등록된 학생입니다.");
    }

    // 4. 정원 확인
    if (term.getCurrentStudents() >= term.getMaxStudents()) {
        throw new BusinessException(ErrorCode.ENROLLMENT_FULL,
            "정원이 초과되었습니다.");
    }

    // 5. 수강 신청 생성 (관리자는 바로 ENROLLED 상태로)
    Enrollment enrollment = Enrollment.createEnrolled(user, term);
    Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

    // 6. 차수 수강생 수 증가
    term.increaseCurrentStudents();

    // 7. SIS 레코드 생성
    StudentInformationSystem sis = StudentInformationSystem.create(
        user.getId(),
        System.currentTimeMillis(),
        savedEnrollment
    );
    studentInformationSystemRepository.save(sis);

    return EnrollmentResponse.from(savedEnrollment);
}
```

### 3. EnrollmentController
Add to `EnrollmentController.java`:
```java
/**
 * 관리자의 직접 수강 신청
 * POST /api/enrollments/direct
 * 권한: OPERATOR 이상
 */
@PostMapping("/direct")
@PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
public ResponseEntity<EnrollmentResponse> directEnrollment(@Valid @RequestBody DirectEnrollmentRequest request) {
    log.info("POST /api/enrollments/direct - userId: {}, termId: {}", request.userId(), request.termId());
    EnrollmentResponse response = enrollmentService.directEnrollment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

### 4. Add Enrollment.createEnrolled() method
Add to `Enrollment.java` entity:
```java
/**
 * 관리자의 직접 등록 (ENROLLED 상태로 바로 생성)
 */
public static Enrollment createEnrolled(User student, CourseTerm term) {
    Enrollment enrollment = new Enrollment();
    enrollment.student = student;
    enrollment.term = term;
    enrollment.status = EnrollmentStatus.ENROLLED;  // 바로 ENROLLED 상태
    return enrollment;
}
```

---

## 🎨 Frontend Implementation

### 1. API Client (`frontend/src/api/user.ts`)
Add these functions:
```typescript
import type { UserSearchResponse } from '../types/user';

export const searchUsers = async (query: string): Promise<UserSearchResponse[]> => {
  const response = await axiosInstance.get(`/api/users/search`, {
    params: { q: query }
  });
  return response.data;
};
```

### 2. API Client (`frontend/src/api/enrollment.ts`)
Add:
```typescript
import type { DirectEnrollmentRequest } from '../types/enrollment';

export const directEnrollment = async (request: DirectEnrollmentRequest): Promise<EnrollmentResponse> => {
  const response = await axiosInstance.post('/api/enrollments/direct', request);
  return response.data;
};
```

### 3. Types (`frontend/src/types/user.ts`)
Add:
```typescript
export interface UserSearchResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}
```

### 4. Types (`frontend/src/types/enrollment.ts`)
Add:
```typescript
export interface DirectEnrollmentRequest {
  userId: number;
  termId: number;
}
```

### 5. DirectEnrollmentModal Component
Create `frontend/src/components/DirectEnrollmentModal.tsx`:
```typescript
import { useState, useEffect } from 'react';
import { searchUsers } from '../api/user';
import { directEnrollment } from '../api/enrollment';
import { getCourses } from '../api/course';
import { getCourseTerms } from '../api/courseTerm';
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
  const [selectedUser, setSelectedUser] = useState<UserSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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

  // Load courses on mount
  useEffect(() => {
    if (isOpen) {
      loadCourses();
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
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadTerms = async (courseId: number) => {
    try {
      setIsLoadingTerms(true);
      const data = await getCourseTerms(courseId);
      // 진행 중이거나 예정인 차수만
      const availableTerms = data.filter(t => t.status === 'SCHEDULED' || t.status === 'ONGOING');
      setTerms(availableTerms);
    } catch (err) {
      console.error('Failed to load terms:', err);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  const handleSelectUser = (user: UserSearchResponse) => {
    setSelectedUser(user);
    setStep(2);
    setUserQuery('');
    setUserResults([]);
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
    if (!selectedUser || !selectedTerm) return;

    try {
      setIsEnrolling(true);
      setError('');
      await directEnrollment({
        userId: selectedUser.id,
        termId: selectedTerm.id
      });
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || '수강 신청에 실패했습니다.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setUserQuery('');
    setUserResults([]);
    setSelectedUser(null);
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
                1단계: 수강생 선택
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
              {userResults.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {userResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Course Selection */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                2단계: 강의 선택
              </h3>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">선택된 수강생</p>
                <p className="font-medium text-gray-900">
                  {selectedUser?.name} ({selectedUser?.email})
                </p>
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
                  <p className="text-sm text-gray-600">선택된 수강생</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser?.name} ({selectedUser?.email})
                  </p>
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
```

### 6. Integrate into StudentInformationSystemPage
Add to `StudentInformationSystemPage.tsx`:
```typescript
import { DirectEnrollmentModal } from '../../components/DirectEnrollmentModal';

// Add state
const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

// Add button before filters
<div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold text-gray-900">학생 정보 시스템 (SIS)</h1>
  <button
    onClick={() => setIsEnrollModalOpen(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
  >
    + 수강생 등록
  </button>
</div>

// Add modal component
<DirectEnrollmentModal
  isOpen={isEnrollModalOpen}
  onClose={() => setIsEnrollModalOpen(false)}
  onSuccess={() => {
    loadRecords();  // Reload SIS records
    alert('수강 신청이 완료되었습니다.');
  }}
/>
```

---

## ⚠️ Error Codes to Add (if not exist)
Add to `ErrorCode.java`:
```java
ENROLLMENT_ALREADY_EXISTS(400, "이미 해당 차수에 등록된 학생입니다"),
ENROLLMENT_FULL(400, "정원이 초과되었습니다"),
```

---

## 🧪 Testing Checklist
1. [ ] Backend compiles without errors
2. [ ] User search API works: GET /api/users/search?q=test
3. [ ] Direct enrollment API works: POST /api/enrollments/direct
4. [ ] Frontend builds without errors
5. [ ] Modal opens and closes correctly
6. [ ] User search works with debounce
7. [ ] Course and term selection works
8. [ ] Enrollment succeeds and updates SIS table
9. [ ] Error handling works (duplicate enrollment, full capacity)
10. [ ] Authorization works (OPERATOR role required)
