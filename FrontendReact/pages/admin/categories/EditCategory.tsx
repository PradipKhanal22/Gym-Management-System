import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { categoryAPI } from '../../../src/constant/api/categoryAPI';
import { toast } from '../../../components/Toast';
import { FolderOpen, ArrowLeft } from 'lucide-react';

const EditCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    priority: 0,
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setFetching(true);
      const response = await categoryAPI.getById(id!);
      if (response.success) {
        const category = response.data;
        setFormData({
          name: category.name,
          priority: category.priority,
        });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
      navigate('/admin/categories');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'priority' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await categoryAPI.update(id!, formData);
      
      if (response.success) {
        toast.success('Category updated successfully!');
        navigate('/admin/categories');
      } else {
        const errorMessage = response.errors 
          ? Object.values(response.errors).flat().join(', ') 
          : response.message || 'Failed to update category';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-lg font-bold text-slate-600">Loading category...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/categories')}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Edit Category</h1>
                <p className="text-slate-600 mt-1">Update category details</p>
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
              {/* Category Name */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="e.g., Protein Supplements"
                />
              </div>

              {/* Priority */}
              <div className="mb-8">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Priority *
                </label>
                <input
                  type="number"
                  name="priority"
                  required
                  min="0"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="0"
                />
                <p className="text-sm text-slate-500 mt-2">Lower numbers appear first in the list</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Category'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/categories')}
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

export default EditCategory;
