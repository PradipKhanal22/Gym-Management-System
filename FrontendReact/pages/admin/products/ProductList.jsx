import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { productAPI } from '../../../src/constant/api/productAPI';
import { toast } from '../../../components/Toast';
import DeleteModal from '../../../components/DeleteModal';
import { Package, Edit, Trash2, Plus } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: 0, name: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: 0, name: '' });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await productAPI.delete(deleteModal.id);
      if (response.success) {
        toast.success('Product deleted successfully!');
        fetchProducts();
        closeDeleteModal();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Products</h1>
                  <p className="text-slate-600 mt-1">Manage gym products</p>
                </div>
              </div>
              <Link
                to="/admin/products/add"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg font-bold text-slate-600">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-bold text-slate-900 mb-2">No products found</p>
              <p className="text-slate-600 mb-6">Start by adding your first product</p>
              <Link
                to="/admin/products/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Photo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-black text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                            {product.photo_path ? (
                              <img
                                src={`http://localhost:8000/storage/${product.photo_path}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-slate-300" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base font-black text-slate-900">{product.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                            {product.category ? product.category.name : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base font-black text-slate-900">${parseFloat(product.price).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {product.description || 'No description available'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => openDeleteModal(product.id, product.name)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={deleteModal.name}
        loading={deleting}
      />
    </div>
  );
};

export default ProductList;
