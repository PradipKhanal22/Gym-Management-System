import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import Section from "../components/Section";
import {
  Check,
  Plus,
  Minus,
  Star,
  ArrowRight,
  X,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Button from "../components/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "../components/Toast";
import { BASE_URL } from "../src/constant/api";

const plans = [
  {
    id: 1,
    name: "Day Pass",
    price: "Rs. 500",
    period: "day",
    features: ["Single day access", "Locker room access", "Free WiFi"],
  },
  {
    id: 2,
    name: "Pro Member",
    price: "Rs. 5500",
    period: "month",
    features: [
      "24/7 Gym Access",
      "Group Classes Included",
      "1 Guest Pass/Month",
      "Free Fitness Assessment",
    ],
    recommended: true,
  },
  {
    id: 3,
    name: "Elite",
    price: "Rs. 8900",
    period: "month",
    features: [
      "All Pro Benefits",
      "Unlimited Sauna/Recovery",
      "Personal Training (1x/mo)",
      "Nutrition Plan",
      "Priority Support",
    ],
  },
];

const faqs = [
  {
    q: "Is there a cancellation fee?",
    a: "No. We believe in earning your business every month. You can cancel anytime with 30 days notice.",
  },
  {
    q: "Can I freeze my membership?",
    a: "Yes, you can freeze your membership for up to 3 months per year for medical or travel reasons.",
  },
  {
    q: "Are classes included in the Day Pass?",
    a: "Day passes grant access to the gym floor only. Classes require a Pro membership or a drop-in fee.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes! Students with a valid ID get 15% off the Pro Membership.",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    // Check for payment failure status in query parameters
    const query = new URLSearchParams(location.search);
    const status = query.get("status");
    const message = query.get("message");
    if (status === "failure" && message) {
      toast.error(decodeURIComponent(message));
      // Clear query params to prevent double toasts
      navigate("/pricing", { replace: true });
    }
  }, [location, navigate]);

  // Fetch membership status on mount
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      try {
        const userData = JSON.parse(userStr);
        if (!userData.token) return;

        const response = await fetch(`${BASE_URL}/membership/status`, {
          headers: {
            "Authorization": `Bearer ${userData.token}`,
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMembershipStatus(data.data);
        }
      } catch (error) {
        console.error("Error fetching membership status:", error);
      }
    };

    fetchMembershipStatus();
  }, []);

  const handleChoosePlan = (plan) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please log in to purchase a membership plan.");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setFormData({
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }

    setSelectedPlan(plan);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    const userStr = localStorage.getItem("user");
    let token = "";
    if (userStr) {
      try {
        token = JSON.parse(userStr).token || "";
      } catch (err) {
        console.error(err);
      }
    }

    try {
      const amount = selectedPlan.price.replace("Rs. ", "");

      const response = await fetch("http://localhost:8000/api/esewa/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          plan: selectedPlan.name,
          amount: amount,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to initiate payment");
      }

      const data = await response.json();

      // Redirect user to eSewa
      const esewaForm = document.createElement("form");
      esewaForm.method = "POST";
      esewaForm.action = data.url;

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        esewaForm.appendChild(input);
      });

      document.body.appendChild(esewaForm);
      esewaForm.submit();

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };


  return (
    <>
      {/* Sliding Form */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            />

            {/* Form Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                      {selectedPlan.name}
                    </h2>
                    <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                      {selectedPlan.price}/{selectedPlan.period}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Selected Plan Features */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
                    Plan Includes
                  </h3>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        placeholder="+977 9841234567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        placeholder="Address"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t-2 border-slate-200">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
                      Payment Method
                    </h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <img
                          src="https://imgs.search.brave.com/6lBdIxLIAaXa5rt-ETSYtq8wPWRLeIWHwTBMsvPYsx0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJhbmRmZXRjaC5p/by9pZERWdUhaM09L/L3cvNDAwL2gvNDAw/L3RoZW1lL2Rhcmsv/aWNvbi5qcGVnP2M9/MWJ4aWQ2NE11cDdh/Y3pld1NBWU1YJnQ9/MTc1MTM1MTM1ODAz/OQ"
                          alt="Esewa"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-slate-900">
                          Esewa Payment
                        </p>
                        <p className="text-sm text-slate-600">Fast & Secure</p>
                      </div>
                      <Check className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full justify-center bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-xl text-base font-black py-4 mt-6"
                  >
                    Proceed to Esewa
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80"
            alt="Pricing Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-primary/30 to-slate-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
          >
            Membership
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-xl text-white font-medium"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
          >
            Invest in yourself with flexible plans tailored to your needs.
          </motion.p>
        </div>
      </div>

      {/* Pricing Plans */}
      <Section className="bg-white py-10 sm:py-16">
        <div className="text-center mb-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                Choose Your Plan
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Flexible{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Memberships
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto">
              Invest in yourself with flexible plans tailored to your fitness
              goals and lifestyle.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border flex flex-col ${plan.recommended
                  ? "bg-gradient-to-br from-primary to-emerald-500 border-primary shadow-2xl md:scale-105 z-10"
                  : "bg-white border-slate-200 hover:border-primary transition-all hover:-translate-y-2 hover:shadow-xl"
                }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-primary font-black text-xs uppercase py-2 px-6 rounded-full tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <h3
                className={`text-xl font-black uppercase tracking-wider mb-2 ${plan.recommended ? "text-white/90" : "text-slate-600"
                  }`}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline mb-8">
                <span
                  className={`text-4xl sm:text-5xl font-black ${plan.recommended ? "text-white" : "text-slate-900"
                    }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-2 font-semibold ${plan.recommended ? "text-white/90" : "text-slate-500"
                    }`}
                >
                  / {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 shrink-0 ${plan.recommended ? "text-white" : "text-primary"
                        }`}
                    />
                    <span
                      className={`text-sm font-medium ${plan.recommended ? "text-white/95" : "text-slate-600"
                        }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {membershipStatus?.has_active_membership && membershipStatus?.plan_name === plan.name ? (
                <div className={`w-full justify-center py-3 px-4 rounded-xl flex items-center gap-2 ${
                  plan.recommended
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-black text-sm">
                    {membershipStatus.is_day_pass ? "Active today" : `Active - ${membershipStatus.days_remaining} day${membershipStatus.days_remaining !== 1 ? 's' : ''} remaining`}
                  </span>
                </div>
              ) : membershipStatus?.has_active_membership ? (
                <div className={`w-full justify-center py-3 px-4 rounded-xl flex items-center gap-2 ${
                  plan.recommended
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  <Check className="w-5 h-5" />
                  <span className="font-black text-sm">
                    Your Plan: {membershipStatus.plan_name}
                  </span>
                </div>
              ) : (
                <Button
                  variant={plan.recommended ? "secondary" : "primary"}
                  className={`w-full justify-center ${plan.recommended
                      ? "bg-white text-primary hover:bg-gray-50 shadow-lg"
                      : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    }`}
                  onClick={() => handleChoosePlan(plan)}
                >
                  Choose {plan.name}
                </Button>
              )}

              {!plan.recommended && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl"></div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-gradient-to-b from-slate-50 to-white py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                Need Help?
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Questions
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-lg leading-relaxed mb-8">
              Can't find what you're looking for? Contact our support team and
              we'll be happy to help.
            </p>
            <Link to="/contact">
              <Button
                variant="primary"
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Contact Support <ArrowRight />
              </Button>
            </Link>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group"
              >
                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-3 group-hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Plus className="w-4 h-4 shrink-0" />
                  </div>
                  {faq.q}
                </h4>
                <p className="text-slate-600 leading-relaxed pl-11">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-white py-10 sm:py-16">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-primary via-emerald-500 to-primary rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[150px]"></div>
            </div>
            <div className="text-center relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-6">
                Start Your Free 7-Day Trial
              </h2>
              <p className="text-white/95 text-sm sm:text-base md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                Experience everything NeonFit has to offer with no commitment
                required.
              </p>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-50 shadow-xl"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
};

export default Pricing;
