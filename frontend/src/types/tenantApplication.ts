export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateTenantApplicationRequest {
  companyName: string;
  companyCode: string;
  adminName: string;
  adminEmail: string;
  phoneNumber?: string;
  businessNumber?: string;
  description?: string;
}

export interface TenantApplicationResponse {
  id: number;
  companyName: string;
  companyCode: string;
  adminName: string;
  adminEmail: string;
  phoneNumber: string | null;
  businessNumber: string | null;
  description: string | null;
  status: ApplicationStatus;
  rejectionReason: string | null;
  processedAt: string | null;
  processedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveApplicationRequest {
  initialPassword: string;
}

export interface RejectApplicationRequest {
  rejectionReason: string;
}
