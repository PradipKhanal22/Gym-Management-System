import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Button from '../components/Button';
import { Product } from '../types';
import { ShoppingCart, Package, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productAPI } from '../src/constant/api/productAPI';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
            src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=1920&q=80" 
            alt="Products Background" 
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
            Gym Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Gear up with premium supplements and apparel.
          </motion.p>
        </div>
      </div>
      
      {/* Products Grid */}
      <Section className="bg-white py-16">
        <div className="text-center mb-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Shop Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Products</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Fuel your fitness journey with our curated selection of supplements, apparel, and gear.</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-slate-200 h-80 rounded-3xl mb-4"></div>
                <div className="bg-slate-200 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-slate-200 h-8 w-1/2 rounded"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-primary transition-all hover:-translate-y-2 hover:shadow-2xl relative"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.photo_path ? `http://localhost:8000/storage/${product.photo_path}` : 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Link to={`/product/${product.id}`}>
                       <Button variant="primary" className="scale-90 group-hover:scale-100 transition-transform bg-primary hover:bg-primary/90 shadow-lg">View Details</Button>
                     </Link>
                  </div>
                  {product.stock > 0 ? (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      In Stock
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Out of Stock
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    {product.category?.name || 'Product'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-primary"></span>
                    {product.category?.name || 'Uncategorized'}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <span className="text-2xl font-black text-slate-900">Rs. {parseFloat(product.price).toFixed(2)}</span>
                    <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-sm">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-slate-600 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Promotional Banner */}
      <Section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop"
              alt="Promo"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-primary/80 to-slate-900/95"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-4">New Members Get 20% OFF</h3>
                <p className="text-white/90 text-lg mb-6">Use code <span className="font-bold text-emerald-300">NEONFIT20</span> at checkout</p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50 shadow-xl">Shop Now</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default Products;