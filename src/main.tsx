import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import './index.css'
import App from './App.tsx'
import { initializeAuth } from './auth/getAccessToken'

ModuleRegistry.registerModules([AllCommunityModule])

// Sign the user in (via redirect) before rendering. If they aren't signed in,
// initializeAuth navigates the tab to Microsoft and the app renders only once
// they return authenticated.
initializeAuth().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
