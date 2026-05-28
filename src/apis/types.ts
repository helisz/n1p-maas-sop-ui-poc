// [AI_START TIMESTAMP=2025-06-20 10:00:00]

// ==================== 通用分頁 ====================

export interface PageResult<T> {
  total: number;
  size: number;
  current: number;
  pages: number;
  records: T[];
}

// ==================== 認證相關 ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  [key: string]: unknown;
}

// ==================== 賬號相關 ====================

export interface AccountDTO {
  accountId: number;
  username: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  enterpriseId: number;
  parentId: number;
}

export interface UpdateAccountRequest {
  username?: string;
  email?: string;
  phone?: string;
}

export interface AccountListItemDTO {
  accountId: number;
  username: string;
  email: string;
  enterpriseName: string;
  type: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

export interface ListAccountRequest {
  keyword?: string;
  page?: number;
  size?: number;
}

// ==================== 企業相關 ====================

export interface EnterpriseDTO {
  enterpriseId: number;
  name: string;
  industry: string;
  address: string;
  creditCode: string;
  status: string;
  ownerId: number;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  certificationStatus: string;
  certificationTime: string;
}

export interface ListEnterpriseRequest {
  keyword?: string;
  name?: string;
  creditCode?: string;
  status?: string;
  contactName?: string;
  contactPhone?: string;
  certificationStatus?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  certificationTimeStart?: string;
  certificationTimeEnd?: string;
  page?: number;
  size?: number;
}

// ==================== 認證審批 ====================

export interface ApproveCertificationRequest {
  status: string;
  remark?: string;
}

// ==================== 轉移所有者 ====================

export interface TransferOwnerRequest {
  newOwnerId: number;
}

// [AI_END LINES=107 TIMESTAMP=2025-06-20 10:00:00]
