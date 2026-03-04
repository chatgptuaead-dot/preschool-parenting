import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', background: '#1C1C2E', color: '#fff' }
      }} />
    </AppProvider>
  </React.StrictMode>,
)
