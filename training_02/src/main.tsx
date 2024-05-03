// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext.tsx'
import { TreeLayoutProvider } from './context/TreeLayoutContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
    <SearchProvider>
      <TreeLayoutProvider>
        <App />
      </TreeLayoutProvider>
    </SearchProvider>
    </BrowserRouter>,
  // </React.StrictMode>,
)
