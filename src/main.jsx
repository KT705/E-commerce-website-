import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "aos/dist/aos.css";
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/E-commerce-website-">
      <CartProvider>
        <App />
      </CartProvider>  
    </BrowserRouter> 
  </StrictMode>,
)
