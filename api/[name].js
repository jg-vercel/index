// 공통 XML 생성 함수
function generateXmlContent(name) {
  const timestamp = new Date().toISOString();
  
  // XML에서 특수 문자 이스케이프
  const escapedName = String(name).replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return char;
    }
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <n>${escapedName}</n>
  <timestamp>${timestamp}</timestamp>
  <status>active</status>
</config>`;
}

export default function handler(req, res) {
  try {
    console.log('Request query:', req.query);
    console.log('Request URL:', req.url);
    
    const { name } = req.query;
    
    console.log('Extracted name:', name, 'Type:', typeof name);
    
    if (!name || typeof name !== 'string') {
      console.log('Invalid name parameter');
      res.status(400);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Name parameter is required' }));
      return;
    }
    
    const xmlContent = generateXmlContent(name);
    
    console.log('Generated XML length:', xmlContent.length);
    
    // 헤더 설정
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // 응답 전송
    res.status(200);
    res.end(xmlContent);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
  }
} 