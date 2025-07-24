// Notion API 응답 데이터 타입 정의

// 기본 사용자 정보
export interface NotionUser {
  object: "user";
  id: string;
}

// 텍스트 내용
export interface TextContent {
  content: string;
  link: string | null;
}

// 텍스트 스타일 어노테이션
export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

// 리치 텍스트 객체
export interface RichText {
  type: "text";
  text: TextContent;
  annotations: Annotations;
  plain_text: string;
  href: string | null;
}

// 날짜 객체
export interface DateObject {
  start: string;
  end: string | null;
  time_zone: string | null;
}

// 날짜 속성
export interface DateProperty {
  id: string;
  type: "date";
  date: DateObject;
}

// 리치 텍스트 속성
export interface RichTextProperty {
  id: string;
  type: "rich_text";
  rich_text: RichText[];
}

// 타이틀 속성
export interface TitleProperty {
  id: string;
  type: "title";
  title: RichText[];
}

// 페이지 속성들
export interface PageProperties {
  created_at: DateProperty;
  description: RichTextProperty;
  name: TitleProperty;
}

// 페이지 부모 정보
export interface PageParent {
  type: "database_id";
  database_id: string;
}

// Notion 페이지 객체
export interface NotionPage {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: null; // 현재 예시에서는 null, 필요시 확장 가능
  icon: null; // 현재 예시에서는 null, 필요시 확장 가능
  parent: PageParent;
  archived: boolean;
  in_trash: boolean;
  properties: PageProperties;
  url: string;
  public_url: string | null;
}

// Notion API 응답 데이터
export interface NotionApiResponse {
  object: "list";
  results: NotionPage[];
  next_cursor: string | null;
  has_more: boolean;
  type: "page_or_database";
  page_or_database: Record<string, any>;
  request_id: string;
}

// API 에러 응답 타입
export interface NotionApiError {
  object: "error";
  status: number;
  code: string;
  message: string;
  request_id: string;
}

이제 React Query를 사용해서 Notion API를 호출하는 파일을 생성하겠습니다:

```typescript:src/reactQuery/NotionAPI.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { NotionApiResponse, NotionApiError } from '@/type/response/notionApiType';

// Notion API 호출을 위한 기본 설정
const NOTION_API_BASE_URL = 'https://api.notion.com/v1';

// API 키와 데이터베이스 ID는 환경변수에서 가져오거나 props로 전달받아야 합니다
interface NotionApiConfig {
  apiKey: string;
  databaseId: string;
}

// Notion 페이지 목록을 가져오는 함수
const fetchNotionPages = async (config: NotionApiConfig): Promise<NotionApiResponse> => {
  const { apiKey, databaseId } = config;
  
  const response = await fetch(`${NOTION_API_BASE_URL}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      // 필요에 따라 필터링, 정렬 등의 옵션을 추가할 수 있습니다
    }),
  });

  if (!response.ok) {
    const errorData: NotionApiError = await response.json();
    throw new Error(errorData.message || `API 호출 실패: ${response.status}`);
  }

  const data: NotionApiResponse = await response.json();
  return data;
};

// React Query Hook
export const useNotionPages = (
  config: NotionApiConfig,
  options?: UseQueryOptions<NotionApiResponse, Error>
) => {
  return useQuery({
    queryKey: ['notionPages', config.databaseId],
    queryFn: () => fetchNotionPages(config),
    enabled: !!(config.apiKey && config.databaseId), // API 키와 데이터베이스 ID가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 후 가비지 컬렉션
    ...options,
  });
};

// 특정 페이지의 상세 정보를 가져오는 함수 (필요시 사용)
const fetchNotionPage = async (pageId: string, apiKey: string) => {
  const response = await fetch(`${NOTION_API_BASE_URL}/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!response.ok) {
    const errorData: NotionApiError = await response.json();
    throw new Error(errorData.message || `페이지 조회 실패: ${response.status}`);
  }

  return response.json();
};

// 특정 페이지 조회용 React Query Hook
export const useNotionPage = (
  pageId: string,
  apiKey: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['notionPage', pageId],
    queryFn: () => fetchNotionPage(pageId, apiKey),
    enabled: !!(pageId && apiKey),
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
```

구현이 완료되었습니다! 

## 주요 특징:

1. **완전한 타입 정의**: 제공해주신 JSON 구조를 기반으로 모든 필드에 대한 TypeScript 타입을 정의했습니다.

2. **React Query 구현**: 
   - `useNotionPages`: 데이터베이스의 페이지 목록을 가져오는 훅
   - `useNotionPage`: 특정 페이지의 상세 정보를 가져오는 훅 (추가 기능)

3. **에러 처리**: API 에러 응답에 대한 타입과 에러 처리 로직 포함

4. **캐싱 전략**: 5분간 stale time, 10분간 garbage collection time 설정

5. **유틸리티 함수**: 
   - `extractPlainText`: 리치 텍스트에서 순수 텍스트 추출
   - `formatNotionDate`: 날짜 포맷팅

## 사용 예시:

```typescript
// 컴포넌트에서 사용
const MyComponent = () => {
  const { data, isLoading, error } = useNotionPages({
    apiKey: 'your-notion-api-key',
    databaseId: 'your-database-id'
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  
  return (
    <div>
      {data?.results.map(page => (
        <div key={page.id}>
          <h3>{extractPlainText(page.properties.name.title)}</h3>
          <p>{extractPlainText(page.properties.description.rich_text)}</p>
        </div>
      ))}
    </div>
  );
};
```

환경변수에 Notion API 키와 데이터베이스 ID를 설정하시면 바로 사용하실 수 있습니다!
