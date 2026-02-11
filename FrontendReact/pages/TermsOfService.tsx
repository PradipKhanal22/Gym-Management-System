import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, CreditCard, AlertTriangle, Ban, Shield, Scale, Clock } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing or using NeonFit Gym facilities, services, or website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services."
        },
        {
          subtitle: "Age Requirements",
          text: "You must be at least 16 years old to use our facilities. Members aged 16-17 require written parental or guardian consent. Specific areas or equipment may have different age restrictions for safety reasons."
        },
        {
          subtitle: "Changes to Terms",
          text: "We reserve the right to modify these terms at any time. Changes will be posted on our website and at our facility. Continued use of our services after changes constitutes acceptance of the modified terms."
        }
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Membership & Payments",
      content: [
        {
          subtitle: "Membership Types",
          text: "We offer various membership plans including monthly, quarterly, semi-annual, and annual options. Each membership type has specific terms regarding duration, access privileges, and cancellation policies detailed in your membership agreement."
        },
        {
          subtitle: "Payment Terms",
          text: "Membership fees are billed in advance on a recurring basis according to your chosen plan. You authorize us to charge your payment method on file. All fees are non-refundable except as required by law or specified in these terms."
        },
        {
          subtitle: "Late Payments",
          text: "If payment fails or is late, your access may be suspended until payment is received. A late fee of $15 may be charged for failed payments. Memberships unpaid for 30+ days may be terminated."
        },
        {
          subtitle: "Price Changes",
          text: "We reserve the right to change membership prices with 30 days written notice. Current members will be grandfathered at their existing rate for the duration of their current membership term."
        }
      ]
    },
    {
      icon: <Ban className="w-6 h-6" />,
      title: "Cancellation & Freeze",
      content: [
        {
          subtitle: "Cancellation Policy",
          text: "Monthly memberships may be canceled with 30 days written notice. Long-term memberships (3+ months) can be canceled early only for medical reasons (with doctor's note) or relocation 50+ miles away (with proof), subject to a cancellation fee."
        },
        {
          subtitle: "Membership Freeze",
          text: "Members may freeze their membership for medical reasons, pregnancy, or extended travel (minimum 1 month, maximum 2 months per year). A freeze fee of $10/month applies. Requests must be submitted in writing at least 7 days before the next billing cycle."
        },
        {
          subtitle: "Refund Policy",
          text: "Prepaid membership fees are non-refundable except in cases of permanent disability (with medical documentation) or facility closure. Product purchases from our shop may be refunded within 14 days with receipt if unused and in original packaging."
        }
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Facility Rules & Conduct",
      content: [
        {
          subtitle: "Member Conduct",
          text: "Members must behave respectfully toward other members, staff, and property. Prohibited behaviors include harassment, intimidation, excessive noise, inappropriate language, and any conduct that disrupts others' workouts or violates community standards."
        },
        {
          subtitle: "Equipment Use",
          text: "Members must use equipment properly and safely according to posted instructions. Wipe down equipment after use. Do not drop weights. Limit cardio equipment to 30 minutes during peak hours. Return all equipment to designated areas."
        },
        {
          subtitle: "Dress Code",
          text: "Appropriate athletic attire and closed-toe athletic shoes are required at all times. Shirts must be worn. Clean workout clothes are expected. Street shoes, sandals, and barefoot exercise are prohibited in the gym area."
        },
        {
          subtitle: "Guest Policy",
          text: "Members may bring guests at applicable day-pass rates. Guests must check in at the front desk, sign a waiver, and follow all facility rules. Members are responsible for their guests' conduct."
        }
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Health & Safety",
      content: [
        {
          subtitle: "Medical Clearance",
          text: "You represent that you are in good physical condition and have no medical conditions that would prevent safe exercise participation. We recommend consulting your physician before starting any fitness program, especially if you have pre-existing health conditions."
        },
        {
          subtitle: "Assumption of Risk",
          text: "You acknowledge that physical exercise involves inherent risks including muscle soreness, injury, and in rare cases, serious injury or death. You voluntarily assume all such risks associated with your use of our facilities and services."
        },
        {
          subtitle: "Liability Waiver",
          text: "To the fullest extent permitted by law, NeonFit Gym, its owners, employees, and contractors are not liable for any injuries, losses, or damages arising from your use of our facilities or services, except in cases of gross negligence or willful misconduct."
        },
        {
          subtitle: "Emergency Situations",
          text: "In case of medical emergency, we will attempt to contact your emergency contact and may call emergency services. You authorize us to seek emergency medical treatment on your behalf if necessary."
        }
      ]
    },
    {
      icon: <Ban className="w-6 h-6" />,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "Strictly Forbidden",
          text: "The following are strictly prohibited and may result in immediate membership termination: use or possession of illegal drugs, alcohol consumption, smoking/vaping, weapons, photography in locker rooms, solicitation, personal training by non-staff members, and theft or vandalism."
        },
        {
          subtitle: "Commercial Use",
          text: "Using our facilities for commercial purposes, including unauthorized personal training, selling products or services, or professional photography/videography without prior written permission is prohibited."
        },
        {
          subtitle: "Disruptive Behavior",
          text: "Loud or disruptive behavior, excessive grunting, dropping weights unnecessarily, monopolizing equipment, and refusing to share equipment during busy times may result in warnings or membership suspension."
        }
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Trademarks & Content",
          text: "All content on our website and in our facility, including the NeonFit name, logo, class formats, training programs, and marketing materials, are protected by copyright and trademark laws. Unauthorized use is prohibited."
        },
        {
          subtitle: "Photography & Video",
          text: "We may photograph or video record activities in our facility for marketing and promotional purposes. By using our facilities, you consent to such recording and use of your image, unless you opt out in writing."
        }
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Personal Training & Classes",
      content: [
        {
          subtitle: "Cancellation Policy",
          text: "Personal training sessions must be canceled at least 24 hours in advance to avoid being charged. Class spots should be canceled 2 hours in advance to allow others to register. Repeated no-shows may result in booking restrictions."
        },
        {
          subtitle: "Trainer-Client Relationship",
          text: "Personal trainers provide guidance and instruction but are not medical professionals. They cannot diagnose conditions or prescribe treatment. Follow your trainer's instructions carefully, but stop immediately if you experience pain or discomfort."
        }
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Termination of Membership",
      content: [
        {
          subtitle: "Our Right to Terminate",
          text: "We reserve the right to terminate any membership immediately without refund for violation of these terms, disruptive behavior, non-payment, providing false information, or any conduct we deem harmful to our business, staff, or other members."
        },
        {
          subtitle: "Effects of Termination",
          text: "Upon termination, you must immediately cease using our facilities and services. Your keycard access will be deactivated. Any prepaid fees for the unfulfilled period may be forfeited if termination is due to your violation of these terms."
        }
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Dispute Resolution",
      content: [
        {
          subtitle: "Governing Law",
          text: "These Terms of Service are governed by the laws of the state where our facility is located, without regard to conflict of law principles."
        },
        {
          subtitle: "Arbitration",
          text: "Any disputes arising from these terms or your membership shall be resolved through binding arbitration rather than in court, except where prohibited by law. Each party bears their own costs. Class action lawsuits are waived."
        },
        {
          subtitle: "Severability",
          text: "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
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
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80" 
            alt="Terms of Service Background" 
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
              <FileText className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Please read these terms carefully before using our services
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
              Welcome to <span className="font-bold text-primary">NeonFit Gym</span>. These Terms of Service govern your use of our facilities, services, and website. By becoming a member or using our services, you agree to comply with these terms and conditions.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Last Updated: <span className="font-semibold">January 1, 2024</span>
            </p>
          </motion.div>

          {/* Terms Sections */}
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
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                  Questions About These Terms?
                </h2>
                <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
                  If you have any questions or concerns about our Terms of Service, please don't hesitate to reach out to our team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold uppercase tracking-wide rounded-full hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:legal@neonfit.gym"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    legal@neonfit.gym
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

export default TermsOfService;
