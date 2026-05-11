import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    if (image) data.append('image', image);

    try {
      if (editProduct) {
        await api.put(`/api/products/${editProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated!');
      } else {
        await api.post('/api/products/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added!');
      }
      setShowForm(false);
      setEditProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      setImage(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product!');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product!');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <button
            onClick={() => { setShowForm(!showForm); setEditProduct(null); }}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl border mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border rounded-lg p-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border rounded-lg p-2 text-sm resize-none"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="border rounded-lg p-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg"
                >
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-500">{product.category}</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-500 border border-blue-500 px-3 py-1 rounded-lg text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 border border-red-500 px-3 py-1 rounded-lg text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}