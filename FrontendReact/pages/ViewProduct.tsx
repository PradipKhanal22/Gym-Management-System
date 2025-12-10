import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import Button from '../components/Button';
import { ShoppingCart, Star, Package, Shield, Truck, Heart, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ViewProduct: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, this would be fetched based on ID
  const product = {
    id: 1,
    name: "NeonFit Whey Protein",
    price: 49.99,
    category: "Supplements",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    description: "Premium quality whey protein isolate designed for optimal muscle recovery and growth. Each serving delivers 25g of pure protein with minimal carbs and fats.",
    images: [
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop"
    ],
    features: [
      "25g of protein per serving",
      "Fast-absorbing whey isolate",
      "Zero artificial sweeteners",
      "Gluten-free formula",
      "Available in 5 flavors",
      "30 servings per container"
    ],
    specifications: {
      "Serving Size": "30g",
      "Servings Per Container": "30",
      "Protein": "25g",
      "Carbohydrates": "2g",
      "Fat": "1g",
      "Calories": "120"
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Pre-Workout Ignition",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop"
    },
    {
      id: 9,
      name: "Creatine Monohydrate",
      price: 29.99,
      image: "https://imgs.search.brave.com/BM15zEbIAYQGAq-rr_9yEIyL--NnhHiNWtdD7M26uik/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxWDh6SkZ3SG1M/LmpwZw"
    },
    {
      id: 5,
      name: "Neon Shaker Bottle",
      price: 9.99,
      image: "https://imgs.search.brave.com/D_C2av21W51qa6iz_0N3Grc-prdgzEPZiG2eQHIzjzQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iZWFz/dGxpZmUuaW4vY2Ru/L3Nob3AvZmlsZXMv/Z3JlZW5zaGFrZXIz/LmpwZz92PTE3Mzc0/NDgxMjAmd2lkdGg9/MTQ0NQ"
    }
  ];

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <>
      {/* Product Details */}
      <Section className="bg-white py-16 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-slate-600 mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{product.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.inStock && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
                    In Stock
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600 font-semibold">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="py-6 border-y border-slate-200">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  ${product.price}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(-1)}
                    className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-2xl font-black text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { icon: <Shield />, text: 'Authentic Products' },
                  { icon: <Truck />, text: 'Free Shipping' },
                  { icon: <Package />, text: 'Easy Returns' }
                ].map((badge, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {React.cloneElement(badge.icon as React.ReactElement, { className: 'w-5 h-5' })}
                    </div>
                    <span className="text-xs font-bold text-slate-700 text-center">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Product Specifications */}
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                Details
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-8">
              Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Specifications</span>
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="font-black text-slate-700">{key}</span>
                    <span className="font-bold text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Related Products */}
      <Section className="bg-white py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                  You May Also Like
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                Related <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Products</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-200 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-primary">${item.price}</p>
                      <Link to={`/product/${item.id}`}>
                        <Button className="w-full justify-center bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-lg">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default ViewProduct;
