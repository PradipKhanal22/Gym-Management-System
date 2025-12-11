import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import Button from '../components/Button';
import { ShoppingCart, Star, Package, Shield, Truck, Heart, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../src/constant/api/productAPI';
import { addToCart } from '../src/constant/cartUtils';
import { toast } from '../components/Toast';

const ViewProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await productAPI.getById(id);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoadingRelated(true);
      try {
        const response = await productAPI.getAll();
        if (response.success) {
          // Filter out current product and limit to 3 items
          const filtered = response.data
            .filter((p: any) => p.id.toString() !== id)
            .slice(0, 3);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id]);

  const updateQuantity = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login first to add items to cart');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    
    // Check if token exists
    if (!user.token) {
      toast.error('Session expired. Please login again to get authentication.');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    if (!product) return;

    // Add product with selected quantity
    try {
      let success = true;
      for (let i = 0; i < quantity; i++) {
        success = await addToCart(product);
        if (!success) break;
      }

      if (success) {
        toast.success(`${quantity} x ${product.name} added to cart!`);
        setQuantity(1);
      } else {
        toast.error('Failed to add to cart. Please check stock availability.');
      }
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart. Please login again.');
    }
  };

  if (loading) {
    return (
      <Section className="bg-white py-16 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="animate-pulse bg-slate-200 aspect-square rounded-3xl"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-200 aspect-square rounded-2xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="animate-pulse bg-slate-200 h-8 w-32 rounded-full"></div>
              <div className="animate-pulse bg-slate-200 h-12 w-3/4 rounded"></div>
              <div className="animate-pulse bg-slate-200 h-6 w-1/2 rounded"></div>
              <div className="animate-pulse bg-slate-200 h-16 w-1/3 rounded"></div>
              <div className="animate-pulse bg-slate-200 h-24 w-full rounded-2xl"></div>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="bg-white py-16 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Product Not Found</h2>
          <p className="text-slate-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button variant="primary">Back to Products</Button>
          </Link>
        </div>
      </Section>
    );
  }

  const productImage = product.photo_path 
    ? `http://localhost:8000/storage/${product.photo_path}` 
    : 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&h=800&fit=crop';

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
            <span className="text-slate-900 font-semibold">{product?.name || 'Product'}</span>
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
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stock > 0 ? (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Single Thumbnail for now */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedImage(0)}
                  className="aspect-square rounded-2xl overflow-hidden border-2 border-primary shadow-lg scale-105"
                >
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
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
                  {product.category?.name || 'Product'}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                {product.name}
              </h1>

              {/* Rating - Static for now */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600 font-semibold">
                  4.5 (50+ reviews)
                </span>
              </div>

              {/* Price */}
              <div className="py-6 border-y border-slate-200">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  Rs. {parseFloat(product.price).toFixed(2)}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-lg leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>

              {/* Key Features - Placeholder if not available */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Premium Quality', 'Fast Delivery', 'Best Price', 'Money Back Guarantee'].map((feature, index) => (
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
                  onClick={handleAddToCart}
                  disabled={!product || product.stock === 0}
                  className="bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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

      {/* Product Specifications - Hidden for now since backend doesn't provide this data */}
      {/* <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
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
                Specifications would go here
              </div>
            </div>
          </motion.div>
        </div>
      </Section> */}

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
              {loadingRelated ? (
                // Loading skeleton for related products
                [...Array(3)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="bg-slate-200 h-64 rounded-3xl mb-4"></div>
                    <div className="bg-slate-200 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-slate-200 h-8 w-1/2 rounded"></div>
                  </div>
                ))
              ) : relatedProducts.length > 0 ? (
                relatedProducts.map((item, index) => (
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
                        src={item.photo_path ? `http://localhost:8000/storage/${item.photo_path}` : 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-primary">Rs. {parseFloat(item.price).toFixed(2)}</p>
                        <Link to={`/product/${item.id}`}>
                          <Button className="w-full justify-center bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-lg">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-slate-600">No related products available.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default ViewProduct;
