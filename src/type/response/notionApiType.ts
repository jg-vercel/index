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