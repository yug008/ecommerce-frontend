import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Navbar({ onSearch }) {
  const { user, logout, cartCount, updateCartCount, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/api/cart');
      updateCartCount(response.data.items.length);
    } catch (error) {
      updateCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">

        {/* Logo */}
        <div
          className="text-xl font-semibold cursor-pointer"
          onClick={() => navigate('/')}
        >
          ShopEase
        </div>

        {/* Search */}
        <div className="flex-1 hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent outline-none ml-2 w-full text-sm"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* User or Login */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hi, {user.name}!</span>

              {/* Admin link — only for admins */}
              {isAdmin() && (
                <div
                  className="cursor-pointer text-sm font-medium text-blue-600"
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </div>
              )}

              <div
                className="cursor-pointer"
                onClick={() => navigate('/orders')}
              >
                <User size={22} />
              </div>
              <div className="cursor-pointer" onClick={handleLogout}>
                <LogOut size={22} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="text-sm font-medium cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="text-sm font-medium bg-black text-white px-3 py-1.5 rounded-lg cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none ml-2 w-full text-sm"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}