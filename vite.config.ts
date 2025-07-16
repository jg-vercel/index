import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateXmlContent, setXmlHeaders } from './src/utils/xmlGenerator.js'

// 개발환경용 XML 응답 플러그인 (배포환경과 동일한 로직 사용)
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
          
          // API와 동일한 XML 생성 로직 사용
          const xmlContent = generateXmlContent(name)
          setXmlHeaders(res)
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
