import React from 'react';
import Logo from '../assets/images/landingSignUP/logo.png';

const AboutUs = () => (
  <main className="bg-white text-gray-800 py-16 px-6 md:px-20">
    <div className="flex justify-center mb-8">
      <img
        src={Logo}
        alt="Xure Deal Logo"
        className="w-102 h-32"
      />
    </div>
    <h1 className="text-4xl font-bold mb-6 text-center">About Xure Deal</h1>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 text-center">
      Xure Deal Pte. Ltd. is a Singapore-based tech company focused on building trusted digital platforms for collectors and experts. 
      We specialize in apps that blend authentication technology with community features to support safe and verified trading of collectibles.
    </p>
    <p className="text-md text-gray-600 max-w-3xl mx-auto text-center">
      Our flagship apps include the <strong>Xure Store</strong> — a social commerce platform for collectors, and <strong>Xpert Suite</strong> — a tool for authenticators to certify item legitimacy. We empower users with trust, transparency, and innovation in every transaction.
    </p>

    <section className="bg-gray-100 py-8 px-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Our Core Values</h2>
      <ul className="text-gray-600 text-center space-y-2">
        <li>✅ Trust and Transparency</li>
        <li>✅ Innovation and Excellence</li>
        <li>✅ Community and Collaboration</li>
      </ul>
    </section>

    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">What Our Users Say</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <blockquote className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 italic">"Xure Deal has revolutionized the way I trade collectibles. The platform is secure and easy to use!"</p>
          <footer className="mt-4 text-gray-800 font-semibold">- Unknown</footer>
        </blockquote>
        <blockquote className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 italic">"The Xpert Suite is a game-changer for authenticators. Highly recommended!"</p>
          <footer className="mt-4 text-gray-800 font-semibold">- Unknown</footer>
        </blockquote>
      </div>
    </section>

    <div className="text-center mt-8">
      <button
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
        onClick={() => window.location.href = '/contact'}
      >
        Learn More About Us
      </button>
    </div>

    <footer className="mt-12 text-center text-gray-600">
      <p>Follow us on:</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
      </div>
    </footer>
  </main>
);

export default AboutUs;