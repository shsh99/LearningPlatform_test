export interface InstructorInformationSystem {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;
  assignmentId: number;
}

export interface InstructorInformationSystemQuery {
  userKey?: number;
  timeKey?: number;
}
