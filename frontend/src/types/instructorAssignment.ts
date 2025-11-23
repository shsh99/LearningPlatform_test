export interface InstructorAssignment {
  id: number;
  termId: number;
  termNumber: number;
  courseTitle: string;
  instructorId: number;
  instructorName: string;
  assignedById: number;
  assignedByName: string;
  status: 'ASSIGNED' | 'CANCELLED';
  createdAt: string;
}

export interface AssignInstructorRequest {
  termId: number;
  instructorId: number;
  assignedById: number;
}
