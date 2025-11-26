export interface StudentInformationSystem {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;
  enrollmentId: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  termNumber: number;
  enrollmentStatus: 'ENROLLED' | 'CANCELLED' | 'COMPLETED';
  enrollmentCreatedAt: string;
  progressPercentage: number;
}

export interface StudentInformationSystemQuery {
  userKey?: number;
  timeKey?: number;
}
