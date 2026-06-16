import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { serviceAPI } from '../src/constant/api/serviceAPI';

const ViewService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherServices, setOtherServices] = useState([]);
  const [loadingOthers, setLoadingOthers] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await serviceAPI.getById(id);
        if (response.success) {
          setService(response.data);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  useEffect(() => {
    const fetchOtherServices = async () => {
      setLoadingOthers(true);
      try {
        const response = await serviceAPI.getAll();
        if (response.success) {
          const filtered = response.data.filter((s) => s.id.toString() !== id).slice(0, 3);
          setOtherServices(filtered);
        }
      } catch (error) {
        console.error('Error fetching other services:', error);
      } finally {
        setLoadingOthers(false);
      }
    };

    if (id) {
      fetchOtherServices();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="relative h-[60vh] mt-20 flex items-center justify-center overflow-hidden bg-slate-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="animate-pulse bg-slate-200 h-96 rounded-3xl"></div>
              <div className="animate-pulse bg-slate-200 h-10 w-3/4 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="animate-pulse bg-slate-200 h-8 w-40 rounded mb-6"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="bg-slate-200 w-20 h-20 rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-slate-200 h-3 w-full rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <div className="relative h-[60vh] mt-20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80" 
              alt="Services Background" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-primary/30 to-slate-900/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase text-white mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
              Service Not Found
            </h1>
            <p className="text-xl text-white font-medium mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
              The service you're looking for doesn't exist.
            </p>
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors">
              Back to Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  const serviceImage = service.photo_path 
    ? `http://localhost:8000/storage/${service.photo_path}` 
    : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop';

  return (
    <>
      {/* Hero Section - Same as Services Page */}
      <div className="relative h-[60vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80" 
            alt="Services Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-primary/30 to-slate-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            {service.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Comprehensive fitness solutions designed to elevate your performance.
          </motion.p>
        </div>
      </div>

      {/* Service Detail */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <img
                src={serviceImage}
                alt={service.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-8">
              {service.name}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mt-4">
              {service.description || 'No description available for this service.'}
            </p>
          </motion.div>

          {/* More Services Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900">More Services</h3>
              </div>

              <div className="space-y-4">
                {loadingOthers ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="bg-slate-200 w-20 h-20 rounded-xl shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                        <div className="bg-slate-200 h-3 w-full rounded"></div>
                        <div className="bg-slate-200 h-3 w-5/6 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : otherServices.length > 0 ? (
                  otherServices.map((s) => (
                    <Link 
                      key={s.id} 
                      to={`/service/${s.id}`}
                      className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={s.photo_path ? `http://localhost:8000/storage/${s.photo_path}` : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=160&h=160&fit=crop'}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                          {s.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {s.description || 'No description available.'}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No other services available.</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link 
                  to="/services"
                  className="flex items-center justify-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                >
                  View All Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ViewService;
