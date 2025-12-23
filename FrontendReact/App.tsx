import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer, toast } from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Products from './pages/Products';
import ViewProduct from './pages/ViewProduct';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyDetails from './pages/MyDetails';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/admin/Dashboard';
import ServiceList from './pages/admin/services/ServiceList';
import AddService from './pages/admin/services/AddService';
import EditService from './pages/admin/services/EditService';
import CategoryList from './pages/admin/categories/CategoryList';
import AddCategory from './pages/admin/categories/AddCategory';
import EditCategory from './pages/admin/categories/EditCategory';
import TrainerList from './pages/admin/trainers/TrainerList';
import AddTrainer from './pages/admin/trainers/AddTrainer';
import EditTrainer from './pages/admin/trainers/EditTrainer';
import ProductList from './pages/admin/products/ProductList';
import AddProduct from './pages/admin/products/AddProduct';
import EditProduct from './pages/admin/products/EditProduct';
import MessageList from './pages/admin/contact-messages/MessageList';
import Order from './pages/admin/orders/Order';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    const handleToast = (newToast: any) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3100);
    };

    toast.addListener(handleToast);
    return () => toast.removeListener(handleToast);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-light text-slate-800 font-sans selection:bg-primary selection:text-white">
      <ScrollToTop />
      <ToastContainer toasts={toasts} />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-details" element={<MyDetails />} />
          <Route path="/order-history" element={<OrderHistory />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<ServiceList />} />
          <Route path="/admin/services/add" element={<AddService />} />
          <Route path="/admin/services/edit/:id" element={<EditService />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
          <Route path="/admin/trainers" element={<TrainerList />} />
          <Route path="/admin/trainers/add" element={<AddTrainer />} />
          <Route path="/admin/trainers/edit/:id" element={<EditTrainer />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<Order />} />
          <Route path="/admin/contact-messages" element={<MessageList />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;