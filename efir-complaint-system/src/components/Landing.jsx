import React from 'react';
import { Link } from 'react-router-dom';
import ChatBox from './ChatBox';
import Navigation from "./Navigation.jsx";
import Footer from "./Footer.jsx";

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50">
      <Navigation />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-purple-600">e-FIR Complaint System</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Welcome to Efir - Your trusted platform for raising and managing complaints effectively. 
            We ensure your concerns are heard and addressed with transparency and efficiency.
          </p>
          <div className="mt-12 flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-purple-600 text-white active:bg-purple-700 font-bold uppercase text-base px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all duration-300 ease-in-out"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold uppercase text-base px-8 py-3 rounded-full transition-all duration-300 ease-in-out"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative py-20 bg-gray-50 -mt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">Easy Complaint Filing</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    File your complaints with our user-friendly interface. Track status in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">Secure & Private</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Your data is protected with enterprise-grade security. Your privacy is our priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">Quick Resolution</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Get faster resolution with our streamlined complaint management system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI assistant is here to help you with any questions about our complaint system.
              Get instant answers and guidance 24/7.
            </p>
          </div>
          <ChatBox />
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Landing; 