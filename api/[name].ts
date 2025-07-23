import type { VercelRequest, VercelResponse } from '@vercel/node'

// 공통 XML 생성 함수 (Vercel 환경에서는 직접 포함)
function generateXmlContent(name: string): string {
  let timestamp: string
  try {
    timestamp = new Date().toISOString()
  } catch (error) {
    console.error('Date error:', error)
    timestamp = '2024-01-01T00:00:00.000Z'
  }
  
  // XML에서 특수 문자 이스케이프
  const escapedName = name.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return char
    }
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <n>${escapedName}</n>
  <timestamp>${timestamp}</timestamp>
  <status>active</status>
</config>`
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Request query:', req.query)
    console.log('Request URL:', req.url)
    
    const { name } = req.query
    
    console.log('Extracted name:', name, 'Type:', typeof name)
    
    if (!name || typeof name !== 'string') {
      console.log('Invalid name parameter')
      return res.status(400).json({ error: 'Name parameter is required' })
    }
    
    const xmlContent = generateXmlContent(name)
    
    console.log('Generated XML length:', xmlContent.length)
    
    // 안전한 헤더 설정
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Content-Length', Buffer.byteLength(xmlContent, 'utf8'))
    
    // 안전한 응답 전송
    res.status(200)
    res.end(xmlContent)
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error })
  }
} 