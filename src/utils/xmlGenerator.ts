export function generateXmlContent(name: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <n>${name}</n>
  <timestamp>${new Date().toISOString()}</timestamp>
  <status>active</status>
</config>`
}

export function setXmlHeaders(res: any) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
} 