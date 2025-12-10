import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Button from '../components/Button';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent! Thanks ${formState.name}.`);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" 
            alt="Contact Background" 
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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Get in touch with our team. We are here to help you crush your goals.
          </motion.p>
        </div>
      </div>

      <Section className="bg-white py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Get In Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Connect</span>
            </h2>
            <p className="text-slate-600 mb-12 text-lg leading-relaxed">
              Have questions about memberships, personal training, or our facility? Drop us a line or visit us in person. Our team is here to support your fitness journey.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { icon: MapPin, title: "Visit Us", content: "123 Voltage Ave, Electric City, EC 90210" },
                { icon: Phone, title: "Call Us", content: "+1 (555) 123-4567" },
                { icon: Mail, title: "Email Us", content: "hello@neonfit.gym" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-600 font-medium">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hours */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900 to-primary p-8 rounded-3xl shadow-xl relative overflow-hidden"
            >
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
               </div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <Clock className="text-emerald-400 w-6 h-6" />
                 <h3 className="text-2xl font-black uppercase text-white">Opening Hours</h3>
               </div>
               <div className="space-y-4 relative z-10">
                 {[
                   { day: "Monday - Friday", hours: "24 Hours", highlight: true },
                   { day: "Saturday", hours: "6:00 AM - 10:00 PM" },
                   { day: "Sunday", hours: "8:00 AM - 8:00 PM" }
                 ].map((schedule, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/20 pb-4 last:border-0">
                     <span className="text-white/90 font-semibold">{schedule.day}</span>
                     <span className={`font-black ${schedule.highlight ? 'text-emerald-400 text-lg' : 'text-white'}`}>{schedule.hours}</span>
                   </div>
                 ))}
               </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-3xl border border-slate-200 h-fit shadow-2xl hover:shadow-primary/10 transition-shadow"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Message Us</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-8">Send a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Message</span></h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-700 text-sm font-black uppercase tracking-wider mb-3">Your Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="John Doe"
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-black uppercase tracking-wider mb-3">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="john@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-black uppercase tracking-wider mb-3">Your Message</label>
                <textarea 
                  rows={5}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-slate-800 font-medium focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  placeholder="Tell us about your fitness goals and how we can help you achieve them..."
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                ></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full justify-center gap-2 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white shadow-lg shadow-primary/20">
                Send Message <Send size={18} />
              </Button>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
                <CheckCircle2 size={16} className="text-primary" />
                <span>We'll respond within 24 hours</span>
              </div>
            </form>
          </motion.div>
        </div>
      </Section>

      {/* Map Section */}
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-7xl mx-auto"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Find Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Visit Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Location</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Stop by for a tour, meet our trainers, and see why we're the top choice for fitness enthusiasts.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
        >
          <div className="aspect-[16/9] bg-slate-100 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-white py-16">
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
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to Transform Your Life?</h2>
              <p className="text-white/95 text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                Join thousands who have already started their fitness journey with NeonFit. Let's achieve greatness together.
              </p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-xl">Start Your Free Trial</Button>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default Contact;