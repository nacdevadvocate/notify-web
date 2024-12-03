import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Notify from './components/Notify';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:userId" element={<Notify />} />
        <Route path="/" element={<Notify />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  )
}

export default App

