import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { trainerAPI } from '../../../src/constant/api/trainerAPI';
import { toast } from '../../../components/Toast';
import { Users, Upload, ArrowLeft } from 'lucide-react';

const EditTrainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    description: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [existingPhotoPath, setExistingPhotoPath] = useState('');

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      setFetching(true);
      const response = await trainerAPI.getById(id);
      if (response.success) {
        const trainer = response.data;
        setFormData({
          name: trainer.name,
          specialty: trainer.specialty || '',
          description: trainer.description || '',
        });
        if (trainer.photo_path) {
          setExistingPhotoPath(trainer.photo_path);
          setPhotoPreview(`http://localhost:8000/storage/${trainer.photo_path}`);
        }
      }
    } catch (error) {
      console.error('Error fetching trainer:', error);
      toast.error('Failed to load trainer');
      navigate('/admin/trainers');
    } finally {
      setFetching(false);
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
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('specialty', formData.specialty);
      data.append('description', formData.description);
      data.append('_method', 'PUT'); // Laravel method spoofing
      if (photo) {
        data.append('photo', photo);
      }

      const response = await trainerAPI.update(id, data);
      
      if (response.success) {
        toast.success('Trainer updated successfully!');
        navigate('/admin/trainers');
      } else {
        const errorMessage = response.errors 
          ? Object.values(response.errors).flat().join(', ') 
          : response.message || 'Failed to update trainer';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating trainer:', error);
      toast.error('Failed to update trainer');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-lg font-bold text-slate-600">Loading trainer...</div>
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
                onClick={() => navigate('/admin/trainers')}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Edit Trainer</h1>
                <p className="text-slate-600 mt-1">Update trainer details</p>
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
              {/* Trainer Name */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Trainer Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Specialty
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                  placeholder="e.g., Strength Training, Yoga"
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
                  placeholder="Describe the trainer's expertise and experience..."
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Trainer Photo
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
                  {loading ? 'Updating...' : 'Update Trainer'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/trainers')}
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

export default EditTrainer;
