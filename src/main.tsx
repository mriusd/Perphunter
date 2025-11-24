import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Web3Provider } from './components/Web3Provider.tsx'
import './styles/globals.css'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
)