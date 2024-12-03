import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const env = import.meta.env.VITE_NODE_ENV;

// replace console.* for disable log on production
if (env === "production") {
  console.log = () => { };
  console.error = () => { };
  console.debug = () => { };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
