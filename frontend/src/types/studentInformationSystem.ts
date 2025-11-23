export interface StudentInformationSystem {
  id: number;
  userKey: number;
  timeKey: number;
  timestamp: string;
  enrollmentId: number;
}

export interface StudentInformationSystemQuery {
  userKey?: number;
  timeKey?: number;
}
