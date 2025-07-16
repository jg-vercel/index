import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// XML 응답을 위한 커스텀 플러그인
function xmlResponsePlugin() {
  return {
    name: 'xml-response',
    configureServer(server: any) {
      server.middlewares.use('/', (req: any, res: any, next: any) => {
        const url = req.url || ''
        
        // /{name}.xml 패턴 매칭
        const xmlMatch = url.match(/^\/([^\/]+)\.xml$/)
        
        if (xmlMatch) {
          const name = xmlMatch[1]
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<config>
  ${name}
</config>`
          
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(xmlContent)
          return
        }
        
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), xmlResponsePlugin()],
})
