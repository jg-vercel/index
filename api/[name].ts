import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateXmlContent, setXmlHeaders } from '../src/utils/xmlGenerator.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required' })
  }
  
  // 공통 함수 사용
  const xmlContent = generateXmlContent(name)
  setXmlHeaders(res)
  res.status(200).send(xmlContent)
} 