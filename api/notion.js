export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 환경변수에서 API 설정 가져오기
    const NOTION_API_KEY = process.env.VITE_NOTION_API_KEY;
    const NOTION_DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;
    const NOTION_API_BASE_URL = process.env.VITE_NOTION_API_BASE_URL || 'https://api.notion.com/v1';

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      return res.status(400).json({ 
        error: 'Notion API 설정이 누락되었습니다.' 
      });
    }

    const { method } = req;

    // GET 요청: 데이터베이스 쿼리
    if (method === 'GET') {
      const response = await fetch(`${NOTION_API_BASE_URL}/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          // 쿼리 옵션이 있다면 req.query에서 가져와서 사용
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.message || `Notion API 호출 실패: ${response.status}`
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // POST 요청: 특정 페이지 조회
    if (method === 'POST') {
      const { pageId } = req.body;

      if (!pageId) {
        return res.status(400).json({ error: 'pageId가 필요합니다.' });
      }

      const response = await fetch(`${NOTION_API_BASE_URL}/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          error: errorData.message || `페이지 조회 실패: ${response.status}`
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    }

    // 지원하지 않는 메서드
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error('Notion API 에러:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
} 