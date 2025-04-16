import './App.css'
import Banner from './components/layout/Banner'
import LeftPanel from './components/layout/LeftPanel'
import RightPanel from './components/layout/RightPanel'

function App() {
  return (
    <div className="app-container">
      <Banner />
      <div className="content-container">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  )
}

export default App
