export interface InstructorInformationSystem {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;
  assignmentId: number;
}

/**
 * Enhanced IIS with detailed information (similar to SIS)
 */
export interface InstructorInformationSystemDetail {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;

  // Assignment info
  assignmentId: number;
  assignmentStatus: 'ASSIGNED' | 'CANCELLED';
  assignedAt: string;

  // Instructor info
  instructorId: number;
  instructorName: string;
  instructorEmail: string; // Masked

  // AssignedBy info
  assignedById: number;
  assignedByName: string;

  // CourseTerm info
  termId: number;
  termNumber: number;
  courseTitle: string;
  courseId: number;
}

export interface InstructorInformationSystemQuery {
  userKey?: number;
  timeKey?: number;
}
