import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext.tsx'
import { TreeLayoutProvider } from './context/TreeLayoutContext.tsx'
import { DialogProvider } from './context/DialogContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <TreeLayoutProvider>
          <DialogProvider>
            <App />
          </DialogProvider>
        </TreeLayoutProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
