import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return 'bg-green-100 text-green-600';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <p className="text-center mt-20 text-gray-500">Loading orders...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No orders yet!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white border rounded-xl p-5">

                {/* Top */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: #{order.orderId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      📍 {order.address}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                        <p className="text-sm font-medium">
                          Subtotal: ₹{item.subtotal}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom */}
                <div className="flex justify-between items-center mt-5">
                  <p className="font-semibold">Total: ₹{order.totalAmount}</p>
                  <div className="flex gap-3">
                    {order.razorpayOrderId && (
                      <p className="text-xs text-gray-400">
                        Payment ID: {order.razorpayOrderId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}