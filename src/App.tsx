import './App.css'
import {DefaultGrid} from "./components/Landing/DefaultGrid.tsx";

function App() {
  return (
    <div className="h-screen w-screen bg-white relative overflow-hidden">
      {/* 2x2 그리드로 전체 화면 분할 */}
      <div className="h-full w-full grid grid-cols-2 grid-rows-2">
        <DefaultGrid/>
        <DefaultGrid/>
        <DefaultGrid/>
        <DefaultGrid/>
      </div>

      {/* 중앙 개인정보 - 원형 디자인 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-60 h-60 bg-white rounded-full shadow-2xl border-4 border-gray-300 flex flex-col items-center justify-center">
          {/* 프로필 이미지 */}
          <div className="w-32 h-32 rounded-full mb-4 flex items-center justify-center">
            <span className="text-4xl">👨‍💻</span>
          </div>
          
          {/* 하단 아이콘들 */}
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="text-white text-sm">G</span>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="text-white text-sm">L</span>
            </a>
            <a href="#" className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="text-white text-sm">@</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
