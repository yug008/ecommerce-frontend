import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
  { name: "Home", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
]

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (name) => {
    if (name === '') {
      fetchProducts();
      return;
    }
    try {
      const response = await api.get(`/api/products/search?name=${name}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed');
    }
  };

  const handleCategory = async (category) => {
    try {
      const response = await api.get(`/api/products/category?category=${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Category filter failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <Navbar onSearch={handleSearch} />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Discover Latest Products
            </h1>
            <p className="text-gray-600 mt-4">
              Find the best deals on trending items.
            </p>
            <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg">
              Shop Now
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
            className="rounded-xl w-full object-cover h-80"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategory(cat.name)}
              className="bg-white p-4 rounded-xl text-center cursor-pointer hover:shadow-md transition"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-16 object-cover rounded-lg mb-3"
              />
              <p className="text-sm font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Featured Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-black text-white rounded-xl p-8 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold">Big Sale 50% OFF</h3>
            <p className="text-gray-300 mt-2">Limited time offer</p>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}