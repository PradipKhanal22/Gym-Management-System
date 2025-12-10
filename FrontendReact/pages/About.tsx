import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Shield, Heart, Target, Twitter, Instagram, Linkedin, Award, Users2, TrendingUp } from 'lucide-react';

const trainers = [
  { name: "Alex Sterling", role: "Head Trainer & Founder", image: "https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&h=500&fit=crop", specialty: "Strength & Conditioning" },
  { name: "Maria Rodriguez", role: "Yoga & Mobility Specialist", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop", specialty: "Flexibility & Wellness" },
  { name: "James 'The Tank'", role: "Powerlifting Coach", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop", specialty: "Powerlifting & Olympic Lifting" }
];

const achievements = [
  { number: "2023", label: "Founded", icon: <Award /> },
  { number: "50K+", label: "Workouts Completed", icon: <TrendingUp /> },
  { number: "3000+", label: "Active Members", icon: <Users2 /> },
  { number: "98%", label: "Satisfaction Rate", icon: <Heart /> }
];

const values = [
  { icon: <Zap size={32} />, title: "Energy", desc: "We bring high intensity to everything we do." },
  { icon: <Shield size={32} />, title: "Integrity", desc: "We promise honest guidance and real results." },
  { icon: <Heart size={32} />, title: "Community", desc: "We support each other through every rep." },
  { icon: <Target size={32} />, title: "Focus", desc: "We eliminate distractions so you can perform." },
];

const About: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" 
            alt="About Background" 
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
            Who We Are
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            More than a gym. We are a movement dedicated to physical excellence.
          </motion.p>
        </div>
      </div>
      
      {/* Story Section */}
      <Section className="bg-white py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=1000&fit=crop" 
              alt="Gym Interior" 
              className="relative rounded-3xl shadow-2xl border border-primary/20"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Our Story</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Dedicated</span>
            </h2>
            <p className="text-slate-600 text-lg mb-4 leading-relaxed">
              Founded in 2023, NeonFit was created to bridge the gap between high-performance athletic training and the commercial gym experience. We believe that everyone deserves access to professional-grade equipment and coaching, regardless of their fitness level.
            </p>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Our 15,000 sq ft facility is designed to inspire. From the ambient lighting to the strategic equipment layout, every detail serves a purpose: to help you focus, push harder, and achieve more than you thought possible.
            </p>

            <ul className="space-y-3 mb-8">
              {['State-of-the-art Biomechanics Lab', 'Certified Nutritionists on Staff', 'Recovery & Infrared Sauna Zone', 'Elite Community Atmosphere'].map((item, i) => (
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
              <Button variant="primary" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Schedule a Tour</Button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Achievements */}
      <Section className="bg-gradient-to-br from-slate-900 to-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="text-emerald-300 mb-4 flex justify-center group-hover:text-white transition-colors group-hover:scale-110 transform duration-300">{item.icon}</div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">{item.number}</div>
              <div className="text-emerald-100 uppercase text-sm tracking-wider font-bold">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Core Values */}
      <Section className="bg-gradient-to-b from-white via-slate-50 to-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">What Drives Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Values</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">The pillars that define our culture and drive our commitment to excellence.</p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
          {values.map((v, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-slate-200 text-center hover:border-primary transition-all hover:-translate-y-2 hover:shadow-2xl group"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary/20">
                {v.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{v.title}</h3>
              <p className="text-slate-600 leading-relaxed">{v.desc}</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl"></div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-slate-900/85"></div>
        </div>

        {/* Decorative Accents */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Expert Coaches</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Team</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Expert guidance from certified professionals who practice what they preach and are passionate about your success.</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1200px] mx-auto px-6 relative z-10">
          {trainers.map((trainer, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-[420px] overflow-hidden">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">{trainer.name}</h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-10 h-0.5 bg-primary"></span>
                    {trainer.role}
                  </p>
                  <p className="text-slate-600 text-sm font-medium mb-5 leading-relaxed">{trainer.specialty}</p>
                  
                  {/* Social Links */}
                  <div className="flex gap-4 pt-5 border-t border-slate-200">
                    <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                      <Twitter size={18} />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                      <Instagram size={18} />
                    </button>
                    <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110">
                      <Linkedin size={18} />
                    </button>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/60 rounded-tr-2xl transition-all duration-500"></div>
                
                {/* Bottom Glow Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Card Shadow Accent */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Why NeonFit</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Fitness Journey</span>
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              At NeonFit, we're not just about lifting weights – we're about lifting spirits, building confidence, and creating lasting transformations. Our holistic approach combines cutting-edge equipment, expert coaching, and a supportive community.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Premium Equipment', desc: 'Access to top-tier Hammer Strength, Eleiko, and specialized training equipment' },
                { title: 'Expert Coaching', desc: 'Certified trainers with decades of combined experience in fitness and nutrition' },
                { title: 'Flexible Scheduling', desc: '24/7 access means you train on your schedule, not ours' },
                { title: 'Recovery Focused', desc: 'Infrared sauna, ice baths, and dedicated stretching areas for optimal recovery' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=500&fit=crop" 
                alt="Training" 
                className="rounded-3xl shadow-xl border border-primary/20 h-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop" 
                alt="Equipment" 
                className="rounded-3xl shadow-xl border border-primary/20 h-full object-cover mt-8"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Mission Statement */}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Our <span className="text-white/90">Mission</span></h2>
                <p className="text-white/95 text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto">
                  "To empower individuals to reach their full physical potential through world-class facilities, expert coaching, and an inclusive community that celebrates every victory, no matter how small."
                </p>
                <Link to="/contact">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-xl">Join Our Community</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default About;