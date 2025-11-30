export interface UserSearchResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface CreateTenantAdminRequest {
  tenantId: number;
  email: string;
  password: string;
  name: string;
}

export interface CreateOperatorRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenantId: number;
}
