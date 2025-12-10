import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  showCta?: boolean;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, backgroundImage, showCta = true }) => {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/30 z-10"></div>
        <img 
          src={backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter mb-4"
        >
          {title.split(' ').map((word, i) => (
             <span key={i} className={i % 2 !== 0 ? "text-primary" : "text-slate-800"}>{word} </span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-600 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-light"
        >
          {subtitle}
        </motion.p>

        {showCta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link to="/pricing">
              <Button variant="primary" className="w-full md:w-auto">Start Free Trial</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="w-full md:w-auto">Learn More</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;