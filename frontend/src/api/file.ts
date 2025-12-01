import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const SERVER_BASE_URL = 'http://localhost:8080';

const fileApi = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터: 토큰 추가
fileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FileUploadResponse {
  url: string;
  message: string;
}

/**
 * 로고 이미지 업로드
 */
export const uploadLogo = async (file: File, tenantId: number): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenantId', tenantId.toString());

  const response = await fileApi.post<FileUploadResponse>('/files/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 파비콘 이미지 업로드
 */
export const uploadFavicon = async (file: File, tenantId: number): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenantId', tenantId.toString());

  const response = await fileApi.post<FileUploadResponse>('/files/favicon', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 폰트 파일 업로드
 */
export const uploadFont = async (file: File, tenantId: number): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenantId', tenantId.toString());

  const response = await fileApi.post<FileUploadResponse>('/files/font', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 파일 삭제
 */
export const deleteFile = async (fileUrl: string): Promise<{ message: string }> => {
  const response = await fileApi.delete<{ message: string }>('/files', {
    params: { url: fileUrl },
  });
  return response.data;
};

/**
 * 파일 URL을 전체 URL로 변환
 * 서버에서 반환하는 URL은 /api/files/... 형식이므로 서버 베이스 URL만 추가
 */
export const getFullFileUrl = (fileUrl: string | null | undefined): string | null => {
  if (!fileUrl) return null;

  // 이미 전체 URL인 경우
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // 상대 경로인 경우 서버 베이스 URL 추가 (/api/files/... -> http://localhost:8080/api/files/...)
  return `${SERVER_BASE_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
};
