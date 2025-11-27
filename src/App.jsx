import './App.css'
import Home from './Pages/Home';
import ProductList from './Pages/ProductList.jsx';
import Cart from './Pages/cart';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import { CartProvider } from './context/CartContex.jsx';
import Auth from './Pages/Auth.jsx';
import Checkout from './Pages/Checkout.jsx';
import OrderConfirmation from './Pages/OrderConfirmation.jsx';
import { useAuthStatus } from './hooks/useAuthStatus.js';
import ProfilePage from './Pages/ProfilePage.jsx';
import OrderHistory from './Pages/OrderHistory.jsx';

function App() {

  const { currentUser, loading } = useAuthStatus();

  if(loading){
    return(
      <div className='flex justify-center items-center min-h-screen text-lg text-blue-700'>
        Authenticating user...
      </div>
    );
  }
  return (
    <CartProvider>
      
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/products" element={<ProductList/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/confirmation" element={<OrderConfirmation/>}/>
            <Route path="/auth" element={<Auth/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/history" element={<OrderHistory/>}/>
          </Routes>
        </main>
      
    </CartProvider>  
  );
}

export default App
