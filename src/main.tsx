
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient } from "convex/react";
import './index.css'
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Toaster } from 'react-hot-toast';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById('root')!).render(


  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <App />
      <div><Toaster /></div>
    </ConvexProviderWithClerk>
  </ClerkProvider>


)
