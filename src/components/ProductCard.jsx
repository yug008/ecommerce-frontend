import { ShoppingCart } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { user, updateCartCount } = useAuth();
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/api/cart/add?productId=${product.id}&quantity=1`);
      const response = await api.get('/api/cart');
      updateCartCount(response.data.items.length);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart!');
    }
  };

  return (
    <div className="group border rounded-xl overflow-hidden bg-white hover:shadow-md transition">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />
        <button
          onClick={addToCart}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400">{product.category}</p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">₹{product.price ?? 'N/A'}</span>
        </div>
        <div className="text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </div>
    </div>
  );
}