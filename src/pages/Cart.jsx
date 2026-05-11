import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart!');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await api.delete(`/api/cart/remove?id=${cartItemId}`);
      setCart(response.data);
      toast.success('Item removed!');
    } catch (error) {
      toast.error('Failed to remove item!');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/api/cart/clear');
      fetchCart();
      toast.success('Cart cleared!');
    } catch (error) {
      toast.error('Failed to clear cart!');
    }
  };

  const placeOrder = async () => {
    if (!address) {
      toast.error('Please enter delivery address!');
      return;
    }
    try {
      // Step 1 — Place order
      const orderResponse = await api.post('/api/orders/place', { address });
      const orderId = orderResponse.data.orderId;

      // Step 2 — Create Razorpay order
      const paymentResponse = await api.post(`/api/payment/create/${orderId}`);
      const { razorpayOrderId, keyId } = paymentResponse.data;

      // Step 3 — Open Razorpay checkout
      const options = {
        key: keyId,
        amount: cart.totalPrice * 100,
        currency: 'INR',
        name: 'ShopEase',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Step 4 — Verify payment
          try {
            await api.post(`/api/payment/verify?razorpayOrderId=${response.razorpay_order_id}&razorpayPaymentId=${response.razorpay_payment_id}&razorpaySignature=${response.razorpay_signature}`);
            toast.success('Payment successful!');
            navigate('/orders');
          } catch (error) {
            toast.error('Payment verification failed!');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#000000' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error('Failed to place order!');
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <p className="text-center mt-20 text-gray-500">Loading cart...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            {cart?.items?.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart?.items?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Your cart is empty!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart?.items?.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-center gap-4 bg-white p-4 rounded-xl border"
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.productName}</h3>
                  <p className="text-gray-500 text-sm mt-1">₹{item.price}</p>
                  <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium mt-1">
                    Subtotal: ₹{item.subtotal}
                  </p>
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border h-fit sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{cart?.totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{cart?.totalPrice}</span>
          </div>

          {/* Address Input */}
          {showAddressInput && (
            <textarea
              placeholder="Enter delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-4 p-3 border rounded-lg text-sm resize-none"
              rows={3}
            />
          )}

          <button
            className="w-full mt-5 bg-black text-white py-3 rounded-lg"
            onClick={() => {
              if (!showAddressInput) {
                setShowAddressInput(true);
              } else {
                placeOrder();
              }
            }}
          >
            {showAddressInput ? 'Pay Now' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}