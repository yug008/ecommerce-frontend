import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App