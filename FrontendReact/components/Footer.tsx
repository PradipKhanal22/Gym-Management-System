import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Facebook, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Fitness Gym Background - Dark & Energetic */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Dark Overlay + Subtle Neon Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-slate-900/95 to-black/80" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="relative container mx-auto px-6 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <Dumbbell className="w-11 h-11 text-primary transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-3xl font-black tracking-tighter">
                NEON<span className="text-transparent bg-clip-text bg-primary">FIT</span>
              </span>
            </Link>
            <p className="text-slate-300 leading-relaxed max-w-xs">
              Train harder. Glow brighter. Join the electric revolution in fitness.
            </p>

            {/* Social Icons with REAL Brand Colors on Hover */}
            <div className="flex gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-pink-500 transition-all duration-400 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/25"
              >
                <Instagram className="w-6 h-6 text-white/70 group-hover:text-white transition-all duration-300 
                  group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-red-500 
                  group-hover:bg-clip-text group-hover:[-webkit-text-fill-color:transparent]" 
                />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-300 transition-all duration-400 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40"
              >
                <svg className="w-6 h-6 text-white/70 group-hover:text-blue-300 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#0866FF] transition-all duration-400 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40"
              >
                <Facebook className="w-6 h-6 text-white/70 group-hover:text-[#0866FF] transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-5">
              {['About Us', 'Services', 'Membership', 'Shop'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'About Us' ? '/about' : item === 'Services' ? '/services' : item === 'Membership' ? '/pricing' : '/products'}
                    className="text-slate-300 hover:text-primary font-medium transition-all duration-300 hover:translate-x-3 flex items-center group text-lg"
                  >
                    <span className="mr-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider mb-8 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-5">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Privacy Policy', path: '#' },
                { name: 'Terms of Service', path: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-300 hover:text-primary font-medium transition-all duration-300 hover:translate-x-3 flex items-center group text-lg"
                  >
                    <span className="mr-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider mb-8 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-6 text-slate-300">
              <li className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="leading-tight">123 Voltage Ave</p>
                  <p className="text-sm text-slate-400">Electric City, EC 90210</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span>hello@neonfit.gym</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credit */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} <span className="text-primary font-bold">NeonFit Gym</span>. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-2">
            Built for those who train like the lights never go out
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;