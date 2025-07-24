import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { NotionApiResponse, NotionApiError } from '../type/response/notionApiType';

// API 엔드포인트 (Vercel API Routes 사용)
const API_BASE_URL = '/api';

// Notion 페이지 목록을 가져오는 함수 (백엔드 API 통해서)
const fetchNotionPages = async (): Promise<NotionApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/notion`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API 호출 실패: ${response.status}`);
  }

  const data: NotionApiResponse = await response.json();
  return data;
};

// React Query Hook - 백엔드 API를 통해 Notion 데이터 가져오기
export const useNotionPages = (
  options?: UseQueryOptions<NotionApiResponse, Error>
) => {
  return useQuery({
    queryKey: ['notionPages'],
    queryFn: fetchNotionPages,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 후 가비지 컬렉션
    ...options,
  });
};

// 특정 페이지의 상세 정보를 가져오는 함수
const fetchNotionPage = async (pageId: string) => {
  const response = await fetch(`${API_BASE_URL}/notion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `페이지 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 특정 페이지 조회용 React Query Hook
export const useNotionPage = (
  pageId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['notionPage', pageId],
    queryFn: () => fetchNotionPage(pageId),
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 유틸리티 함수들
export const extractPlainText = (richTextArray: any[]): string => {
  return richTextArray?.map(item => item.plain_text).join('') || '';
};

export const formatNotionDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR');
}; 