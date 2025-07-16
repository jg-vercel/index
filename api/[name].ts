import type { VercelRequest, VercelResponse } from '@vercel/node'

// 공통 XML 생성 함수 (Vercel 환경에서는 직접 포함)
function generateXmlContent(name: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <n>${name}</n>
  <timestamp>${new Date().toISOString()}</timestamp>
  <status>active</status>
</config>`
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required' })
  }
  
  const xmlContent = generateXmlContent(name)
  
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200).send(xmlContent)
} 