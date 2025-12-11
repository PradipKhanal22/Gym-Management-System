import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { Dumbbell, HeartPulse, Trophy, Users, Bike, BrainCircuit, Wifi, Coffee, Car, Lock, ShowerHead, Music, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../src/constant/api/serviceAPI';

const amenities = [
  { icon: <Wifi />, name: "Free High-Speed WiFi" },
  { icon: <Car />, name: "Free Member Parking" },
  { icon: <ShowerHead />, name: "Luxury Showers" },
  { icon: <Lock />, name: "Digital Lockers" },
  { icon: <Coffee />, name: "Juice & Smoothie Bar" },
  { icon: <Music />, name: "Curated Playlists" },
];

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
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
            Our Services
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
      
      {/* Training Programs */}
      <Section className="bg-white py-16">
        <div className="text-center mb-12 max-w-7xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             <div className="inline-block mb-4">
               <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">What We Offer</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
               Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Programs</span>
             </h2>
             <p className="text-slate-600 text-lg max-w-2xl mx-auto">Discover our comprehensive range of programs designed to meet your fitness goals, whether you're a beginner or a seasoned athlete.</p>
           </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-slate-200 h-16 w-16 rounded-2xl mb-6"></div>
                <div className="bg-slate-200 h-6 w-3/4 rounded mb-3"></div>
                <div className="bg-slate-200 h-4 w-full rounded mb-2"></div>
                <div className="bg-slate-200 h-4 w-5/6 rounded"></div>
              </div>
            ))
          ) : services.length > 0 ? (
            services.map((s, idx) => (
              <motion.div 
                key={s.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white p-8 rounded-3xl border border-slate-200 hover:border-primary transition-all hover:-translate-y-2 hover:shadow-2xl group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary/20 overflow-hidden p-3">
                  {s.photo_path ? (
                    <img 
                      src={`http://localhost:8000/storage/${s.photo_path}`} 
                      alt={s.name} 
                      className="w-full h-full object-contain rounded-full"
                    />
                  ) : (
                    <Dumbbell className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="text-slate-600 leading-relaxed">{s.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl"></div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-slate-600 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Amenities */}
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-12 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Facilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Amenities</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Everything you need for a comfortable and convenient workout experience. We've thought of every detail.</p>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto relative z-10">
          {amenities.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary transition-all hover:scale-105 hover:shadow-xl group"
            >
              <div className="text-slate-400 group-hover:text-primary mb-3 transition-colors group-hover:scale-110 transform duration-300">
                {item.icon}
              </div>
              <div className="text-sm font-bold text-center leading-tight text-slate-800">{item.name}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Personal Training CTA */}
      <Section className="bg-white py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Get Started</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Not sure where to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Start?</span>
            </h2>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Our expert trainers will create a personalized fitness plan tailored to your goals, fitness level, and lifestyle. Whether you want to build muscle, lose weight, or improve athletic performance, we've got you covered.
            </p>
            <ul className="space-y-3 mb-8">
              {['Comprehensive Fitness Assessment', 'Custom Workout Programming', 'Nutritional Guidance', 'Progress Tracking & Adjustments'].map((item, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle2 className="text-primary w-5 h-5 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/contact">
              <Button variant="primary" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Book Free Consultation <ArrowRight /></Button>
            </Link>
          </motion.div>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                alt="Trainer" 
                className="relative rounded-3xl shadow-2xl border border-primary/20 w-full"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-primary via-emerald-500 to-primary rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[150px]"></div>
            </div>
            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Start Your Journey?</h2>
              <p className="text-white/95 text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                Join NeonFit today and experience the difference that expert coaching and world-class facilities can make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-xl">Start Free Trial</Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10">View Pricing</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default Services;