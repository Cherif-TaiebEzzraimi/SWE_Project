import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <AppRouter />
      </div>
    </Router>
  )
}

export default App
