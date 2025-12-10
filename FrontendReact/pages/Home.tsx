import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { Service, Testimonial } from '../types';
import { Dumbbell, Users, Clock, Award, Star, ArrowRight, Sparkles, CheckCircle2, Zap, Target, HeartHandshake } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const services: Service[] = [
  { id: 1, title: 'Personal Training', description: 'One-on-one coaching tailored to your goals with world-class certified trainers.', icon: 'Users' },
  { id: 2, title: 'Premium Equipment', description: 'Hammer Strength, Eleiko, and cutting-edge machines built for performance.', icon: 'Dumbbell' },
  { id: 3, title: '24/7 Access', description: 'Train anytime with secure keycard entry and zero restrictions.', icon: 'Clock' },
];

const testimonials: Testimonial[] = [
  { id: 1, name: "Sarah Connor", role: "Member since 2023", text: "This gym changed my life. The atmosphere is electric and the trainers are world-class. I've lost 30 lbs and gained so much confidence!", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", rating: 5 },
  { id: 2, name: "Marcus Wright", role: "Professional Athlete", text: "The equipment here is unmatched. If you are serious about gains, NeonFit is the only place. My performance has improved dramatically.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", rating: 5 },
  { id: 3, name: "Kyle Reese", role: "Member since 2024", text: "Love the 24/7 access. I can train whenever I want without worrying about crowds. The community here is incredibly supportive!", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", rating: 5 }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=600&h=600&fit=crop",
];

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
    title: "Transform Your Body",
    subtitle: "Experience world-class training and state-of-the-art equipment",
    cta: "Start Your Journey"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
    title: "Build Your Strength",
    subtitle: "Professional trainers dedicated to your fitness goals",
    cta: "Get Started Today"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80",
    title: "Achieve Your Goals",
    subtitle: "Join our community of fitness enthusiasts and champions",
    cta: "Join NeonFit Now"
  }
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      {/* Hero - Sliding Image Carousel */}
      <div className="relative h-[90vh] mt-20 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="text-xl md:text-2xl text-white/95 mb-10 font-medium max-w-2xl mx-auto"
                  style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                >
                  <Link to="/contact">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 px-12 py-6 text-lg font-black shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 rounded-full uppercase tracking-wider">
                      {heroSlides[currentSlide].cta}
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 bg-primary' 
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Why NeonFit - Glassmorphism Cards */}
      <Section className="bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-16 max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-slate-900 mb-4">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-primary animate-gradient-x">NeonFit</span>?
            </h2>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed font-medium">
              Designed for those who refuse to settle. Premium everything. No distractions. Just progress.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative bg-white border border-slate-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {service.icon === 'Users' && <Users className="w-10 h-10 text-white" />}
                  {service.icon === 'Dumbbell' && <Dumbbell className="w-10 h-10 text-white" />}
                  {service.icon === 'Clock' && <Clock className="w-10 h-10 text-white" />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{service.description}</p>
              </div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg shadow-primary/50" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stats - Light & Elegant */}
      <Section className="bg-gradient-to-br from-slate-900 to-primary py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center relative z-10">
          {[
            { value: '50+', label: 'Expert Trainers', icon: <Users className="w-12 h-12" /> },
            { value: '200+', label: 'Premium Machines', icon: <Dumbbell className="w-12 h-12" /> },
            { value: '24/7', label: 'Always Open', icon: <Clock className="w-12 h-12" /> },
            { value: '3,000+', label: 'Happy Members', icon: <HeartHandshake className="w-12 h-12" /> }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="mb-6 text-emerald-300 group-hover:text-white transition-colors duration-300 group-hover:scale-110 inline-block">{stat.icon}</div>
              <div className="text-6xl md:text-7xl font-black text-white mb-3 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm font-bold text-emerald-100 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Gallery + Features */}
      <Section className="bg-gray-50/50">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Performance</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every detail crafted with intention. From competition-grade platforms to recovery zones that actually work.
            </p>
            <ul className="space-y-5 mb-10">
              {["Olympic Lifting Platforms", "Indoor Turf Track", "Infrared Sauna & Ice Baths", "Private Posing Room", "Smoothie & Supplement Bar"].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 text-gray-700 font-medium"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/about">
              <Button size="lg" className="gap-3 shadow-lg hover:shadow-xl">
                Take a Tour <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl shadow-xl group"
              >
                <img 
                  src={src} 
                  alt={`Gym interior ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials - Minimal & Trustworthy */}
      <Section className="bg-white">
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Real People.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Real Results.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join thousands who’ve transformed their bodies and minds.</p>
        </div>

        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -100 / testimonials.length + '%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 4 * testimonials.length,
                ease: "linear",
              },
            }}
          >
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="flex-shrink-0 w-full md:w-[calc(33.333%-1.5rem)] bg-gray-50/70 border border-gray-200/50 rounded-3xl p-8 hover:border-gray-300 transition-all"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < t.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full ring-4 ring-white shadow-lg" />
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Final CTA - Clean & Powerful */}
      <Section className="bg-white py-2 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary via-emerald-500 to-primary rounded-3xl p-12 md:p-16 shadow-2xl"
          >
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-black text-white mb-4"
              >
                Ready to Start Your Journey?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
              >
                Join thousands of members who've achieved their fitness goals with NeonFit.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Link to="/contact">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-xl text-base px-8 py-3 font-bold">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-base px-8 py-3 font-bold">
                    View Plans
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-6 text-white/90 text-sm"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> No Contract Required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Cancel Anytime
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 7-Day Free Access
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default Home;