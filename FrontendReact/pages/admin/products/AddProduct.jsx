import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { productAPI } from '../../../src/constant/api/productAPI';
import { categoryAPI } from '../../../src/constant/api/categoryAPI';
import { toast } from '../../../components/Toast';
import { Package, Upload, ArrowLeft } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation check
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    setLoading(true);

    try {
      const data = new FormData();
      data.append('category_id', formData.category_id);
      data.append('name', formData.name);
      data.append('description', formData.description || '');
      data.append('price', formData.price);
      if (photo) {
        console.log('Photo file details:', {
          name: photo.name,
          type: photo.type,
          size: photo.size
        });
        data.append('photo', photo);
      }

      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await productAPI.create(data);
      console.log('API Response:', response);
      
      if (response.success) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      } else {
        // Show detailed validation errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(', ');
          toast.error(errorMessages);
        } else {
          toast.error(response.message || 'Failed to create product');
        }
        console.error('API Error Response:', response);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(`Error: ${error.message || 'Failed to create product'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Add Product</h1>
                <p className="text-slate-600 mt-1">Create a new gym product</p>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              {/* Product Name */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="e.g., Protein Powder"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="0.00"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all resize-none"
                  placeholder="Describe the product..."
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Product Photo
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  {photoPreview ? (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview('');
                        }}
                        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-slate-400 mb-3" />
                        <p className="mb-2 text-sm font-bold text-slate-700">
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, JPEG or GIF (MAX. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
