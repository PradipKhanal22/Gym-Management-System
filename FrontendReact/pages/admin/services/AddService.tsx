import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { serviceAPI } from '../../../src/constant/api/serviceAPI';
import { toast } from '../../../components/Toast';
import { Dumbbell, Upload, ArrowLeft } from 'lucide-react';

const AddService: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (photo) {
        data.append('photo', photo);
      }

      const response = await serviceAPI.create(data);
      
      if (response.success) {
        toast.success('Service created successfully!');
        navigate('/admin/services');
      } else {
        // Show detailed validation errors
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(', ');
          toast.error(errorMessages);
        } else {
          toast.error(response.message || 'Failed to create service');
        }
        console.error('API Response:', response);
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service. Check console for details.');
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
                onClick={() => navigate('/admin/services')}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Add Service</h1>
                <p className="text-slate-600 mt-1">Create a new gym service</p>
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
              {/* Service Name */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="e.g., Personal Training"
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
                  placeholder="Describe the service..."
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Service Photo
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
                        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="mb-2 text-sm font-bold text-slate-700">
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/services')}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Service'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
