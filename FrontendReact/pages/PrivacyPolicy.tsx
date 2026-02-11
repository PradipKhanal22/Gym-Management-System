import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Bell, UserCheck, FileText, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you register for a membership, we collect personal details including your name, email address, phone number, date of birth, emergency contact information, and payment details. This information is necessary to provide our services and ensure your safety."
        },
        {
          subtitle: "Health Information",
          text: "With your consent, we may collect health-related information such as fitness goals, medical conditions, and injury history. This helps our trainers create safe and effective workout programs tailored to your needs."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about your gym visits, class attendance, equipment usage, and facility access through our keycard system. This helps us improve our services and maintain facility security."
        }
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "Your information is used to manage your membership, process payments, schedule personal training sessions, reserve spots in group classes, and provide access to our facilities."
        },
        {
          subtitle: "Communication",
          text: "We use your contact information to send important updates about your membership, class schedules, gym closures, promotional offers, and fitness tips. You can opt out of marketing communications at any time."
        },
        {
          subtitle: "Safety & Security",
          text: "Your emergency contact information and health data may be used in case of medical emergencies. Our security systems use your access data to ensure facility safety and prevent unauthorized entry."
        },
        {
          subtitle: "Improvement & Analytics",
          text: "We analyze usage patterns to improve our services, optimize class schedules, maintain equipment, and enhance member experience. This data is anonymized and used in aggregate form."
        }
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Information Sharing",
      content: [
        {
          subtitle: "We Do Not Sell Your Data",
          text: "NeonFit will never sell, rent, or trade your personal information to third parties for marketing purposes. Your trust is our top priority."
        },
        {
          subtitle: "Service Providers",
          text: "We share information with trusted service providers who help us operate our business, including payment processors, email service providers, and scheduling software. These partners are bound by strict confidentiality agreements."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government request, or to protect the rights, property, and safety of NeonFit, our members, or others."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner, who will continue to honor this privacy policy."
        }
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement industry-standard security measures including encryption, secure servers, firewalls, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure."
        },
        {
          subtitle: "Payment Security",
          text: "All payment transactions are processed through PCI-DSS compliant payment gateways. We do not store complete credit card information on our servers."
        },
        {
          subtitle: "Staff Training",
          text: "Our staff members are trained on data privacy and security best practices. Access to personal information is restricted to authorized personnel only."
        }
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Your Rights & Choices",
      content: [
        {
          subtitle: "Access & Correction",
          text: "You have the right to access, review, and update your personal information at any time through your member portal or by contacting our front desk."
        },
        {
          subtitle: "Data Deletion",
          text: "You may request deletion of your personal information, subject to legal and contractual retention requirements. We will retain certain information for record-keeping and legal compliance."
        },
        {
          subtitle: "Marketing Opt-Out",
          text: "You can unsubscribe from marketing emails by clicking the unsubscribe link in any promotional email or by updating your communication preferences in your account settings."
        },
        {
          subtitle: "Cookie Preferences",
          text: "Our website uses cookies to enhance your browsing experience. You can manage cookie preferences through your browser settings."
        }
      ]
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Cookies & Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use essential cookies necessary for website functionality, including login authentication, shopping cart management, and security features."
        },
        {
          subtitle: "Analytics Cookies",
          text: "With your consent, we use analytics tools to understand how visitors use our website, helping us improve user experience and content."
        },
        {
          subtitle: "Marketing Cookies",
          text: "Marketing cookies help us deliver relevant advertisements and track campaign effectiveness. You can opt out of these through your browser or privacy settings."
        }
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Children's Privacy",
      content: [
        {
          subtitle: "Age Requirements",
          text: "Our services are not intended for children under 16 years of age. For members aged 16-17, we require parental consent and release forms. We do not knowingly collect information from children under 16 without parental consent."
        }
      ]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Changes to This Policy",
      content: [
        {
          subtitle: "Policy Updates",
          text: "We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations. We will notify you of significant changes via email or prominent notice on our website."
        },
        {
          subtitle: "Effective Date",
          text: "This Privacy Policy is effective as of January 1, 2024. Your continued use of our services after any changes constitutes acceptance of the updated policy."
        }
      ]
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[55vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" 
            alt="Privacy Policy Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-primary/20 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 backdrop-blur-sm rounded-3xl border border-primary/30 mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Your privacy and data security are our top priorities
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              At <span className="font-bold text-primary">NeonFit Gym</span>, we are committed to protecting your privacy and handling your personal information with care and transparency. This Privacy Policy explains how we collect, use, share, and protect your data when you use our services.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Last Updated: <span className="font-semibold">January 1, 2024</span>
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-6 pl-0 md:pl-16">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                  Questions About Your Privacy?
                </h2>
                <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold uppercase tracking-wide rounded-full hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
                  >
                    <Mail className="w-5 h-5" />
                    Contact Us
                  </a>
                  <a
                    href="mailto:privacy@neonfit.gym"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    privacy@neonfit.gym
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
