import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Dumbbell, Calendar, CreditCard, Users, Clock, Shield, Zap, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "Membership",
    question: "What membership plans do you offer?",
    answer: "We offer flexible membership options including Monthly, 3-Month, 6-Month, and Annual plans. All memberships include 24/7 gym access, unlimited group classes, free Wi-Fi, and complimentary locker usage. Check our Pricing page for detailed information on each plan.",
    icon: <CreditCard className="w-6 h-6" />
  },
  {
    id: 2,
    category: "Membership",
    question: "Can I pause or cancel my membership?",
    answer: "Yes! Monthly memberships can be canceled anytime with 30 days notice. Longer-term memberships can be paused for up to 2 months per year for medical or travel reasons. Contact our front desk or your account portal to manage your membership.",
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 3,
    category: "Membership",
    question: "Do you offer day passes or trial memberships?",
    answer: "Absolutely! We offer single-day passes for $25 and a 7-day trial membership for $49. This gives you full access to all facilities and classes so you can experience NeonFit before committing to a full membership.",
    icon: <CheckCircle2 className="w-6 h-6" />
  },
  {
    id: 4,
    category: "Facilities",
    question: "What equipment and facilities do you have?",
    answer: "NeonFit features state-of-the-art equipment including Hammer Strength machines, Eleiko barbells, cardio equipment with entertainment screens, functional training zones, free weight areas, and dedicated stretching/recovery spaces. We also have private changing rooms, showers, and secure lockers.",
    icon: <Dumbbell className="w-6 h-6" />
  },
  {
    id: 5,
    category: "Facilities",
    question: "Is the gym really open 24/7?",
    answer: "Yes! NeonFit is accessible 24 hours a day, 7 days a week, 365 days a year. Members receive secure keycard access that works anytime. Staff are available during peak hours (6 AM - 10 PM weekdays, 8 AM - 8 PM weekends) for assistance and personal training.",
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 6,
    category: "Training",
    question: "Do you offer personal training?",
    answer: "Yes! Our certified personal trainers offer customized one-on-one sessions, partner training, and small group training. Sessions can be purchased in packages of 5, 10, or 20, or as part of premium membership tiers. Book a complimentary consultation to discuss your fitness goals.",
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 7,
    category: "Training",
    question: "What group classes are available?",
    answer: "We offer a diverse schedule of group fitness classes including HIIT, Yoga, Spin, Boxing, Strength Training, Zumba, and more. All classes are included with your membership and are led by experienced instructors. Check our weekly schedule at the front desk or in the member app.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 8,
    category: "Safety",
    question: "What safety measures do you have in place?",
    answer: "Member safety is our top priority. We maintain clean facilities with professional daily cleaning, provide hand sanitizer stations throughout, have 24/7 security surveillance, employ certified staff trained in first aid and CPR, and enforce proper equipment usage guidelines.",
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 9,
    category: "Getting Started",
    question: "I'm new to fitness. Can beginners join?",
    answer: "Absolutely! NeonFit welcomes all fitness levels. We offer complimentary orientation sessions for new members, beginner-friendly classes, and our trainers can create customized workout plans. Many of our members started their fitness journey here with zero experience.",
    icon: <HelpCircle className="w-6 h-6" />
  },
  {
    id: 10,
    category: "Getting Started",
    question: "What should I bring to my first visit?",
    answer: "Bring comfortable workout clothes, athletic shoes, a water bottle, and a towel. We provide complimentary lockers (bring your own lock or purchase one from our shop). If you're touring the facility, just come as you are and we'll show you around!",
    icon: <CheckCircle2 className="w-6 h-6" />
  }
];

const categories = ["All", "Membership", "Facilities", "Training", "Safety", "Getting Started"];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[55vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80" 
            alt="FAQ Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-primary/20 to-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-3xl border border-primary/30 mb-4">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Got Questions?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Find answers to frequently asked questions about NeonFit
          </motion.p>
        </div>
      </div>

      {/* FAQ Content */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary hover:text-primary hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-primary/30">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          openId === faq.id 
                            ? 'bg-primary text-white' 
                            : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}>
                          {faq.icon}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
                            {faq.category}
                          </span>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: openId === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 ml-4 ${
                          openId === faq.id ? 'text-primary' : 'text-slate-400'
                        }`}
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="pl-16">
                              <p className="text-slate-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                  Still Have Questions?
                </h2>
                <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                  Our team is here to help! Reach out and we'll get back to you as soon as possible.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold uppercase tracking-wide rounded-full hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
                >
                  Contact Us
                  <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
