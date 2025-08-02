import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatBox from './ChatBox';
import Navigation from "./Navigation.jsx";
import Footer from "./Footer.jsx";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  // Force scroll to top on component mount and trigger animations
  useEffect(() => {
    window.scrollTo(0, 0);

    // Trigger hero animations
    setTimeout(() => setIsVisible(true), 100);

    // Set up intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'features-section') {
            setFeaturesVisible(true);
          } else if (entry.target.id === 'chat-section') {
            setChatVisible(true);
          }
        }
      });
    }, observerOptions);

    // Observe sections after a short delay to ensure they're mounted
    setTimeout(() => {
      const featuresSection = document.getElementById('features-section');
      const chatSection = document.getElementById('chat-section');

      if (featuresSection) observer.observe(featuresSection);
      if (chatSection) observer.observe(chatSection);
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-50 overflow-x-hidden">
        <Navigation />
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className={`text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            <span className={`block transition-all duration-1000 delay-200 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>Welcome to</span>
              <span className={`block text-purple-600 transition-all duration-1000 delay-400 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>e-FIR Complaint System</span>
            </h1>
            <p className={`mt-4 text-lg text-gray-600 transition-all duration-1000 delay-600 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              Welcome to Efir - Your trusted platform for raising and managing complaints effectively.
              We ensure your concerns are heard and addressed with transparency and efficiency.
            </p>
            <div className={`mt-12 flex justify-center space-x-4 transition-all duration-1000 delay-800 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Link
                  to="/register"
                  className="bg-purple-600 text-white active:bg-purple-700 font-bold uppercase text-base px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-700 hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
              >
                Get Started
              </Link>
              <Link
                  to="/about"
                  className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold uppercase text-base px-8 py-3 rounded-full hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out transform"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features-section" className="relative py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center">
              <div className={`lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center transition-all duration-800 transform ${
                  featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`} style={{ transitionDelay: '0ms' }}>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out group">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h6 className="text-xl font-semibold group-hover:text-purple-600 transition-colors duration-300">Easy Complaint Filing</h6>
                    <p className="mt-2 mb-4 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      File your complaints with our user-friendly interface. Track status in real-time.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`w-full md:w-4/12 px-4 text-center transition-all duration-800 transform ${
                  featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out group">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h6 className="text-xl font-semibold group-hover:text-purple-600 transition-colors duration-300">Secure & Private</h6>
                    <p className="mt-2 mb-4 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Your data is protected with enterprise-grade security. Your privacy is our priority.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`pt-6 w-full md:w-4/12 px-4 text-center transition-all duration-800 transform ${
                  featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out group">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h6 className="text-xl font-semibold group-hover:text-purple-600 transition-colors duration-300">Quick Resolution</h6>
                    <p className="mt-2 mb-4 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Get faster resolution with our streamlined complaint management system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section id="chat-section" className="py-20 bg-gray-100 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 min-h-screen">
            <div className={`text-center mb-12 transition-all duration-800 transform ${
                chatVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI assistant is here to help you with any questions about our complaint system.
                Get instant answers and guidance 24/7.
              </p>
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <ChatBox />
            </div>
          </div>
        </section>
        <Footer/>
      </div>
  );
};

export default Landing;