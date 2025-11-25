export interface InstructorAssignmentInfo {
  assignmentId: number;
  termId: number;
  termNumber: number;
  courseTitle: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  termStatus: string;
  assignmentStatus: string;
}

export interface EnrollmentInfo {
  enrollmentId: number;
  termId: number;
  termNumber: number;
  courseTitle: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  termStatus: string;
  enrollmentStatus: string;
  enrolledAt: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  instructorAssignments: InstructorAssignmentInfo[];
  enrollments: EnrollmentInfo[];
}

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
